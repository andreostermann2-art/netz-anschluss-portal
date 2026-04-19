
import { Project, ProjectStatus, User, UserRole, RegionStats, Substation, NodeStatus, TSO, GridLevel, ContractType } from './types';

export const KNOWN_SUBSTATIONS: Substation[] = [
  { id: 'UW-001', name: 'UW Berlin-Mitte', zip: '10117', city: 'Berlin', status: NodeStatus.EXISTING, operator: 'Stromnetz Berlin', tso: TSO.FIFTY_HERTZ, gridLevel: GridLevel.TSO, lat: 28, lng: 84 },
  { id: 'UW-002', name: 'UW Hamburg-Hafen', zip: '20457', city: 'Hamburg', status: NodeStatus.EXISTING, operator: 'Stromnetz Hamburg', tso: TSO.FIFTY_HERTZ, gridLevel: GridLevel.TSO, lat: 18, lng: 52 },
  { id: 'UW-003', name: 'UW München-Süd', zip: '81379', city: 'München', status: NodeStatus.EXISTING, operator: 'SWM', tso: TSO.TENNET, gridLevel: GridLevel.TSO, lat: 86, lng: 72 },
  { id: 'UW-004', name: 'UW Köln-West', zip: '50858', city: 'Köln', status: NodeStatus.EXISTING, operator: 'WestNetz', tso: TSO.AMPRION, gridLevel: GridLevel.TSO, lat: 45, lng: 18 },
  { id: 'UW-005', name: 'UW Frankfurt-Ost', zip: '60314', city: 'Frankfurt', status: NodeStatus.EXISTING, operator: 'MainGrid', tso: TSO.AMPRION, gridLevel: GridLevel.TSO, lat: 56, lng: 38 },
  { id: 'UW-006', name: 'UW Stuttgart-Degerloch', zip: '70597', city: 'Stuttgart', status: NodeStatus.UPGRADE_REQUIRED, operator: 'Netze BW', tso: TSO.TRANSNET_BW, gridLevel: GridLevel.TSO, lat: 78, lng: 38 },
  { id: 'UW-007', name: 'UW Leipzig-Nord', zip: '04158', city: 'Leipzig', status: NodeStatus.PLANNED, operator: 'MitNetz', tso: TSO.FIFTY_HERTZ, gridLevel: GridLevel.TSO, lat: 44, lng: 76, plannedCommissioning: 'Q2 2026' },
  { id: 'UW-008', name: 'UW Magdeburg-Süd (VNB-P)', zip: '39104', city: 'Magdeburg', status: NodeStatus.PLANNED, operator: 'Städtische Werke Magdeburg', tso: TSO.FIFTY_HERTZ, gridLevel: GridLevel.DSO, lat: 35, lng: 70, plannedCommissioning: 'Q1 2027' },
  { id: 'UW-009', name: 'UW Dortmund-Hörde (VNB-P)', zip: '44263', city: 'Dortmund', status: NodeStatus.PLANNED, operator: 'DEW21', tso: TSO.AMPRION, gridLevel: GridLevel.DSO, lat: 42, lng: 28, plannedCommissioning: 'Q4 2025' }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Max Entwickler', role: UserRole.DEVELOPER, organization: 'Green Storage GmbH' },
  { id: 'u2', name: 'Petra Prokurist', role: UserRole.OPERATOR, organization: 'NetzNord AG' },
  { id: 'u3', name: 'Admin User', role: UserRole.ADMIN, organization: 'Bundesnetzagentur' }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'BESS-2024-001',
    developerId: 'u1',
    developerName: 'Green Storage GmbH',
    operatorName: 'NetzNord AG',
    zipCode: '10115',
    city: 'Berlin',
    substationName: 'UW Berlin-Mitte',
    substationId: 'UW-001',
    powerMW: 50,
    capacityMWh: 100,
    submissionDate: '2024-01-15',
    plannedStart: '2024-06-01',
    plannedCommissioning: '2025-01-01',
    status: ProjectStatus.IN_REVIEW,
    messages: [],
    maturityInfo: {
      feasibility: 'Flächen gesichert, B-Plan Verfahren läuft.',
      technicalMaturity: 'Anlagenkonzept mit 2h-Speicher fertiggestellt.',
      financialCapacity: 'Eigenkapitalnachweis über 10 Mio. € liegt vor.',
      systemBenefit: 'Hybrides Konzept mit PV-Park geplant.',
      hasUploadedDocs: true
    },
    clusterStudyResult: 'Die Clusterstudie für Berlin-Mitte zeigt eine hohe Netzverfügbarkeit für BESS-Anlagen.',
    isSuccessor: true
  },
  {
    id: 'BESS-2024-002',
    developerId: 'u1',
    developerName: 'Green Storage GmbH',
    operatorName: 'NetzNord AG',
    zipCode: '20095',
    city: 'Hamburg',
    substationName: 'UW Hamburg-Hafen',
    substationId: 'UW-002',
    powerMW: 25,
    capacityMWh: 50,
    submissionDate: '2024-02-10',
    plannedStart: '2024-09-01',
    plannedCommissioning: '2025-06-01',
    status: ProjectStatus.DOCS_MISSING,
    messages: [
      { id: 'm1', senderId: 'u2', senderName: 'Petra Prokurist', text: 'Bitte laden Sie das aktuelle Brandschutzkonzept hoch.', timestamp: '2024-02-12' }
    ],
    maturityInfo: {
      feasibility: 'Vorvertrag für Fläche vorhanden.',
      technicalMaturity: 'Vorplanung abgeschlossen.',
      financialCapacity: 'Bonitätsnachweis vorhanden.',
      systemBenefit: 'Netzdienlicher Betrieb durch Lastmanagement.',
      hasUploadedDocs: false
    },
    clusterStudyResult: 'Ergebnis ausstehend. Prüfung erfolgt nach Dokumentenupload.'
  },
  {
    id: 'BESS-2024-003',
    developerId: 'u1',
    developerName: 'Green Storage GmbH',
    operatorName: 'NetzNord AG',
    zipCode: '80331',
    city: 'München',
    substationName: 'UW München-Süd',
    substationId: 'UW-003',
    powerMW: 100,
    capacityMWh: 200,
    submissionDate: '2024-03-01',
    plannedStart: '2024-10-01',
    plannedCommissioning: '2025-12-01',
    status: ProjectStatus.OFFER_SUBMITTED,
    messages: [],
    maturityInfo: {
      feasibility: 'Flächen gesichert, Baugenehmigung erteilt.',
      technicalMaturity: 'Anschlusskonzept vom Netzbetreiber bestätigt.',
      financialCapacity: 'Finanzierungszusage der Bank liegt vor.',
      systemBenefit: 'Kombination mit Windpark zur Glättung der Einspeisung.',
      hasUploadedDocs: true
    },
    clusterStudyResult: 'Die Clusterstudie für den Bereich München-Süd hat ergeben, dass Ihr Projekt im aktuellen Ausbauschritt berücksichtigt werden kann.',
    isSuccessor: false,
    contractType: ContractType.NAV,
    contractContent: 'Dies ist der Entwurf des Netzanschlussvertrags (NAV). Er regelt die technischen und rechtlichen Bedingungen für Ihren Anschluss...'
  },
  {
    id: 'BESS-2024-004',
    developerId: 'u1',
    developerName: 'Green Storage GmbH',
    operatorName: 'NetzNord AG',
    zipCode: '50858',
    city: 'Köln',
    substationName: 'UW Köln-West',
    substationId: 'UW-004',
    powerMW: 80,
    capacityMWh: 160,
    submissionDate: '2024-03-15',
    plannedStart: '2024-11-01',
    plannedCommissioning: '2026-03-01',
    status: ProjectStatus.CONTRACT_NEGOTIATION,
    messages: [],
    maturityInfo: {
      feasibility: 'Baugenehmigung liegt vor.',
      technicalMaturity: 'Detailplanung abgeschlossen.',
      financialCapacity: 'Finanzierung gesichert.',
      systemBenefit: 'Blindleistungsbereitstellung geplant.',
      hasUploadedDocs: true
    },
    clusterStudyResult: 'Die Clusterstudie für Köln-West bestätigt die Anschlusskapazität von 80 MW.',
    isSuccessor: false,
    contractType: ContractType.AEV,
    contractContent: 'Entwurf des Anschlusserrichtungsvertrags (AEV) zur Abstimmung.'
  }
];

export const MOCK_REGION_STATS: RegionStats[] = KNOWN_SUBSTATIONS.map((sub, i) => ({
  zip: sub.zip,
  city: sub.city,
  substationName: sub.name,
  requestCount: 5 + (i * 2),
  totalMW: 200 + (i * 80),
  totalMWh: 400 + (i * 160),
  approvedCount: 1 + Math.floor(i / 2),
  estimatedCapacityMWh: 120 - (i * 12),
  nodeStatus: sub.status,
  gridLevel: sub.gridLevel,
  tso: sub.tso,
  lat: sub.lat,
  lng: sub.lng,
  plannedCommissioning: sub.plannedCommissioning
}));
