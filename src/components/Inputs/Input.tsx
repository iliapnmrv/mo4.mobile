import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {Dispatch, ReactNode, SetStateAction} from 'react';
import {COLORS} from 'constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  setValue: Dispatch<SetStateAction<string>>;
  value: string | undefined;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  label?: string;
  iconName?: string;
};

const Input = ({
  setValue,
  value,
  placeholder,
  label,
  keyboardType = 'default',
  iconName,
}: Props) => {
  return (
    <>
      <Text style={styles.labelText}>{label}</Text>
      <View style={iconName ? styles.iconContainer : {}}>
        {iconName ? (
          <Icon style={styles.icon} name={iconName} size={20} color="#000" />
        ) : null}
        <TextInput
          onChangeText={setValue}
          value={value}
          placeholder={placeholder}
          keyboardType={keyboardType}
          style={styles.inputStyle}
          placeholderTextColor="#dbdbdb"
          selectionColor="#757575"
        />
      </View>
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputStyle: {
    color: '#000',
    fontSize: 18,
    // borderBottomWidth: 1,
    borderColor: '#808080',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    // backgroundColor: COLORS.lightgray,
  },
  labelText: {
    color: '#808080',
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 2,
  },
  icon: {
    paddingLeft: 15,
  },
});
