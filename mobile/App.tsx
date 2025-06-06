import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { AppState } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import AlcoholTypeScreen from './src/screens/AlcoholTypeScreen';
import SubtypeScreen from './src/screens/SubtypeScreen';
import BrandScreen from './src/screens/BrandScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AuthScreen from './src/screens/AuthScreen';

// Import providers
import { SpiritsProvider } from './src/contexts/SpiritsContext';
import { UserPreferencesProvider } from './src/contexts/UserPreferencesContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Import services
import NotificationService from './src/services/NotificationService';
import AnalyticsService from './src/services/AnalyticsService';
import CrashReportingService from './src/services/CrashReportingService';
import OfflineService from './src/services/OfflineService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You could show a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="AlcoholType" 
              component={AlcoholTypeScreen}
              options={{ headerShown: true, title: 'Spirit Details' }}
            />
            <Stack.Screen 
              name="Subtype" 
              component={SubtypeScreen}
              options={{ headerShown: true, title: 'Subtype Details' }}
            />
            <Stack.Screen 
              name="Brand" 
              component={BrandScreen}
              options={{ headerShown: true, title: 'Brand Details' }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize services
        await Promise.all([
          // Initialize crash reporting first
          CrashReportingService.initialize('YOUR_SENTRY_DSN_HERE'),
          
          // Initialize analytics
          AnalyticsService.initialize('YOUR_SEGMENT_WRITE_KEY_HERE'),
          
          // Initialize notifications
          NotificationService.initialize(),
          
          // Initialize offline service
          OfflineService.initialize(),
        ]);

        // Track app opened
        AnalyticsService.trackAppOpened();

        // Set up app state change listener
        const handleAppStateChange = (nextAppState: string) => {
          if (nextAppState === 'background') {
            AnalyticsService.trackAppBackgrounded();
          } else if (nextAppState === 'active') {
            AnalyticsService.trackAppOpened();
          }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Artificially delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 2000));

        return () => {
          subscription?.remove();
        };
      } catch (e) {
        console.warn('Error during app initialization:', e);
        CrashReportingService.captureException(e as Error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <UserPreferencesProvider>
        <AuthProvider>
          <SpiritsProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </SpiritsProvider>
        </AuthProvider>
      </UserPreferencesProvider>
    </SafeAreaProvider>
  );
}