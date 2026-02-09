// 🔒 MAGIC BUTTON VAULT - CORE SECURITY SYSTEM
// Created: Feb 9, 2026
// Purpose: Protect Magic Button from unintended modifications

import { 
  MagicButtonPhase, 
  MagicButtonBackup, 
  VaultConfig, 
  VaultStatus,
  ModificationAuthor 
} from './types';

class MagicButtonVault {
  private static instance: MagicButtonVault;
  private static backups: Map<string, MagicButtonBackup> = new Map();
  private static currentPhase: MagicButtonPhase = 'welcome';
  private static isLocked: boolean = true;
  private static lastOwnerAccess: number = 0;
  
  private static config: VaultConfig = {
    ownerPin: process.env.NEXT_PUBLIC_MAGIC_BUTTON_OWNER_PIN || 'KING_GALLERY_2026',
    maxBackups: 50, // Keep last 50 backups
    autoBackupTriggers: ['transaction', 'error', 'success'],
    logLevel: 'info',
    enableFlightRecorder: process.env.NODE_ENV !== 'production',
    enableDeveloperUI: process.env.NODE_ENV === 'development'
  };

  // 🔐 SINGLETON PATTERN - Only one vault instance
  private constructor() {}

  public static getInstance(): MagicButtonVault {
    if (!MagicButtonVault.instance) {
      MagicButtonVault.instance = new MagicButtonVault();
    }
    return MagicButtonVault.instance;
  }

  // 🔑 PIN VERIFICATION
  public static verifyOwnerPin(pin?: string): boolean {
    if (!pin) return false;
    
    const isValid = pin === this.config.ownerPin;
    if (isValid) {
      this.lastOwnerAccess = Date.now();
      console.log('🔓 Magic Button Vault: Owner access GRANTED');
    } else {
      console.warn('🚨 Magic Button Vault: Invalid PIN attempt');
    }
    return isValid;
  }

  // 📊 VAULT STATUS
  public static getStatus(): VaultStatus {
    return {
      isLocked: this.isLocked,
      currentPhase: this.currentPhase,
      lastModified: this.lastOwnerAccess,
      totalChanges: Array.from(this.backups.values()).length,
      backupCount: this.backups.size,
      ownerAccess: (Date.now() - this.lastOwnerAccess) < (5 * 60 * 1000) // 5 min grace period
    };
  }

  // 🎯 PHASE MANAGEMENT - Core function
  public static getCurrentPhase(): MagicButtonPhase {
    return this.currentPhase;
  }

  public static setPhase(
    newPhase: MagicButtonPhase, 
    author: ModificationAuthor = 'external',
    pin?: string
  ): boolean {
    const requiresAuth = this.requiresAuthorization(this.currentPhase, newPhase);
    
    if (requiresAuth && author !== 'owner' && !this.verifyOwnerPin(pin)) {
      console.error(
        `🚨 Magic Button Vault: BLOCKED unauthorized phase change from ${this.currentPhase} to ${newPhase}`
      );
      return false;
    }

    const previousPhase = this.currentPhase;
    this.currentPhase = newPhase;
    
    console.log(
      `✅ Magic Button Vault: Phase change ${previousPhase} → ${newPhase} (${author})`
    );

    return true;
  }

  // 🛡️ AUTHORIZATION RULES
  private static requiresAuthorization(from: MagicButtonPhase, to: MagicButtonPhase): boolean {
    // Critical transitions that require owner PIN
    const criticalTransitions: Array<[MagicButtonPhase, MagicButtonPhase]> = [
      ['welcome', 'minting'],     // Skip wallet connection
      ['connected', 'success'],   // Skip minting process
      ['error', 'success'],       // Force success from error
      ['minting', 'welcome'],     // Reset during transaction
    ];

    return criticalTransitions.some(([f, t]) => f === from && t === to);
  }

  // 💾 BACKUP SYSTEM
  public static createBackup(
    label: string, 
    reason: string = 'Manual backup',
    pin?: string
  ): string | null {
    if (!this.verifyOwnerPin(pin) && reason === 'Manual backup') {
      console.warn('🚨 Manual backup requires owner PIN');
      return null;
    }

    const backupId = `backup-${Date.now()}-${label.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    const backup: MagicButtonBackup = {
      id: backupId,
      timestamp: Date.now(),
      label,
      phase: this.currentPhase,
      componentState: this.captureComponentState(),
      reason
    };

    this.backups.set(backupId, backup);
    
    // Cleanup old backups
    this.cleanupOldBackups();
    
    console.log(`💾 Magic Button Vault: Backup created - ${backupId}`);
    return backupId;
  }

  // 🔄 ROLLBACK SYSTEM
  public static rollback(backupId: string, pin: string): boolean {
    if (!this.verifyOwnerPin(pin)) {
      console.error('🚨 Rollback requires valid owner PIN');
      return false;
    }

    const backup = this.backups.get(backupId);
    if (!backup) {
      console.error(`🚨 Backup not found: ${backupId}`);
      return false;
    }

    try {
      this.currentPhase = backup.phase;
      this.restoreComponentState(backup.componentState);
      
      console.log(`🔄 Magic Button Vault: Rollback to ${backupId} successful`);
      
      // Create rollback log backup
      this.createBackup('post-rollback', `Rolled back to ${backup.label}`);
      
      return true;
    } catch (error) {
      console.error('🚨 Rollback failed:', error);
      return false;
    }
  }

  // 📋 BACKUP MANAGEMENT
  public static listBackups(): MagicButtonBackup[] {
    return Array.from(this.backups.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  public static deleteBackup(backupId: string, pin: string): boolean {
    if (!this.verifyOwnerPin(pin)) return false;
    
    return this.backups.delete(backupId);
  }

  // 🧹 CLEANUP
  private static cleanupOldBackups(): void {
    const backupArray = Array.from(this.backups.entries())
      .sort(([, a], [, b]) => b.timestamp - a.timestamp);
    
    if (backupArray.length > this.config.maxBackups) {
      const toDelete = backupArray.slice(this.config.maxBackups);
      toDelete.forEach(([id]) => this.backups.delete(id));
      console.log(`🧹 Cleaned up ${toDelete.length} old backups`);
    }
  }

  // 📸 STATE CAPTURE/RESTORE
  private static captureComponentState(): any {
    // Capture current Magic Button state
    // This would be expanded to capture full component state
    return {
      phase: this.currentPhase,
      timestamp: Date.now(),
      // Add more state capture as needed
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };
  }

  private static restoreComponentState(state: any): void {
    // Restore Magic Button state
    // Implementation depends on how we want to restore state
    console.log('🔄 Restoring component state:', state);
  }

  // 🔧 CONFIGURATION
  public static updateConfig(newConfig: Partial<VaultConfig>, pin: string): boolean {
    if (!this.verifyOwnerPin(pin)) return false;
    
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Vault configuration updated');
    return true;
  }

  public static getConfig(pin?: string): Partial<VaultConfig> {
    const isOwner = this.verifyOwnerPin(pin);
    
    return {
      maxBackups: this.config.maxBackups,
      autoBackupTriggers: this.config.autoBackupTriggers,
      logLevel: this.config.logLevel,
      enableFlightRecorder: this.config.enableFlightRecorder,
      enableDeveloperUI: this.config.enableDeveloperUI,
      // Only show PIN to owner
      ...(isOwner && { ownerPin: this.config.ownerPin })
    };
  }
}

export default MagicButtonVault;