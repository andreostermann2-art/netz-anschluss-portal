
import React, { useState, useMemo } from 'react';
import { MOCK_REGION_STATS } from '../constants';
import { RegionStats, NodeStatus, TSO, GridLevel } from '../types';

const TSO_INFO = {
  [TSO.FIFTY_HERTZ]: { color: '#fee2e2', hover: '#fecaca', border: '#ef4444', name: '50Hertz' },
  [TSO.TENNET]: { color: '#dbeafe', hover: '#bfdbfe', border: '#3b82f6', name: 'TenneT' },
  [TSO.AMPRION]: { color: '#fef3c7', hover: '#fde68a', border: '#f59e0b', name: 'Amprion' },
  [TSO.TRANSNET_BW]: { color: '#dcfce7', hover: '#bbf7d0', border: '#10b981', name: 'TransnetBW' },
};

const MAJOR_CITIES = [
  { name: 'Berlin', x: 500, y: 250 },
  { name: 'Hamburg', x: 300, y: 160 },
  { name: 'München', x: 420, y: 750 },
  { name: 'Köln', x: 100, y: 400 },
  { name: 'Frankfurt', x: 230, y: 490 },
  { name: 'Stuttgart', x: 230, y: 650 },
  { name: 'Leipzig', x: 440, y: 380 },
];

