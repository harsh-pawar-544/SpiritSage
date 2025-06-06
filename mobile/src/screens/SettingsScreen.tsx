import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

export default function SettingsScreen() {
  const {
    theme,
    language,
    preferredSpirit,
    setTheme,
    setLanguage,
    setPreferredSpirit
  } = useUserPreferences();

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' }
  ];

  const spirits = [
    { value: null, label: 'No Preference' },
    { value: 'whiskey', label: 'Whiskey' },
    { value: 'gin', label: 'Gin' },
    { value: 'rum', label: 'Rum' },
    { value: 'tequila', label: 'Tequila' },
    { value: 'brandy', label: 'Brandy' },
    { value: 'cognac', label: 'Cognac' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="settings" size={32} color="#6366f1" />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons 
                name={theme === 'dark' ? 'moon' : 'sunny'} 
                size={20} 
                color="#6366f1" 
              />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
              thumbColor={theme === 'dark' ? '#ffffff' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.value}
              style={styles.settingItem}
              onPress={() => setLanguage(lang.value as any)}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="language" size={20} color="#6366f1" />
                <Text style={styles.settingLabel}>{lang.label}</Text>
              </View>
              {language === lang.value && (
                <Ionicons name="checkmark" size={20} color="#6366f1" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Preferred Spirit Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Spirit</Text>
          {spirits.map((spirit) => (
            <TouchableOpacity
              key={spirit.value || 'none'}
              style={styles.settingItem}
              onPress={() => setPreferredSpirit(spirit.value as any)}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="wine" size={20} color="#6366f1" />
                <Text style={styles.settingLabel}>{spirit.label}</Text>
              </View>
              {preferredSpirit === spirit.value && (
                <Ionicons name="checkmark" size={20} color="#6366f1" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle" size={20} color="#6366f1" />
              <Text style={styles.settingLabel}>About SpiritSage</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle" size={20} color="#6366f1" />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text" size={20} color="#6366f1" />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SpiritSage v1.0.0</Text>
          <Text style={styles.footerSubtext}>Your AI-Powered Spirit Assistant</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    marginHorizontal: 20,
    marginBottom: 2,
    borderRadius: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});