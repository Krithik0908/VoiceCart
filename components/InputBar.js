import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const InputBar = ({
  inputText,
  onChangeText,
  selectedCategory,
  onChangeCategory,
  categories,
  onAdd,
  onMicPress,
  isListening,
  theme,
}) => {
  return (
    <View style={[styles.wrapper, { backgroundColor: theme.card, borderColor: theme.border }]}> 
      <TextInput
        value={inputText}
        onChangeText={onChangeText}
        placeholder="Add grocery item"
        placeholderTextColor={theme.muted}
        style={[
          styles.input,
          { backgroundColor: theme.input, color: theme.text, borderColor: theme.border },
        ]}
      />

      <View style={[styles.pickerWrap, { borderColor: theme.border, backgroundColor: theme.input }]}> 
        <Picker
          selectedValue={selectedCategory}
          onValueChange={onChangeCategory}
          style={[styles.picker, { color: theme.text }]}
          dropdownIconColor={theme.text}
        >
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={onAdd}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>

        <Pressable
          style={[
            styles.micButton,
            { backgroundColor: isListening ? theme.danger : theme.secondary },
          ]}
          onPress={onMicPress}
        >
          <Text style={styles.buttonText}>{isListening ? 'Stop Mic' : 'Mic'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  pickerWrap: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default InputBar;
