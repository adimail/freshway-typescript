import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import ScreenTemplate from '../../components/ScreenTemplate';
import { UserDataContext } from '../../context/UserDataContext';
import { colors, fontSize } from '../../theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { UserData } from '../../types/user';

interface RootStackParamList {
  ModalStacks: {
    screen: 'InventoryMonth';
    params: {
      month: string;
      userData: UserData;
    };
  };
}

export default function AllTimeInventoryHistory(): JSX.Element {
  const { userData } = useContext(UserDataContext)!;
  const isDark = true;
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const getMonthsSinceJoined = (): string[] => {
    const joinedDate = userData.joined.toDate();
    const result: string[] = [];
    const now = new Date();

    const currentDate = new Date(joinedDate);

    while (currentDate <= now) {
      result.push(
        currentDate.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      );
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return result.reverse();
  };

  const monthsSinceJoined = getMonthsSinceJoined();

  const navigateToMonth = (monthName: string) => {
    navigation.navigate('ModalStacks', {
      screen: 'InventoryMonth',
      params: {
        month: monthName,
        userData,
      },
    });
  };

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
                onPress={() => navigateToMonth(month)}
                key={index}
                style={styles.monthCard}>
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
  monthCard: {
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
