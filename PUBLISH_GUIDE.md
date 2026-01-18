# SmartBite Mobile App - Build & Publish Guide

Complete step-by-step guide to create, test, and publish your app on iOS and Android.

---

## 📋 PHASE 1: Setup & Prerequisites

### Step 1: Install Development Tools

#### For macOS Users (iOS Development):
```bash
# 1. Install Xcode from App Store
# 2. Install Command Line Tools
xcode-select --install

# 3. Install CocoaPods (for iOS dependencies)
sudo gem install cocoapods

# 4. Verify installation
xcode-select --print-path
pod --version
```

#### For Windows/Mac Users (Android Development):
```bash
# 1. Download Android Studio from:
# https://developer.android.com/studio

# 2. After installation, open Android Studio and:
#    - Accept licenses
#    - Install Android SDK (API Level 25+)
#    - Install emulator and system images

# 3. Set ANDROID_HOME environment variable
# Windows (PowerShell as Admin):
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")

# 4. Verify Android SDK
android --version
# or
sdkmanager --version
```

#### For All Platforms:
```bash
# Install Node.js 18+
# Download from: https://nodejs.org/

# Verify installations
node --version
npm --version
```

---

## 🔨 PHASE 2: Build for Development

### Step 2: Build Web App

```bash
cd c:\Users\TECH-GENIUSES\Documents\workspace\2026\smartbite

# Build the web app (creates dist/ folder)
npm run build

# Expected output:
# ✓ 1545 modules transformed
# dist/index.html 0.39 kB
# dist/assets/*.css 22.59 kB
# dist/assets/*.js 359.35 kB
```

### Step 3: Sync to Native Projects

```bash
# Sync web assets to iOS and Android projects
npm run sync

# This copies your dist/ files to:
# - ios/App/App/public/
# - android/app/src/main/assets/public/
```

---

## 🍎 PHASE 3: iOS Development & Testing

### Step 4: Open iOS Project in Xcode

```bash
npm run ios

# This will:
# 1. Build your web app
# 2. Sync files to iOS project
# 3. Open Xcode automatically
```

### Step 5: Test on iOS Simulator

In Xcode:
1. Select **Product → Destination → Simulator** (or press `Cmd + Shift + J`)
2. Choose an iPhone simulator (e.g., iPhone 15)
3. Click the **Play button** (or press `Cmd + R`) to build and run
4. App will launch in simulator
5. Test all features:
   - Sign up with email
   - Sign in with Google OAuth
   - Add meals
   - Analyze with AI
   - View BMI and profile

### Step 6: Test on Physical iPhone (Optional)

1. Connect your iPhone via USB to your Mac
2. In Xcode: **Product → Destination → Your iPhone**
3. Select your Apple ID in **Xcode → Preferences → Accounts**
4. Configure signing: **Project → Signing & Capabilities**
5. Click Play button to build and run on device

### Step 7: Build for iOS App Store

```bash
# In Xcode, prepare for production:

# 1. Update version number:
#    Project → General → Version (e.g., 1.0.0)
#    Project → General → Build (e.g., 1)

# 2. Make sure signing certificate is valid:
#    Project → Signing & Capabilities
#    Select your team and certificate

# 3. Build archive:
#    Product → Archive

# 4. Validate archive:
#    Window → Organizer
#    Select your archive → Validate App

# 5. Submit to App Store:
#    Window → Organizer
#    Select your archive → Distribute App
#    Follow the wizard to upload to App Store Connect
```

---

## 🤖 PHASE 4: Android Development & Testing

### Step 8: Open Android Project in Android Studio

```bash
npm run android

# This will:
# 1. Build your web app
# 2. Sync files to Android project
# 3. Open Android Studio automatically
```

### Step 9: Test on Android Emulator

In Android Studio:
1. Click **AVD Manager** (phone icon in top-right)
2. Select or create an Android Virtual Device (AVD)
3. Click the **Play button** to start emulator
4. Wait for emulator to fully load (might take 2-5 minutes)
5. Once started: **Run → Run 'app'** (or press `Shift + F10`)
6. Select the emulator and click OK
7. App will build and deploy to emulator
8. Test all features (same as iOS)

