import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import React, {Dispatch, ReactNode, SetStateAction} from 'react';
import {COLORS} from 'constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import AppText from 'components/Text/AppText';

type Props = {
  setValue: Dispatch<SetStateAction<string>>;
  value: string | undefined;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  label?: string;
  iconName?: string;
  [key: string]: any;
};

const Input = ({
  setValue,
  value,
  placeholder,
  label,
  keyboardType = 'default',
  iconName,
  ...rest
}: Props) => {
  return (
    <>
      {label ? <AppText style={styles.labelText}>{label}</AppText> : null}
      <View style={[styles.container, iconName ? styles.iconContainer : null]}>
        {iconName ? (
          <Icon style={styles.icon} name={iconName} size={20} color="#000" />
        ) : null}
        <TextInput
          {...rest}
          onChangeText={setValue}
          value={value}
          placeholder={placeholder}
          keyboardType={keyboardType}
          style={styles.inputStyle}
          placeholderTextColor={COLORS.gray}
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
    // paddingHorizontal: 10,
    backgroundColor: '#fff',
    // backgroundColor: COLORS.lightgray,
    verticalAlign: 'top',
    textAlignVertical: 'top',
    maxHeight: 110,
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  container: {
    // paddingHorizontal: 10,
  },
  labelText: {
    color: '#808080',
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    // borderColor: COLORS.primary + '33',
    // borderWidth: 1,
    // borderLeftColor: COLORS.primary,
    // borderLeftWidth: 2,
  },
  icon: {
    paddingLeft: 15,
  },
});
