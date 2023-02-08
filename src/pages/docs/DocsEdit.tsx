import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import QRButton from 'components/Buttons/QRButton';
import {useAppSelector} from 'hooks/redux';
import {
  useGetOwnersQuery,
  useGetPersonsQuery,
  useGetStatusesQuery,
  useGetStoragesQuery,
  useGetTypesQuery,
  useLazyGetDocsItemQuery,
} from 'redux/docs/docs.api';
import PageContainer from 'components/PageContainer/PageContainer';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import {useActions} from 'hooks/actions';
import HorizontalListSeparator from 'components/List/HorizontalListSeparator';
import {CatalogsNames} from 'types/docs/catalogs';
import {Picker} from '@react-native-picker/picker';
import {CompositeScreenProps} from '@react-navigation/native';
import {RootStackParamList} from 'navigation/Navigation';
import {DocsParamList} from 'navigation/Home/Docs';

type DocsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DocsParamList, 'DocsEdit', 'MyStack'>,
  NativeStackScreenProps<RootStackParamList>
>;

const DocsEdit = ({navigation}: DocsScreenProps) => {
  const {docsScan} = useAppSelector(state => state.scan);

  const {history} = useAppSelector(state => state.docs);

  const {setDocsScan, setDocsHistory} = useActions();

  const [getDoc, {isLoading, isError, data: docData, error}] =
    useLazyGetDocsItemQuery();

  const {data: statuses} = useGetStatusesQuery('');
  const {data: persons} = useGetPersonsQuery('');
  const {data: storages} = useGetStoragesQuery('');
  const {data: owners} = useGetOwnersQuery('');
  const {data: types} = useGetTypesQuery('');

  console.log(types);

  const [selectedLanguage, setSelectedLanguage] = useState();
  const [text, onChangeText] = useState('');

  useEffect(() => {
    console.log('docsScan', docsScan);
  }, [docsScan]);

  return (
    <PageContainer>
      <QRButton
        action={() =>
          navigation.navigate('Scanner', {
            setScan: data => {
              setDocsScan(data), setDocsHistory(data);
            },
          })
        }
      />
      {history.length ? (
        <ContentBlock
          transparent
          helperText="Нажмите, чтобы получить информацию"
          title="Предыдущие сканирования">
          <FlatList
            horizontal={true}
            data={history}
            ItemSeparatorComponent={() => <HorizontalListSeparator />}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => setDocsScan(item)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 5,
                  maxWidth: Dimensions.get('screen').width - 20,
                }}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        </ContentBlock>
      ) : null}
      <ContentBlock title="Сканирование">
        <View>
          <Text>
            {docsScan ? docsScan : 'Отсканируйте код чтобы получить информацию'}
          </Text>
        </View>
      </ContentBlock>
      {/* {docData ? ( */}
      {true ? (
        <ContentBlock title="Изменить информацию">
          <View></View>

          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            {types?.map((type, index) => (
              <Picker.Item
                key={index}
                label={type.type_name}
                value={type.type_id}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            {owners?.map((owner, index) => (
              <Picker.Item
                key={index}
                label={owner.owner_name}
                value={owner.owner_id}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            {storages?.map((storage, index) => (
              <Picker.Item
                key={index}
                label={storage.storage_name}
                value={storage.storage_id}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            {persons?.map((person, index) => (
              <Picker.Item
                key={index}
                label={person.person_name}
                value={person.person_id}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            {statuses?.map((status, index) => (
              <Picker.Item
                key={index}
                label={status.status_name}
                value={status.id}
              />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
          />
        </ContentBlock>
      ) : null}
    </PageContainer>
  );
};

export default DocsEdit;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
