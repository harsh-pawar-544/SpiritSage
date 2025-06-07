# SpiritSage Mobile - Connectivity Solutions for Bolt.new

## Issue Resolution Guide

### 1. ConfigError: expo module not found

**Root Cause**: The expo module installation may not be properly recognized in the Bolt.new environment.

**Solutions**:
```bash
# Navigate to mobile directory
cd mobile

# Clear all caches and reinstall
rm -rf node_modules package-lock.json .expo
npm cache clean --force
npm install

# Verify expo installation
npx expo --version

# If still failing, try installing expo globally (if permissions allow)
npm install -g expo-cli@latest
```

### 2. Physical iPhone Connection Solutions

Since Bolt.new runs in a containerized environment, direct LAN access may be limited. Here are the recommended approaches:

#### Option A: Use Expo Development Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/cli

# Create a development build
npx expo install expo-dev-client
eas build --profile development --platform ios
```

#### Option B: Web Preview (Immediate Testing)
```bash
# Start web version for immediate testing
cd mobile
npx expo start --web
```

#### Option C: iOS Simulator (if available)
```bash
# Start with iOS simulator
npx expo start --ios
```

### 3. Network Connectivity Workarounds

#### Method 1: QR Code with Expo Go
```bash
# Start with clear cache
cd mobile
npx expo start --clear

# Look for QR code in terminal output
# Scan with iPhone camera or Expo Go app
```

#### Method 2: Manual URL Entry
```bash
# Start the server
npx expo start

# Note the exp:// URL from terminal
# Manually enter in Expo Go app under "Enter URL manually"
```

#### Method 3: Tunnel Alternative (if ngrok fails)
```bash
# Try using localtunnel as alternative
npm install -g localtunnel
npx expo start --localhost
# In another terminal:
lt --port 8081 --subdomain spiritsage-mobile
```

### 4. Environment-Specific Commands

For Bolt.new environment, use these specific commands:

```bash
# Basic start (most compatible)
cd mobile && npx expo start --web

# For QR code generation
cd mobile && npx expo start --clear

# Force localhost (bypass network detection)
cd mobile && npx expo start --localhost --clear

# Web-only mode (guaranteed to work)
cd mobile && npx expo start --web --clear
```

### 5. Troubleshooting Steps

1. **Verify Project Structure**:
   ```bash
   cd mobile
   ls -la
   # Should see app.json, package.json, etc.
   ```

2. **Check Expo Configuration**:
   ```bash
   cd mobile
   npx expo config
   ```

3. **Validate Dependencies**:
   ```bash
   cd mobile
   npx expo doctor
   ```

4. **Clear All Caches**:
   ```bash
   cd mobile
   rm -rf node_modules .expo
   npm cache clean --force
   npm install
   npx expo start --clear
   ```

### 6. Alternative Development Approaches

If direct device connection remains problematic:

1. **Use Web Version**: Test core functionality in browser
2. **Use Expo Snack**: Copy components to online editor
3. **Use Development Build**: Create custom development app
4. **Use Simulator**: Test on iOS/Android simulators if available

### 7. Production Deployment

For final testing, consider building and deploying:

```bash
cd mobile
# Build for iOS
eas build --platform ios --profile preview

# Build for Android
eas build --platform android --profile preview
```

## Quick Start Commands

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start development server (web-compatible)
npx expo start --web

# Alternative: Start with QR code
npx expo start --clear
```

## Notes for Bolt.new Environment

- Global package installation may be restricted
- Network tunneling may have limitations
- Web preview is the most reliable testing method
- QR code scanning may work depending on network configuration
- Consider using Expo Snack for quick prototyping