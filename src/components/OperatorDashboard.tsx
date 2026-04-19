
import React, { useState } from 'react';
import { User, Project, ProjectStatus, ContractType } from '../types';
import ProjectDetailView from './ProjectDetailView';

interface OperatorDashboardProps {
  user: User;
  projects: Project[];
  onUpdateStatus: (id: string, s: ProjectStatus, options?: { 
    reason?: string, 
    isFCA?: boolean, 
    staticLimitMW?: number, 
    dynamicConstraints?: string,
    clusterStudyResult?: string,
    isSuccessor?: boolean,
    contractType?: ContractType,
    contractContent?: string
  }) => void;
  onAddMessage: (projectId: string, text: string) => void;
}

const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ user, projects, onUpdateStatus, onAddMessage }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Netzbetreiber Dashboard</h1>
        <p className="text-slate-500">Eingegangene Anschlussanfragen für das Netzgebiet von {user.organization}.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Eingang</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Projekt / Entwickler</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Umspannwerk</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Leistung</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Clusterstudie</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600">{p.submissionDate}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{p.id}</div>
                  <div className="text-xs text-slate-500">{p.developerName}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{p.substationName}</td>
                <td className="px-6 py-4 text-sm text-slate-600 font-semibold">{p.powerMW} MW</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {(p.clusterStudyResult || p.status === ProjectStatus.OFFER_SUBMITTED || p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.OFFER_ACCEPTED || p.status === ProjectStatus.OFFER_DECLINED || p.status === ProjectStatus.CONTRACT_NEGOTIATION) ? (
                      <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Vorliegend
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold italic">Ausstehend</span>
                    )}
                    {p.isSuccessor && (
                      <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Nachrücker
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                    p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FCA_OFFERED ? 'bg-emerald-100 text-emerald-700' :
                    p.status === ProjectStatus.REJECTED ? 'bg-red-100 text-red-700' :
                    p.status === ProjectStatus.CONTRACT_NEGOTIATION ? 'bg-indigo-100 text-indigo-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setSelectedProjectId(p.id)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Bearbeiten
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <ProjectDetailView 
          project={selectedProject} 
          user={user}
          onClose={() => setSelectedProjectId(null)} 
          onUpdateStatus={onUpdateStatus}
          onAddMessage={onAddMessage}
        />
      )}
    </div>
  );
};

export default OperatorDashboard;
