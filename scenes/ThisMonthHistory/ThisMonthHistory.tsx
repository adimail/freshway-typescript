import React, { useEffect, useContext, useState, useMemo } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Vibration,
  RefreshControl,
  Platform,
} from 'react-native';
import { colors } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs, doc, getDoc, writeBatch } from 'firebase/firestore';
import ScreenTemplate from '../../components/ScreenTemplate';
import { UserDataContext } from '../../context/UserDataContext';
import CustomSwitch from '../../components/toggleSwitch';
import { firestore } from '../../firebase/config';
import Card from '../../components/expenseCard';
import { showToast } from '../../utils/ShowToast';
import { styles } from './styles';

export default function ThisMonthHistory() {
  const { userData } = useContext(UserDataContext)!;
  const [type, setType] = useState('Sell');
  const [expenseData, setExpenseData] = useState();
  const [CreditData, setCreditData] = useState();
  const [selectedLog, setSelectedLog] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState('Date');
  const [categoryfilter, setCategoryFilter] = useState('All');
  const [CreditCategories, setCreditCategories] = useState(['All']);
  const [expenseCategories, setExpenseCategories] = useState(['All']);
  const [order, setOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  const CurrentMonth = new Date().toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });

  const [totalExpense, setTotalExpense] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  const extractUniqueCategories = (logs) => {
    const categories = logs.reduce((uniqueCategories, log) => {
      if (!uniqueCategories.includes(log.category)) {
        return [...uniqueCategories, log.category];
      }
      return uniqueCategories;
    }, []);
    return categories;
  };

  useEffect(() => {
    if (CreditData) {
      const uniqueCreditCategories = extractUniqueCategories(CreditData);
      setCreditCategories(['All', ...uniqueCreditCategories]);
    }
    if (expenseData) {
      const uniqueExpenseCategories = extractUniqueCategories(expenseData);
      setExpenseCategories(['All', ...uniqueExpenseCategories]);
    }
  }, [CreditData, expenseData]);

  const fetchSummaryData = async (dataType) => {
    try {
      const summaryRef = doc(
        firestore,
        `summaries-${userData.id}`,
        dataType,
        CurrentMonth,
        'Aggregate'
      );
      const summarySnapshot = await getDoc(summaryRef);
      if (summarySnapshot.exists()) {
        const summaryData = summarySnapshot.data();
        if (dataType === 'Sell') {
          setTotalExpense(summaryData.sum || 0);
        } else if (dataType === 'Credit') {
          setTotalCredit(summaryData.sum || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching summary data:', error);
    }
  };

  const fetchDataForCurrentMonth = async () => {
    try {
      setIsRefreshing(true);

      const expenseCollectionRef = collection(
        firestore,
        `transactions-${userData.id}`,
        'Sell',
        CurrentMonth
      );
      const CreditCollectionRef = collection(
        firestore,
        `transactions-${userData.id}`,
        'Credit',
        CurrentMonth
      );

      const [expenseSnapshot, CreditSnapshot] = await Promise.all([
        getDocs(expenseCollectionRef),
        getDocs(CreditCollectionRef),
      ]);

      const expenses = expenseSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const Credits = CreditSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExpenseData(expenses);
      setCreditData(Credits);

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      showToast({
        title: 'Data refreshed',
        body: `Last Updated: ${formattedDate} ${formattedTime}`,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDataForCurrentMonth();
    fetchSummaryData('Sell');
    fetchSummaryData('Credit');
  }, []);

  const onSelectSwitch = (value) => {
    setType(value);
  };

  const onSelectFilter = (value) => {
    setFilter(value);
  };
  const onSelectCategoryFilter = (value) => {
    setCategoryFilter(value);
  };

  const deleteLog = async () => {
    if (selectedLog) {
      try {
        const batch = writeBatch(firestore);

        // Delete transaction directly without fetching it
        const transactionRef = doc(
          firestore,
          `transactions-${userData.id}/${type}/${CurrentMonth}`,
          selectedLog.id
        );
        batch.delete(transactionRef);

        // Update summary by subtracting the amount of the deleted log
        const summaryRef = doc(
          firestore,
          `summaries-${userData.id}`,
          type,
          CurrentMonth,
          'Aggregate'
        );
        const summarySnapshot = await getDoc(summaryRef);
        if (summarySnapshot.exists()) {
          const summaryData = summarySnapshot.data();
          const currentSum = summaryData.sum || 0;
          const updatedSum = currentSum - selectedLog.amount;
          batch.update(summaryRef, { sum: updatedSum });
        }

        await batch.commit();

        showToast({
          title: 'Log Deleted',
          body: 'Data refreshed',
        });

        fetchDataForCurrentMonth();
        fetchSummaryData('Sell');
        fetchSummaryData('Credit');
      } catch (error) {
        console.error('Error deleting log:', error);
      }
    }
  };

  const confirmDeleteLog = () => {
    if (Platform.OS === 'web') {
      alert('Use mobile application to delete your logs');
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this log?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: deleteLog },
      ],
      { cancelable: false }
    );
  };

  const dataToDisplay = useMemo(() => {
    let filteredData = [];

    if (type === 'Sell' && expenseData) {
      filteredData = [...expenseData];
    } else if (type === 'Credit' && CreditData) {
      filteredData = [...CreditData];
    }

    // Apply filter based on selected filter type
    if (filter === 'Date') {
      // Sort by date
      filteredData = filteredData.sort((a, b) => {
        if (order === 'asc') {
          return new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000);
        }
        return new Date(b.date.seconds * 1000) - new Date(a.date.seconds * 1000);
      });
    } else if (filter === 'Amount') {
      // Sort by amount
      filteredData = filteredData.sort((a, b) => {
        if (order === 'asc') {
          return a.amount - b.amount;
        }
        return b.amount - a.amount;
      });
    }

    // Apply category filter
    if (categoryfilter !== 'All') {
      filteredData = filteredData.filter((log) => log.category === categoryfilter);
    }

    return filteredData;
  }, [type, expenseData, CreditData, filter, categoryfilter, order]);

  const onRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);

    fetchDataForCurrentMonth()
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));

    fetchSummaryData('Sell');
    fetchSummaryData('Credit');

    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
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
            options={['Sell', 'Credit']}
            onSelectSwitch={onSelectSwitch}
            selectionColor="#1C2833"
            height={38}
            borderRadius={10}
          />
        </View>

        <Card
          title={`${CurrentMonth} ${type === 'Credit' ? 'Borrowes' : 'Sales'}`}
          amount={type === 'Credit' ? totalCredit : totalExpense}
        />

        <View>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View style={[styles.separator]} />

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                maxWidth: 300,
                alignItems: 'center',
              }}>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                <MaterialCommunityIcons
                  name="sort-alphabetical-ascending"
                  size={35}
                  color={order === 'asc' ? colors.primary : colors.gray}
                  onPress={() => {
                    setOrder('asc');
                  }}
                />
                <MaterialCommunityIcons
                  name="sort-alphabetical-descending"
                  size={35}
                  color={order === 'desc' ? colors.primary : colors.gray}
                  onPress={() => {
                    setOrder('desc');
                  }}
                />
              </View>
            </View>

            <Text style={{ color: 'white' }}>Filter by Date, Costs and categories of logs</Text>

            <ScrollView
              horizontal
              contentContainerStyle={[styles.scrollViewContainer, { flexDirection: 'row' }]}
              showsVerticalScrollIndicator={false}>
              <CustomSwitch
                roundCorner
                options={['Date', 'Amount']}
                onSelectSwitch={onSelectFilter}
                selectionColor="#5e5e5e"
                height={38}
                borderRadius={10}
              />
              <CustomSwitch
                roundCorner
                options={type === 'Credit' ? CreditCategories : expenseCategories}
                onSelectSwitch={onSelectCategoryFilter}
                selectionColor="#1C2833"
                height={36}
                borderRadius={10}
              />
            </ScrollView>

            <View style={styles.logBook}>
              {isLoading ? ( // Check if loading
                <Text style={[styles.title, { color: 'white' }]}>Fetching data from cloud ☁️</Text>
              ) : (
                dataToDisplay && (
                  <View>
                    {dataToDisplay.length === 0 ? (
                      <Text style={[styles.title, { color: 'white' }]}>No data to display</Text>
                    ) : (
                      dataToDisplay.map((log) => (
                        <TouchableOpacity
                          style={[
                            styles.log,
                            {
                              backgroundColor: colors.primaryText,
                            },
                          ]}
                          key={log.id}
                          onLongPress={() => {
                            Vibration.vibrate(20);
                            setSelectedLog(log);
                          }}>
                          <View style={styles.column}>
                            <Text style={[styles.title]} numberOfLines={1}>
                              {log.title}
                            </Text>
                            <Text style={styles.date}>
                              {new Date(log.date.seconds * 1000).toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                weekday: 'short',
                              })}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.amount}>₹ {log.amount}</Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
}
