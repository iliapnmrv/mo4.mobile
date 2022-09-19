import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import {COLORS} from 'constants/colors';

type IContentBlockButton = {
  text: string | ReactNode;
  action: () => void;
  size?: number;
};

type Props = {
  children: ReactNode;
  title?: string;
  helperText?: string;
  transparent?: boolean;
  button?: IContentBlockButton;
};

const ContentBlock = ({
  children,
  title,
  transparent = false,
  helperText,
  button,
}: Props) => {
  return (
    <>
      <View style={styles.blockTopContainer}>
        <View>
          {title ? (
            <Text style={[styles.header, {color: COLORS.black}]}>{title}</Text>
          ) : (
            <></>
          )}
          {helperText ? (
            <Text style={[styles.helperText, {color: COLORS.black}]}>
              {helperText}
            </Text>
          ) : (
            <></>
          )}
        </View>

        {button ? (
          <TouchableOpacity activeOpacity={0.8} onPress={button.action}>
            <Text
              style={[
                styles.buttonText,
                button.size ? {fontSize: button.size} : {},
              ]}>
              {button?.text}
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <View
        style={[
          styles.mainItem,
          transparent ? {backgroundColor: undefined, margin: -15} : null,
        ]}>
        {children}
      </View>
    </>
  );
};

export default ContentBlock;

const styles = StyleSheet.create({
  mainItem: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 19,
    marginTop: 10,
    fontWeight: '500',
    color: '#404040',
  },
  helperText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'gray',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#808080',
  },
  blockTopContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
});
