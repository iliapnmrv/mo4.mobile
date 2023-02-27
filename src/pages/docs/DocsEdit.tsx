import {Picker} from '@react-native-picker/picker';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Button from 'components/Buttons/Button';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import Input from 'components/Inputs/Input';
import PageContainer from 'components/PageContainer/PageContainer';
import AppText from 'components/Text/AppText';
import {COLORS} from 'constants/colors';
import {useActions} from 'hooks/actions';
import {useAppSelector} from 'hooks/redux';
import {DocsParamList} from 'navigation/Home/Docs';
import {RootStackParamList} from 'navigation/Navigation';
import React, {useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Image,
  RefreshControl,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {Modal, StyleSheet, TextInput, View} from 'react-native';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import Swiper from 'react-native-swiper';
import {useGetCatalogsQuery, useUpdateItemMutation} from 'redux/docs/docs.api';
import {useGetItemQuery, useUploadFilesMutation} from 'redux/docs/docs.api';
import {IItem} from 'types/docs/docs';

type DocsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DocsParamList, 'DocsEdit'>,
  NativeStackScreenProps<RootStackParamList>
>;

type ItemFields = Partial<
  Pick<
    IItem,
    | 'user_id'
    | 'type_id'
    | 'additional_information'
    | 'description'
    | 'device_id'
    | 'model'
    | 'serial_number'
    | 'place_id'
    | 'person_id'
    | 'status_id'
  >
>;

const removeValuesFromItem = (item: any) => {
  return {
    qr: item?.qr ?? '',
    name: item?.name ?? '',
    model: item?.model ?? '',
    place_id: item?.place_id ?? '',
    status_id: item?.status_id ?? '',
    device_id: item?.device_id ?? '',
    type_id: item?.type_id ?? '',
    user_id: item?.user_id ?? '',
    person_id: item?.person_id ?? '',
    year: item?.year ?? '',
    month: item?.month ?? '',
    description: item?.description ?? '',
    serial_number: item?.serial_number ?? '',
    additional_information: item?.additional_information ?? '',
  };
};

const DocsEdit = ({navigation, route}: DocsScreenProps) => {
  const {id, title} = route.params;

  const [viewImages, setViewImages] = useState<boolean>(false);
  const [imagesIndex, setImagesIndex] = useState<number>(0);

  const {data: item} = useGetItemQuery(id);

  const {data: catalogs} = useGetCatalogsQuery();

  const [updateItem] = useUpdateItemMutation();

  const {prevValues} = useAppSelector(state => state.docs);
  const {serverUrl} = useAppSelector(state => state.settings);

  const {setPrevValues} = useActions();

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors: err},
  } = useForm<ItemFields>({
    defaultValues: useMemo(() => {
      return removeValuesFromItem(item);
    }, [item]),
  });

  const onSubmit = async (data: ItemFields) => {
    try {
      const {
        additional_information,
        description,
        model,
        serial_number,
        ...rest
      } = data;

      setPrevValues(rest);
      const res = await updateItem({...data, qr: id}).unwrap();

      ToastAndroid.show('Успешно обновлено', ToastAndroid.LONG);

      navigation.navigate('Docs');
    } catch (e) {
      console.log(e);
    }
  };

  const [uploadFiles] = useUploadFilesMutation();

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
      ToastAndroid.show('Фото успешно загружено', ToastAndroid.LONG);
    } catch (e) {
      console.log(123, e);

      ToastAndroid.show(
        `Произошла ошибка при загрузке ${(e as any)?.message}`,
        ToastAndroid.LONG,
      );
    }
  };

  const onViewerClose = () => {
    setViewImages(false);
  };

  const staticUrl = serverUrl.replace('api/', '');

  return (
    <PageContainer>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }>
        {item?.files?.[0]?.path ? (
          <Swiper style={{height: 200}} loop={false} showsButtons={true}>
            {item?.files.map((file, index) => (
              <TouchableOpacity
                key={file.id}
                activeOpacity={0.7}
                onPress={() => {
                  setViewImages(true);
                  setImagesIndex(index);
                }}>
                <Image
                  style={{width: '100%', height: 200}}
                  source={{uri: staticUrl + file.path}}
                />
              </TouchableOpacity>
            ))}
          </Swiper>
        ) : null}

        {item?.files ? (
          // {true ? (
          <Modal
            visible={viewImages}
            onRequestClose={onViewerClose}
            transparent={true}>
            <ImageViewer
              index={imagesIndex}
              onSwipeDown={onViewerClose}
              enableSwipeDown
              onCancel={onViewerClose}
              // imageUrls={[
              //   {
              //     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
              //   },
              //   {
              //     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
              //   },
              // ]}
              imageUrls={item?.files?.map(file => ({
                url: staticUrl + file.path,
              }))}
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

        {item ? (
          <ContentBlock title="Изменить информацию">
            <View>
              <AppText style={styles.label}>Номенкулатура</AppText>
              <Controller
                name="device_id"
                control={control}
                render={({field: {onChange, value}, formState: {errors}}) => (
                  <View style={styles.select}>
                    <Picker
                      mode="dropdown"
                      selectedValue={value}
                      onValueChange={onChange}>
                      {catalogs?.devices?.map((catalog, index) => (
                        <Picker.Item
                          key={index}
                          label={catalog.name}
                          value={catalog.id}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              />
              {prevValues?.device_id ? (
                <Button
                  onPress={() => {
                    setValue(
                      'device_id',
                      catalogs?.devices.find(
                        device => device.id === prevValues.device_id,
                      )?.id,
                    );
                  }}
                  textStyle={{textAlign: 'right'}}
                  style={{marginBottom: 8}}
                  text={`Предыдущее значение ${
                    catalogs?.devices.find(
                      device => device.id === prevValues.device_id,
                    )?.name
                  }`}
                  type="text"
                />
              ) : null}
            </View>
            <View>
              <AppText style={styles.label}>Пользователь</AppText>
              <Controller
                name="user_id"
                control={control}
                render={({field: {onChange, value}, formState: {errors}}) => (
                  <View style={styles.select}>
                    <Picker
                      mode="dropdown"
                      selectedValue={value}
                      onValueChange={onChange}>
                      {catalogs?.users?.map((catalog, index) => (
                        <Picker.Item
                          key={index}
                          label={catalog.name}
                          value={catalog.id}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              />
              {prevValues?.user_id ? (
                <Button
                  onPress={() => {
                    setValue(
                      'user_id',
                      catalogs?.users.find(
                        user => user.id === prevValues.user_id,
                      )?.id,
                    );
                  }}
                  textStyle={{textAlign: 'right'}}
                  style={{marginBottom: 8}}
                  text={`Предыдущее значение ${
                    catalogs?.users.find(user => user.id === prevValues.user_id)
                      ?.name
                  }`}
                  type="text"
                />
              ) : null}
            </View>
            <View>
              <AppText style={styles.label}>Статус</AppText>
              <Controller
                name="status_id"
                control={control}
                render={({field: {onChange, value}, formState: {errors}}) => (
                  <View style={styles.select}>
                    <Picker
                      mode="dropdown"
                      selectedValue={value}
                      onValueChange={onChange}>
                      {catalogs?.statuses?.map((catalog, index) => (
                        <Picker.Item
                          key={index}
                          label={catalog.name}
                          value={catalog.id}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              />
              {prevValues?.status_id ? (
                <Button
                  onPress={() => {
                    setValue(
                      'status_id',
                      catalogs?.statuses.find(
                        status => status.id === prevValues.status_id,
                      )?.id,
                    );
                  }}
                  textStyle={{textAlign: 'right'}}
                  style={{marginBottom: 8}}
                  text={`Предыдущее значение ${
                    catalogs?.statuses.find(
                      status => status.id === prevValues.status_id,
                    )?.name
                  }`}
                  type="text"
                />
              ) : null}
            </View>
            <View>
              <AppText style={styles.label}>МОЛ</AppText>
              <Controller
                name="person_id"
                control={control}
                render={({field: {onChange, value}, formState: {errors}}) => (
                  <View style={styles.select}>
                    <Picker
                      mode="dropdown"
                      selectedValue={value}
                      onValueChange={onChange}>
                      {catalogs?.persons?.map((catalog, index) => (
                        <Picker.Item
                          key={index}
                          label={catalog.name}
                          value={catalog.id}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              />
              {prevValues?.person_id ? (
                <Button
                  onPress={() => {
                    setValue(
                      'person_id',
                      catalogs?.persons.find(
                        person => person.id === prevValues.person_id,
                      )?.id,
                    );
                  }}
                  textStyle={{textAlign: 'right'}}
                  style={{marginBottom: 8}}
                  text={`Предыдущее значение ${
                    catalogs?.persons.find(
                      person => person.id === prevValues.person_id,
                    )?.name
                  }`}
                  type="text"
                />
              ) : null}
            </View>
            <View>
              <AppText style={styles.label}>Местоположение</AppText>
              <Controller
                name="place_id"
                control={control}
                render={({field: {onChange, value}, formState: {errors}}) => (
                  <View style={styles.select}>
                    <Picker
                      mode="dropdown"
                      selectedValue={value}
                      onValueChange={onChange}>
                      {catalogs?.places?.map((catalog, index) => (
                        <Picker.Item
                          key={index}
                          label={catalog.name}
                          value={catalog.id}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              />
              {prevValues?.place_id ? (
                <Button
                  onPress={() => {
                    setValue(
                      'place_id',
                      catalogs?.places.find(
                        place => place.id === prevValues.place_id,
                      )?.id,
                    );
                  }}
                  textStyle={{textAlign: 'right'}}
                  style={{marginBottom: 8}}
                  text={`Предыдущее значение ${
                    catalogs?.places.find(
                      place => place.id === prevValues.place_id,
                    )?.name
                  }`}
                  type="text"
                />
              ) : null}
            </View>
            <Controller
              name="description"
              control={control}
              render={({field: {onChange, value}, formState: {errors}}) => (
                <Input
                  setValue={onChange}
                  value={value ?? ''}
                  label="Описание"
                  multiline
                  numberOfLines={5}
                  style={styles.input}
                />
              )}
            />
            <Controller
              name="additional_information"
              control={control}
              render={({field: {onChange, value}, formState: {errors}}) => (
                <Input
                  setValue={onChange}
                  value={value ?? ''}
                  label="Доп. описание"
                  style={styles.input}
                />
              )}
            />
          </ContentBlock>
        ) : null}
      </ScrollView>
      <View style={{paddingVertical: 5}}>
        <Button onPress={handleSubmit(onSubmit)} text="Сохранить изменения" />
      </View>
    </PageContainer>
  );
};

export default DocsEdit;

const styles = StyleSheet.create({
  input: {
    // height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: COLORS.black,
  },
  slide: {flex: 1},
  label: {
    fontSize: 17,
    marginBottom: 4,
  },
  select: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.darkgray,
  },
});
