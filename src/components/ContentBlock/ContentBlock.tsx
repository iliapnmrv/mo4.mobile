import {StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';

type Props = {
  children: ReactNode;
  title?: string;
};

const ContentBlock = ({children, title}: Props) => {
  return (
    <>
      {title ? <Text style={styles.header}>{title}</Text> : <></>}
      <View style={styles.mainItem}>{children}</View>
    </>
  );
};

export default ContentBlock;

const styles = StyleSheet.create({
  mainItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  header: {
    fontSize: 19,
    marginTop: 10,
    // marginBottom: 10,
    fontWeight: '500',
    color: '#000',
  },
});
