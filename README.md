# Crushr native app

This Expo Router app now uses a polished native landing page and a clean route shell for the Crushr mobile experience.

## Environment

Set these values in the app shell before connecting to the live Supabase backend:

- EXPO_PUBLIC_SUPABASE_URL=https://hkifkaesfvfmxcacziev.supabase.co
- EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

## Run locally

1. npm install
2. npx expo start
3. Use Expo Go / simulator to open the app.

## Build for Android / iOS

- Android: eas build --platform android
- iOS: eas build --platform ios

## OneSignal / deep links

- Add your OneSignal app ID in the native push setup when ready.
- Test deep links with: expo start --dev-client

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
## Android release checklist

1. Replace placeholder app assets with final brand icon and splash images.
2. Verify `android.package` and `versionCode` in `app.json`.
3. Run `npm install` and build a native release with `eas build --platform android` or `expo prebuild` before publishing.
4. Test the APK on a physical Android device and validate WebView navigation, pull-to-refresh, offline handling, and back button behavior.
5. Confirm `expo-router` routes and deep links work in a standalone build.
6. Update Play Store listing text, screenshots, and privacy policy.
7. Sign the APK/AAB and submit through the Google Play Console.
## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
