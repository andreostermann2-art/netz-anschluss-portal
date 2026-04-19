
import React from 'react';
import { MOCK_USERS } from '../constants';
import { User } from '../types';

interface LoginProps {
  onClose: () => void;
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onLogin }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
           <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">B</div>
           <h2 className="text-2xl font-bold text-slate-900">Willkommen zurück</h2>
           <p className="text-slate-500">Wählen Sie einen Demo-Account zum Testen</p>
        </div>
        
        <div className="p-8 space-y-4">
          {MOCK_USERS.map(u => (
            <button 
              key={u.id}
              onClick={() => onLogin(u)}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="text-left">
                <p className="font-bold text-slate-900">{u.name}</p>
                <p className="text-xs text-slate-500">{u.organization} — {u.role}</p>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </div>
            </button>
          ))}
          
          <button onClick={onClose} className="w-full py-3 text-slate-500 font-semibold hover:text-slate-900 transition-colors">
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
