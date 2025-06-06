# SpiritSage Mobile

A React Native mobile application for exploring spirits, built with Expo.

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`

### Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure Supabase:
   - Open `src/lib/supabase.ts`
   - Replace `YOUR_SUPABASE_URL` with your actual Supabase project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your actual Supabase anon key

### Development

1. Start the development server:
```bash
npm start
```

2. Run on specific platforms:
```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

### Building for Production

#### Setup EAS Build
1. Login to Expo:
```bash
eas login
```

2. Configure your project:
```bash
eas build:configure
```

#### Build APK (Android)
```bash
npm run build:android
```

#### Build for iOS
```bash
npm run build:ios
```

#### Build for both platforms
```bash
npm run build:all
```

### App Store Submission

#### Android (Google Play Store)
1. Build a production APK:
```bash
eas build --platform android --profile production
```

2. Submit to Google Play:
```bash
npm run submit:android
```

#### iOS (Apple App Store)
1. Build for iOS:
```bash
eas build --platform ios --profile production
```

2. Submit to App Store:
```bash
npm run submit:ios
```

### Configuration Files

- `app.json`: Expo configuration
- `eas.json`: EAS Build configuration
- Update bundle identifiers and app names as needed

### Features

- Browse spirit categories
- View detailed information about alcohol types, subtypes, and brands
- Search functionality
- User preferences and settings
- Dark/light theme support
- Offline-capable with local storage

### Architecture

- **React Native with Expo**: Cross-platform mobile development
- **React Navigation**: Navigation between screens
- **Supabase**: Backend database and authentication
- **AsyncStorage**: Local data persistence
- **TypeScript**: Type safety and better development experience

### Project Structure

```
mobile/
├── src/
│   ├── contexts/          # React contexts for state management
│   ├── lib/              # Utility libraries and configurations
│   ├── screens/          # Screen components
│   └── types/            # TypeScript type definitions
├── assets/               # Images and other static assets
├── app.json             # Expo configuration
├── eas.json             # EAS Build configuration
└── package.json         # Dependencies and scripts
```

### Troubleshooting

1. **Metro bundler issues**: Clear cache with `expo start --clear`
2. **Build failures**: Check EAS build logs in Expo dashboard
3. **Supabase connection**: Verify URL and keys in `src/lib/supabase.ts`
4. **Navigation issues**: Ensure all screen names match navigation calls

### Next Steps

1. Add app icons and splash screens in the `assets/` directory
2. Configure push notifications if needed
3. Add analytics and crash reporting
4. Implement offline data synchronization
5. Add user authentication flows
6. Optimize images and bundle size for production