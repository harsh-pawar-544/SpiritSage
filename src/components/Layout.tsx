import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { GlassWater } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GlassWater className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-semibold text-gray-900">SpiritSage</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}