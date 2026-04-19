
import React, { useState, useMemo } from 'react';
import { User, Project, ProjectStatus, Substation, NodeStatus } from '../types';
import { KNOWN_SUBSTATIONS } from '../constants';
import ProjectDetailView from './ProjectDetailView';

interface DeveloperDashboardProps {
  user: User;
  projects: Project[];
  onAddProject: (p: Project) => void;
  onUpdateStatus: (id: string, s: ProjectStatus, options?: any) => void;
  onAddMessage: (projectId: string, text: string) => void;
}

const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ user, projects, onAddProject, onUpdateStatus, onAddMessage }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId) || null
  , [projects, selectedProjectId]);

  const [formData, setFormData] = useState({
    city: '', 
    zip: '', 
    substationSearch: '', 
    selectedSubstationId: '', 
    customSubstationName: '', 
    power: '', 
    capacity: '', 
    start: '', 
    commission: '', 
    operator: '',
    // Maturity fields
    feasibility: '',
    technicalMaturity: '',
    financialCapacity: '',
    systemBenefit: '',
    hasUploadedDocs: false
  });

  const filteredSubstations = useMemo(() => {
    if (!formData.substationSearch || formData.substationSearch.length < 2) return [];
    return KNOWN_SUBSTATIONS.filter(s => 
      s.name.toLowerCase().includes(formData.substationSearch.toLowerCase()) ||
      s.zip.includes(formData.substationSearch)
    );
  }, [formData.substationSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subName = formData.selectedSubstationId === 'custom' 
      ? formData.customSubstationName 
      : KNOWN_SUBSTATIONS.find(s => s.id === formData.selectedSubstationId)?.name || formData.customSubstationName;

    const newProject: Project = {
      id: `BESS-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      developerId: user.id,
      developerName: user.organization,
      operatorName: formData.operator || 'Wird geprüft',
      zipCode: formData.zip,
      city: formData.city,
      substationName: subName,
      substationId: formData.selectedSubstationId === 'custom' ? undefined : formData.selectedSubstationId,
      powerMW: Number(formData.power),
      capacityMWh: Number(formData.capacity),
      submissionDate: new Date().toISOString().split('T')[0],
      plannedStart: formData.start,
      plannedCommissioning: formData.commission,
      status: ProjectStatus.SUBMITTED,
      messages: [],
      maturityInfo: {
        feasibility: formData.feasibility,
        technicalMaturity: formData.technicalMaturity,
        financialCapacity: formData.financialCapacity,
        systemBenefit: formData.systemBenefit,
        hasUploadedDocs: formData.hasUploadedDocs
      }
    };
    onAddProject(newProject);
    setIsFormOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ 
      city: '', 
      zip: '', 
      substationSearch: '', 
      selectedSubstationId: '', 
      customSubstationName: '', 
      power: '', 
      capacity: '', 
      start: '', 
      commission: '', 
      operator: '',
      feasibility: '',
      technicalMaturity: '',
      financialCapacity: '',
      systemBenefit: '',
      hasUploadedDocs: false
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Entwickler Dashboard</h1>
          <p className="text-slate-500 font-medium">Verwalten Sie Ihre Netzanschlussanfragen für <span className="text-emerald-600 font-bold">{user.organization}</span>.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all flex items-center gap-3 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
          Neuer Antrag
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Projekt ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NVP & Standort</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Techn. Daten</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clusterstudie</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic">
                  Noch keine Anträge eingereicht. Klicken Sie auf "Neuer Antrag", um zu starten.
                </td>
              </tr>
            ) : projects.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6 font-mono text-xs text-slate-500">{p.id}</td>
                <td className="px-8 py-6">
                  <div className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase italic">{p.substationName}</div>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                    {p.zipCode} {p.city}
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="text-sm font-bold text-slate-700">{p.powerMW} MW / {p.capacityMWh} MWh</div>
                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">IBN: {p.plannedCommissioning}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    {(p.clusterStudyResult || p.status === ProjectStatus.OFFER_SUBMITTED || p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.OFFER_ACCEPTED || p.status === ProjectStatus.OFFER_DECLINED || p.status === ProjectStatus.CONTRACT_NEGOTIATION) ? (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-tighter rounded-full border border-blue-100 flex items-center gap-1 w-fit">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Vorliegend
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-400 font-bold uppercase italic">Ausstehend</span>
                    )}
                    {p.isSuccessor && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-tighter rounded-full border border-amber-100 flex items-center gap-1 w-fit">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Nachrücker
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${
                    p.status === ProjectStatus.APPROVED ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                    p.status === ProjectStatus.REJECTED ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                    p.status === ProjectStatus.DOCS_MISSING ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    p.status === ProjectStatus.CONTRACT_NEGOTIATION ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                    'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => setSelectedProjectId(p.id)} className="text-slate-900 font-black text-xs uppercase tracking-widest hover:text-emerald-600 flex items-center gap-2">
                    Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col border border-slate-200">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Netzanschlussantrag</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Stellen Sie eine neue Anfrage für ein Batteriespeicherprojekt.</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors group">
                 <svg className="w-8 h-8 text-slate-400 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">
              {/* Sektion 1: Standort */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-4 h-px bg-emerald-600"></span>
                  Standort & Netzpunkt
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase ml-1">Ort</label>
                    <input required placeholder="z.B. Berlin" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase ml-1">PLZ</label>
                    <input required placeholder="10115" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})}/>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-600 uppercase ml-1">Netzverknüpfungspunkt (NVP)</label>
                  <div className="relative">
                    <input type="text" placeholder="Bestehenden NVP suchen..." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" value={formData.substationSearch} onChange={e => setFormData({...formData, substationSearch: e.target.value})}/>
                    {filteredSubstations.length > 0 && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl max-h-56 overflow-y-auto p-2">
                        {filteredSubstations.map(s => (
                          <button key={s.id} type="button" className="w-full text-left px-5 py-4 hover:bg-slate-50 rounded-2xl transition-colors flex justify-between items-center group" onClick={() => { setFormData({ ...formData, selectedSubstationId: s.id, substationSearch: s.name, operator: s.operator, zip: s.zip, city: s.city }); }}>
                            <div>
                               <p className="font-bold text-slate-900 group-hover:text-emerald-600">{s.name}</p>
                               <p className="text-[10px] text-slate-500 font-bold uppercase">{s.zip} {s.city}</p>
                            </div>
                            <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-black uppercase tracking-tighter border border-slate-200">{s.operator}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <input type="radio" id="sub-custom" name="sub-choice" className="w-5 h-5 accent-slate-900 cursor-pointer" checked={formData.selectedSubstationId === 'custom'} onChange={() => setFormData({...formData, selectedSubstationId: 'custom'})} />
                    <label htmlFor="sub-custom" className="text-sm font-bold text-slate-700 cursor-pointer">Neuer oder in Planung befindlicher NVP (Strategisch)</label>
                  </div>
                  {formData.selectedSubstationId === 'custom' && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <input required placeholder="Name des geplanten NVPs oder Beschreibung..." className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-slate-900 focus:ring-0 transition-all font-medium" value={formData.customSubstationName} onChange={e => setFormData({...formData, customSubstationName: e.target.value})} />
                    </div>
                  )}
                </div>
              </div>

              {/* Sektion 2: Technische Daten */}
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-4 h-px bg-emerald-600"></span>
                  Technische Spezifikationen
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase ml-1">Anschlussleistung</label>
                    <div className="relative">
                       <input required type="number" step="0.1" placeholder="z.B. 50" className="w-full px-6 py-4 pr-16 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-black text-lg" value={formData.power} onChange={e => setFormData({...formData, power: e.target.value})}/>
                       <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm uppercase">MW</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase ml-1">Speicherkapazität</label>
                    <div className="relative">
                       <input required type="number" step="0.1" placeholder="z.B. 100" className="w-full px-6 py-4 pr-16 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-black text-lg" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}/>
                       <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm uppercase">MWh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sektion 3: Zeitplan */}
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-4 h-px bg-emerald-600"></span>
                  Projekt-Zeitplan
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase ml-1">Geplanter Baubeginn</label>
                    <input required type="date" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase ml-1">Geplante Inbetriebnahme (IBN)</label>
                    <input required type="date" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" value={formData.commission} onChange={e => setFormData({...formData, commission: e.target.value})}/>
                  </div>
                </div>
              </div>

              {/* Sektion 4: Reifegradverfahren */}
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-4 h-px bg-emerald-600"></span>
                  Informationen zum Reifegradverfahren
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase ml-1">1. Projektumsetzbarkeit (Flächen- & Genehmigungssicherheit)</label>
                    <textarea required placeholder="Angaben zur Flächensicherung, B-Plan-Status, etc." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-medium h-24 resize-none" value={formData.feasibility} onChange={e => setFormData({...formData, feasibility: e.target.value})}/>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase ml-1">2. Technische Reife (Anlagen- & Anschlusskonzept)</label>
                    <textarea required placeholder="Details zum technischen Konzept, Speicherkonfiguration, etc." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-medium h-24 resize-none" value={formData.technicalMaturity} onChange={e => setFormData({...formData, technicalMaturity: e.target.value})}/>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase ml-1">3. Finanzielle & organisatorische Leistungsfähigkeit</label>
                    <textarea required placeholder="Angaben zur Finanzierungssicherheit und Erfahrung des Teams." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-medium h-24 resize-none" value={formData.financialCapacity} onChange={e => setFormData({...formData, financialCapacity: e.target.value})}/>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase ml-1">4. Netz- und Systemnutzen (z.B. Hybride Ansätze)</label>
                    <textarea required placeholder="Beschreibung des Systemnutzens, z.B. durch Kombination mit EE-Anlagen." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-medium h-24 resize-none" value={formData.systemBenefit} onChange={e => setFormData({...formData, systemBenefit: e.target.value})}/>
                  </div>

                  <div className="p-6 bg-emerald-50 rounded-3xl border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center gap-4 group hover:border-emerald-500 transition-all cursor-pointer" onClick={() => setFormData({...formData, hasUploadedDocs: true})}>
                    <div className={`p-3 rounded-full transition-colors ${formData.hasUploadedDocs ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-500'}`}>
                      {formData.hasUploadedDocs ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-emerald-900 uppercase tracking-tight">Nachweise hochladen</p>
                      <p className="text-xs text-emerald-600 font-medium">PDFs zu Flächensicherung, Finanzierung & Konzept</p>
                    </div>
                    {formData.hasUploadedDocs && <span className="text-[10px] font-black text-emerald-600 uppercase bg-white px-3 py-1 rounded-full border border-emerald-200">4 Dokumente bereit</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-10 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 px-8 py-5 rounded-2xl border-2 border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">Abbrechen</button>
                <button type="submit" className="flex-1 px-8 py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-xl transition-all shadow-slate-900/10 active:scale-95">Antrag verbindlich einreichen</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (
        <ProjectDetailView 
          project={selectedProject} 
          user={user} 
          onClose={() => setSelectedProjectId(null)} 
          onAddMessage={onAddMessage}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </div>
  );
};

export default DeveloperDashboard;