### Step 10: Test on Physical Android Phone (Optional)

1. Enable Developer Mode on your Android phone:
   - Go to **Settings → About Phone**
   - Tap **Build Number** 7 times
   - Go back → **Developer options**
   - Enable **USB Debugging**

2. Connect phone to computer via USB

3. In Android Studio: **Run → Run 'app'**

4. Select your phone from the device list

5. App will install and run on your phone

### Step 11: Build for Google Play Store

```bash
# In Android Studio:

# 1. Update version in build.gradle (app level):
#    Open: android/app/build.gradle
#    Change: versionCode = 1
#    Change: versionName = "1.0.0"

# 2. Generate signed APK/Bundle:
#    Build → Generate Signed App Bundle / APK
#    
#    If first time:
#    - Click "Create new..."
#    - Set keystore password (remember this!)
#    - Fill in key info (Name, Org, City, State, Country Code)
#    - Set key validity (10000 days recommended)
#    - Save keystore file safely!
#
#    If existing keystore:
#    - Select your .jks keystore file
#    - Enter passwords

# 3. Select "App Bundle" for Google Play
#    (Smaller size, better optimization)

# 4. Select Release build variant

# 5. Click Finish

# 6. Android Studio will create:
#    android/app/release/app-release.aab
```

---

## 🚀 PHASE 5: Create App Store & Play Store Accounts

### Step 12: Google Play Developer Account

1. Go to: https://play.google.com/console/
2. Sign in or create Google Account
3. Create developer account ($25 one-time fee)
4. Complete profile information:
   - Developer name
   - Developer contact info
   - Website (optional)
5. Accept agreements
6. Verify phone number

### Step 13: Apple App Store Developer Account

1. Go to: https://developer.apple.com/account/
2. Sign in or create Apple ID
3. Enroll in Apple Developer Program ($99/year)
4. Provide:
   - Legal entity name
   - Business contact info
   - Payment method
5. Complete verification (can take 24-48 hours)

---

## 📱 PHASE 6: Publish to Google Play Store

### Step 14: Create Google Play App Listing

1. Go to **Google Play Console**
2. Click **Create app**
3. Enter app name: "SmartBite"
4. Select category: **Health & Fitness**
5. Select content rating: **Appropriate for all ages**
6. Click **Create app**

### Step 15: Fill App Store Listing

Navigate to **App Details** and fill in:

**Main Store Listing:**
- **App name:** SmartBite
- **Short description:** "Track your nutrition with AI-powered meal analysis"
- **Full description:**
  ```
  SmartBite is your personal nutrition tracker powered by AI.
  
  Features:
  - Upload meal photos
  - Get instant nutritional analysis
  - Track daily calories
  - Manage health profile and BMI
  - Secure authentication with Google
  
  Perfect for health-conscious individuals who want to understand their nutrition better.
  ```
- **Screenshots:** Upload 5+ screenshots from emulator
  - Meal upload screen
  - Meal analysis results
  - Profile/BMI screen
  - Sign-in screen
  - Account screen

**Graphics:**
- **Feature image (1024x500px):** Design banner showing app features
- **Icon (512x512px):** App icon
- **Promo graphic (180x120px):** Optional

**Ratings:**
- Content rating: Everyone (unless restricted)

### Step 16: Configure App Signing

In Google Play Console:
1. Go to **Setup → App signing**
2. Google Play will handle key generation automatically
3. No action needed for first release

### Step 17: Release to Testing (Beta)

1. Go to **Testing → Internal testing**
2. Click **Create new release**
3. Select the .aab file you built:
   - `android/app/release/app-release.aab`
4. Upload file
5. Add release notes: "Initial beta release"
6. Review content rating questionnaire
7. Click **Save and review**
8. Review all details
9. Click **Start rollout to internal testing**

### Step 18: Add Internal Testers (Optional)

1. In **Internal testing**, click **Manage testers**
2. Create tester list with email addresses
3. Share testing link with testers
4. They can download from Play Store (only for them)

### Step 19: Release to Production

After 24+ hours of internal testing:

