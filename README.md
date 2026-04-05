# VoiceCart

VoiceCart is a voice-enabled grocery cart app built with Expo and React Native. It lets users add, remove, filter, and mark grocery items as purchased using either text input or spoken commands. The app also speaks back confirmations and saves data locally so the list persists between sessions.

## Features

- Add grocery items manually or by voice
- Remove items by name
- Mark items as purchased or pending
- Filter items by category
- Track total and purchased item counts
- Dark mode support
- Local persistence with AsyncStorage
- Spoken feedback with text-to-speech

## Tech Stack

- React Native
- Expo
- Expo Speech
- Expo Speech Recognition
- AsyncStorage
- React Native Picker

## Project Structure

- `App.js` - main app logic and UI
- `components/InputBar.js` - item input, category picker, and mic controls
- `components/CategoryFilter.js` - category filtering UI
- `components/ItemCard.js` - grocery item card UI
- `utils/voiceParser.js` - voice command parsing

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo Go or an Android/iOS emulator

### Install Dependencies

```bash
npm install
```

### Run the App

```bash
npm start
```

You can also launch directly on a platform:

```bash
npm run android
npm run ios
npm run web
```

## Voice Commands

VoiceCart recognizes simple commands such as:

- `add milk`
- `add 2 apples`
- `remove bread`
- `delete eggs`
- `mark milk as purchased`
- `mark apples as bought`

## Permissions

The app requests microphone and speech recognition permissions so it can listen for voice commands. These permissions are configured in `app.json`.

## Notes

- Items and dark mode preference are stored locally on the device.
- Voice recognition availability may depend on the device, runtime, or Expo environment.
- The app is optimized for grocery-list style workflows.

## License

No license has been specified for this project.
