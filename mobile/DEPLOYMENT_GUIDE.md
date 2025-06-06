# SpiritSage Mobile - Complete Deployment Guide

## 1. App Identity and Branding Configuration

### Update App Configuration (app.json)

1. **Bundle Identifiers and Package Names:**
   ```json
   {
     "expo": {
       "name": "SpiritSage",
       "slug": "spiritsage-mobile",
       "ios": {
         "bundleIdentifier": "com.yourcompany.spiritsage"
       },
       "android": {
         "package": "com.yourcompany.spiritsage"
       }
     }
   }
   ```
   Replace `yourcompany` with your actual company/developer name.

2. **App Description and Metadata:**
   Add these fields to your `app.json`:
   ```json
   {
     "expo": {
       "description": "Your AI-powered spirit companion for discovering and learning about fine spirits",
       "keywords": ["spirits", "whiskey", "gin", "rum", "alcohol", "tasting"],
       "privacy": "public",
       "githubUrl": "https://github.com/yourusername/spiritsage"
     }
   }
   ```

### Required Assets

Create these assets in the `mobile/assets/` directory:

**App Icons:**
- `icon.png` - 1024x1024px (main app icon)
- `adaptive-icon.png` - 1024x1024px (Android adaptive icon foreground)
- `favicon.png` - 48x48px (web favicon)

**Splash Screen:**
- `splash.png` - 1284x2778px (iPhone 12 Pro Max resolution)

**Additional Store Assets (create in `mobile/store-assets/`):**
- Feature graphic: 1024x500px (Google Play)
- Screenshots for various device sizes
- App preview videos (optional but recommended)

### Asset Requirements:
- **Format:** PNG with transparency
- **App Icon:** Must be exactly 1024x1024px, no transparency for iOS
- **Adaptive Icon:** 1024x1024px with safe area in center 66% circle
- **Splash Screen:** Should work on various screen ratios

## 2. Supabase Credentials Integration

### Update Supabase Configuration

1. **Get your Supabase credentials:**
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy your Project URL and anon/public key

2. **Update `mobile/src/lib/supabase.ts`:**
   ```typescript
   const supabaseUrl = 'https://your-project-id.supabase.co';
   const supabaseAnonKey = 'your-anon-key-here';
   ```

3. **For production, use environment variables:**
   Create `mobile/.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   Then update `supabase.ts`:
   ```typescript
   import Constants from 'expo-constants';
   
   const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'fallback-url';
   const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'fallback-key';
   ```

## 3. Local Testing and Development

### Prerequisites Installation

1. **Install required tools:**
   ```bash
   # Install Expo CLI globally
   npm install -g @expo/cli
   
   # Install EAS CLI for building
   npm install -g eas-cli
   
   # Navigate to mobile directory
   cd mobile
   
   # Install dependencies
   npm install
   ```

2. **Install Expo Go app on your device:**
   - iOS: Download from App Store
   - Android: Download from Google Play Store

### Running the App Locally

1. **Start development server:**
   ```bash
   npm start
   # or
   expo start
   ```

2. **Test on different platforms:**
   ```bash
   # Android emulator/device
   npm run android
   
   # iOS simulator (macOS only)
   npm run ios
   
   # Web browser
   npm run web
   ```

3. **Using Expo Go:**
   - Scan the QR code with your device camera (iOS) or Expo Go app (Android)
   - The app will load directly on your device
   - Changes will hot-reload automatically

### Development Best Practices

- **Enable debugging:** Shake device → "Debug Remote JS"
- **View logs:** Use `expo logs` or check Metro bundler output
- **Clear cache:** `expo start --clear` if you encounter issues

## 4. App Store Submission Process

### A. Setup EAS (Expo Application Services)

1. **Create Expo account and login:**
   ```bash
   eas login
   ```

2. **Initialize EAS in your project:**
   ```bash
   eas build:configure
   ```

### B. Android (Google Play Store) Submission

#### Step 1: Prepare for Android Build
1. **Update `eas.json` for production:**
   ```json
   {
     "build": {
       "production": {
         "android": {
           "buildType": "apk",
           "gradleCommand": ":app:assembleRelease"
         }
       }
     }
   }
   ```

2. **Build production APK:**
   ```bash
   eas build --platform android --profile production
   ```

#### Step 2: Google Play Console Setup
1. **Create Google Play Developer account** ($25 one-time fee)
2. **Create new application** in Play Console
3. **Upload APK** from EAS build
4. **Complete store listing:**
   - App title: "SpiritSage"
   - Short description: "AI-powered spirit discovery app"
   - Full description: Detailed app description
   - Screenshots for phone and tablet
   - Feature graphic (1024x500px)
   - App icon (512x512px)

#### Step 3: Required Store Assets
- **Screenshots:** 2-8 screenshots per device type
- **Feature Graphic:** 1024x500px
- **App Icon:** 512x512px
- **Privacy Policy URL:** Required for apps that collect data

#### Step 4: Submit for Review
- Complete content rating questionnaire
- Set pricing (free)
- Select countries for distribution
- Submit for review (typically 1-3 days)

### C. iOS (Apple App Store) Submission

#### Step 1: Apple Developer Account
1. **Enroll in Apple Developer Program** ($99/year)
2. **Create App ID** in developer portal
3. **Generate certificates** (EAS handles this automatically)

#### Step 2: Build for iOS
```bash
eas build --platform ios --profile production
```

#### Step 3: App Store Connect Setup
1. **Create new app** in App Store Connect
2. **Upload build** using EAS Submit:
   ```bash
   eas submit --platform ios
   ```

#### Step 4: Complete App Information
- **App Information:** Name, bundle ID, SKU
- **Pricing:** Free
- **App Store Information:**
  - Screenshots for all device sizes
  - App preview videos (optional)
  - Description and keywords
  - Support URL and privacy policy URL

#### Step 5: Submit for Review
- Complete App Review Information
- Submit for review (typically 24-48 hours)

### Required Metadata for Both Stores

**App Store Optimization (ASO) Content:**
- **Title:** "SpiritSage - AI Spirit Guide"
- **Subtitle/Short Description:** "Discover & learn about fine spirits"
- **Keywords:** spirits, whiskey, gin, rum, alcohol, tasting, AI, guide
- **Description:** 
  ```
  Discover your perfect spirit with SpiritSage, the AI-powered companion for spirit enthusiasts and bartenders.

  Features:
  • Comprehensive spirit database with detailed information
  • AI-powered recommendations based on your preferences
  • Expert tasting notes and historical facts
  • Myth-busting information about spirits
  • Beautiful, intuitive interface
  • Dark/light theme support

  Whether you're a curious newcomer or seasoned connoisseur, SpiritSage guides you through the fascinating world of spirits with expert knowledge and personalized recommendations.
  ```

## 5. Over-the-Air (OTA) Updates

### Setup OTA Updates

1. **EAS Update configuration** (add to `app.json`):
   ```json
   {
     "expo": {
       "updates": {
         "url": "https://u.expo.dev/your-project-id"
       },
       "runtimeVersion": "1.0.0"
     }
   }
   ```

2. **Install EAS Update:**
   ```bash
   npx expo install expo-updates
   ```

### Publishing Updates

1. **Publish update:**
   ```bash
   eas update --branch production --message "Bug fixes and improvements"
   ```

2. **Preview updates:**
   ```bash
   eas update --branch preview --message "Testing new features"
   ```

### Automatic Updates with CI/CD

**GitHub Actions example** (`.github/workflows/update.yml`):
```yaml
name: EAS Update
on:
  push:
    branches: [main]
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -g eas-cli
      - run: cd mobile && npm install
      - run: eas update --branch production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

