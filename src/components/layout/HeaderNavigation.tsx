import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlassWater, LogIn, LogOut, UserCircle, Settings, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';

const HeaderNavigation: React.FC = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path ? 'text-indigo-300' : '';

  const handleSignIn = () => toast.success('Sign In clicked - Authentication coming soon!');
  const handleSignUp = () => toast.success('Sign Up clicked - Authentication coming soon!');
  const handleSignOut = () => toast.success('Sign Out clicked - Authentication coming soon!');

  const NavLinks = () => (
    <ul className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
      {['/', '/explore', '/about', '/contact'].map(path => (
        <li key={path}>
          <Link
            to={path}
            className={`block text-lg md:text-base hover:text-indigo-300 transition-colors ${isActive(path)}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
          </Link>
        </li>
      ))}
    </ul>
  );

  const AuthButtons = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
      {isAuthenticated ? (
        <>
          <Link
            to="/profile"
            className="flex items-center space-x-1 hover:text-indigo-300 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <UserCircle className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <button
            onClick={() => {
              handleSignOut();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center space-x-1 hover:text-indigo-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              handleSignIn();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center space-x-1 hover:text-indigo-300 transition-colors w-full md:w-auto"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => {
              handleSignUp();
              setIsMobileMenuOpen(false);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-1 w-full md:w-auto justify-center"
          >
            <UserCircle className="w-5 h-5" />
            <span>Sign Up</span>
          </button>
        </>
      )}
      <Link
        to="/settings"
        className={`flex items-center space-x-1 hover:text-indigo-300 transition-colors ${isActive('/settings')} w-full md:w-auto`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Settings className="w-5 h-5" />
        <span className="md:sr-only">Settings</span>
      </Link>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900 text-white shadow-lg z-50">
      <nav className="container mx-auto px-4 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-semibold hover:text-indigo-300 transition-colors">
            <GlassWater className="w-6 h-6" />
            <span>SpiritSage</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLinks />
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <Dialog.Trigger asChild>
              <button className="block md:hidden p-2 bg-slate-800 hover:bg-slate-700 rounded-lg">
                <Menu className="w-6 h-6" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
              <Dialog.Content
                className="fixed inset-y-0 right-0 w-[80vw] max-w-sm bg-slate-900 p-6 shadow-xl z-50 text-white overflow-y-auto"
                onInteractOutside={() => setIsMobileMenuOpen(false)}
              >
                <Dialog.Title className="sr-only">Mobile navigation menu</Dialog.Title>

                <div className="flex flex-col min-h-full">
                  {/* Header in Menu */}
                  <div className="flex items-center justify-between mb-8">
                    <Link
                      to="/"
                      className="flex items-center space-x-2 text-xl font-semibold hover:text-indigo-300 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <GlassWater className="w-6 h-6" />
                      <span>SpiritSage</span>
                    </Link>
                    <Dialog.Close className="p-2 hover:bg-slate-800 rounded-lg">
                      <X className="w-6 h-6" />
                    </Dialog.Close>
                  </div>

                  {/* Mobile Links */}
                  <div className="flex flex-col space-y-8">
                    <NavLinks />
                    <div className="pt-4 border-t border-slate-800">
                      <AuthButtons />
                    </div>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
};

export default HeaderNavigation;