import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';

type Props = {
  action: Function;
};

const QRButton = ({action}: Props) => {
  return (
    <TouchableOpacity
      onPress={() => action()}
      style={styles.button}
      activeOpacity={0.7}>
      <Icon name="qr-code-outline" size={30} color="#000" />
      <AppText style={styles.buttonText}>Сканировать QR код</AppText>
    </TouchableOpacity>
  );
};

export default QRButton;

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 15,
    // marginHorizontal: 3,
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 5,
    // borderColor: 'lightgray',
    // borderWidth: 1,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 10,
    color: COLORS.black,
  },
});
