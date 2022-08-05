import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Input from '../components/Inputs/Input';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {setServerUrl} from '../store/reducers/settingsReducer';
import ContentBlock from '../components/ContentBlock/ContentBlock';
import {Snackbar} from 'react-native-paper';

const Settings = () => {
  const {serverUrl} = useAppSelector(state => state.settings);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [server, setServer] = useState(serverUrl);
  const [initialServerUrl, setInitialServerUrl] = useState(serverUrl);

  const dispatch = useAppDispatch();

  const saveSettings = () => {
    setSnackbarVisible(true);
    dispatch(setServerUrl(server));
  };

  return (
    <>
      <View>
        <ContentBlock title="Сервер">
          <Input value={server} setValue={setServer} label="Ссылка на сервер" />
          <Button title="Сохранить" onPress={saveSettings} />
        </ContentBlock>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Отменить',
          onPress: () => {
            dispatch(setServerUrl(initialServerUrl));
            setServer(initialServerUrl);
          },
        }}
        duration={5000}>
        Настройки сохранены
      </Snackbar>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({});
