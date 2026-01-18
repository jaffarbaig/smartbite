# SmartBite Mobile - Quick Reference Checklist

## ⚡ Quick Command Reference

### Development
```bash
npm run dev          # Run locally in browser (port 5176)
npm run build        # Build production web app
npm run sync         # Sync to mobile projects
npm run build:mobile # Build + sync together
```

### iOS
```bash
npm run ios          # Open iOS in Xcode
# Then: Product → Run (or Cmd+R)
```

### Android
```bash
npm run android      # Open Android in Android Studio
# Then: Run → Run 'app' (or Shift+F10)
```

---

## 📋 Setup Checklist

### Prerequisites Installation
- [ ] Node.js 18+ installed
- [ ] npm installed and updated
- [ ] Xcode installed (Mac only, for iOS)
- [ ] Android Studio installed
- [ ] Android SDK 25+ installed
- [ ] CocoaPods installed (Mac, for iOS)

### Project Setup
- [ ] Repository cloned locally
- [ ] `npm install` run successfully
- [ ] `.env.local` file exists with credentials
- [ ] `npm run build` succeeds
- [ ] `npm run sync` completes without errors

---

## 🍎 iOS Development Checklist

### First Time Setup
- [ ] Xcode 14+ installed
- [ ] Command Line Tools installed
- [ ] Apple ID configured in Xcode
- [ ] CocoaPods updated
- [ ] Run `npm run ios` successfully

### Before First Build
- [ ] Check iOS project opens in Xcode
- [ ] Verify iOS simulator available
- [ ] Check "Generic iOS Device" appears in Xcode

### Testing on Simulator
- [ ] Select iPhone simulator in Xcode
- [ ] Press Cmd+R to build and run
- [ ] App launches without crashing
- [ ] Sign up works
- [ ] Google sign-in works
- [ ] Meal upload works
- [ ] AI analysis works
- [ ] BMI calculations correct

### Testing on Device
- [ ] iPhone connected via USB
- [ ] Trust device on iPhone
- [ ] Xcode recognizes device
- [ ] Select device in Xcode
- [ ] Signing certificate configured
- [ ] Press Cmd+R to build and run
- [ ] All features tested on device

### Store Submission
- [ ] Apple Developer account created
- [ ] App name "SmartBite" reserved
- [ ] Screenshots uploaded (min 5)
- [ ] Description written
- [ ] Privacy policy created
- [ ] Version number set (1.0.0)
- [ ] Build number set (1)
- [ ] Product → Archive works
- [ ] Archive uploaded via App Store Connect
- [ ] Submitted for review

---

## 🤖 Android Development Checklist

### First Time Setup
- [ ] Android Studio installed
- [ ] Android SDK 25+ installed
- [ ] Emulator system image downloaded
- [ ] ANDROID_HOME environment variable set
- [ ] Run `npm run android` successfully

### Before First Build
- [ ] Check Android project opens
- [ ] Create/select Android Virtual Device (AVD)
- [ ] AVD has sufficient storage (2GB+)

### Testing on Emulator
- [ ] Start Android emulator (takes 2-5 min)
- [ ] Run → Run 'app' (or Shift+F10)
- [ ] Select emulator from device list
- [ ] App installs and launches
- [ ] No crashes or ANR (Application Not Responding)
- [ ] Sign up works
- [ ] Google sign-in works
- [ ] Meal upload works
- [ ] AI analysis works
- [ ] BMI calculations correct

### Testing on Device
- [ ] Android phone with Android 7.0+
- [ ] Developer Mode enabled on phone
- [ ] USB Debugging enabled
- [ ] Phone connected via USB
- [ ] Android Studio recognizes phone
- [ ] Run → Run 'app'
- [ ] Select device from list
- [ ] App installs successfully
- [ ] All features tested on device

### Store Submission
- [ ] Google Play Developer account created
- [ ] App listed as "SmartBite"
- [ ] Screenshots uploaded (min 5)
- [ ] Description written
- [ ] Version code set (1)
- [ ] Version name set (1.0.0)
- [ ] Signing keystore created and saved
- [ ] Release APK/AAB generated
- [ ] Build → Generate Signed Bundle successful
- [ ] Uploaded to Google Play Console
- [ ] Internal testing passed (24+ hours)
- [ ] Submitted to production

---

## 🚀 Pre-Publication Checklist

