# SpiritSage Mobile - Complete Setup Instructions

## Prerequisites

1. **Node.js** (v16 or later)
2. **Expo CLI**: `npm install -g @expo/cli`
3. **EAS CLI**: `npm install -g eas-cli`
4. **Expo account** (create at expo.dev)

## Installation

1. **Navigate to mobile directory**:
```bash
cd mobile
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
Create a `.env` file in the mobile directory:
```env
# Supabase (already configured)
EXPO_PUBLIC_SUPABASE_URL=https://eiamlzpxbfnllyhzrwrm.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpYW1senB4YmZubGx5aHpyd3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjY3OTksImV4cCI6MjA2NDQ0Mjc5OX0.1l_wXeEeT3XZ2Kl8O25FLvO15lc9W3jCfQBRokpITc0

# Analytics (replace with your keys)
EXPO_PUBLIC_SEGMENT_WRITE_KEY=your_segment_write_key_here

# Crash Reporting (replace with your DSN)
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

## Service Configuration

### 1. Sentry (Crash Reporting)
1. Create account at [sentry.io](https://sentry.io)
2. Create new React Native project
3. Copy DSN to environment variables
4. Update `App.tsx` with your DSN

### 2. Segment (Analytics)
1. Create account at [segment.com](https://segment.com)
2. Create new React Native source
3. Copy Write Key to environment variables
4. Update `App.tsx` with your key

### 3. Push Notifications
- No additional setup required for development
- For production, you'll need to configure push notification credentials in EAS

## Asset Setup

Create the following assets in `mobile/assets/`:

### Required Assets
- `icon.png` (1024x1024px) - Main app icon
- `adaptive-icon.png` (1024x1024px) - Android adaptive icon
- `splash.png` (1284x2778px) - Splash screen
- `favicon.png` (48x48px) - Web favicon

### Optional Assets
- `notification-icon.png` (96x96px) - Notification icon
- `notification.wav` - Custom notification sound

## Development

### Start Development Server
```bash
npm start
```

### Run on Specific Platforms
```bash
npm run android  # Android
npm run ios      # iOS (macOS only)
npm run web      # Web browser
```

### Using Expo Go
1. Install Expo Go app on your device
2. Scan QR code from terminal
3. App will load on your device

## Building for Production

### 1. Setup EAS Build
```bash
eas login
eas build:configure
```

### 2. Update Configuration
Edit `app.json` to update:
- Bundle identifiers
- App name and description
- Version numbers

### 3. Build Commands
```bash
# Android APK
npm run build:android

# iOS build
npm run build:ios

# Both platforms
npm run build:all
```

## App Store Submission

### Android (Google Play)
```bash
npm run submit:android
```

### iOS (App Store)
```bash
npm run submit:ios
```

## Features Implemented

### ✅ App Icons and Splash Screens
- Configured for iOS, Android, and Web
- Proper resolution handling
- Platform-specific optimizations

### ✅ Push Notifications
- Permission handling
- Token management
- Local notifications
- Background notification handling

### ✅ Analytics and Crash Reporting
- Segment integration for analytics
- Sentry integration for crash reporting
- User tracking and event logging
- Performance monitoring

### ✅ Offline Data Synchronization
- AsyncStorage for local persistence
- Network state monitoring
- Automatic sync when online
- Pending changes queue

### ✅ User Authentication
- Supabase Auth integration
- Sign up, sign in, sign out
- Password reset functionality
- Authentication state management

### ✅ Image and Bundle Optimization
- Expo Image for optimized loading
- Image caching and compression
- Bundle size optimization
- Lazy loading implementation

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**:
```bash
expo start --clear
```

2. **Dependency conflicts**:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. **Build failures**:
- Check EAS build logs in Expo dashboard
- Verify all required assets are present
- Ensure environment variables are set

### Performance Issues
- Use React DevTools for component profiling
- Monitor bundle size with `expo export --dump-assetmap`
- Check image optimization with network inspector

## Next Steps

1. **Replace placeholder keys** in environment variables
2. **Add app assets** to the assets directory
3. **Test on physical devices** before production
4. **Configure app store metadata** for submission
5. **Set up CI/CD pipeline** for automated builds

## Support

For issues specific to:
- **Expo**: [Expo Documentation](https://docs.expo.dev)
- **React Navigation**: [React Navigation Docs](https://reactnavigation.org)
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)