import React, { useState, useContext } from 'react';
import { Text, View, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import ScreenTemplate from '../../components/ScreenTemplate';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { HomeTitleContext } from '../../context/HomeTitleContext';
import { UserDataContext } from '../../context/UserDataContext';
import { colors } from '../../theme';
import { firestore } from '../../firebase/config';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { showToast } from '../../utils/ShowToast';
import { SelectList } from 'react-native-dropdown-select-list';
import Button from '../../components/Button';

export default function QuickAdd() {
  const navigation = useNavigation();
  const { setTitle } = useContext(HomeTitleContext);
  const { userData } = useContext(UserDataContext)!;

  const SellData = userData && userData.Sell;

  // Quick Add information
  const [title, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amounts, setAmount] = useState([]);

  useFocusEffect(() => {
    setTitle('Quick Add Shortcuts');
  });

  const handlGenrateQuickAdd = async () => {
    if (!title || !category || !amounts) {
      Alert.alert('Error', 'Please fill in all fields ');
      return;
    }

    const isValidTitle = /^[a-zA-Z0-9 ]{4,}$/.test(title.trim());

    if (!isValidTitle) {
      Alert.alert(
        'Error',
        'Please enter a valid title with at least 4 characters (excluding special characters like period, comma, semicolon).'
      );
      return;
    }

    const isValidAmounts = amounts.every((amount) => /^\d+$/.test(amount));

    if (!isValidAmounts) {
      Alert.alert('Error', 'Please enter valid amounts containing only numbers.');
      return;
    }

    const filteredAmounts = amounts.filter((amount) => amount !== '');

    if (filteredAmounts.length === 0) {
      Alert.alert('Incomplete data', 'Please fill in 3 amounts.');
      return;
    }

    if (filteredAmounts.some((amount) => parseInt(amount) > 10000)) {
      alert('Cannot generate quick add for amounts greater than 10,000');
      return;
    }

    const newQuickAdd = { category, title, amounts: filteredAmounts };
    console.log(newQuickAdd);

    const userDocRef = doc(firestore, 'users', userData.id);

    // Update Firestore document with new quick add
    try {
      await updateDoc(userDocRef, {
        quickadd: arrayUnion(newQuickAdd),
      });

      showToast({
        title: 'Success',
        body: 'New Quick Add Generated',
      });

      setName('');
      setAmount([]);
      setCategory('');

      navigation.goBack();
    } catch (error) {
      console.error('Error updating document: ', error);
      showToast({
        title: 'Error',
        body: 'Failed to generate Quick Add. Please try again later.',
      });
    }
  };

  return (
    <ScreenTemplate>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text
            style={[
              {
                fontSize: 15,
                textAlign: 'center',
                color: 'white',
                backgroundColor: colors.darkPurple,
                padding: 10,
                width: '110%',
              },
            ]}>
            Create a new template for Quick Add
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: 'black', backgroundColor: colors.lightGrayPurple }]}
              value={title}
              onChangeText={setName}
              placeholder="Title"
              placeholderTextColor="gray"
            />
            <Text style={[styles.title, { color: 'white' }]}>
              Setup the shortcut for most frequent Retails
            </Text>
            <View
              style={{
                display: 'flex',
                gap: 5,
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-around',
              }}>
              {[1, 2, 3].map((index) => (
                <View style={styles.inline} key={index}>
                  <TextInput
                    style={[
                      styles.numeric,
                      {
                        color: 'black',
                        backgroundColor: colors.lightGrayPurple,
                      },
                    ]}
                    keyboardType="numeric"
                    value={amounts[index - 1]}
                    onChangeText={(value) => {
                      const newAmounts = [...amounts];
                      newAmounts[index - 1] = value;
                      setAmount(newAmounts);
                    }}
                    placeholder={`Amount ${index}`}
                    placeholderTextColor="gray"
                  />
                </View>
              ))}
            </View>
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
              setSelected={(value: string) => {
                setCategory(value);
              }}
              search={false}
              data={SellData}
              save="value"
              placeholder="Select Category"
            />
          </View>

          <Button
            label="Generate Quick Add"
            color={colors.darkInput}
            onPress={() => {
              handlGenrateQuickAdd();
            }}
          />
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  lightContent: {
    backgroundColor: '#fff',
  },
  darkContent: {
    backgroundColor: '#34495E',
  },
  aboutContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    width: 300,
    alignSelf: 'center',
  },
  aboutText: {
    fontSize: 16,
    marginVertical: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.blueLight,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    alignItems: 'center',
    marginVertical: 30,
    gap: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingHorizontal: 10,
    color: colors.primaryText,
    height: 45,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#7676768f',
    borderRadius: 15,
    padding: 10,
    marginVertical: 8,
    width: '80%',
    height: 60,
  },
  cat: {
    width: '100%',
    maxWidth: 600,
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  numeric: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: colors.primaryText,
    width: 90,
    height: 45,
  },
});
