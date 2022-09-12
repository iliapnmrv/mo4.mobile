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
import PageContainer from 'components/PageContainer/PageContainer';

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
    path: 'InventoryStack',
  },
  {
    id: '2',
    title: 'Документооборот',
    icon: 'md-document-text-outline',
    path: 'DocsStack',
  },
  {id: '3', title: 'Картриджи', icon: 'md-print-outline', path: 'Cartridges'},
];

type Props = NativeStackScreenProps<RootStackParamList, 'Home', 'MyStack'>;

const Home = ({navigation}: Props) => {
  return (
    <PageContainer>
      <Text style={styles.welcomeText}>Добро пожаловать!</Text>
      <FlatList
        data={Screens}
        renderItem={({item}) => <HomePageItem item={item} />}
        keyExtractor={item => item.id}
        numColumns={2}
        horizontal={false}
      />
    </PageContainer>
  );
};

export default Home;

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 22,
  },
});
