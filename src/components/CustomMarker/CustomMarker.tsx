import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BarcodeMask from 'react-native-barcode-mask';

const CustomMarker = () => {
  return (
    <BarcodeMask
      showAnimatedLine={false}
      edgeRadius={10}
      width={300}
      height={300}
    />
  );
};

export default CustomMarker;

const styles = StyleSheet.create({});
