
import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogout }) => {
  const handleLoginClick = () => {
    // Scroll to top immediately so the dashboard is visible after login
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onLoginClick();
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
          <span className="text-xl font-bold tracking-tight text-slate-900">BESS Grid Connect</span>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                <span className="text-xs text-slate-500">{user.role} | {user.organization}</span>
              </div>
              <button 
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Abmelden
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLoginClick}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-all"
            >
              Anmelden
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
