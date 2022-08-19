import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Input from '../components/Inputs/Input';
import {useAppSelector} from '../hooks/redux';
import ContentBlock from '../components/ContentBlock/ContentBlock';
import {Snackbar} from 'react-native-paper';
import {useActions} from 'hooks/actions';
import PageContainer from 'components/PageContainer/PageContainer';

const Settings = () => {
  const {serverUrl} = useAppSelector(state => state.settings);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [server, setServer] = useState(serverUrl);
  const [initialServerUrl, setInitialServerUrl] = useState(serverUrl);

  const {setServerUrl} = useActions();

  const saveSettings = () => {
    setSnackbarVisible(true);
    setServerUrl(server);
  };

  return (
    <PageContainer>
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
            setServerUrl(initialServerUrl);
            setServer(initialServerUrl);
          },
        }}
        duration={5000}>
        Настройки сохранены
      </Snackbar>
    </PageContainer>
  );
};

export default Settings;

const styles = StyleSheet.create({});