1. Go to **Production** release track
2. Click **Create new release**
3. Upload the same .aab file
4. Add release notes: "SmartBite v1.0.0 - Initial release"
5. Click **Save and review**
6. Accept **Country restrictions** (if any)
7. Review pricing (Free recommended)
8. Click **Start rollout to production**
9. Choose rollout percentage:
   - Start with 10-25% for monitoring
   - Increase to 100% after 1-2 days if no issues

**Your app is now live on Google Play Store!** 🎉

---

## 🍎 PHASE 7: Publish to Apple App Store

### Step 20: Create App Store Connect App

1. Go to: https://appstoreconnect.apple.com/
2. Click **My Apps**
3. Click **+** icon → **New App**
4. Select **iOS** as platform
5. Fill in:
   - **Name:** SmartBite
   - **Primary Language:** English
   - **Bundle ID:** com.smartbite.app (matches Capacitor config)
   - **SKU:** com.smartbite.app-001
   - **User Access:** Limit to Only app owners
6. Click **Create**

### Step 21: Configure App Store Listing

In App Store Connect → **General**:

**App Information:**
- **Subtitle:** "AI Nutrition Tracker"
- **Category:** Health & Fitness
- **Content rights:** Select all that apply

**Rating:**
- Complete questionnaire (default: 4+)

**App Preview and Screenshots:**
- Upload for iPhone 6.5" (max size):
  - Meal upload
  - Analysis results
  - BMI profile
  - Google sign-in
  - Account page
- Each screenshot: 1242×2208 px
- Add captions explaining features

**App Description:**
```
SmartBite - Your AI-Powered Nutrition Tracker

Understand your nutrition better with SmartBite. Upload photos of your meals and 
get instant AI-powered analysis of calories, nutrients, and portions.

✨ Features:
• 📸 AI Meal Analysis - Upload photos, get detailed nutrition facts
• 📊 Track Daily Calories - Monitor your intake throughout the day
• 👤 Personal Profile - Manage your health goals and BMI
• 🔐 Secure Authentication - Sign in with Google or email
• 📈 Health Metrics - Track and trend your nutritional data

Perfect for anyone interested in nutrition, fitness, or healthy living!
```

**Keywords:**
nutrition, fitness, calories, meal tracker, health, diet, AI, food analysis

**Support URL:** https://github.com/jaffarbaig/smartbite

**Privacy Policy URL:** (Create and link to your privacy policy)

**Category:** Health & Fitness

### Step 22: Pricing

In **Pricing and Availability**:
- **Price:** Free
- **Availability:** All countries (or select specific ones)
- **Age Rating:** 4+ (if appropriate)

### Step 23: Build & Upload to TestFlight

In Xcode (build from Step 7 onward):

```bash
# After building archive in Xcode:

# 1. In Organizer window:
#    Select your archive
#    Click "Validate App"
#    Select team and signing certificate
#    Complete validation

# 2. Click "Distribute App"
#    Select "App Store Connect"
#    Select "Upload"
#    Leave defaults, click "Next"
#    Select team
#    Automatically manage signing - select team
#    Click "Upload"

# Processing takes 5-15 minutes
```

### Step 24: TestFlight Beta Testing

1. Go to App Store Connect → **TestFlight** tab
2. Go to **Internal Testing**
3. Build should appear automatically after processing
4. Click "+" to add testers
5. Enter email addresses
6. Testers receive invite via email
7. They install TestFlight app from App Store
8. They can test your app before public release

### Step 25: Submit for App Store Review

1. Go to App Store Connect → **App Review** tab
2. Click **Add Version or Platform**
3. Select **iOS**
4. Fill in:
   - **Version Number:** 1.0
   - **Release Notes:** "SmartBite v1.0 - Initial release"
5. Check all items in **Build** section
6. Verify app details are complete:
   - Screenshots ✓
   - Description ✓
   - Keywords ✓
   - Support URL ✓
   - Privacy Policy ✓
7. Click **Save**
8. Click **Submit for Review**

### Step 26: Review Guidelines Checklist

