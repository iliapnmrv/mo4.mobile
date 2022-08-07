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
import {RootStackParamList} from 'App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type IHomeItem = {
  id: string;
  title: string;
  icon: string;
  path: keyof RootStackParamList;
};

const Screens: IHomeItem[] = [
  {
    id: '1',
    title: 'Инвентаризация',
    icon: 'md-list-outline',
    path: 'Inventory',
  },
  {
    id: '2',
    title: 'Документооборот',
    icon: 'md-document-text-outline',
    path: 'Docs',
  },
  {id: '3', title: 'Картриджи', icon: 'md-print-outline', path: 'Cartridges'},
];

type Props = NativeStackScreenProps<RootStackParamList, 'Home', 'MyStack'>;

const Home = ({navigation}: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Screens}
        renderItem={({item}) => <HomePageItem item={item} />}
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
