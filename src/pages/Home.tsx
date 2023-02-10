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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import PageContainer from 'components/PageContainer/PageContainer';
import {RootStackParamList} from 'navigation/Navigation';
import {HomeScreensParamList} from 'navigation/Home/Home';
import {CompositeScreenProps} from '@react-navigation/native';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';

export type IHomeItem = {
  id: string;
  title: string;
  icon: string;
  path: keyof HomeScreensParamList;
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

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeScreensParamList, 'Home', 'MyStack'>,
  NativeStackScreenProps<RootStackParamList>
>;

const Home = ({navigation}: HomeScreenProps) => {
  return (
    <PageContainer>
      <AppText style={styles.welcomeText}>Портал МО-4</AppText>
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
    fontSize: 25,
    color: COLORS.black,
    fontWeight: '600',
    marginVertical: 20,
    marginLeft: 20,
  },
});
