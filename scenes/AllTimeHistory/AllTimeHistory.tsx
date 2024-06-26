import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import ScreenTemplate from '../../components/ScreenTemplate';
import { UserDataContext } from '../../context/UserDataContext';
import { colors, fontSize } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export default function AllTimeHistory() {
  const { userData } = useContext(UserDataContext)!;
  const isDark = true;
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const [monthsSinceJoined, setMonthsSinceJoined] = useState([]);
  const joinedDate = userData.joined.toDate();
  const currentDate = new Date();

  const navigatetomonth = (monthName) => {
    navigation.navigate('ModalStacks', {
      screen: 'Month',
      params: {
        month: monthName,
        userData,
      },
    });
  };

  useEffect(() => {
    const months = [];
    const currentMonth = new Date(joinedDate);

    while (
      currentMonth.getFullYear() < currentDate.getFullYear() ||
      (currentMonth.getFullYear() === currentDate.getFullYear() &&
        currentMonth.getMonth() <= currentDate.getMonth())
    ) {
      const formattedMonth = currentMonth.toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      });
      months.push(formattedMonth);
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    setMonthsSinceJoined(months.reverse());
  }, [userData.joined]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <ScreenTemplate>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.main, { paddingTop: 20 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text style={[styles.header, { color: isDark ? 'white' : 'black' }]}>All time history</Text>
        <View>
          <View style={styles.history}>
            {monthsSinceJoined.map((month, index) => (
              <TouchableOpacity
                onPress={() => navigatetomonth(month)}
                key={index}
                style={styles.monthcard}>
                <Text style={[styles.title]}>{month}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: fontSize.xLarge,
    textAlign: 'center',
    color: 'white',
    backgroundColor: colors.primaryText,
    width: '100%',
    paddingVertical: 4,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  header: {
    fontSize: fontSize.xxxLarge,
    textAlign: 'center',
    color: 'white',
  },
  history: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: 10,
  },
  monthcard: {
    backgroundColor: colors.lightPurple,
    width: '30%',
    maxWidth: 200,
    height: 100,
    margin: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.gray,
  },
});
