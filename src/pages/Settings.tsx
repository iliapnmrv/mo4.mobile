import Button from 'components/Buttons/Button';
import PageContainer from 'components/PageContainer/PageContainer';
import {useActions} from 'hooks/actions';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Snackbar} from 'react-native-paper';
import ContentBlock from '../components/ContentBlock/ContentBlock';
import Input from '../components/Inputs/Input';
import {useAppSelector} from '../hooks/redux';
import {WebView} from 'react-native-webview';

export const SERVER_POSTFIX = '/api/';
export const SERVER_PREFIX = 'http://';

const Settings = () => {
  const {serverUrl} = useAppSelector(state => state.settings);

  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [inventoryServer, setInventoryServer] = useState<string>(serverUrl);

  const {setServerUrl} = useActions();

  const saveSettings = () => {
    setSnackbarVisible(true);
    setServerUrl(inventoryServer);
  };

  console.log(SERVER_PREFIX + serverUrl.substring(0, serverUrl.indexOf(':')));

  return (
    <PageContainer>
      <View>
        <ContentBlock title="Сервер">
          <Input
            iconName="md-document-text-outline"
            value={inventoryServer}
            setValue={setInventoryServer}
            label="Инвентаризация/документооборот"
            postfix={SERVER_POSTFIX}
            prefix={SERVER_PREFIX}
          />
          <Button
            // color={COLORS.primary}
            text="Сохранить"
            onPress={saveSettings}
          />
        </ContentBlock>
      </View>
      {/* <WebView
        sharedCookiesEnabled
        source={{
          uri: serverUrl.substring(0, serverUrl.indexOf(':') - 1),
        }}
        onError={e => console.log(e)}
        style={{marginTop: 20, flex: 1}}
      /> */}
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
