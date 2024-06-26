import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  Alert,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import ScreenTemplate from '../../components/ScreenTemplate';

import { UserDataContext } from '../../context/UserDataContext';
import CustomSwitch from '../../components/toggleSwitch';
import { styles } from './styles';
import { firestore } from '../../firebase/config';
import { collection, getDocs, writeBatch, doc, getDoc } from 'firebase/firestore';
import { colors } from '../../theme';
import { showToast } from '../../utils/ShowToast';
import { FontAwesome5 } from '@expo/vector-icons';
import { monthYear } from '../inventory/utils';
import { updateSummary } from '../../utils/addstock';
import { NetSummaryComponent } from '../inventory/summary';

const ThisMonthInventoryHistory = () => {
  const { userData } = useContext(UserDataContext)!;

  const isDark = true;

  const [selectedLog, setSelectedLog] = useState(null);
  const [type, setType] = useState('All');
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchInventoryData();
  }, [refreshTrigger]);

  const fetchInventoryData = async () => {
    try {
      let promises = [];

      if (type === 'All') {
        promises = ['seeds', 'pesticides', 'fertilizers'].map(async (collectionName) => {
          const collectionRef = collection(
            firestore,
            `inventory-${userData.id}`,
            monthYear,
            collectionName
          );
          const snapshot = await getDocs(collectionRef);
          return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        });
      } else {
        const collectionRef = collection(
          firestore,
          `inventory-${userData.id}`,
          monthYear,
          type.toLowerCase()
        );
        const snapshot = await getDocs(collectionRef);
        promises.push(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }

      const results = await Promise.all(promises);
      const combinedData = results.flat();
      setData(combinedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  const onSelectSwitch = (value) => {
    setType(value);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    fetchInventoryData();
  };

  const dataToDisplay = useMemo(() => {
    let filteredData = [...data];

    if (type !== 'All') {
      filteredData = filteredData.filter((item) => item.category === type.toLocaleLowerCase());
    }

    return filteredData;
  }, [type, data]);

  const deleteLog = async () => {
    try {
      const batch = writeBatch(firestore);

      // Delete transaction directly without fetching it
      const transactionRef = doc(
        firestore,
        `inventory-${userData.id}/${monthYear}/${selectedLog.category}`,
        selectedLog.id
      );

      batch.delete(transactionRef);

      // Update summary by subtracting the amount of the deleted log
      const summaryRef = doc(
        firestore,
        `summaries-${userData.id}`,
        'inventory',
        monthYear,
        selectedLog.category.toLowerCase()
      );

      const netSummaryRef = doc(
        firestore,
        `summaries-${userData.id}`,
        'inventory',
        monthYear,
        'net'
      );

      const docSnapshot = await getDoc(summaryRef);
      await updateSummary({
        docSnapshot,
        formData: selectedLog,
        summaryRef,
        remove: true,
      });

      const netDocSnapshot = await getDoc(netSummaryRef);
      await updateSummary({
        docSnapshot: netDocSnapshot,
        formData: selectedLog,
        summaryRef: netSummaryRef,
        remove: true,
      });

      await batch.commit().then(() => {
        showToast({
          title: 'Log Deleted',
          isDark,
        });
        setRefreshTrigger((prev) => prev + 1);
      });
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const confirmDeleteLog = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this log?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: deleteLog,
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (selectedLog !== null) {
      confirmDeleteLog(selectedLog);
    }
  }, [selectedLog]);

  return (
    <ScreenTemplate>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
        <View
          style={{
            alignItems: 'center',
            paddingBottom: 10,
            width: 300,
            alignSelf: 'center',
          }}>
          <CustomSwitch
            roundCorner
            options={['All', 'Seeds', 'Pesticides', 'Fertilizers']}
            onSelectSwitch={onSelectSwitch}
            selectionColor="#1C2833"
          />
        </View>
        <View style={styles.content}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View
              style={[
                styles.separator,
                {
                  backgroundColor: isDark ? 'white' : 'black',
                },
              ]}
            />
          </View>
        </View>
        {isLoading ? (
          <Text style={[styles.title, { color: isDark ? 'white' : 'black' }]}>
            Fetching data from cloud ☁️
          </Text>
        ) : (
          <View>
            {dataToDisplay.length === 0 ? (
              <Text style={[styles.title, { color: isDark ? 'white' : 'black' }]}>
                No data to display
              </Text>
            ) : (
              <ScrollView
                horizontal
                contentContainerStyle={[styles.scrollViewContainer, { marginBottom: 50 }]}
                showsVerticalScrollIndicator>
                <View
                  style={{
                    display: 'flex',
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    width: '100%',
                    height: 40,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: isDark ? colors.lightPurple : colors.darkPurple,
                    borderTopEndRadius: 15,
                    borderTopStartRadius: 15,
                  }}>
                  <Text
                    style={[styles.col1, { fontWeight: 'bold', fontSize: 15 }]}
                    numberOfLines={1}>
                    Name
                  </Text>
                  <Text
                    style={[styles.col5, { fontWeight: 'bold', fontSize: 15 }]}
                    numberOfLines={1}>
                    Batch
                  </Text>
                  <Text
                    style={[styles.col2, { fontWeight: 'bold', fontSize: 15 }]}
                    numberOfLines={1}>
                    Company
                  </Text>
                  <Text
                    style={[styles.col2, { fontWeight: 'bold', fontSize: 15 }]}
                    numberOfLines={1}>
                    Package Size
                  </Text>
                  <Text
                    style={[styles.col3, { fontWeight: 'bold', fontSize: 15 }]}
                    numberOfLines={1}>
                    Cost Price
                  </Text>
                  <Text
                    style={[styles.col3, { fontWeight: 'bold', fontSize: 15 }]}
                    numberOfLines={1}>
                    Selling Price
                  </Text>
                  <Text style={[styles.col2, { fontWeight: 'bold', fontSize: 15 }]}>Added</Text>
                  <Text style={[styles.col1, { fontWeight: 'bold', fontSize: 15 }]}>MFD - EXP</Text>
                  <Text style={[styles.col3, { fontWeight: 'bold', fontSize: 15 }]}>
                    Total Cost
                  </Text>
                  <Text style={[styles.col3, { fontWeight: 'bold', fontSize: 15 }]}>Profit</Text>
                  <Text style={[styles.col6, { fontWeight: 'bold', fontSize: 15 }]}>Delete</Text>
                </View>
                {dataToDisplay.map((log) => (
                  <View
                    style={[
                      styles.log,
                      {
                        backgroundColor: isDark ? colors.primaryText : colors.primary,
                      },
                    ]}
                    key={log.id}>
                    <Text style={[styles.col1]} numberOfLines={1}>
                      {log.name || log.crop} {log.variety && ` - ${log.variety}`}
                      {log.type && `(${log.type})`}
                    </Text>
                    <Text style={[styles.col5]} numberOfLines={1}>
                      {log.batchNumber || '-'}
                    </Text>
                    <Text style={[styles.col2]} numberOfLines={1}>
                      {log.company}
                    </Text>
                    <Text style={[styles.col2]} numberOfLines={1}>
                      {log.packingSize} {log.state}
                    </Text>
                    <Text style={[styles.col3]} numberOfLines={1}>
                      ₹ {log.purchasePrice} {log.category === 'seeds' && '/Kg'}
                    </Text>
                    <Text style={[styles.col3]} numberOfLines={1}>
                      ₹ {log.sellingPrice} {log.category === 'seeds' && '/Kg'}
                    </Text>
                    <Text style={styles.col2}>
                      {new Date(log.date.seconds * 1000).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        weekday: 'short',
                      })}
                    </Text>
                    <Text style={styles.col1}>
                      <DateText
                        date={log.manufacturingDate}
                        format="en-US"
                        displayFormat={{ month: 'short', year: 'numeric' }}
                      />{' '}
                      -{' '}
                      <DateText
                        date={log.expiryDate}
                        format="en-US"
                        displayFormat={{ month: 'short', year: 'numeric' }}
                      />
                    </Text>
                    <Text style={styles.col3}>₹ {log.totalCost}</Text>
                    <Text style={styles.col3}>₹ {log.estimatedprofit}</Text>
                    <Text style={[styles.col6, { fontWeight: 'bold', fontSize: 15 }]}>
                      <TouchableOpacity
                        onPress={() => {
                          Vibration.vibrate(5);
                          setSelectedLog(log);
                        }}>
                        <FontAwesome5 name="trash" size={18} color="white" />
                      </TouchableOpacity>
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
        {!isLoading && dataToDisplay.length > 0 && (
          <NetSummaryComponent refreshTrigger={refreshTrigger} time={monthYear} />
        )}
      </ScrollView>
    </ScreenTemplate>
  );
};

const DateText = ({ date, format, displayFormat }) => {
  const formattedDate = new Date(date.seconds * 1000).toLocaleDateString(
    format,
    displayFormat || {
      month: 'short',
      day: '2-digit',
      weekday: 'short',
    }
  );
  return <Text>{formattedDate}</Text>;
};

export default ThisMonthInventoryHistory;
