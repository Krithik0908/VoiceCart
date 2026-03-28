import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  FlatList,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  UIManager,
  View,
} from 'react-native';
import InputBar from './components/InputBar';
import CategoryFilter from './components/CategoryFilter';
import ItemCard from './components/ItemCard';
import { ACTIONS, parseVoiceCommand } from './utils/voiceParser';

let SpeechRecognitionModule = null;
try {
  // Optional: module may be unavailable in Expo Go depending on runtime.
  SpeechRecognitionModule = require('expo-speech-recognition').ExpoSpeechRecognitionModule;
} catch (error) {
  SpeechRecognitionModule = null;
}

const STORAGE_KEYS = {
  ITEMS: '@voicecart_items',
  DARK_MODE: '@voicecart_dark_mode',
};

const CATEGORIES = ['Fruits', 'Vegetables', 'Dairy', 'Snacks'];

const LIGHT_THEME = {
  background: '#f3f7fb',
  card: '#ffffff',
  input: '#f7f9fc',
  text: '#102a43',
  muted: '#627d98',
  border: '#d9e2ec',
  primary: '#1877f2',
  secondary: '#00a896',
  success: '#1b8f4b',
  warning: '#b06500',
  danger: '#d64545',
  purchasedBg: '#ebfaef',
};

const DARK_THEME = {
  background: '#121826',
  card: '#1b2335',
  input: '#222d43',
  text: '#f8fbff',
  muted: '#9db0cb',
  border: '#2f3d57',
  primary: '#4b9cff',
  secondary: '#08c0a2',
  success: '#30d158',
  warning: '#f5b04a',
  danger: '#ff6b6b',
  purchasedBg: '#1b3a2a',
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [items, setItems] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  useEffect(() => {
    if (!SpeechRecognitionModule) {
      return undefined;
    }

    const startSub = SpeechRecognitionModule.addListener('start', () => {
      setListening(true);
    });

    const endSub = SpeechRecognitionModule.addListener('end', () => {
      setListening(false);
    });

    const errorSub = SpeechRecognitionModule.addListener('error', (event) => {
      setListening(false);
      speak(`Voice input error: ${event?.error || 'unknown'}`);
    });

    const resultSub = SpeechRecognitionModule.addListener('result', (event) => {
      const transcript = event?.results?.[0]?.transcript;
      if (!transcript) {
        return;
      }

      setLastTranscript(transcript);

      if (event.isFinal) {
        handleVoiceTranscript(transcript);
      }
    });

    return () => {
      startSub.remove();
      endSub.remove();
      errorSub.remove();
      resultSub.remove();
    };
  }, [items, selectedCategory]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [storedItems, storedDarkMode] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ITEMS),
          AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE),
        ]);

        if (storedItems) {
          setItems(JSON.parse(storedItems));
        }

        if (storedDarkMode) {
          setDarkMode(JSON.parse(storedDarkMode));
        }
      } catch (error) {
        Alert.alert('Load Error', 'Could not load saved data.');
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
  }, [darkMode]);

  const visibleItems = useMemo(() => {
    if (categoryFilter === 'All') {
      return items;
    }
    return items.filter((item) => item.category === categoryFilter);
  }, [items, categoryFilter]);

  const speak = (message) => {
    Speech.stop();
    Speech.speak(message, {
      language: 'en',
      rate: 1.0,
    });
  };

  const addItem = ({ name, category, quantity = 1 }) => {
    const normalized = name.trim();
    if (!normalized) {
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: normalized,
      quantity: Math.max(1, Number(quantity) || 1),
      category,
      purchased: false,
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);
    speak(`${normalized} added to your list`);
  };

  const handleAdd = () => {
    if (!inputText.trim()) {
      Alert.alert('Missing Item', 'Please enter an item name first.');
      return;
    }
    addItem({ name: inputText, category: selectedCategory, quantity: 1 });
    setInputText('');
  };

  const handleDelete = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const removed = items.find((item) => item.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    speak(`${removed?.name || 'Item'} removed`);
  };

  const handleTogglePurchased = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let changedName = 'Item';
    let isPurchased = false;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        changedName = item.name;
        isPurchased = !item.purchased;
        return { ...item, purchased: !item.purchased };
      })
    );

    speak(isPurchased ? `${changedName} marked as purchased` : `${changedName} marked as pending`);
  };

  const removeByName = (itemName) => {
    const target = items.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase().trim()
    );
    if (!target) {
      speak(`${itemName} was not found`);
      return;
    }
    handleDelete(target.id);
  };

  const markPurchasedByName = (itemName) => {
    const target = items.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase().trim()
    );
    if (!target) {
      speak(`${itemName} was not found`);
      return;
    }

    if (!target.purchased) {
      handleTogglePurchased(target.id);
    } else {
      speak(`${target.name} is already purchased`);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    const parsed = parseVoiceCommand(transcript);

    if (!parsed) {
      speak('Command not recognized');
      return;
    }

    if (parsed.action === ACTIONS.ADD) {
      addItem({
        name: parsed.item,
        quantity: parsed.quantity,
        category: selectedCategory,
      });
      return;
    }

    if (parsed.action === ACTIONS.REMOVE) {
      removeByName(parsed.item);
      return;
    }

    if (parsed.action === ACTIONS.MARK_PURCHASED) {
      markPurchasedByName(parsed.item);
    }
  };

  const handleMicPress = async () => {
    if (!SpeechRecognitionModule) {
      speak('Voice input module is not available in this runtime');
      return;
    }

    if (listening) {
      SpeechRecognitionModule.stop();
      return;
    }

    try {
      const permission = await SpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        speak('Microphone permission is required');
        return;
      }

      if (!SpeechRecognitionModule.isRecognitionAvailable()) {
        speak('Speech recognition is not available on this device');
        return;
      }

      setLastTranscript('');
      SpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
      });
    } catch (error) {
      setListening(false);
      speak('Voice input is unavailable in this build');
    }
  };

  const totalCount = items.length;
  const purchasedCount = items.filter((item) => item.purchased).length;

  const getCategoryIcon = (category) => {
    if (category === 'Fruits') return '🍎';
    if (category === 'Vegetables') return '🥦';
    if (category === 'Dairy') return '🥛';
    if (category === 'Snacks') return '🍪';
    return '🛒';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />

      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>VoiceCart</Text>
        <View style={styles.toggleWrap}>
          <Text style={[styles.toggleLabel, { color: theme.muted }]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ true: theme.primary, false: '#c3ced9' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.statsText, { color: theme.text }]}>Total: {totalCount}</Text>
        <Text style={[styles.statsText, { color: theme.success }]}>Purchased: {purchasedCount}</Text>
      </View>

      <InputBar
        inputText={inputText}
        onChangeText={setInputText}
        selectedCategory={selectedCategory}
        onChangeCategory={setSelectedCategory}
        categories={CATEGORIES}
        onAdd={handleAdd}
        onMicPress={handleMicPress}
        isListening={listening}
        theme={theme}
      />

      {lastTranscript ? (
        <Text style={[styles.transcript, { color: theme.muted }]}>Heard: {lastTranscript}</Text>
      ) : null}

      <CategoryFilter
        selectedFilter={categoryFilter}
        onChangeFilter={setCategoryFilter}
        filters={['All', ...CATEGORIES]}
        theme={theme}
      />

      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onTogglePurchased={handleTogglePurchased}
            onDelete={handleDelete}
            theme={theme}
            getCategoryIcon={getCategoryIcon}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.muted }]}>No items in this category yet.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  toggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  statsCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '700',
  },
  transcript: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 36,
    gap: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 15,
  },
});
