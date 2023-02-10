import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';

type Props = {
  name: string;
  value?: string | number | undefined;
  isFirst?: boolean;
  isLast?: boolean;
};

const ListItem = ({name, value, isFirst = false, isLast = false}: Props) => {
  return value != null ? (
    <View
      style={[
        styles.infoItemContainer,
        isFirst
          ? {marginTop: 2, borderTopLeftRadius: 5, borderTopRightRadius: 5}
          : null,
        isLast
          ? {
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              borderBottomWidth: 1,
              borderBottomColor: 'lightgray',
            }
          : null,
      ]}>
      <AppText style={styles.nameText}>{name}</AppText>
      <AppText style={styles.valueText}>{value}</AppText>
    </View>
  ) : null;
};

export default ListItem;

const styles = StyleSheet.create({
  infoItemContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    borderRightWidth: 1,
    borderRightColor: 'lightgray',
    borderLeftWidth: 1,
    borderLeftColor: 'lightgray',
  },
  nameText: {
    fontWeight: '500',
    fontSize: 20,
    color: COLORS.darkgray,
    // marginBottom: 3,
  },
  valueText: {
    color: COLORS.black,
    fontSize: 16,
  },
});
