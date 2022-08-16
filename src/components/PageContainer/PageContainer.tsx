import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';

type Props = {
  children: ReactNode;
};

const PageContainer = ({children}: Props) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

export default PageContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
});
