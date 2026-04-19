import React, { useState } from 'react';
import { Project, ProjectStatus, User, UserRole, ContractType } from '../types';

interface ProjectDetailViewProps {
  project: Project;
  user: User;
  onClose: () => void;
  onUpdateStatus?: (id: string, s: ProjectStatus, options?: { 
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

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, user, onClose, onUpdateStatus, onAddMessage }) => {
  const [message, setMessage] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Offer/Contract states
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [clusterResult, setClusterResult] = useState(project.clusterStudyResult || '');
  const [isSuccessor, setIsSuccessor] = useState(project.isSuccessor || false);
  const [selectedContractType, setSelectedContractType] = useState<ContractType>(project.contractType || ContractType.NAV);
  const [contractContent, setContractContent] = useState(project.contractContent || '');
  
  // FCA states (legacy but still used for logic)
  const [staticLimitMW, setStaticLimitMW] = useState<number>(project.powerMW);
  const [dynamicConstraints, setDynamicConstraints] = useState('');

  const handleStatusChange = (status: ProjectStatus) => {
    if (status === ProjectStatus.REJECTED) {
      setShowRejectForm(true);
    } else if (status === ProjectStatus.OFFER_SUBMITTED) {
      setShowOfferForm(true);
    } else {
      onUpdateStatus?.(project.id, status);
    }
  };

  const confirmRejection = () => {
    onUpdateStatus?.(project.id, ProjectStatus.REJECTED, { reason: rejectionReason });
    setShowRejectForm(false);
  };

  const confirmOffer = () => {
    onUpdateStatus?.(project.id, ProjectStatus.OFFER_SUBMITTED, { 
      clusterStudyResult: clusterResult,
      isSuccessor,
      contractType: selectedContractType,
      contractContent: contractContent || `Standard-Vertragstext für ${selectedContractType}...`,
      isFCA: selectedContractType === ContractType.FCA,
      staticLimitMW: selectedContractType === ContractType.FCA ? staticLimitMW : undefined,
      dynamicConstraints: selectedContractType === ContractType.FCA ? dynamicConstraints : undefined
    });
    setShowOfferForm(false);
  };

  const handleOfferResponse = (accepted: boolean) => {
    onUpdateStatus?.(project.id, accepted ? ProjectStatus.OFFER_ACCEPTED : ProjectStatus.OFFER_DECLINED);
  };

  const saveContractChanges = () => {
    onUpdateStatus?.(project.id, project.status, { contractContent });
    onAddMessage(project.id, "Vertragsentwurf wurde aktualisiert.");
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    onAddMessage(project.id, message);
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-xl font-bold">P</div>
             <div>
                <h2 className="text-2xl font-bold text-slate-900">{project.id}</h2>
                <p className="text-slate-500 font-medium">{project.city} — {project.substationName}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Details Section */}
          <div className="lg:col-span-8 p-8 space-y-8 border-r border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Entwickler</h4>
                <p className="text-slate-900 font-semibold">{project.developerName}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Netzbetreiber</h4>
                <p className="text-slate-900 font-semibold">{project.operatorName}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Antragseingang</h4>
                <p className="text-slate-900 font-semibold">{project.submissionDate}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Leistung</h4>
                <p className="text-slate-900 font-semibold text-xl">{project.powerMW} MW</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Kapazität</h4>
                <p className="text-slate-900 font-semibold text-xl">{project.capacityMWh} MWh</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</h4>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                  project.status === ProjectStatus.OFFER_SUBMITTED ? 'bg-amber-100 text-amber-700' : 
                  project.status === ProjectStatus.OFFER_ACCEPTED ? 'bg-emerald-100 text-emerald-700' :
                  project.status === ProjectStatus.OFFER_DECLINED ? 'bg-rose-100 text-rose-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            {/* Cluster Study Section */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">Ergebnis Clusterstudie</h3>
                {(project.isSuccessor || project.status === ProjectStatus.CONTRACT_NEGOTIATION) && (
                  <div className="flex gap-2">
                    {project.status === ProjectStatus.CONTRACT_NEGOTIATION && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-200">
                        Prüfung abgeschlossen
                      </span>
                    )}
                    {project.isSuccessor && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200">
                        Nachrücker-Option
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <div>
                    {(project.clusterStudyResult || project.status === ProjectStatus.OFFER_SUBMITTED || project.status === ProjectStatus.APPROVED || project.status === ProjectStatus.OFFER_ACCEPTED || project.status === ProjectStatus.OFFER_DECLINED || project.status === ProjectStatus.CONTRACT_NEGOTIATION) ? (
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">
                        {project.clusterStudyResult || 'Die Clusterstudie ist abgeschlossen und das Ergebnis liegt vor.'}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">Noch kein Ergebnis der Clusterstudie verfügbar. Die Prüfung erfolgt nach Einreichung aller Unterlagen.</p>
                    )}
                  </div>
                </div>

                {project.isSuccessor && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Nachrücker-Status: Dieses Projekt ist als Nachrücker klassifiziert.
                  </div>
                )}
              </div>
            </div>

            {/* Vertragskonstrukt Section */}
            {(project.status === ProjectStatus.CONTRACT_NEGOTIATION || project.status === ProjectStatus.OFFER_ACCEPTED) && (
              <div className="space-y-6 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">Vertragskonstrukt</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200">
                    Entwurfsphase
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktueller Entwurf</h4>
                      <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Download PDF</button>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">Netzanschlussvertrag_V3_Draft.pdf</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">Letzte Änderung: Vor 2 Stunden</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neuen Entwurf hochladen</h4>
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-emerald-500 transition-colors cursor-pointer group">
                      <div className="p-3 bg-slate-800 text-slate-400 rounded-full group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-widest">Datei auswählen</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-1">PDF, DOCX (Max. 10MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Developer Action: Accept/Decline Offer */}
            {user.role === UserRole.DEVELOPER && (
              <>
                {project.status === ProjectStatus.OFFER_SUBMITTED && (
                  <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-6 shadow-2xl">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase italic tracking-tight">Angebot prüfen</h3>
                      <p className="text-slate-400 text-sm font-medium">Bitte prüfen Sie das vorliegende Angebot und den Vertragsentwurf. Sie können das Angebot annehmen oder ablehnen.</p>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleOfferResponse(true)}
                        className="flex-1 bg-emerald-500 text-slate-900 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95"
                      >
                        Angebot annehmen
                      </button>
                      <button 
                        onClick={() => handleOfferResponse(false)}
                        className="flex-1 bg-slate-800 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-slate-700 hover:bg-rose-600 transition-all active:scale-95"
                      >
                        Angebot ablehnen
                      </button>
                    </div>
                  </div>
                )}
                {(project.status === ProjectStatus.OFFER_ACCEPTED || project.status === ProjectStatus.OFFER_DECLINED) && (
                  <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-900 font-bold">Entscheidung übermittelt</p>
                      <p className="text-xs text-slate-500 font-medium">Sie haben das Angebot bereits {project.status === ProjectStatus.OFFER_ACCEPTED ? 'angenommen' : 'abgelehnt'}.</p>
                    </div>
                    <button 
                      onClick={() => onUpdateStatus?.(project.id, ProjectStatus.OFFER_SUBMITTED)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                    >
                      Entscheidung ändern
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Contract Section (Legacy/Text-based) */}
            {(project.contractType || user.role === UserRole.OPERATOR) && project.status !== ProjectStatus.CONTRACT_NEGOTIATION && (
              <div className="space-y-6 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">Vertrag</h3>
                  {project.contractType && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-200">
                      {project.contractType}
                    </span>
                  )}
                </div>

                {project.status === ProjectStatus.OFFER_SUBMITTED || project.status === ProjectStatus.OFFER_ACCEPTED || user.role === UserRole.OPERATOR ? (
                  <div className="space-y-4">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vertragsentwurf bearbeiten / einsehen</h4>
                        {user.role === UserRole.OPERATOR && (
                          <button onClick={saveContractChanges} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Änderungen speichern</button>
                        )}
                      </div>
                      <textarea 
                        className={`w-full bg-white border border-slate-200 rounded-xl p-5 h-64 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none ${user.role !== UserRole.OPERATOR ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                        value={contractContent}
                        onChange={(e) => setContractContent(e.target.value)}
                        readOnly={user.role !== UserRole.OPERATOR}
                        placeholder="Vertragstext hier eingeben..."
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Der Vertragsentwurf wird nach der technischen Prüfung erstellt.</p>
                )}
              </div>
            )}

            {/* FCA Info Display (if applicable) */}
            {project.isFCA && (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl space-y-3">
                <h4 className="text-amber-800 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Flexible Netzanschlusszusage (FCA)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-amber-600 font-bold uppercase">Statische Begrenzung</p>
                    <p className="text-lg font-black text-slate-900">{project.staticLimitMW} MW</p>
                  </div>
                  {project.dynamicConstraints && (
                    <div>
                      <p className="text-[10px] text-amber-600 font-bold uppercase">Dynamische Vorgaben</p>
                      <p className="text-sm text-slate-700 font-medium">{project.dynamicConstraints}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {project.status === ProjectStatus.REJECTED && project.rejectionReason && (
              <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
                <h4 className="text-red-800 font-bold flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                  Ablehnungsbegründung
                </h4>
                <p className="text-red-700">{project.rejectionReason}</p>
              </div>
            )}

            {/* Maturity Info Section */}
            {project.maturityInfo && (
              <div className="space-y-6 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">Reifegrad-Bewertung</h3>
                  {project.maturityInfo.hasUploadedDocs && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200">
                      Dokumente validiert
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">1. Projektumsetzbarkeit</h4>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{project.maturityInfo.feasibility}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">2. Technische Reife</h4>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{project.maturityInfo.technicalMaturity}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">3. Leistungsfähigkeit</h4>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{project.maturityInfo.financialCapacity}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">4. Netz- & Systemnutzen</h4>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{project.maturityInfo.systemBenefit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Section */}
            <div className="space-y-4 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Dokumente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between group hover:border-emerald-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-500 rounded group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Netzanschlussbegehren.pdf</p>
                      <p className="text-xs text-slate-400">1.2 MB — 15.01.2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operator Controls */}
            {user.role === UserRole.OPERATOR && onUpdateStatus && (
              <div className="p-6 bg-slate-900 rounded-2xl space-y-4">
                <h3 className="text-white font-bold">Status-Verwaltung</h3>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleStatusChange(ProjectStatus.IN_REVIEW)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">In Prüfung</button>
                  <button onClick={() => handleStatusChange(ProjectStatus.DOCS_MISSING)} className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-bold hover:bg-slate-600 transition-all">Unterlagen nachfordern</button>
                  <button onClick={() => handleStatusChange(ProjectStatus.OFFER_SUBMITTED)} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 transition-all">Angebot übermitteln</button>
                  <button onClick={() => handleStatusChange(ProjectStatus.APPROVED)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all">Final Genehmigen</button>
                  <button onClick={() => handleStatusChange(ProjectStatus.REJECTED)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-all">Ablehnen</button>
                </div>
              </div>
            )}
          </div>

          {/* Messenger Section */}
          <div className="lg:col-span-4 bg-slate-50 flex flex-col h-full border-l border-slate-100">
            <div className="p-4 border-b border-slate-200 bg-white">
               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                 <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                 Kommunikation
               </h3>
            </div>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {project.messages.length === 0 && (
                <div className="text-center py-12">
                   <p className="text-sm text-slate-400">Keine Nachrichten vorhanden.</p>
                </div>
              )}
              {project.messages.map(m => (
                <div key={m.id} className={`flex flex-col ${m.senderId === user.id ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.senderId === user.id ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                    {m.senderName} • {m.timestamp}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="relative">
                <textarea 
                  className="w-full border border-slate-200 rounded-xl p-3 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-20"
                  placeholder="Nachricht schreiben..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                  onClick={sendMessage}
                  className="absolute bottom-3 right-3 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer / Contract Form */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-slate-900/80 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-slate-50 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Angebot erstellen</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Übermitteln Sie das Ergebnis der Clusterstudie und den Vertragsentwurf.</p>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Vertragstyp</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(ContractType).map(type => (
                    <button 
                      key={type}
                      onClick={() => setSelectedContractType(type)}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${selectedContractType === type ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-white text-slate-400'}`}
                    >
                      <span className="text-xs font-black uppercase">{type}</span>
                      {selectedContractType === type && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Ergebnis Clusterstudie</label>
                <textarea 
                  className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-sm h-24 resize-none"
                  placeholder="Zusammenfassung der Clusterstudie..."
                  value={clusterResult}
                  onChange={e => setClusterResult(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <input 
                  type="checkbox" 
                  id="successor" 
                  className="w-5 h-5 accent-amber-600 cursor-pointer"
                  checked={isSuccessor}
                  onChange={e => setIsSuccessor(e.target.checked)}
                />
                <label htmlFor="successor" className="text-xs font-bold text-amber-800 cursor-pointer uppercase">Als Nachrücker-Option markieren</label>
              </div>

              {selectedContractType === ContractType.FCA && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase">Statische Leistungsbegrenzung</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        className="w-full px-5 py-4 bg-white rounded-xl border-none focus:ring-2 focus:ring-amber-500 font-black"
                        value={staticLimitMW}
                        onChange={e => setStaticLimitMW(Number(e.target.value))}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">MW</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowOfferForm(false)} className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Abbrechen</button>
                <button 
                  onClick={confirmOffer} 
                  className="flex-1 px-6 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all active:scale-95"
                >
                  Angebot senden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectForm && (
        <div className="fixed inset-0 bg-slate-900/80 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 uppercase italic mb-4">Projekt ablehnen</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">Bitte geben Sie eine detaillierte Begründung an, um dem Entwickler alternative Planungen zu ermöglichen.</p>
            <textarea 
              className="w-full border-none bg-slate-50 rounded-2xl p-5 h-40 mb-6 focus:ring-2 focus:ring-red-500 outline-none font-medium text-sm resize-none"
              placeholder="Gründe für die Ablehnung (z.B. Netzkapazität am NVP erschöpft)..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowRejectForm(false)} className="flex-1 px-6 py-4 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase text-slate-400">Abbrechen</button>
              <button onClick={confirmRejection} className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-red-600/20">Ablehnen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailView;
