import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlassWater } from 'lucide-react';
// import { useUserPreferences } from '../contexts/UserPreferencesContext'; // Not used in this snippet, can remove if not needed elsewhere

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  // const { theme } = useUserPreferences(); // If you want to dynamically switch logo based on theme

  const navigation = [
    { name: 'Explore', path: '/explore' }, // Changed Home to Explore as per common usage
    { name: 'My Bar', path: '/my-bar' }, // Added My Bar to navigation
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200 flex flex-col">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <GlassWater className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">SpiritSage</span>
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    } transition-colors`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            {/* You might have user login/profile elements here */}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer Section - Using White Circle Badge for presumed dark footer background */}
      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-4">© {new Date().getFullYear()} SpiritSage. All rights reserved.</p>
          <div className="flex justify-center items-center space-x-4">
            {/* Use White Circle on dark backgrounds (like the dark mode footer) */}
            <img
              src="/logos/bolt-white-circle.png" // Ensure this path is correct based on your public/logos folder
              alt="Powered by Bolt AI"
              className="h-9 w-auto rounded-full" // Added rounded-full for circular badge
            />
            {/* If you wanted a text-only option for dark backgrounds: */}
            {/* <img
              src="/logos/bolt-text-only.png"
              alt="Powered by Bolt AI"
              className="h-6 w-auto"
            /> */}
          </div>
          <p className="mt-4 text-sm">Intelligent Spirit Recommendations</p>
        </div>
      </footer>
    </div>
  );
}