Before submission, ensure:
- ✅ App works without crashing
- ✅ No broken links
- ✅ Privacy policy is accessible
- ✅ Authentication works (Google OAuth, Email)
- ✅ All features function correctly
- ✅ No sensitive information in app
- ✅ Proper error handling
- ✅ Appropriate content rating

**Review typically takes 24-48 hours**

### Step 27: App Store Approval

Apple may:
1. **Approve** - Your app goes live! 🎉
2. **Request Info** - Answer questions and resubmit
3. **Reject** - Fix issues and resubmit

Once approved, your app appears on App Store!

---

## 🔄 PHASE 8: Version Updates (For Future Releases)

### Updating Your App

```bash
# 1. Make code changes
# 2. Test locally: npm run dev
# 3. Build: npm run build
# 4. Sync: npm run sync

# For iOS:
npm run ios
# Test in Xcode, then repeat Phase 6 steps 7+

# For Android:
npm run android
# Test in Android Studio, then repeat Phase 5 steps 11+

# Increment version numbers:
# iOS: Xcode Project → General
# Android: android/app/build.gradle
```

---

## 📊 Summary Timeline

| Phase | Timeline | Action |
|-------|----------|--------|
| Setup | Day 1 | Install tools, verify prerequisites |
| Development | Day 1-3 | Build, test on simulators/emulators |
| Testing | Day 4-5 | Test on real devices, fix bugs |
| Store Setup | Day 5-6 | Create developer accounts, fill listings |
| Beta Testing | Day 7 | TestFlight/Internal testing (optional) |
| Review | Day 7-8 | Submit to both stores |
| Approval | Day 8-10 | Wait for Apple/Google approval |
| **LIVE** | **Day 10+** | **Your app is on the App Stores!** 🚀 |

---

## 💰 Costs

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer Program | $99 | Annual |
| Google Play Developer | $25 | One-time |
| **Total First Year** | **$124** | - |
| **Annual Renewal** | **$99** | Each year |

---

## ⚠️ Important Security Notes

1. **Keystore File (Android):**
   - Save your `.jks` keystore file in a safe location
   - **Never commit to GitHub**
   - Losing it means you can't update your app
   - Password protect it

2. **Apple Certificates:**
   - Certificates valid for 1 year
   - Renew before expiration
   - Keep backup of certificates

3. **API Keys:**
   - Your `.env.local` is already built into the app
   - Consider different API keys for production
   - Supabase and OpenAI keys are embedded

4. **Privacy Policy:**
   - Create privacy policy for your app
   - Both stores require it
   - Use services like: termly.io, iubenda.com

---

## 🐛 Troubleshooting

### iOS Issues

**"No signing certificate found"**
- Go to Xcode → Preferences → Accounts
- Select your Apple ID
- Click "Download Xcode Signing Certificates"
- Try again

**"Pod install failed"**
```bash
cd ios/App
rm -rf Pods
rm Podfile.lock
pod install
cd ../..
```

**App crashes on startup**
- Check Console.app for error logs
- Enable logging in Capacitor
- Check that environment variables work

### Android Issues

**"SDK location not found"**
- Set ANDROID_HOME environment variable
- Restart Android Studio
- Verify SDK installation

**"Gradle sync failed"**
```bash
cd android
./gradlew clean
./gradlew build
cd ..
```

**"App not installing"**
- Clear emulator data: AVD Manager → Delete device → Recreate
- Update Android SDK tools

---

## ✅ Pre-Launch Checklist

Before submitting to stores:

- [ ] App runs without crashes
- [ ] All authentication methods work (email, Google)
- [ ] Meal upload and analysis works
- [ ] BMI calculation displays
- [ ] Profile page functional
- [ ] No console errors
- [ ] Tested on multiple device sizes
- [ ] No hardcoded test data
- [ ] Privacy policy created
- [ ] Support contact info ready
- [ ] Screenshots are high-quality
- [ ] App description is accurate
- [ ] Version number updated
- [ ] Release notes written

---

## 📞 Support & Resources

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Apple App Store:** https://developer.apple.com/app-store/
- **Google Play:** https://play.google.com/console/
- **Xcode Help:** Built into Xcode (Help menu)
- **Android Studio Help:** Built into Android Studio (Help menu)

---

**You've got this! 🚀**
