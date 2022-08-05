import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import QRCodeScanner from 'react-native-qrcode-scanner';
import QRButton from 'components/Buttons/QRButton';
import CustomMarker from 'components/CustomMarker/CustomMarker';
import {useAppDispatch} from '../hooks/redux';
import {setScan} from 'store/reducers/scanReducer';
import {BarCodeReadEvent} from 'react-native-camera';

type Props = NativeStackScreenProps<RootStackParamList, 'Scanner', 'MyStack'>;

interface scanData {
  data: string;
}

const Scanner = ({navigation}: Props) => {
  const dispatch = useAppDispatch();

  // const {height, width} = useWindowDimensions();

  // const finderWidth = 280;
  // const finderHeight = 230;
  // const viewMinX = (width - finderWidth) / 2;
  // const viewMinY = (height - finderHeight) / 2;

  const onSuccess = (e: BarCodeReadEvent) => {
    dispatch(setScan(e.data));
    navigation.goBack();
  };

  return (
    <View style={{height: '100%', width: '100%'}}>
      <QRCodeScanner
        onRead={onSuccess}
        // flashMode={RNCamera.Constants.FlashMode.torch}
        showMarker
        customMarker={
          <>
            <CustomMarker />
          </>
        }
        containerStyle={{height: '100%', width: '100%'}}
        cameraStyle={{height: '100%', width: '100%'}}
      />
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
