import {Picker} from '@react-native-picker/picker';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Button from 'components/Buttons/Button';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import PageContainer from 'components/PageContainer/PageContainer';
import {useAppSelector} from 'hooks/redux';
import {DocsParamList} from 'navigation/Home/Docs';
import {RootStackParamList} from 'navigation/Navigation';
import React, {useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Modal, StyleSheet, TextInput, View} from 'react-native';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useGetItemQuery, useUploadFilesMutation} from 'redux/docs/docs.api';

type DocsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DocsParamList, 'DocsEdit', 'MyStack'>,
  NativeStackScreenProps<RootStackParamList>
>;

const DocsEdit = ({navigation, route}: DocsScreenProps) => {
  const {id, title} = route.params;

  const [viewImages, setViewImages] = useState<boolean>(false);

  const {data: item} = useGetItemQuery(id);

  const {serverUrl} = useAppSelector(state => state.settings);

  const [uploadFiles] = useUploadFilesMutation();

  const [selectedLanguage, setSelectedLanguage] = useState();
  const [text, onChangeText] = useState('');

  const onImageFromLibrary = async () => {
    try {
      const result = await launchImageLibrary({mediaType: 'photo'});
      onImagesUpload(result?.assets);
    } catch (e) {
      console.log(e);
    }
  };

  const onTakeImage = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: true,
      });
      onImagesUpload(result?.assets);
    } catch (e) {
      console.log(e);
    }
  };

  const onImagesUpload = async (images: Asset[] | undefined) => {
    try {
      const form = new FormData();

      images?.forEach(image =>
        form.append('files', {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        }),
      );

      await uploadFiles({body: form, qr: id}).unwrap();
    } catch (e) {
      console.log(e);
    }
  };

  const onViewerClose = () => {
    setViewImages(false);
  };

  console.log(viewImages);

  return (
    <PageContainer>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setViewImages(true)}>
        <Image
          style={{width: '100%', height: 200}}
          // source={{uri: serverUrl + item?.files?.[0].path}}
          source={{
            uri: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
          }}
        />
      </TouchableOpacity>
      {/* {item?.files ? ( */}
      {true ? (
        <Modal
          visible={viewImages}
          onRequestClose={onViewerClose}
          // onCancel={() => setViewImages(false)}
          // onDismiss={onViewerClose}
          transparent={true}>
          <ImageViewer
            onSwipeDown={onViewerClose}
            enableSwipeDown
            onCancel={onViewerClose}
            imageUrls={[
              {
                url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
              },
              {
                url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
              },
            ]}
            // imageUrls={item?.files?.map(file => ({url: serverUrl + file.path}))}
          />
        </Modal>
      ) : (
        <View></View>
      )}

      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          gap: 15,
          marginTop: 10,
        }}>
        <Button
          type="outlined"
          text="Загрузить фото"
          onPress={onImageFromLibrary}
        />
        <Button text="Сделать фото" onPress={onTakeImage} />
      </View>

      {/* {docData ? ( */}
      {true ? (
        <ContentBlock title="Изменить информацию">
          <View></View>

          <Picker
            mode="dropdown"
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            <Picker.Item label="JavaScript" value="js" />
            {/* {types?.map((type, index) => (
              <Picker.Item
                key={index}
                label={type.type_name}
                value={type.type_id}
              />
            ))} */}
          </Picker>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            {/* {owners?.map((owner, index) => (
              <Picker.Item
                key={index}
                label={owner.owner_name}
                value={owner.owner_id}
              />
            ))} */}
          </Picker>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            {/* {storages?.map((storage, index) => (
              <Picker.Item
                key={index}
                label={storage.storage_name}
                value={storage.storage_id}
              />
            ))} */}
          </Picker>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            {/* {persons?.map((person, index) => (
              <Picker.Item
                key={index}
                label={person.person_name}
                value={person.person_id}
              />
            ))} */}
          </Picker>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            {/* {statuses?.map((status, index) => (
              <Picker.Item
                key={index}
                label={status.status_name}
                value={status.id}
              />
            ))} */}
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
  slide: {flex: 1},
});
