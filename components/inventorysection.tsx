import React from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'

export default function Section(props) {
  return <SafeAreaView style={styles.container}>{props?.children}</SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
})
