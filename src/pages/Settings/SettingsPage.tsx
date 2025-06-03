import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Globe, GlassWater, Save, X, Loader2 } from 'lucide-react';
import { useUserPreferences, Theme, Language, PreferredSpirit } from '../../contexts/UserPreferencesContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';
import ImageUpdater from '../../components/admin/ImageUpdater';

interface SettingsForm {
  theme: Theme;
  language: Language;
  preferredSpirit: PreferredSpirit;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    theme: savedTheme,
    language: savedLanguage,
    preferredSpirit: savedSpirit,
    updatePreferences
  } = useUserPreferences();

  const [formState, setFormState] = useState<SettingsForm>({
    theme: savedTheme,
    language: savedLanguage,
    preferredSpirit: savedSpirit,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsDirty(
      formState.theme !== savedTheme ||
      formState.language !== savedLanguage ||
      formState.preferredSpirit !== savedSpirit
    );
  }, [formState, savedTheme, savedLanguage, savedSpirit]);

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

  const handleSave = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      updatePreferences(formState);
      toast.success('Settings saved successfully!');
      setIsDirty(false);
      setShowSaveModal(false);
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormState({
      theme: savedTheme,
      language: savedLanguage,
      preferredSpirit: savedSpirit,
    });
    toast.success('Changes discarded');
    setIsDirty(false);
    setShowCancelModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-center mb-12">
        <SettingsIcon className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {formState.theme === 'dark' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Theme</h2>
            </div>
            <select
              value={formState.theme}
              onChange={(e) => setFormState(prev => ({
                ...prev,
                theme: e.target.value as Theme
              }))}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
              disabled={isSubmitting}
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Language</h2>
            </div>
            <select
              value={formState.language}
              onChange={(e) => setFormState(prev => ({
                ...prev,
                language: e.target.value as Language
              }))}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
              disabled={isSubmitting}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GlassWater className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferred Spirit</h2>
            </div>
            <select
              value={formState.preferredSpirit || ''}
              onChange={(e) => setFormState(prev => ({
                ...prev,
                preferredSpirit: e.target.value as PreferredSpirit
              }))}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
              disabled={isSubmitting}
            >
              {spirits.map((spirit) => (
                <option key={spirit.value || 'none'} value={spirit.value || ''}>
                  {spirit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex space-x-4">
          <button
            onClick={() => setShowSaveModal(true)}
            disabled={!isDirty || isSubmitting}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-white transition-colors ${
              isDirty && !isSubmitting
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isSubmitting ? 'Saving...' : 'Save Settings'}</span>
          </button>
          
          <button
            onClick={() => setShowCancelModal(true)}
            disabled={!isDirty || isSubmitting}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isDirty && !isSubmitting
                ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <X className="w-5 h-5" />
            <span>Cancel Changes</span>
          </button>
        </div>
      </div>

      {/* Admin Section */}
      {user?.email?.endsWith('@spiritsage.com') && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Settings</h2>
          <ImageUpdater />
        </div>
      )}

      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSave}
        title="Save Changes"
        message="Are you sure you want to save these changes? This will update your preferences across the application."
        confirmText="Save Changes"
      />

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Discard Changes"
        message="Are you sure you want to discard your changes? All modifications will be lost."
        confirmText="Discard Changes"
      />
    </div>
  );
};

export default SettingsPage;