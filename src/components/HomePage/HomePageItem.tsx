import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IHomeItem} from 'pages/Home';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';

type Props = {
  item: IHomeItem;
};

const HomePageItem = ({item}: Props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.itemContainer}
      //@ts-ignore
      onPress={() => navigation.navigate(item.path)}>
      <View style={styles.homeItem}>
        <AppText style={styles.homeItemText}>{item.title}</AppText>
        <Icon
          style={{marginTop: 5}}
          name={item.icon}
          size={50}
          color={COLORS.primary}
        />
      </View>
    </TouchableOpacity>
  );
};

export default HomePageItem;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1 / 2,
  },
  homeItem: {
    flex: 1,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 6,
    margin: 6,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeItemText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
});
