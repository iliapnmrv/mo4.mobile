import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Input from '../components/Inputs/Input';
import {useAppSelector} from '../hooks/redux';
import ContentBlock from '../components/ContentBlock/ContentBlock';
import {Snackbar} from 'react-native-paper';
import {useActions} from 'hooks/actions';
import PageContainer from 'components/PageContainer/PageContainer';

const Settings = () => {
  const {serverUrl, cartridgeServerUrl} = useAppSelector(
    state => state.settings,
  );

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [inventoryServer, setInventoryServer] = useState(serverUrl);
  const [cartridgeServer, setCartridgeServer] = useState(cartridgeServerUrl);

  const {setServerUrl, setCartridgeServerUrl} = useActions();

  const saveSettings = () => {
    setSnackbarVisible(true);
    setServerUrl(inventoryServer);
    setCartridgeServerUrl(cartridgeServer);
  };

  return (
    <PageContainer>
      <View>
        <ContentBlock title="Сервер">
          <Input
            value={inventoryServer}
            setValue={setInventoryServer}
            label="Инвентаризация/документооборот"
          />
          <Input
            value={cartridgeServer}
            setValue={setCartridgeServer}
            label="Картриджи"
          />
          <Button title="Сохранить" onPress={saveSettings} />
        </ContentBlock>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}>
        Настройки сохранены
      </Snackbar>
    </PageContainer>
  );
};

export default Settings;

const styles = StyleSheet.create({});
