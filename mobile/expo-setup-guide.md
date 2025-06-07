# Linking Your Expo Account to SpiritSage Mobile

## Prerequisites
- An Expo account (create one at https://expo.dev if you don't have one)
- EAS CLI installed globally

## Steps to Link Your Account

### 1. Install EAS CLI (if not already installed)
```bash
npm install -g @expo/cli eas-cli
```

### 2. Navigate to the mobile directory
```bash
cd mobile
```

### 3. Login to your Expo account
```bash
eas login
```
Enter your Expo account credentials when prompted.

### 4. Initialize EAS for your project
```bash
eas build:configure
```
This will create an `eas.json` file (already exists) and link the project to your account.

### 5. Update app.json with your project details
You may want to update the following in `app.json`:
- `expo.slug`: Make it unique to your account
- `expo.owner`: Your Expo username
- Bundle identifiers for iOS/Android

### 6. Create your first build (optional)
```bash
# For development build
eas build --profile development --platform ios

# For production build
eas build --profile production --platform all
```

### 7. Set up project on Expo dashboard
After running the commands above, your project will appear in your Expo dashboard at https://expo.dev

## Important Notes

- The web app deployed to Netlify (https://spirit-sage.site) is independent of the Expo mobile app
- The mobile app in the `mobile/` directory is what gets linked to your Expo account
- You can manage builds, updates, and deployments through the Expo dashboard once linked

## Troubleshooting

If you encounter network issues (as mentioned in previous messages), you may need to:
1. Use the `--local` flag for builds: `eas build --local`
2. Or work around network connectivity issues in the current environment

## Next Steps

Once linked, you can:
- Build your app for iOS/Android app stores
- Use EAS Update for over-the-air updates
- Manage your app through the Expo dashboard
- Submit to app stores directly through EAS Submit