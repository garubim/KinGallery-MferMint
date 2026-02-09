// 🛡️ MAGIC BUTTON VAULT SYSTEM - TYPES
// Created: Feb 9, 2026
// Purpose: Type definitions for the Magic Button protection system

export type MagicButtonPhase = 
  | 'welcome'          // Initial animation - welcome to connect
  | 'connected'        // Wallet connected - ready to mint
  | 'minting'         // Transaction in progress
  | 'success'         // Mint successful - redirect to gallery
  | 'error'           // Error state - show retry
  | 'gallery_mode'    // On page 2 - "want more" button

export type MagicButtonTrigger = 
  | 'user_click'      // User clicked the button
  | 'wallet_connect'  // Wallet connection event
  | 'transaction'     // Transaction state change
  | 'success'         // Transaction success
  | 'error'          // Error occurred
  | 'navigation'     // Page navigation
  | 'timer'          // Automatic timer event

export type ModificationAuthor = 
  | 'owner'          // Authorized owner with PIN
  | 'safe'           // Safe automatic changes
  | 'external'       // External component (potentially unsafe)

export interface MagicButtonChangeLog {
  id: string;
  timestamp: number;
  phase: MagicButtonPhase;
  previousPhase?: MagicButtonPhase;
  trigger: MagicButtonTrigger;
  author: ModificationAuthor;
  component: string;
  message: string;
  stackTrace?: string;
  backupCreated?: string;
  ownerPin?: boolean; // Was owner PIN used?
}

export interface MagicButtonBackup {
  id: string;
  timestamp: number;
  label: string;
  phase: MagicButtonPhase;
  componentState: any; // Full component state snapshot
  reason: string;
}

export interface VaultStatus {
  isLocked: boolean;
  currentPhase: MagicButtonPhase;
  lastModified: number;
  totalChanges: number;
  backupCount: number;
  ownerAccess: boolean;
}

export interface FlightRecorderStats {
  totalEvents: number;
  phaseDistribution: Record<MagicButtonPhase, number>;
  authorDistribution: Record<ModificationAuthor, number>;
  triggerDistribution: Record<MagicButtonTrigger, number>;
  crashEvents: number;
  rollbackEvents: number;
}

export interface SafeMagicButtonProps {
  isOnGalleryPage?: boolean;
  // All other props pass-through to original MagicButton
  [key: string]: any;
}

// 🔐 Vault Configuration
export interface VaultConfig {
  ownerPin: string;
  maxBackups: number;
  autoBackupTriggers: MagicButtonTrigger[];
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableFlightRecorder: boolean;
  enableDeveloperUI: boolean;
}

// 📊 Flight Recorder Export Format
export interface FlightRecorderExport {
  exportId: string;
  timestamp: number;
  appVersion: string;
  totalLogs: number;
  logs: MagicButtonChangeLog[];
  backups: MagicButtonBackup[];
  stats: FlightRecorderStats;
  vaultConfig: Omit<VaultConfig, 'ownerPin'>; // Don't export PIN
}