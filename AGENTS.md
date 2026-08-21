# Mobile Application Development Focus

This project is primarily a **React Native & Expo mobile application** targeting iOS and Android. 

All future development, fixes, and feature additions must focus **solely on mobile constraints and mobile UX/UI guidelines**.

## Key Guidelines

1. **Strict Mobile Focus**: 
   * Always design and implement features specifically for native mobile screens and mobile-first users.
   * Do not optimize or compromise mobile design, layouts, or functionality for the web version. Mobile performance, responsiveness, and touch interactions are the highest priorities.

2. **React Native Components & Styling**:
   * Never use web-specific HTML tags (e.g., `<div>`, `<span>`, `<button>`, `<a>`, `<p>`).
   * Always use standard React Native primitives: `<View>`, `<Text>`, `<TouchableOpacity>`, `<Pressable>`, `<ScrollView>`, `<FlatList>`, `<Image>`.
   * Use React Native stylesheets (`StyleSheet.create`) and keep styling rules responsive to variable mobile screen heights and widths.
   * Make proper use of `react-native-safe-area-context` (`SafeAreaView`, `useSafeAreaInsets`) to avoid notch, status bar, and home indicator overlaps.

3. **Storage & Native APIs**:
   * Do not use browser-specific storage APIs (e.g., `localStorage`, `sessionStorage`, `cookies`).
   * Use `expo-secure-store` for confidential data (tokens, user credentials) and native Storage Adapters.
   * Always use Expo APIs (e.g., `expo-location`, `expo-haptics`) when interacting with hardware or OS-level configurations.

4. **Versioned Reference**:
   * Read the exact versioned Expo docs at https://docs.expo.dev/versions/v54.0.0/ before writing or updating any code.
