import React, { useEffect, useContext, useState } from 'react';
import { Text, View, ScrollView, RefreshControl } from 'react-native';
import ScreenTemplate from '../../components/ScreenTemplate';
import { colors } from '../../theme';
import { ColorSchemeContext } from '../../context/ColorSchemeContext';
import CustomSwitch from '../../components/toggleSwitch';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import { HomeTitleContext } from '../../context/HomeTitleContext';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../ThisMonthHistory/styles';
import { NetSummaryComponent } from '../inventory/summary';

export default function InventoryMonth({ route }) {
  const { month, userData } = route.params;
  const { scheme } = useContext(ColorSchemeContext);
  const isDark = scheme === 'dark';
  const { setTitle } = useContext(HomeTitleContext);

  useFocusEffect(() => {
    setTitle(`${month} Inventory History`);
  });

  const [type, setType] = useState('All');
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      let promises = [];

      if (type === 'All') {
        promises = ['seeds', 'pesticides', 'fertilizers'].map(async (collectionName) => {
          const collectionRef = collection(
            firestore,
            `inventory-${userData.id}`,
            month,
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
          month,
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
    fetchInventoryData();
  };

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
            selectionMode={1}
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
            {data.length === 0 ? (
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
                </View>
                {data.map((log) => (
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
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
        {!isLoading && data.length > 0 && <NetSummaryComponent time={month} />}
      </ScrollView>
    </ScreenTemplate>
  );
}

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
