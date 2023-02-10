import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';
import {StyleProp} from 'react-native';

type Props = {
  action: Function;
  style?: StyleProp<TextStyle>;
};

const QRButton = ({action, style}: Props) => {
  return (
    <TouchableOpacity
      onPress={() => action()}
      style={[styles.button, style]}
      activeOpacity={0.7}>
      <Icon name="qr-code-outline" size={30} color={COLORS.primary} />
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
    padding: 12,
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 10,
    color: COLORS.black,
  },
});
