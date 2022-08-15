import {Button, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {IScanned} from 'types/inventory';
import {scanResultModalColors} from 'constants/constants';

type Props = {
  item?: IScanned;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};
const ScanResultModal = ({visible, item, setVisible}: Props) => {
  const {backgroundColor, textColor, title, description} =
    scanResultModalColors.filter(
      color => color.status === (item?.status || 1),
    )?.[0];
  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={visible}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, {backgroundColor}]}>
            <Text style={[styles.modalText, {color: textColor}]}>{title}</Text>
            {item ? (
              <Text style={[styles.modalText, {color: textColor}]}>
                {description(item)}
              </Text>
            ) : null}
            <Button
              title="hide modal"
              onPress={() => {
                setVisible(!visible);
              }}></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ScanResultModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    color: 'black',
    marginBottom: 15,
    textAlign: 'center',
  },
});
