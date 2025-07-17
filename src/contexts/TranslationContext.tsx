import React, { createContext, useContext, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr';

interface TranslationContextType {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const translations = {
  en: {
    'nav.explore': 'Explore',
    'nav.myBar': 'My Bar',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.settings': 'Settings',
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    'footer.allRightsReserved': 'All rights reserved.',
    'footer.intelligentRecommendations': 'Intelligent Spirit Recommendations'
  },
  es: {
    'nav.explore': 'Explorar',
    'nav.myBar': 'Mi Bar',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.settings': 'Configuración',
    'auth.signIn': 'Iniciar Sesión',
    'auth.signOut': 'Cerrar Sesión',
    'footer.allRightsReserved': 'Todos los derechos reservados.',
    'footer.intelligentRecommendations': 'Recomendaciones Inteligentes de Licores'
  },
  fr: {
    'nav.explore': 'Explorer',
    'nav.myBar': 'Mon Bar',
    'nav.about': 'À Propos',
    'nav.contact': 'Contact',
    'nav.settings': 'Paramètres',
    'auth.signIn': 'Se Connecter',
    'auth.signOut': 'Se Déconnecter',
    'footer.allRightsReserved': 'Tous droits réservés.',
    'footer.intelligentRecommendations': 'Recommandations Intelligentes de Spiritueux'
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = React.useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};