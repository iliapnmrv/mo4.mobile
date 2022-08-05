import {StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';

type Props = {
  children: ReactNode;
  title?: string;
};

const ContentBlock = ({children, title}: Props) => {
  return (
    <View style={styles.mainItem}>
      {title ? <Text style={styles.header}>{title}</Text> : <></>}
      {children}
    </View>
  );
};

export default ContentBlock;

const styles = StyleSheet.create({
  mainItem: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '700',
    color: '#000',
  },
});