const PublicMap: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionStats | null>(null);
  const [activeTSO, setActiveTSO] = useState<TSO | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const filteredRegions = useMemo(() => {
    return MOCK_REGION_STATS.filter(r => {
      const matchesSearch = r.zip.includes(searchTerm) || 
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.substationName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTSO = !activeTSO || r.tso === activeTSO;
      return matchesSearch && matchesTSO;
    });
  }, [searchTerm, activeTSO]);

  const getNodeColor = (region: RegionStats) => {
    if (region.nodeStatus === NodeStatus.EXISTING) return 'fill-white';
    if (region.nodeStatus === NodeStatus.UPGRADE_REQUIRED) return 'fill-rose-300';
    if (region.nodeStatus === NodeStatus.PLANNED) {
      return region.gridLevel === GridLevel.TSO ? 'fill-amber-300' : 'fill-cyan-300';
    }
    return 'fill-slate-300';
  };

  const getStatusLabel = (region: RegionStats) => {
    if (region.nodeStatus === NodeStatus.EXISTING) return 'Günstige Anschlusssituation';
    if (region.nodeStatus === NodeStatus.UPGRADE_REQUIRED) return 'Netzausbau erforderlich (Flaschenhals)';
    if (region.nodeStatus === NodeStatus.PLANNED) {
      return `Geplant auf ${region.gridLevel === GridLevel.TSO ? 'Übertragungsnetzebene' : 'Verteilnetzebene'}`;
    }
    return 'Unbekannt';
  };

  const getTSOZoneStyles = (tso: TSO) => {
    const isActive = !activeTSO || activeTSO === tso;
    return {
      fill: isActive ? TSO_INFO[tso].color : '#f8fafc',
      stroke: TSO_INFO[tso].border,
      opacity: isActive ? 1 : 0.3
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Search & Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <label className="block text-sm font-bold text-slate-700 mb-2">Netzverknüpfungspunkt (NVP) finden</label>
          <div className="relative mb-4">
            <input 
              type="text"
              placeholder="PLZ, Ort oder NVP Name..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter nach Übertragungsnetzbetreiber</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(TSO).map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTSO(activeTSO === t ? null : t)}
                  className={`text-[10px] font-bold py-2.5 px-3 rounded-xl border transition-all ${
                    activeTSO === t 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
             <span className="text-xs font-bold text-slate-500">{filteredRegions.length} NVPs visualisiert</span>
          </div>
          <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100">
            {filteredRegions.map(region => (
              <button 
                key={region.substationName}
                onClick={() => setSelectedRegion(region)}
                className={`w-full text-left p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group ${selectedRegion?.substationName === region.substationName ? 'bg-slate-50 ring-2 ring-inset ring-slate-900' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">{region.substationName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{region.city}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-600 border border-slate-200 uppercase tracking-tighter">{region.tso}</span>
                    <span className={`text-[9px] font-bold uppercase ${
                      region.nodeStatus === NodeStatus.EXISTING ? 'text-emerald-600' : 
                      region.nodeStatus === NodeStatus.PLANNED ? 'text-blue-600' : 'text-rose-600'
                    }`}>
                      {region.nodeStatus === NodeStatus.PLANNED ? `Planung (${region.gridLevel === GridLevel.TSO ? 'ÜNB' : 'VNB'})` : region.nodeStatus}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-2">
                   <p className="text-sm font-bold text-slate-900">{region.requestCount}</p>
                   <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Pipeline</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 min-h-[750px] flex flex-col relative overflow-hidden">
          <div className="absolute top-10 left-10 z-10 space-y-2">
             <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">NVP-Anschlusssituation</h3>
             <p className="text-sm text-slate-500 font-medium max-w-sm italic">"Klicken Sie auf einen Punkt, um Details zur Kapazität und Realisierungswahrscheinlichkeit zu sehen."</p>
          </div>

          <div className="flex-1 flex items-center justify-center pt-20">
            <svg viewBox="0 0 600 850" className="w-full h-full max-w-xl">
              <g className="germany-outline">
                {/* TSO Zones */}
                <path d="M300,50 L450,40 L550,60 L580,250 L540,480 L420,480 L360,350 L380,220 L320,180 Z" {...getTSOZoneStyles(TSO.FIFTY_HERTZ)} className="cursor-pointer transition-colors duration-200" onClick={() => setActiveTSO(activeTSO === TSO.FIFTY_HERTZ ? null : TSO.FIFTY_HERTZ)} />
                <path d="M180,60 L300,50 L320,180 L380,220 L360,350 L420,480 L540,480 L510,780 L320,810 L240,600 L280,450 L240,300 L180,200 Z" {...getTSOZoneStyles(TSO.TENNET)} className="cursor-pointer transition-colors duration-200" onClick={() => setActiveTSO(activeTSO === TSO.TENNET ? null : TSO.TENNET)} />
                <path d="M40,250 L180,200 L240,300 L280,450 L240,600 L160,550 L100,550 L30,400 Z" {...getTSOZoneStyles(TSO.AMPRION)} className="cursor-pointer transition-colors duration-200" onClick={() => setActiveTSO(activeTSO === TSO.AMPRION ? null : TSO.AMPRION)} />
                <path d="M160,550 L240,600 L320,810 L140,810 L80,750 L100,550 Z" {...getTSOZoneStyles(TSO.TRANSNET_BW)} className="cursor-pointer transition-colors duration-200" onClick={() => setActiveTSO(activeTSO === TSO.TRANSNET_BW ? null : TSO.TRANSNET_BW)} />

                {/* Cities */}
                {MAJOR_CITIES.map(city => (
                  <g key={city.name} className="pointer-events-none opacity-20">
                    <circle cx={city.x} cy={city.y} r="2.5" fill="#64748b" />
                    <text x={city.x + 6} y={city.y + 3} className="text-[10px] font-bold fill-slate-400 tracking-tighter">{city.name}</text>
                  </g>
                ))}

                {/* NVPs markers */}
                {MOCK_REGION_STATS.map((region) => {
                  const isFilteredOut = activeTSO && region.tso !== activeTSO;
                  const svgX = (region.lng / 100) * 600;
                  const svgY = (region.lat / 100) * 850;
                  const isSelected = selectedRegion?.substationName === region.substationName;
                  const radius = Math.min(region.requestCount / 3 + 6, 14);

                  return (
                    <g 
                      key={region.substationName} 
                      className={`transition-opacity duration-300 ${isFilteredOut ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRegion(region);
                      }}
                    >
                      {isSelected && (
                        <circle 
                          cx={svgX} cy={svgY} 
                          r={radius + 12} 
                          className="fill-emerald-400/20 stroke-emerald-500/50 stroke-[1px] animate-ping" 
                        />
                      )}

                      {region.nodeStatus === NodeStatus.PLANNED ? (
                         <rect 
                           x={svgX - 8} y={svgY - 8} 
                           width="16" height="16" rx="4"
                           className={`${getNodeColor(region)} stroke-slate-900 stroke-[1.5px] shadow-sm transition-colors duration-200 hover:stroke-emerald-500 hover:stroke-[3px]`}
                         />
                      ) : (
                        <circle 
                          cx={svgX} cy={svgY} 
                          r={radius} 
                          className={`${getNodeColor(region)} stroke-slate-900 stroke-[1.5px] shadow-sm transition-colors duration-200 hover:stroke-emerald-500 hover:stroke-[3px]`} 
                        />
                      )}

                      <circle 
                        cx={svgX} cy={svgY} 
                        r="24" 
                        className="fill-transparent cursor-pointer" 
                      />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Detailed Legend */}
          <div className="absolute bottom-10 right-10 flex flex-col gap-3 bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-xl">
             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status am NVP</h4>
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-white border border-slate-900"></div>
                <span className="text-xs font-bold text-slate-700">Bestand / Anschlussbereit</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-[4px] bg-amber-300 border border-slate-900"></div>
                <span className="text-xs font-bold text-slate-700">Geplant: Übertragungsnetzebene</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-[4px] bg-cyan-300 border border-slate-900"></div>
                <span className="text-xs font-bold text-slate-700">Geplant: Verteilnetzebene</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-rose-300 border border-slate-900"></div>
                <span className="text-xs font-bold text-slate-700">Netzausbau nötig (Flaschenhals)</span>
             </div>
          </div>
          
          <div className="absolute bottom-10 left-10">
             <button onClick={() => { setActiveTSO(null); setSelectedRegion(null); setSearchTerm(''); }} className="text-[11px] font-bold bg-slate-900 text-white px-6 py-3.5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95">Ansicht zurücksetzen</button>
          </div>
        </div>

        {selectedRegion && (
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-start mb-10">
              <div>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                   <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">Netzverknüpfungspunkt</span>
                   <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700">{selectedRegion.gridLevel === GridLevel.TSO ? 'Übertragungsnetzebene' : 'Verteilnetzebene'}</span>
                   <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300 bg-blue-800/20 px-4 py-1.5 rounded-full border border-blue-700/30">{selectedRegion.tso}</span>
                </div>
                <h2 className="text-5xl font-black tracking-tight uppercase italic">{selectedRegion.substationName}</h2>
                <p className="text-slate-400 text-xl mt-2 font-medium">{selectedRegion.city} ({selectedRegion.zip})</p>
                
                <div className="flex gap-4 mt-6">
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl border ${
                    selectedRegion.nodeStatus === NodeStatus.EXISTING ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                    selectedRegion.nodeStatus === NodeStatus.PLANNED ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                    'border-rose-500/30 bg-rose-500/10 text-rose-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      selectedRegion.nodeStatus === NodeStatus.EXISTING ? 'bg-emerald-400' :
                      selectedRegion.nodeStatus === NodeStatus.PLANNED ? 'bg-blue-400' :
                      'bg-rose-400'
                    }`}></div>
                    <span className="text-sm font-black uppercase tracking-widest">{getStatusLabel(selectedRegion)}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedRegion(null)} className="p-3 hover:bg-slate-800 rounded-full transition-colors group border border-slate-700">
                 <svg className="w-10 h-10 text-slate-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-slate-800/40 p-8 rounded-[2rem] border border-slate-700/50 backdrop-blur-xl">
                <span className="text-slate-500 text-[11px] uppercase font-bold tracking-widest block mb-2">Angemeldete Pipeline</span>
                <p className="text-5xl font-black">{selectedRegion.requestCount} <span className="text-xl">Projekte</span></p>
              </div>
              <div className="bg-slate-800/40 p-8 rounded-[2rem] border border-slate-700/50 backdrop-blur-xl">
                <span className="text-slate-500 text-[11px] uppercase font-bold tracking-widest block mb-2">Gesamtleistung (MW)</span>
                <p className="text-5xl font-black">{selectedRegion.totalMW} <span className="text-2xl text-slate-500">MW</span></p>
              </div>
              <div className="bg-slate-800/40 p-8 rounded-[2rem] border border-slate-700/50 backdrop-blur-xl">
                <span className="text-slate-500 text-[11px] uppercase font-bold tracking-widest block mb-2">Realisiert / Zusage</span>
                <p className="text-5xl font-black text-emerald-400">{selectedRegion.approvedCount}</p>
              </div>
              <div className="bg-slate-800/40 p-8 rounded-[2rem] border border-slate-700/50 backdrop-blur-xl ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-blue-400 text-[11px] uppercase font-bold tracking-widest block">Verfügbare Kapazität</span>
                  {selectedRegion.nodeStatus === NodeStatus.PLANNED && selectedRegion.plannedCommissioning && (
                    <span className="text-[9px] font-black text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30 uppercase tracking-tighter">
                      ab {selectedRegion.plannedCommissioning}
                    </span>
                  )}
                </div>
                <p className="text-5xl font-black text-blue-400">{selectedRegion.estimatedCapacityMWh} <span className="text-2xl text-slate-500">MWh</span></p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-tight">Strategischer NVP Fokus</p>
                
                {selectedRegion.nodeStatus === NodeStatus.EXISTING && (
                  <button 
                    onClick={() => setShowRegistrationModal(true)}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    zu Ihrem Netzanschlussvertrag
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowRegistrationModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Registrierung</h3>
                  <p className="text-slate-500 text-sm font-medium">Erstellen Sie ein Konto, um Ihren Netzanschlussvertrag für <span className="text-slate-900 font-bold">{selectedRegion?.substationName}</span> zu beantragen.</p>
                </div>
                <button onClick={() => setShowRegistrationModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowRegistrationModal(false); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vorname</label>
                    <input type="text" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 outline-none text-sm font-medium" placeholder="Max" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nachname</label>
                    <input type="text" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 outline-none text-sm font-medium" placeholder="Mustermann" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unternehmen</label>
                  <input type="text" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 outline-none text-sm font-medium" placeholder="Green Storage GmbH" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Mail Adresse</label>
                  <input type="email" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 outline-none text-sm font-medium" placeholder="max@beispiel.de" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Passwort</label>
                  <input type="password" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 outline-none text-sm font-medium" placeholder="••••••••" />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-900/20">
                    Konto erstellen & Vertrag anfordern
                  </button>
                </div>
              </form>

              <p className="text-center text-[10px] text-slate-400 font-medium">
                Haben Sie bereits ein Konto? <button className="text-slate-900 font-bold hover:underline">Anmelden</button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMap;
