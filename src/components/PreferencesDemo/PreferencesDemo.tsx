import React from 'react';
import { Moon, Sun, Globe, GlassWater } from 'lucide-react';
import { useUserPreferences, Theme, Language, PreferredSpirit } from '../../contexts/UserPreferencesContext';
import toast from 'react-hot-toast';

const PreferencesDemo = () => {
  const {
    theme,
    language,
    preferredSpirit,
    setTheme,
    setLanguage,
    setPreferredSpirit
  } = useUserPreferences();

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' }
  ];

  const spirits: { value: PreferredSpirit; label: string }[] = [
    { value: null, label: 'No Preference' },
    { value: 'whiskey', label: 'Whiskey' },
    { value: 'gin', label: 'Gin' },
    { value: 'rum', label: 'Rum' },
    { value: 'tequila', label: 'Tequila' },
    { value: 'brandy', label: 'Brandy' },
    { value: 'cognac', label: 'Cognac' }
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">User Preferences</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
            <span className="text-gray-700 dark:text-gray-300">Theme</span>
          </div>
          <button
            onClick={handleThemeToggle}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GlassWater className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">Preferred Spirit</span>
          </div>
          <select
            value={preferredSpirit || ''}
            onChange={(e) => setPreferredSpirit(e.target.value as PreferredSpirit)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
          >
            {spirits.map((spirit) => (
              <option key={spirit.value || 'none'} value={spirit.value || ''}>
                {spirit.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>Current Theme: <span className="font-semibold">{theme}</span></p>
          <p>Current Language: <span className="font-semibold">{language}</span></p>
          <p>Preferred Spirit: <span className="font-semibold">{preferredSpirit || 'None'}</span></p>
        </div>
      </div>
    </div>
  );
};

export default PreferencesDemo;