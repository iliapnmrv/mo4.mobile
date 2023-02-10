import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';

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
            <AppText style={[styles.header, {color: COLORS.black}]}>
              {title}
            </AppText>
          ) : (
            <></>
          )}
          {helperText ? (
            <AppText style={[styles.helperText, {color: COLORS.black}]}>
              {helperText}
            </AppText>
          ) : (
            <></>
          )}
        </View>

        {button && button.text ? (
          <TouchableOpacity activeOpacity={0.7} onPress={button.action}>
            <AppText
              style={[
                styles.buttonText,
                button.size ? {fontSize: button.size} : {},
              ]}>
              {button?.text}
            </AppText>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <View
        style={[
          styles.mainItem,
          transparent
            ? {backgroundColor: undefined, marginHorizontal: 0, padding: 0}
            : null,
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
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    textDecorationLine: 'underline',
    marginRight: 10,
  },
  blockTopContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 3,
    justifyContent: 'space-between',
  },
});
