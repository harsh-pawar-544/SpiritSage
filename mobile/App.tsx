import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import AlcoholTypeScreen from './src/screens/AlcoholTypeScreen';
import SubtypeScreen from './src/screens/SubtypeScreen';
import BrandScreen from './src/screens/BrandScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import providers
import { SpiritsProvider } from './src/contexts/SpiritsContext';
import { UserPreferencesProvider } from './src/contexts/UserPreferencesContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

export default function App() {
  return (
    <SafeAreaProvider>
      <UserPreferencesProvider>
        <SpiritsProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
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
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </SpiritsProvider>
      </UserPreferencesProvider>
    </SafeAreaProvider>
  );
}