import {
  FlatList,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import HomePageItem from 'components/HomePage/HomePageItem';

export type IHomeItem = {
  id: string;
  title: string;
  icon: string;
};

const Screens: IHomeItem[] = [
  {id: '1', title: 'Инвентаризация', icon: 'md-list-outline'},
  {id: '2', title: 'Документооборот', icon: 'md-document-text-outline'},
  {id: '3', title: 'Картриджи', icon: 'md-print-outline'},
];

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Screens}
        renderItem={HomePageItem}
        keyExtractor={(item, index) => item.id}
        numColumns={2}
        horizontal={false}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5,
  },
});
