import { ReactNode } from 'react';
// import { Link, useLocation } from 'react-router-dom'; // No longer directly used here, as navigation is in HeaderNavigation
import HeaderNavigation from './HeaderNavigation'; // Assuming this component handles your main navigation
import { useTranslation } from '../../contexts/TranslationContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header handled by HeaderNavigation component */}
      <HeaderNavigation />

      {/* Main content area */}
      {/* The mt-20 provides space for the fixed header, adjust if your HeaderNavigation is not fixed height */}
      <main className="flex-1 container mx-auto px-4 py-8 mt-20 text-gray-900 dark:text-white">
        {children}
      </main>

      {/* Footer Section - Added for Bolt AI Logos */}
      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-4">© {new Date().getFullYear()} SpiritSage. {t('footer.allRightsReserved')}</p>
          <div className="flex justify-center items-center space-x-4">
            {/* Using the White Circle Badge for a presumed dark footer background in dark mode */}
            <img
              src="/logos/white_circle.png" // Ensure this path is correct: public/logos/bolt-white-circle.png
              alt="Powered by Bolt AI"
              className="h-9 w-auto rounded-full" // Adjust sizing as needed
            />
            {/* You can add other badge variations here if you want to display all three, e.g.: */}
            {/* <img
              src="/logos/black_circle.png"
              alt="Bolt AI Badge"
              className="h-9 w-auto rounded-full"
            />
            <img
              src="/logos/bolt-text-only.png"
              alt="Bolt AI"
              className="h-6 w-auto"
            /> */}
          </div>
          <p className="mt-4 text-sm">{t('footer.intelligentRecommendations')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
