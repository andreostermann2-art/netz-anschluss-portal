
export enum UserRole {
  DEVELOPER = 'DEVELOPER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
  PUBLIC = 'PUBLIC'
}

export enum TSO {
  TENNET = 'TenneT',
  AMPRION = 'Amprion',
  FIFTY_HERTZ = '50Hertz',
  TRANSNET_BW = 'TransnetBW'
}

export enum GridLevel {
  TSO = 'Übertragungsnetz (ÜNB)',
  DSO = 'Verteilnetz (VNB)'
}

export enum ProjectStatus {
  SUBMITTED = 'Eingereicht',
  DOCS_MISSING = 'Unterlagen fehlen',
  IN_REVIEW = 'In Prüfung',
  TECH_EVAL = 'Technische Bewertung',
  OFFER_SUBMITTED = 'Angebot übermittelt',
  APPROVED = 'Vertrag (Zusage)',
  FCA_OFFERED = 'FCA Angeboten',
  REJECTED = 'Abgelehnt',
  OFFER_ACCEPTED = 'Angebot angenommen',
  OFFER_DECLINED = 'Angebot abgelehnt',
  CONTRACT_NEGOTIATION = 'Vertragsverhandlung'
}

export enum ContractType {
  AEV = 'Anschlusserrichtungsvertrag (AEV)',
  NAV = 'Netzanschlussvertrag (NAV)',
  FCA = 'Flexible Connection Agreement (FCA)'
}

export enum NodeStatus {
  EXISTING = 'Bestand',
  PLANNED = 'In Planung',
  UPGRADE_REQUIRED = 'Ausbau notwendig'
}

export interface Substation {
  id: string;
  name: string;
  zip: string;
  city: string;
  status: NodeStatus;
  operator: string;
  tso: TSO;
  gridLevel: GridLevel;
  lat: number;
  lng: number;
  plannedCommissioning?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  organization: string;
}

export interface MaturityInfo {
  feasibility: string; // Projektumsetzbarkeit
  technicalMaturity: string; // Technische Reife
  financialCapacity: string; // Finanzielle Leistungsfähigkeit
  systemBenefit: string; // Netz- und Systemnutzen
  hasUploadedDocs: boolean;
}

export interface Project {
  id: string;
  developerId: string;
  developerName: string;
  operatorName: string;
  zipCode: string;
  city: string;
  substationName: string;
  substationId?: string;
  powerMW: number;
  capacityMWh: number;
  submissionDate: string;
  plannedStart: string;
  plannedCommissioning: string;
  status: ProjectStatus;
  rejectionReason?: string;
  messages: Message[];
  // FCA Specific fields
  isFCA?: boolean;
  staticLimitMW?: number;
  dynamicConstraints?: string;
  // Maturity Process fields
  maturityInfo?: MaturityInfo;
  // New Reifegradverfahren fields
  clusterStudyResult?: string;
  isSuccessor?: boolean;
  contractType?: ContractType;
  contractContent?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface RegionStats {
  zip: string;
  city: string;
  substationName: string;
  requestCount: number;
  totalMW: number;
  totalMWh: number;
  approvedCount: number;
  estimatedCapacityMWh: number;
  nodeStatus: NodeStatus;
  gridLevel: GridLevel;
  tso: TSO;
  lat: number;
  lng: number;
  plannedCommissioning?: string;
}
