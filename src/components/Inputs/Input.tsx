import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';

type Props = {
  setValue: Dispatch<SetStateAction<string>>;
  value: string | undefined;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  label?: string;
};

const Input = ({
  setValue,
  value,
  placeholder,
  label,
  keyboardType = 'default',
}: Props) => {
  return (
    <>
      <Text style={styles.labelText}>{label}</Text>
      <TextInput
        onChangeText={setValue}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={styles.inputStyle}
        placeholderTextColor="#dbdbdb"
        selectionColor="#757575"
      />
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputStyle: {
    color: '#000',
    fontSize: 22,
    borderBottomWidth: 1,
    borderColor: '#808080',
    borderRadius: 5,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  labelText: {
    color: '#808080',
    fontSize: 18,
  },
});
