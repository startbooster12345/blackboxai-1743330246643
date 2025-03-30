# React Native Mobile App Setup Guide

## 1. Environment Setup

### Prerequisites
- Node.js (v14+)
- Java Development Kit (JDK 11)
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Installation
```bash
npm install -g react-native-cli
npx react-native init SuccessPlannerMobile
cd SuccessPlannerMobile
```

## 2. Project Structure Conversion

### Core Components
Create these directories:
```
src/
├── components/
├── screens/
├── navigation/
├── assets/
└── utils/
```

### Key Files to Create:
1. `src/screens/HomeScreen.js`
2. `src/screens/LoginScreen.js`
3. `src/screens/CreateGoalScreen.js`
4. `src/screens/DashboardScreen.js`

## 3. Essential Dependencies
```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-safe-area-context react-native-screens
npm install axios react-native-async-storage/async-storage
```

## 4. App Entry Point (App.js)
```javascript
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 5. Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### iOS
1. Open ios/SuccessPlannerMobile.xcworkspace in Xcode
2. Select Product > Archive
3. Distribute through App Store Connect

## 6. App Store Submission

### Google Play Store
1. Create developer account ($25 one-time fee)
2. Prepare:
   - App listing (title, description, screenshots)
   - Privacy policy
   - App signing key
3. Upload APK/AAB to Google Play Console

### Apple App Store
1. Enroll in Apple Developer Program ($99/year)
2. Prepare:
   - App Store Connect listing
   - TestFlight builds
   - App icons and metadata
3. Submit through Xcode or Transporter

## 7. Continuous Deployment
Recommend setting up:
- Fastlane for automated deployments
- GitHub Actions for CI/CD
- Firebase App Distribution for beta testing