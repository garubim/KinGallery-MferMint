// 🛡️ VAULT SYSTEM INDEX - MAGIC BUTTON PROTECTION
// Created: Feb 9, 2026
// Purpose: Export all vault system components

export { default as MagicButtonVault } from './MagicButtonVault';
export { default as FlightRecorder } from './FlightRecorder';
export { default as SafeMagicButton } from './SafeMagicButton';

export type {
  MagicButtonPhase,
  MagicButtonTrigger,
  ModificationAuthor,
  MagicButtonChangeLog,
  MagicButtonBackup,
  VaultStatus,
  VaultConfig,
  FlightRecorderStats,
  FlightRecorderExport,
  SafeMagicButtonProps
} from './types';

// 🎯 QUICK ACCESS UTILITIES
export const VaultUtils = {
  // 🔐 Quick PIN verification
  verifyPin: (pin: string) => MagicButtonVault.verifyOwnerPin(pin),
  
  // 📊 Quick stats
  getQuickStats: () => ({
    vault: MagicButtonVault.getStatus(),
    flights: FlightRecorder.getStats(),
    backups: MagicButtonVault.listBackups().length,
    criticalEvents: FlightRecorder.getCriticalLogs().length
  }),
  
  // 🚨 Emergency functions
  emergencyBackup: (pin: string, reason: string = 'Emergency backup') => 
    MagicButtonVault.createBackup('emergency', reason, pin),
    
  emergencyRollback: (backupId: string, pin: string) => 
    MagicButtonVault.rollback(backupId, pin),
    
  // 📤 Quick export
  exportAllData: () => ({
    flightData: FlightRecorder.exportFlightData(),
    backups: MagicButtonVault.listBackups(),
    vaultStatus: MagicButtonVault.getStatus(),
    exportTimestamp: Date.now()
  })
};

// 🎮 DEVELOPER UTILITIES (Development only)
export const DevUtils = process.env.NODE_ENV === 'development' ? {
  // 🧪 Test functions
  simulateCrash: () => FlightRecorder.recordError('minting', 'Simulated crash for testing'),
  
  simulatePhaseChange: (phase: MagicButtonPhase) => 
    FlightRecorder.recordPhaseChange('welcome', phase, 'user_click', 'external'),
    
  // 📊 Debug info
  debugInfo: () => {
    console.group('🛡️ Magic Button Vault Debug Info');
    console.log('Vault Status:', MagicButtonVault.getStatus());
    console.log('Flight Stats:', FlightRecorder.getStats());
    console.log('Recent Logs:', FlightRecorder.getLogs(5));
    console.log('Backups:', MagicButtonVault.listBackups().slice(0, 3));
    console.groupEnd();
  },
  
  // 🔄 Reset (DANGER - use only in development)
  dangerousReset: (pin: string) => {
    if (MagicButtonVault.verifyOwnerPin(pin)) {
      FlightRecorder.clearLogs(pin);
      console.warn('🚨 Vault system reset - all logs cleared');
      return true;
    }
    return false;
  }
} : {};

// 🚀 INITIALIZATION HELPER
export const initializeVaultSystem = (config?: {
  ownerPin?: string;
  enableFlightRecorder?: boolean;
  enableDeveloperUI?: boolean;
}) => {
  console.log('🛡️ Initializing Magic Button Vault System...');
  
  // Start flight recording
  FlightRecorder.startRecording();
  
  // Create initial backup
  const backupId = MagicButtonVault.createBackup(
    'system-init', 
    'Vault system initialization'
  );
  
  if (config) {
    // Apply custom configuration (requires PIN)
    if (config.ownerPin) {
      MagicButtonVault.updateConfig(config, config.ownerPin);
    }
  }
  
  FlightRecorder.record(
    'welcome',
    'timer',
    'owner',
    'VaultSystem',
    'Vault system fully initialized',
    undefined,
    !!config?.ownerPin
  );
  
  return {
    vaultInitialized: true,
    initialBackup: backupId,
    flightRecorderActive: true,
    timestamp: Date.now()
  };
};