import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {IScanned} from 'types/inventory';
import {scanResultModalColors} from 'constants/constants';
import Button from 'components/Buttons/Button';
import AppText from 'components/Text/AppText';

export type ScanModalProps = {
  scanned?: (IScanned | Omit<IScanned, 'status'>) & {
    kolvo?: number;
  };
  status: 1 | 2 | 3 | 4;
  visible: boolean;
};

type Props = {
  scanModal: ScanModalProps;
  setScanModal: Dispatch<SetStateAction<ScanModalProps>>;
};
const ScanResultModal = ({scanModal, setScanModal}: Props) => {
  const {backgroundColor, textColor, title, getContent} =
    scanResultModalColors.filter(
      color => color.status === scanModal.status,
    )?.[0];

  let body;

  //@ts-ignore
  scanModal?.scanned ? (body = getContent(scanModal?.scanned)) : null;
  return (
    <Modal animationType="fade" transparent={true} visible={scanModal?.visible}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, {backgroundColor}]}>
          <AppText style={[styles.modalTextHeader, {color: textColor}]}>
            {title}
          </AppText>
          {scanModal?.scanned ? (
            <ScrollView style={[styles.modalContent]}>{body}</ScrollView>
          ) : null}
          <Button
            text="Подтвердить"
            onPress={() => {
              setScanModal(prevState => ({
                ...prevState,
                visible: !prevState.visible,
              }));
            }}
          />
        </View>
      </View>
    </Modal>
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
    margin: 10,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 10,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    color: 'black',
    marginBottom: 15,
  },
  modalTextHeader: {
    fontSize: 20,
    marginBottom: 10,
    paddingBottom: 10,
    textAlign: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    fontWeight: '500',
  },
});
