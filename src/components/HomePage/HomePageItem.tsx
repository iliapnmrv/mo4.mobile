import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IHomeItem} from 'pages/Home';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

type Props = {
  item: IHomeItem;
};

const HomePageItem = ({item}: Props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.55}
      style={styles.itemContainer}
      //@ts-ignore
      onPress={() => navigation.navigate(item.path)}>
      <View style={styles.homeItem}>
        <Text style={styles.homeItemText}>{item.title}</Text>
        <Icon
          style={{marginTop: 5}}
          name={item.icon}
          size={50}
          color={'#6495ED'}
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
