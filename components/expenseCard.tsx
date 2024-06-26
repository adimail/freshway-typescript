import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { colors } from '../theme';

export default function Card({ title, amount }: { title: string; amount: number }) {
  const dynamicCardStyles = {
    ...styles.card,
    height: styles.card.height,
  };

  return (
    <View style={dynamicCardStyles}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>₹ {amount}</Text>
    </View>
  );
}

export function SummaryCard({ expense, profit }: { expense: string; profit: string }) {
  return (
    <View
      style={{
        marginTop: 10,
        width: 300,
        borderRadius: 24,
        backgroundColor: colors.primaryText,
        marginBottom: 25,
        gap: 5,
        paddingVertical: 5,
        alignItems: 'center',
      }}>
      <View style={styles.summarycard}>
        <Text style={styles.title}>Total Spendings</Text>
        <Text style={styles.amount}>₹ {expense}</Text>
      </View>
      <View style={styles.summarycard}>
        <Text style={styles.title}>Estimated Profit</Text>
        <Text style={styles.amount}>₹ {profit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    width: '80%',
    backgroundColor: colors.primaryText,
    paddingHorizontal: 20,
    padding: 6,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 320,
    height: 50,
    alignSelf: 'center',
    margin: 10,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  summarycard: {
    display: 'flex',
    width: '90%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    alignSelf: 'center',
  },
  title: {
    fontSize: 17,
    color: 'white',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
});