### OTA Update Best Practices

- **Test updates** on preview branch first
- **Use semantic versioning** for runtime versions
- **Monitor update adoption** in Expo dashboard
- **Rollback capability** if issues arise
- **Update frequency:** Weekly for minor fixes, monthly for features

## 6. Production Deployment Checklist

### Pre-Launch Checklist

- [ ] App icons and splash screens added
- [ ] Bundle identifiers configured
- [ ] Supabase credentials updated
- [ ] Privacy policy created and linked
- [ ] App tested on multiple devices
- [ ] Store screenshots captured
- [ ] App descriptions written
- [ ] Content rating completed
- [ ] Pricing set (free)
- [ ] Distribution countries selected

### Post-Launch Monitoring

1. **Analytics Setup:**
   ```bash
   npx expo install expo-analytics-amplitude
   # or
   npx expo install @react-native-firebase/analytics
   ```

2. **Crash Reporting:**
   ```bash
   npx expo install expo-error-recovery
   ```

3. **Performance Monitoring:**
   - Monitor app startup time
   - Track API response times
   - Monitor memory usage

### Maintenance Schedule

- **Weekly:** Check crash reports and user feedback
- **Bi-weekly:** OTA updates for bug fixes
- **Monthly:** Feature updates and improvements
- **Quarterly:** Major version updates requiring store review

## 7. Troubleshooting Common Issues

### Build Issues
- **Clear cache:** `expo start --clear`
- **Clean install:** Delete `node_modules` and run `npm install`
- **Check EAS logs:** View detailed build logs in Expo dashboard

### Store Rejection Issues
- **Android:** Usually related to permissions or content policy
- **iOS:** Often UI/UX guidelines or missing functionality

### OTA Update Issues
- **Version mismatch:** Ensure runtime version compatibility
- **Network issues:** Check update URL configuration
- **Rollback:** Use EAS dashboard to rollback problematic updates

## 8. Cost Considerations

### Development Costs
- **Apple Developer:** $99/year
- **Google Play:** $25 one-time
- **Expo EAS:** Free tier available, paid plans for advanced features

### Ongoing Costs
- **Supabase:** Free tier generous, paid plans scale with usage
- **App Store fees:** 30% commission on paid apps (SpiritSage is free)
- **EAS builds:** Limited free builds, then $29/month for unlimited

This guide provides everything you need to successfully deploy SpiritSage to both app stores and maintain it with OTA updates. Follow each section carefully and test thoroughly before submitting to stores.