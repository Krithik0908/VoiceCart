import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CategoryFilter = ({ selectedFilter, onChangeFilter, filters, theme }) => {
  return (
    <View style={[styles.wrapper, { borderColor: theme.border, backgroundColor: theme.card }]}> 
      <Text style={[styles.label, { color: theme.muted }]}>Filter by Category</Text>
      <View style={[styles.pickerWrap, { borderColor: theme.border, backgroundColor: theme.input }]}> 
        <Picker
          selectedValue={selectedFilter}
          onValueChange={onChangeFilter}
          style={[styles.picker, { color: theme.text }]}
          dropdownIconColor={theme.text}
        >
          {filters.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  pickerWrap: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
});

export default CategoryFilter;
