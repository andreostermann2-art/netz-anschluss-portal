
import React, { useState } from 'react';
import { User, UserRole, Project, ProjectStatus, ContractType } from './types';
import { MOCK_USERS, MOCK_PROJECTS } from './constants';
import Navbar from './components/Navbar';
import PublicMap from './components/PublicMap';
import DeveloperDashboard from './components/DeveloperDashboard';
import OperatorDashboard from './components/OperatorDashboard';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogin = (u: User) => {
    setUser(u);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const updateProjectStatus = (projectId: string, newStatus: ProjectStatus, options?: { 
    reason?: string, 
    isFCA?: boolean, 
    staticLimitMW?: number, 
    dynamicConstraints?: string,
    clusterStudyResult?: string,
    isSuccessor?: boolean,
    contractType?: ContractType,
    contractContent?: string
  }) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { 
        ...p, 
        status: newStatus, 
        rejectionReason: options?.reason,
        isFCA: options?.isFCA,
        staticLimitMW: options?.staticLimitMW,
        dynamicConstraints: options?.dynamicConstraints,
        clusterStudyResult: options?.clusterStudyResult,
        isSuccessor: options?.isSuccessor,
        contractType: options?.contractType,
        contractContent: options?.contractContent
      } : p
    ));
  };

  const addNewProject = (newProj: Project) => {
    setProjects(prev => [...prev, newProj]);
  };

  const addMessage = (projectId: string, text: string) => {
    if (!user) return;
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: user.name,
      text,
      timestamp: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, messages: [...p.messages, newMessage] } : p
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar 
        user={user} 
        onLoginClick={() => setIsLoginOpen(true)} 
        onLogout={handleLogout} 
      />

      <main className="flex-grow">
        {!user && (
          <div className="space-y-0">
            {/* Hero Section */}
            <header className="relative pt-28 pb-36 overflow-hidden bg-slate-900 text-white">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none opacity-50"></div>

              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto text-center space-y-12">
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                    Digitaler Standard für BESS-Anschlüsse
                  </div>
                  
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
                    Vom Datenvakuum zum Netzanschluss.
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-4xl mx-auto italic">
                    "Ihr Ziel ist die formelle Netzanschlusszusage. Wir etablieren einen standardisierten Prozess, um Vertragswerke mit Netzbetreibern transparent, zielführend und rechtssicher auszuhandeln."
                  </p>

                  <div className="relative mt-20 flex justify-between items-end px-4 md:px-20 min-h-[300px]">
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-32 pointer-events-none">
                       <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="grad-left" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="transparent" />
                              <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                            <linearGradient id="grad-right" x1="100%" y1="0%" x2="0%" y2="0%">
                              <stop offset="0%" stopColor="transparent" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                          </defs>
                          {/* The bridge base */}
                          <path d="M0,100 L1000,100 L950,80 L50,80 Z" fill="#1e293b" />
                          {/* The main arch */}
                          <path d="M50,80 Q500,-20 950,80" fill="none" stroke="#334155" strokeWidth="8" />
                          
                          {/* Energy Flow Left to Middle (Emerald) */}
                          <path 
                            d="M50,80 Q275,30 500,30" 
                            fill="none" 
                            stroke="url(#grad-left)" 
                            strokeWidth="4" 
                            strokeDasharray="20,30" 
                            className="animate-[energy-flow_3s_linear_infinite,energy-pulse_2s_ease-in-out_infinite]" 
                          />
                          {/* Energy Flow Right to Middle (Blue) */}
                          <path 
                            d="M950,80 Q725,30 500,30" 
                            fill="none" 
                            stroke="url(#grad-right)" 
                            strokeWidth="4" 
                            strokeDasharray="20,30" 
                            className="animate-[energy-flow_3s_linear_infinite,energy-pulse_2s_ease-in-out_infinite]" 
                          />
                          
                          {/* Pulsating Center Point */}
                          <circle cx="500" cy="30" r="8" fill="#10b981" className="animate-pulse shadow-[0_0_20px_#10b981]" />
                          <circle cx="500" cy="30" r="12" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping opacity-20" />
                       </svg>
                    </div>

                    <div className="flex flex-col items-center gap-4 z-20">
                      <div className="relative w-24 h-40 bg-slate-800 rounded-xl border-4 border-slate-700 shadow-2xl flex flex-col p-2 group transition-all hover:border-emerald-500 hover:-translate-y-2">
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-700 rounded-t-md"></div>
                         <div className="flex-1 flex flex-col-reverse gap-1.5">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className={`h-1/6 w-full rounded-sm transition-all duration-700 ${i < 4 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-700'}`}></div>
                            ))}
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-slate-900/50 px-3 py-1 rounded-full border border-emerald-500/20">Projektentwickler</span>
                    </div>

                    <div className="z-30 flex flex-col items-center -mb-8">
                       <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-4 border-slate-800 group hover:scale-110 transition-transform cursor-pointer">
                          <svg className="w-14 h-14 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                          </svg>
                       </div>
                       <span className="mt-4 text-[11px] font-black text-white bg-emerald-600 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 text-center">Netzanschlusszusage</span>
                    </div>

                    <div className="flex flex-col items-center gap-4 z-20">
                      <div className="relative p-6 bg-slate-800 rounded-3xl border-4 border-slate-700 shadow-2xl transition-all hover:border-blue-500 hover:-translate-y-2 group">
                         <svg className="w-20 h-24 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                         </svg>
                      </div>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] bg-slate-900/50 px-3 py-1 rounded-full border border-blue-500/20">Netzbetreiber</span>
                    </div>
                  </div>

                  <div className="pt-12">
                     <button 
                       onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
                       className="bg-emerald-500 text-slate-900 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-emerald-500/40 active:scale-95 flex items-center gap-3 mx-auto"
                     >
                       Standard-Prozess starten
                     </button>
                  </div>
                </div>
              </div>

              <style>{`
                @keyframes energy-flow {
                  0% { stroke-dashoffset: 200; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes energy-pulse {
                  0%, 100% { stroke-opacity: 0.4; stroke-width: 3; }
                  50% { stroke-opacity: 1; stroke-width: 6; }
                }
              `}</style>
            </header>

            <section className="py-32 bg-white">
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Der BESS Grid Connect Standard</span>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tight italic">Zielführende Verhandlungen durch Transparenz</h2>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed">
                    Schluss mit intransparenten E-Mail-Ketten. Wir digitalisieren den Dialog zwischen Projektentwickler und Netzbetreiber für rechtssichere Vertragswerke und schnellere Zusagen.
                  </p>
                </div>

                  <div className="grid md:grid-cols-3 gap-12">
                  <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 italic mb-4 uppercase leading-none">Reifegradverfahren</h3>
                    <div className="space-y-3 text-slate-500 font-medium text-sm">
                      <p className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                        Teilnahme am Reifegradverfahren inkl. Antragspauschale
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                        Reifegradbasierte Clusterstudie der Netzbetreiber
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                        Angebotslegung & Realisierungskaution
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                        Vertragsgestaltung (NAV/AEV oder FCA)
                      </p>
                    </div>
                  </div>
                  <div className="p-10 rounded-[3rem] bg-slate-900 text-white border border-slate-800 hover:shadow-2xl transition-all">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-sm mb-8">
                      <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <h3 className="text-2xl font-black italic mb-4 uppercase leading-none">Netzanschlusszusage</h3>
                    <p className="text-slate-400 font-medium leading-relaxed">Das Ziel: Ein rechtssicheres Vertragswerk auf Knopfdruck, validiert von beiden Parteien nach erfolgreicher Angebotsannahme.</p>
                  </div>
                  <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 italic mb-4 uppercase leading-none">FCA als Hebel</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">Wo das Netz eng wird, ermöglicht die Flexible Vereinbarung (FCA) eine Zusage trotz Restriktionen.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="map-section" className="container mx-auto px-4 py-24 border-t border-slate-100">
              <div className="mb-16 text-center space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Grid Analytics 2024</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tight italic">Kapazitäten & NVP-Eignung</h2>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
                  Finden Sie den optimalen Netzverknüpfungspunkt für Ihre BESS-Anschlusszusage.
                </p>
              </div>
              <PublicMap />
            </section>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          {user?.role === UserRole.DEVELOPER && (
            <DeveloperDashboard 
              user={user} 
              projects={projects.filter(p => p.developerId === user.id)} 
              onAddProject={addNewProject}
              onUpdateStatus={updateProjectStatus}
              onAddMessage={addMessage}
            />
          )}

          {user?.role === UserRole.OPERATOR && (
            <OperatorDashboard 
              user={user} 
              projects={projects.filter(p => p.operatorName === user.organization)} 
              onUpdateStatus={updateProjectStatus}
              onAddMessage={addMessage}
            />
          )}

          {user?.role === UserRole.ADMIN && (
            <AdminDashboard users={MOCK_USERS} />
          )}
        </div>
      </main>

      {isLoginOpen && (
        <Login 
          onClose={() => setIsLoginOpen(false)} 
          onLogin={handleLogin} 
        />
      )}

      <footer className="bg-slate-900 text-slate-500 py-24 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 border-b border-slate-800 pb-20 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl">B</div>
                <span className="text-3xl font-black tracking-tighter text-white uppercase italic">Grid Connect</span>
              </div>
              <p className="max-w-md text-slate-400 text-lg leading-relaxed font-medium">
                Standardisierte Plattform für rechtssichere Netzanschlusszusagen und Flexible Netzanschlussvereinbarungen (FCA).
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase text-xs tracking-[0.3em]">Services</h4>
              <nav className="flex flex-col gap-4 text-sm font-bold">
                <a href="#" className="hover:text-emerald-400 transition-colors uppercase tracking-widest">NVP Monitoring</a>
                <a href="#" className="hover:text-emerald-400 transition-colors uppercase tracking-widest">Vertrags-Standard</a>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase text-xs tracking-[0.3em]">Rechtliches</h4>
              <nav className="flex flex-col gap-4 text-sm font-bold">
                <a href="#" className="hover:text-emerald-400 transition-colors uppercase tracking-widest">Impressum</a>
                <a href="#" className="hover:text-emerald-400 transition-colors uppercase tracking-widest">Datenschutz</a>
              </nav>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em]">
            <span>&copy; {new Date().getFullYear()} BESS Grid Connect Germany.</span>
            <div className="flex gap-12">
              <span className="text-emerald-500 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                 Systemstatus: Online
              </span>
              <span className="text-slate-600">V 3.3.0-Standard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
