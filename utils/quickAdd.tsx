import React, { useState, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import IconButton from '../components/IconButton';
import { colors } from '../theme';
import { submitData } from './SubmitUserData';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { deleteQuickAdd } from './deletequickadd';

import { showToast } from './ShowToast';

const QuickAddComponent = ({ data, userData, setCurrentMonthExpense, NavigateToQuickAdd }) => {
  const isDark = true;

  const handleAddLog = (title, amount, category, description) => {
    const type = 'Sell';

    const amountInt = parseInt(amount);

    submitData(
      type,
      title,
      amountInt,
      category,
      userData,
      new Date(),
      description,
      setCurrentMonthExpense
    )
      .then(() => {
        showToast({
          title: 'Log Added',
          body: title,
          isDark,
        });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
        Alert.alert('Error', 'Failed to add log. Please try again.');
      });
  };

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.scrollViewContainer}
      showsVerticalScrollIndicator={false}>
      {data &&
        data.map((item, index) => (
          <QuickAddItem
            key={index}
            title={item.title}
            amounts={item.amounts}
            category={item.category}
            userData={userData}
            handleAddLog={handleAddLog}
            deleteQuickAdd={deleteQuickAdd}
          />
        ))}

      {data.length <= 10 ? (
        <TouchableOpacity onPress={() => NavigateToQuickAdd()}>
          <View style={[styles.item, { alignItems: 'center', backgroundColor: colors.gray }]}>
            <FontIcon name="plus" color={colors.white} size={81} />
            <Text style={{ color: colors.white, fontSize: 18, textAlign: 'center' }}>
              New Quick Add
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            width: 155,
            height: 150,
            display: 'flex',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: colors.primaryText,
            alignItems: 'center',
            marginHorizontal: 15,
            borderRadius: 20,
            borderWidth: 0.3,
            borderColor: 'white',
          }}>
          <MaterialCommunityIcons name="car-speed-limiter" size={55} color="#fff" />
          <Text style={{ color: colors.white, fontSize: 15, textAlign: 'center' }}>
            You can add maximum 6 Quick Adds
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const QuickAddItem = ({ title, amounts, category, userData, handleAddLog, deleteQuickAdd }) => {
  const isDark = true;
  const description = 'Quick add item';

  const [selectedAmountIndex, setSelectedAmountIndex] = useState(0);

  const handleAmountPress = (index) => {
    setSelectedAmountIndex((prevIndex) => (prevIndex === index ? prevIndex : index));
  };

  const handleDeleteQuickAdd = async () => {
    try {
      await deleteQuickAdd(userData.id, title);
    } catch (error) {
      console.error('Error deleting quick add:', error);
      Alert.alert('Error', 'Failed to delete Quick Add. Please try again later.');
    }
  };

  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor: isDark ? colors.primaryText : colors.darkInput,
        },
      ]}>
      <View style={styles.body}>
        <Text style={[styles.text, { color: 'white', paddingBottom: 5 }]}>{title}</Text>

        <View style={styles.buttons}>
          {amounts &&
            amounts.map((amount, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.list, selectedAmountIndex === index && styles.selectedAmount]}
                onPress={() => handleAmountPress(index)}>
                <Text
                  style={[
                    styles.amountText,
                    {
                      backgroundColor: selectedAmountIndex === index ? '#212F3D' : '#566573',
                    },
                  ]}>
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {/* <IconButton
          icon="pen"
          color={colors.white}
          size={20}
          onPress={() => handleEditQuickAdd()}
          containerStyle={{ paddingRight: 15 }}
        /> */}
        <IconButton
          icon="trash"
          color={colors.white}
          size={20}
          onPress={handleDeleteQuickAdd}
          containerStyle={{ paddingRight: 15 }}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#408c57' }]}
          onPress={() => {
            handleAddLog(title, amounts[selectedAmountIndex], category, description);
          }}>
          <Text style={[styles.buttonText]}>Add Log</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 180,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  item: {
    width: 222,
    height: 150,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 20,
    borderWidth: 0.3,
    borderColor: 'white',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    width: 80,
    alignItems: 'center',
    margin: 5,
    borderWidth: 0.5,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '50%',
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    backgroundColor: '#EAECEE',
    width: 190,
    padding: 8,
    borderRadius: 100,
    justifyContent: 'space-around',
  },
  list: {
    display: 'flex',
  },
  amountText: {
    color: 'white',
    fontSize: 15,
    padding: 2,
    borderRadius: 100,
    width: 41,
    textAlign: 'center',
  },
  selectedAmount: {
    borderRadius: 100,
    transform: [{ scale: 1.2 }],
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

export default QuickAddComponent;
