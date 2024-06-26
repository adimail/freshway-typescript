import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectList } from 'react-native-dropdown-select-list';
import { colors, fontSize } from '../../theme';
import ScreenTemplate from '../../components/ScreenTemplate';
import { firestore } from '../../firebase/config';
import { UserDataContext } from '../../context/UserDataContext';
import { ColorSchemeContext } from '../../context/ColorSchemeContext';
import { showToast } from '../../utils/ShowToast';
import { submitData } from '../../utils/SubmitUserData';
import Card from '../../components/expenseCard';
import CustomSwitch from '../../components/toggleSwitch';
import QuickAddComponent from '../../utils/quickAdd';
import { NetSummaryComponent } from '../inventory/summary';

export default function Home() {
  const navigation = useNavigation();
  const { userData } = useContext(UserDataContext);
  const { scheme } = useContext(ColorSchemeContext);
  const isDark = scheme === 'dark';

  const [refreshing, setRefreshing] = useState(false);

  // expense categories
  const SellData = userData && userData.Sell;
  const SavingsDate = userData && userData.Credit;

  // Account Information
  const [name, setName] = useState('Customer');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(null);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('Sell');
  const [category, setCategory] = useState('');

  const [CurrentMonthExpense, setCurrentMonthExpense] = useState(0);
  const [CurrentMonthCredit, setCurrentMonthCredit] = useState(0);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const QuickAddData = userData && userData.quickadd;

  const fetchSummaryData = async () => {
    const MonthYear = new Date().toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });

    const expenseSummaryRef = doc(
      firestore,
      `summaries-${userData.id}`,
      'Sell',
      MonthYear,
      'Aggregate'
    );

    const CreditSummaryRef = doc(
      firestore,
      `summaries-${userData.id}`,
      'Credit',
      MonthYear,
      'Aggregate'
    );

    try {
      const [expenseDocSnapshot, CreditDocSnapshot] = await Promise.all([
        getDoc(expenseSummaryRef),
        getDoc(CreditSummaryRef),
      ]);

      if (expenseDocSnapshot.exists()) {
        const expenseData = expenseDocSnapshot.data();
        setCurrentMonthExpense(expenseData.sum || 0);
      } else {
        setCurrentMonthExpense(0);
      }

      if (CreditDocSnapshot.exists()) {
        const CreditData = CreditDocSnapshot.data();
        setCurrentMonthCredit(CreditData.sum || 0);
      } else {
        setCurrentMonthCredit(0);
      }
    } catch (error) {
      console.error('Error fetching summary documents: ', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSummaryData();
    setRefreshTrigger((prev) => prev + 1);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const renderDatePicker = () => {
    // Get the start of the month when the user joined
    const joinedDate = userData.joined.toDate();

    const startOfMonth = new Date(joinedDate.getFullYear(), joinedDate.getMonth(), 1);

    const minimumDate = startOfMonth.getTime() < new Date().getTime() ? startOfMonth : new Date();

    return (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        maximumDate={new Date()}
        minimumDate={minimumDate}
        onChange={handleDateChange}
      />
    );
  };

  const NavigateToCategories = () => {
    navigation.navigate('ModalStacks', {
      screen: 'Post',
      params: {
        data: userData,
        from: 'Home screen',
      },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ paddingRight: 10 }}>
          <FontAwesome
            name="folder-open"
            size={27}
            onPress={() => NavigateToCategories()}
            color={colors.lightPurple}
          />
        </View>
      ),
    });
  }, [navigation]);

  const NavigateToQuickAdd = () => {
    navigation.navigate('ModalStacks', {
      screen: 'QuickAdd',
      params: {
        data: userData,
        from: 'Home screen',
      },
    });
  };

  const HandleSubmitData = () => {
    // Check if all fields are filled
    if (!name || !category || !amount || date === null) {
      alert('Please fill in all required fields');
      return;
    }

    const isValidName = /^[a-zA-Z0-9 ]{4,}$/.test(name.trim());

    // Check if Name is valid
    if (!isValidName) {
      Alert.alert(
        'Error',
        'Please enter a valid Name with at least 4 characters (excluding special characters like period, comma, semicolon).'
      );
      return;
    }

    // Check if amount contains only numbers
    const isValidAmount = /^\d+$/.test(amount);

    if (!isValidAmount) {
      Alert.alert('Error', 'Please enter a valid amount containing only numbers.');
      return;
    }

    submitData(type, name, amount, category, userData, date, description, setCurrentMonthExpense)
      .then(() => {
        showToast({
          title: 'Log Added',
          body: name,
          isDark,
        });

        setAmount('');
        setDescription('');
        setName('Customer');
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
        Alert.alert('Error', 'Failed to add log. Please try again.');
      });
  };

  return (
    <ScreenTemplate>
      <ScrollView
        style={styles.main}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }>
        <View style={[styles.top]}>
          <TouchableOpacity
            style={styles.container}
            onPress={() => {
              navigation.navigate('History');
            }}>
            <Card
              title="Current month aggregate"
              amount={type === 'Credit' ? CurrentMonthCredit : CurrentMonthExpense}
            />
          </TouchableOpacity>

          <View style={[styles.separator]} />

          <Text style={[styles.text, { color: 'white' }]}>
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>

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
              options={['Sell', 'Credit']}
              onSelectSwitch={(value) => {
                setType(value);
              }}
              selectionColor="#1C2833"
            />
          </View>

          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
            <TextInput
              style={styles.input}
              placeholder="Customer name"
              value={name}
              onChangeText={(text) => setName(text)}
            />

            <SelectList
              boxStyles={{
                height: 45,
                borderColor: '#BABABA',
                borderRadius: 50,
                backgroundColor: '#F2F3F4',
                width: 300,
                borderWidth: 1,
                paddingHorizontal: 10,
              }}
              dropdownTextStyles={{ fontSize: 14, color: 'white' }}
              dropdownStyles={{ backgroundColor: '#1c2833ba' }}
              setSelected={(value) => {
                setCategory(value);
              }}
              search={false}
              data={type === 'Sell' ? SellData : SavingsDate}
              save="value"
              placeholder="Select Category"
            />

            <TextInput
              style={[styles.input]}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Additional Info (optional)"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />

            <View style={[styles.inline]}>
              <View style={[{ alignItems: 'center' }]}>
                <MaterialIcons
                  name="date-range"
                  size={30}
                  color={colors.black}
                  onPress={() => {
                    setShowDatePicker(true);
                  }}
                />
                <Text style={[{ color: 'white' }]}>
                  {date.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={HandleSubmitData}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && renderDatePicker()}
          </View>
        </View>
        <Text style={[styles.Name, { color: isDark ? 'white' : 'black' }]}>Quick Add</Text>
        <QuickAddComponent
          data={QuickAddData}
          userData={userData}
          setCurrentMonthExpense={setCurrentMonthExpense}
          NavigateToQuickAdd={NavigateToQuickAdd}
        />

        <View style={[styles.separator, { marginVertical: 30 }]} />

        <NetSummaryComponent refreshTrigger={refreshTrigger} />
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
  },
  Name: {
    fontSize: fontSize.xxxLarge,
    textAlign: 'center',
    marginTop: 20,
    borderRadius: 50,
  },
  text: {
    fontSize: fontSize.large,
    marginBottom: 10,
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
  },
  input: {
    height: 45,
    borderColor: '#BABABA',
    borderRadius: 50,
    backgroundColor: '#F2F3F4',
    width: 300,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  button: {
    height: 45,
    backgroundColor: '#408c57',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    width: 250,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 6.8,
    paddingTop: 5,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
  top: {
    backgroundColor: colors.lightPurple,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    width: '100%',
    alignSelf: 'center',
  },
});
