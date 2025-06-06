# SpiritSage Mobile - Production Optimization Guide

## Image Optimization

### 1. Image Formats and Compression
- **Use WebP format** when possible for better compression
- **JPEG for photos** with 80% quality for good balance
- **PNG for graphics** with transparency
- **Implement lazy loading** for spirit detail screens

### 2. Image Caching Strategy
```typescript
// Already implemented in OptimizedImage component
import { Image } from 'expo-image';

// Use with caching
<Image
  source={{ uri: imageUrl }}
  cachePolicy="memory-disk"
  placeholder="blur-hash-here"
  contentFit="cover"
/>
```

### 3. Image Preloading
```typescript
// Preload critical images
import ImageOptimizer from '../utils/ImageOptimizer';

// In your component
useEffect(() => {
  const criticalImages = [
    'https://example.com/hero-image.jpg',
    'https://example.com/featured-spirit.jpg'
  ];
  
  ImageOptimizer.preloadImages(criticalImages, {
    maxWidth: 400,
    quality: 0.8
  });
}, []);
```

## Bundle Size Optimization

### 1. Code Splitting and Lazy Loading
```typescript
// Lazy load screens
const BrandScreen = React.lazy(() => import('./src/screens/BrandScreen'));
const AlcoholTypeScreen = React.lazy(() => import('./src/screens/AlcoholTypeScreen'));

// Use with Suspense
<Suspense fallback={<LoadingScreen />}>
  <BrandScreen />
</Suspense>
```

### 2. Remove Unused Dependencies
```bash
# Analyze bundle
npx expo install --fix
expo doctor

# Remove unused packages
npm uninstall unused-package-name
```

### 3. Tree Shaking
```typescript
// Import only what you need
import { debounce } from 'lodash/debounce'; // ✅ Good
import _ from 'lodash'; // ❌ Bad - imports entire library
```

### 4. Asset Optimization
```json
// In app.json
{
  "expo": {
    "assetBundlePatterns": [
      "assets/images/**",
      "assets/fonts/**"
    ],
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "enableProguardInReleaseBuilds": true,
            "enableShrinkResourcesInReleaseBuilds": true
          }
        }
      ]
    ]
  }
}
```

## Performance Optimizations

### 1. FlatList Optimization
```typescript
// In spirit lists
<FlatList
  data={spirits}
  renderItem={renderSpirit}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### 2. Memory Management
```typescript
// Clean up subscriptions
useEffect(() => {
  const subscription = someService.subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

### 3. Network Optimization
```typescript
// Implement request deduplication
const requestCache = new Map();

async function fetchWithCache(url: string) {
  if (requestCache.has(url)) {
    return requestCache.get(url);
  }
  
  const promise = fetch(url).then(r => r.json());
  requestCache.set(url, promise);
  
  return promise;
}
```

## Build Configuration

### 1. EAS Build Optimization
```json
// eas.json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      },
      "ios": {
        "buildConfiguration": "Release"
      },
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 2. Metro Configuration
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable tree shaking
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Optimize asset resolution
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

module.exports = config;
```

### 3. Babel Configuration
```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['transform-remove-console', { exclude: ['error', 'warn'] }], // Remove console.logs in production
    ],
  };
};
```

## Monitoring and Analytics

### 1. Performance Monitoring
```typescript
// Track performance metrics
import AnalyticsService from '../services/AnalyticsService';

// Track screen load times
const startTime = Date.now();

useEffect(() => {
  const loadTime = Date.now() - startTime;
  AnalyticsService.track('Screen Load Time', {
    screen: 'SpiritDetail',
    loadTime,
  });
}, []);
```

### 2. Bundle Analysis
```bash
# Analyze bundle size
npx expo export --dump-assetmap
npx expo export --dump-sourcemap

# Use bundle analyzer
npm install -g react-native-bundle-visualizer
react-native-bundle-visualizer
```

## Deployment Checklist

### Pre-Production
- [ ] Remove all console.log statements
- [ ] Enable Proguard/R8 for Android
- [ ] Optimize images and assets
- [ ] Test on low-end devices
- [ ] Verify offline functionality
- [ ] Test push notifications
- [ ] Validate analytics tracking

### Production Build
- [ ] Set NODE_ENV=production
- [ ] Enable minification
- [ ] Remove development dependencies
- [ ] Test on physical devices
- [ ] Verify app signing
- [ ] Test OTA updates

### Post-Deployment
- [ ] Monitor crash reports
- [ ] Track performance metrics
- [ ] Monitor user engagement
- [ ] Check bundle size impact
- [ ] Validate offline sync

## Asset Requirements

Create these optimized assets in `mobile/assets/`:

### App Icons
- `icon.png` - 1024x1024px (main app icon)
- `icon-ios.png` - 1024x1024px (iOS specific)
- `icon-android.png` - 1024x1024px (Android specific)
- `adaptive-icon.png` - 1024x1024px (Android adaptive icon)
- `favicon.png` - 48x48px (web favicon)

### Splash Screens
- `splash.png` - 1284x2778px (main splash)
- `splash-ios.png` - 1284x2778px (iOS specific)
- `splash-android.png` - 1284x2778px (Android specific)
- `splash-web.png` - 1920x1080px (web splash)

### Notifications
- `notification-icon.png` - 96x96px (notification icon)
- `notification.wav` - notification sound (optional)

All images should be optimized for mobile delivery with appropriate compression.