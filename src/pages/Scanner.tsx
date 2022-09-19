import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CustomMarker from 'components/CustomMarker/CustomMarker';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import {RootStackParamList} from 'navigation/Navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner', 'MyStack'>;

interface scanData {
  data: string;
}

const Scanner = ({navigation, route}: Props) => {
  const {setScan} = route.params;

  const [flash, setFlash] = useState<boolean>(false);

  // const {height, width} = useWindowDimensions();

  // const finderWidth = 280;
  // const finderHeight = 230;
  // const viewMinX = (width - finderWidth) / 2;
  // const viewMinY = (height - finderHeight) / 2;

  const onSuccess = (e: BarCodeReadEvent) => {
    setScan(e.data);
    navigation.goBack();
  };

  return (
    <View style={{height: '100%', width: '100%'}}>
      <StatusBar hidden={true} />
      <QRCodeScanner
        onRead={onSuccess}
        // flashMode={RNCamera.Constants.FlashMode.torch}
        showMarker
        customMarker={<CustomMarker />}
        containerStyle={{height: '100%', width: '100%'}}
        cameraStyle={{height: '100%', width: '100%'}}
      />
      {/* <View style={styles.icons}>
        <Ionicon
          name="flashlight-outline"
          size={40}
          color="#f9f9f9"
          onPress={() => navigation.goBack()}
        />
        <Ionicon
          name="flashlight-outline"
          size={40}
          color="#f9f9f9"
          onPress={() => navigation.goBack()}
        />
      </View> */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeBtn}
        activeOpacity={0.7}>
        <FontAwesomeIcon name="times" size={40} color="#f9f9f9" />
      </TouchableOpacity>
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  icons: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: '20%',
    width: '100%',
  },
  closeBtn: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '15%',
    paddingHorizontal: 10,
    borderRadius: 50,
  },
});
