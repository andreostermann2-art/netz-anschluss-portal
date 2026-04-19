
import React from 'react';
import { User } from '../types';

interface AdminDashboardProps {
  users: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin-Verwaltung</h1>
        <p className="text-slate-500">Systemweite Nutzer- und Rollenkonfiguration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Aktive Nutzer</h3>
           <p className="text-4xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Ausstehende Validierungen</h3>
           <p className="text-4xl font-bold text-emerald-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Systemstatus</h3>
           <p className="text-4xl font-bold text-blue-600">Online</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
           <h2 className="font-bold text-lg">Nutzerliste</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Organisation</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Rolle</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{u.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{u.organization}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 text-sm font-bold hover:underline">Rechte bearbeiten</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
