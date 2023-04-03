import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {Dispatch, FC, SetStateAction} from 'react';
import Input from 'components/Inputs/Input';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';
import {QRzeros} from 'utils/utils';
import {IItem} from 'types/docs/docs';

type Props<T> = {
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  showSuggestions: boolean;
  suggestions: T[] | undefined;
  onSuggestionPress: (suggestion: T) => void;
};

const Search = <T extends IItem>({
  search,
  setSearch,
  showSuggestions,
  suggestions,
  onSuggestionPress,
}: Props<T>) => {
  return (
    <>
      <Input
        setValue={setSearch}
        value={search}
        iconName="search"
        placeholder="Поиск по номеру QR..."
      />
      {showSuggestions ? (
        <View
          style={{
            width: '100%',
          }}>
          {suggestions?.map((suggestion, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.primary,
                backgroundColor: 'white',
              }}
              onPress={() => onSuggestionPress(suggestion)}>
              <AppText style={{fontSize: 16}}>
                {QRzeros(suggestion.qr)} - {suggestion.name}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </>
  );
};

export default Search;

const styles = StyleSheet.create({});
