import {StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';

type Props = {
  children: ReactNode;
  title?: string;
  helperText?: string;
  transparent?: boolean;
};

const ContentBlock = ({
  children,
  title,
  transparent = false,
  helperText,
}: Props) => {
  return (
    <>
      {title ? <Text style={styles.header}>{title}</Text> : <></>}
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : <></>}
      <View
        style={[
          styles.mainItem,
          transparent ? {backgroundColor: undefined, margin: -15} : null,
        ]}>
        {children}
      </View>
    </>
  );
};

export default ContentBlock;

const styles = StyleSheet.create({
  mainItem: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 19,
    marginTop: 10,
    fontWeight: '500',
    color: '#404040',
  },
  helperText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'gray',
  },
});