### Final Code Review
- [ ] No console errors in browser
- [ ] No console errors in iOS logs
- [ ] No console errors in Android logs
- [ ] No hardcoded test data
- [ ] No TODO comments remaining
- [ ] All error handling working
- [ ] Loading states display correctly
- [ ] Network errors handled gracefully

### Functionality Testing
- [ ] Email sign-up works
- [ ] Email sign-in works
- [ ] Google OAuth works
- [ ] Password reset works
- [ ] Profile creation/editing works
- [ ] BMI calculation correct
- [ ] Meal upload accepts images
- [ ] AI analysis returns results
- [ ] Meals save to database
- [ ] Meals load on refresh
- [ ] Delete meal works
- [ ] Sign out works

### Device Testing (Both Platforms)
- [ ] Tested on minimum API level (Android 7.0+)
- [ ] Tested on latest version
- [ ] Tested on multiple screen sizes
- [ ] Portrait orientation works
- [ ] Landscape orientation works (if supported)
- [ ] No missing graphics or icons
- [ ] Text readable on all devices
- [ ] Touch targets adequate (min 48dp)
- [ ] No content cut off

### Compliance
- [ ] Privacy policy written and accessible
- [ ] Terms of Service written (if applicable)
- [ ] No prohibited content
- [ ] Appropriate age rating selected
- [ ] All URLs tested and working
- [ ] Support contact info provided
- [ ] Proper attribution for libraries
- [ ] No misleading claims

### Stores
- [ ] Store listings complete
- [ ] High-quality screenshots (min 1080x1920)
- [ ] App icon (512x512px minimum)
- [ ] Description accurate and compelling
- [ ] Keywords appropriate
- [ ] Contact information current
- [ ] Version numbers match across platforms
- [ ] Release notes written
- [ ] Privacy policy URL set
- [ ] Support URL set

---

## 📅 Timeline for First Release

```
Day 1:    Setup development environment
Day 2-3:  Local development and testing
Day 4:    Build for mobile, test on simulators
Day 5:    Test on real devices
Day 6:    Create store accounts, fill listings
Day 7:    Build and upload to stores
Day 8:    Submit for review
Day 10+:  Approval and launch! 🎉
```

---

## 🔑 Important Files to Backup

### Critical Files (Keep Safe!)
- `.env.local` - API keys and secrets
- `android/.keystore` or `.jks` - Android signing key (NEVER share)
- Apple certificates (from Xcode)
- Google Play signing key (managed by Google)

### What NOT to Commit to GitHub
```
.env.local
android/*.jks
android/*.keystore
*.mobileprovision
*.cer
ios/Pods/
node_modules/
dist/
```

These are already in `.gitignore`

---

## 💡 Pro Tips

1. **Test Early and Often**
   - Don't wait until submission to test
   - Test on real devices, not just simulators

2. **Start Small**
   - Consider beta release on Google Play (10% rollout)
   - Use TestFlight for iOS before wide release
   - Monitor crash rates and user feedback

3. **Version Control**
   - Keep consistent version numbers
   - Document changes in release notes
   - Use semantic versioning (1.0.0, 1.0.1, etc.)

4. **Keep API Keys Safe**
   - Consider rate limiting on APIs
   - Monitor for unusual activity
   - Have backup API keys ready

5. **Monitor After Launch**
   - Check crash reports daily for first week
   - Respond to user reviews
   - Plan updates based on feedback

6. **Automate Testing**
   - Write unit tests for critical functions
   - Use Xcode Test Navigator for iOS
   - Use Android Studio for Android tests

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't build | Run `npm run sync` then clean build |
| Simulator won't start | Restart Android Studio or Xcode |
| Google OAuth not working | Verify redirect URLs in Supabase |
| Images not uploading | Check Supabase storage permissions |
| App crashes on startup | Check browser console and device logs |
| Can't find signing certificate | Configure in Xcode Preferences → Accounts |
| Keystore password forgotten | Need to create new keystore for updates |

---

## 📱 Device Testing Checklist

### iOS Devices
- [ ] iPhone SE (small screen)
- [ ] iPhone 14 (standard)
- [ ] iPhone 14 Pro Max (large)
- [ ] iPad (tablet, if supported)

### Android Devices
- [ ] Phone with Android 7.0
- [ ] Phone with Android 11
- [ ] Phone with Android 13+
- [ ] Tablet (if supported)

---

**You're ready to launch! 🚀**
