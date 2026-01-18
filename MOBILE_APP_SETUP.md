# SmartBite Mobile App Setup Guide

Your SmartBite app has been successfully wrapped with **Capacitor** for iOS and Android deployment!

## What Was Set Up

✅ Capacitor CLI installed  
✅ iOS platform added  
✅ Android platform added  
✅ Essential plugins installed:
   - `@capacitor/app` - App lifecycle management
   - `@capacitor/splash-screen` - Splash screen control
   - `@capacitor/status-bar` - Status bar customization

✅ Build scripts added to `package.json`

## Project Structure

```
smartbite/
├── dist/                    # Web app build (used by Capacitor)
├── ios/                     # iOS native project (Xcode)
├── android/                 # Android native project (Android Studio)
├── capacitor.config.json    # Capacitor configuration
└── package.json             # Scripts for mobile builds
```

## Available Commands

### Build & Sync

**Build web app and sync to mobile platforms:**
```bash
npm run build:mobile
```

### iOS Development

**Open iOS project in Xcode:**
```bash
npm run ios
```

This will:
1. Build your React app
2. Copy assets to iOS project
3. Open Xcode automatically

Then in Xcode:
- Select a simulator or device
- Press the Play button to build and run
- Or use `Cmd + R` to build/run

### Android Development

**Open Android project in Android Studio:**
```bash
npm run android
```

This will:
1. Build your React app
2. Copy assets to Android project
3. Open Android Studio automatically

Then in Android Studio:
- Select an emulator or device
- Click the "Run" button (green play icon)
- Or use `Shift + F10` to build/run

### Manual Sync

**Update mobile projects without opening IDEs:**
```bash
npm run sync
```

## Prerequisites

### For iOS Development
- macOS (required)
- Xcode 14+ (install from App Store)
- Command Line Tools for Xcode
- CocoaPods (usually pre-installed, but run `sudo gem install cocoapods` if needed)

### For Android Development
- Android Studio
- Android SDK (25 or higher)
- Java Development Kit (JDK) 11+
- Gradle (usually bundled with Android Studio)

## Development Workflow

### 1. Local Development (Web)
```bash
npm run dev
```
Test your changes in the browser at `http://localhost:5176`

### 2. Build for Mobile
```bash
npm run build
```

### 3. Sync Changes
```bash
npm run sync
```

### 4. Open Native IDE
```bash
npm run ios    # For iOS
npm run android # For Android
```

### 5. Build & Run on Device/Emulator
- In Xcode: Press Play button or `Cmd + R`
- In Android Studio: Click Run button or `Shift + F10`

## Important: Capacitor App IDs

- **App ID:** `com.smartbite.app`
- **App Name:** `smartbite`
- **Web Directory:** `dist/`

These are configured in `capacitor.config.json`

## Environment Variables on Mobile

Your `.env.local` variables are **already bundled** into the production build (`dist/`), so they'll work on mobile apps automatically.

For sensitive data, consider:
- Using Supabase's built-in security
- Adding API rate limiting
- Using environment-specific credentials (dev vs production)

## Building for Production

### iOS
1. Open Xcode: `npm run ios`
2. Select "Generic iOS Device" as target
3. Product → Archive
4. Follow Apple's guidelines for App Store submission

### Android
1. Open Android Studio: `npm run android`
2. Build → Generate Signed Bundle/APK
3. Follow Google Play Store submission guidelines

## Troubleshooting

### "Could not find gradle" (Android)
- Make sure Android Studio is installed
- Open Android Studio at least once to let it configure

### "Pod install failed" (iOS)
- Update CocoaPods: `sudo gem install cocoapods`
- Manual fix: `cd ios/App && pod install`

### Changes not showing on device
- Always run `npm run build` first
- Then run `npm run sync`
- Rebuild in Xcode/Android Studio

### Build errors after npm install
- Delete node_modules and ios/Pods folders
- Run `npm install`
- Run `npm run build:mobile`

## Next Steps

1. **Test locally** - Use `npm run dev` and test in browser
2. **Build for mobile** - Run `npm run build:mobile`
3. **Open native IDEs** - Run `npm run ios` or `npm run android`
4. **Build & test on emulator/device** - Use Xcode or Android Studio
5. **Deploy to App Stores** - Follow platform submission guidelines

## Useful Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS App Deployment](https://capacitorjs.com/docs/ios/deploying-to-app-store)
- [Android App Deployment](https://capacitorjs.com/docs/android/deploying-to-google-play)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

## Questions?

Refer to:
- Capacitor Documentation: https://capacitorjs.com/docs
- Xcode Help (in Xcode → Help menu)
- Android Studio Help (in Android Studio → Help menu)
