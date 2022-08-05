import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RootStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import QRButton from '../components/Buttons/QRButton';
import {useAppSelector} from '../hooks/redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Input from '../components/Inputs/Input';
import ContentBlock from '../components/ContentBlock/ContentBlock';
import {useLazyQuery, useMutation} from '@apollo/client';
import {FindByNameQuery} from '../lib/Queries';
import {ICartridge, LogTypesEnum} from '../types/cartridge';
import moment from 'moment';
import 'moment/locale/ru';
import {UpdateCartridgeAmountMutation} from '../lib/Mutations';
import {Snackbar} from 'react-native-paper';
import {store} from '../store/store';
import apolloClient from '../lib/apollo';
moment.locale('ru');

type Props = NativeStackScreenProps<RootStackParamList, 'Home', 'MyStack'>;

type IFindByName = {
  findByName: ICartridge;
};

const Home = ({navigation}: Props) => {
  const [
    executeFindByName,
    {data: cartridge, loading: findByNameLoading, error: findByNameError},
  ] = useLazyQuery<IFindByName>(FindByNameQuery);

  const [
    updateCartridge,
    {data: updateResponseData, loading: updateLoading, error: updateError},
  ] = useMutation(UpdateCartridgeAmountMutation);

  useEffect(() => {
    findByNameError || updateError
      ? setErrorSnackbarVisible(true)
      : setErrorSnackbarVisible(false);
  }, [findByNameError, updateError]);

  const {scan} = useAppSelector(state => state.scan);
  const {serverUrl} = useAppSelector(state => state.settings);

  const [amount, setAmount] = useState<string>('');
  const [errorSnackbarVisible, setErrorSnackbarVisible] =
    useState<boolean>(false);

  store.subscribe(() => {
    executeFindByName({variables: {name: store.getState().scan.scan}});
  });

  const updateCartridgeAmount = (type: LogTypesEnum) => {
    updateCartridge({
      variables: {
        id: cartridge?.findByName.id,
        amount: +amount,
        type,
      },
    });
    setAmount('');
  };

  console.log('cartridge?.findByName', cartridge?.findByName);

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl
            refreshing={findByNameLoading || updateLoading}
            onRefresh={() => executeFindByName({variables: {name: scan}})}
          />
        }>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.container}
          keyboardVerticalOffset={Platform.select({
            ios: 0,
            android: -300,
          })}>
          <QRButton action={() => navigation.navigate('Scanner')} />
          <ContentBlock title="Сканирование">
            {scan && !!cartridge?.findByName ? (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <Text style={styles.mainText}>
                  Наименование: {cartridge.findByName.name}
                </Text>
                <Text style={styles.mainText}>
                  Количество: {cartridge.findByName.amount}
                </Text>
                {cartridge.findByName.info ? (
                  <Text style={styles.mainText}>
                    Примечания: {cartridge.findByName.info}
                  </Text>
                ) : (
                  <Text>Примечания отсутствуют</Text>
                )}
              </View>
            ) : scan && !!!cartridge?.findByName ? (
              <Text style={styles.mainText}>{scan} отсутствует в списке</Text>
            ) : (
              <Text style={styles.mainText}>Отсканируйте QR код</Text>
            )}
          </ContentBlock>

          <ContentBlock title="Действия">
            <View pointerEvents={!cartridge?.findByName?.id ? 'none' : 'auto'}>
              <View style={styles.itemAmountChange}>
                <TouchableOpacity
                  style={[
                    styles.actionIcon,
                    styles.actionButtonSub,
                    !cartridge?.findByName?.id ? styles.disabled : null,
                  ]}
                  onPress={() => updateCartridgeAmount(LogTypesEnum.sub)}
                  activeOpacity={0.7}>
                  <Icon name="remove" size={30} color="#fff" />
                  <Text style={[styles.mainText, {color: 'white'}]}>
                    Выдача
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateCartridgeAmount(LogTypesEnum.add)}
                  activeOpacity={0.7}
                  style={[
                    styles.actionIcon,
                    styles.actionButtonAdd,
                    !cartridge?.findByName?.id ? styles.disabled : null,
                  ]}>
                  <Icon name="add-sharp" size={30} color="#000" />
                  <Text style={styles.mainText}>Поступление</Text>
                </TouchableOpacity>
              </View>

              <Input
                label="Количество картриджей"
                value={amount}
                setValue={setAmount}
                keyboardType="numeric"
                placeholder="Введите количество"
              />
            </View>
          </ContentBlock>
          {scan && !!cartridge?.findByName ? (
            <ContentBlock title="Журная действий">
              {cartridge?.findByName.logs?.length ? (
                <>
                  <Text style={styles.secondaryText}>
                    Количество Описание Дата
                  </Text>
                  {cartridge?.findByName.logs?.map((log, index) => (
                    <Text style={styles.secondaryText} key={index}>
                      {log.type === 'add' ? '+' : '-'}
                      {log.amount} {log.description}{' '}
                      {moment(log.created_at).format('L')}
                    </Text>
                  ))}
                </>
              ) : (
                <Text style={styles.secondaryText}>Действия отсутствуют</Text>
              )}
            </ContentBlock>
          ) : (
            <></>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
      <Snackbar
        visible={errorSnackbarVisible}
        onDismiss={() => setErrorSnackbarVisible(false)}
        duration={5000}>
        Ошибка: проверьте подключение к сети {serverUrl}
      </Snackbar>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  disabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.26)',
  },
  mainText: {
    color: '#000',
    fontSize: 18,
    // flex: 1,
    // flexWrap: 'wrap',
  },
  secondaryText: {
    color: '#000',
    fontSize: 14,
  },
  itemAmountChange: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '100%',
  },
  actionIcon: {
    width: '47%',
    display: 'flex',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 3,
    paddingVertical: 5,
  },
  actionButtonAdd: {
    backgroundColor: '#fff',
  },
  actionButtonSub: {
    backgroundColor: '#80a3ff',
  },
});
