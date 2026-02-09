// 📊 FLIGHT RECORDER - MAGIC BUTTON EVENT LOGGING
// Created: Feb 9, 2026
// Purpose: Log all Magic Button events for debugging and analysis

import { 
  MagicButtonChangeLog, 
  MagicButtonPhase, 
  MagicButtonTrigger,
  ModificationAuthor,
  FlightRecorderStats,
  FlightRecorderExport
} from './types';
import MagicButtonVault from './MagicButtonVault';

class FlightRecorder {
  private static logs: MagicButtonChangeLog[] = [];
  private static maxLogs: number = 1000; // Keep last 1000 events
  private static isRecording: boolean = true;

  // 📝 RECORD EVENT
  public static record(
    phase: MagicButtonPhase,
    trigger: MagicButtonTrigger,
    author: ModificationAuthor,
    component: string,
    message: string,
    previousPhase?: MagicButtonPhase,
    ownerPin?: boolean
  ): string {
    if (!this.isRecording) return '';

    const logId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const changeLog: MagicButtonChangeLog = {
      id: logId,
      timestamp: Date.now(),
      phase,
      previousPhase,
      trigger,
      author,
      component,
      message,
      ownerPin,
      stackTrace: this.captureStackTrace()
    };

    // 🔄 Auto-backup on critical events
    if (author === 'owner' || trigger === 'transaction' || trigger === 'error') {
      const backupId = MagicButtonVault.createBackup(
        `auto-${trigger}`, 
        `Auto backup for ${message}`
      );
      if (backupId) {
        changeLog.backupCreated = backupId;
      }
    }

    this.logs.push(changeLog);
    this.cleanupOldLogs();
    
    // Console output based on log level
    this.logToConsole(changeLog);
    
    return logId;
  }

  // 🎯 CONVENIENT LOGGING METHODS
  public static recordPhaseChange(
    fromPhase: MagicButtonPhase,
    toPhase: MagicButtonPhase,
    trigger: MagicButtonTrigger,
    author: ModificationAuthor = 'external',
    ownerPin?: boolean
  ): string {
    return this.record(
      toPhase,
      trigger,
      author,
      'MagicButton',
      `Phase transition: ${fromPhase} → ${toPhase}`,
      fromPhase,
      ownerPin
    );
  }

  public static recordUserClick(
    phase: MagicButtonPhase,
    clickType: 'connect' | 'mint' | 'navigate' | 'retry'
  ): string {
    return this.record(
      phase,
      'user_click',
      'safe',
      'MagicButton',
      `User clicked: ${clickType} (phase: ${phase})`
    );
  }

  public static recordError(
    phase: MagicButtonPhase,
    error: Error | string,
    component: string = 'MagicButton'
  ): string {
    const errorMsg = error instanceof Error ? error.message : error;
    return this.record(
      phase,
      'error',
      'external',
      component,
      `Error: ${errorMsg}`,
      undefined,
      false
    );
  }

  public static recordTransaction(
    phase: MagicButtonPhase,
    txHash?: string,
    status: 'pending' | 'success' | 'failed' = 'pending'
  ): string {
    return this.record(
      phase,
      'transaction',
      'safe',
      'MagicButton',
      `Transaction ${status}${txHash ? `: ${txHash}` : ''}`,
      undefined,
      false
    );
  }

  public static recordWalletEvent(
    phase: MagicButtonPhase,
    event: 'connect' | 'disconnect' | 'switch_network',
    details?: string
  ): string {
    return this.record(
      phase,
      'wallet_connect',
      'safe',
      'MagicButton',
      `Wallet ${event}${details ? `: ${details}` : ''}`,
      undefined,
      false
    );
  }

  // 📊 ANALYTICS & STATS
  public static getStats(): FlightRecorderStats {
    const phaseDistribution: Record<MagicButtonPhase, number> = {
      welcome: 0,
      connected: 0,
      minting: 0,
      success: 0,
      error: 0,
      gallery_mode: 0
    };

    const authorDistribution: Record<ModificationAuthor, number> = {
      owner: 0,
      safe: 0,
      external: 0
    };

    const triggerDistribution: Record<MagicButtonTrigger, number> = {
      user_click: 0,
      wallet_connect: 0,
      transaction: 0,
      success: 0,
      error: 0,
      navigation: 0,
      timer: 0
    };

    let crashEvents = 0;
    let rollbackEvents = 0;

    this.logs.forEach(log => {
      phaseDistribution[log.phase]++;
      authorDistribution[log.author]++;
      triggerDistribution[log.trigger]++;
      
      if (log.trigger === 'error') crashEvents++;
      if (log.message.includes('rollback') || log.message.includes('Rollback')) rollbackEvents++;
    });

    return {
      totalEvents: this.logs.length,
      phaseDistribution,
      authorDistribution,
      triggerDistribution,
      crashEvents,
      rollbackEvents
    };
  }

  // 📋 LOG RETRIEVAL
  public static getLogs(limit?: number): MagicButtonChangeLog[] {
    const logs = [...this.logs].reverse(); // Most recent first
    return limit ? logs.slice(0, limit) : logs;
  }

  public static getLogsByPhase(phase: MagicButtonPhase): MagicButtonChangeLog[] {
    return this.logs.filter(log => log.phase === phase);
  }

  public static getLogsByAuthor(author: ModificationAuthor): MagicButtonChangeLog[] {
    return this.logs.filter(log => log.author === author);
  }

  public static getErrorLogs(): MagicButtonChangeLog[] {
    return this.logs.filter(log => log.trigger === 'error');
  }

  public static getCriticalLogs(): MagicButtonChangeLog[] {
    return this.logs.filter(log => 
      log.author === 'owner' || 
      log.trigger === 'error' || 
      log.backupCreated ||
      log.message.toLowerCase().includes('crash')
    );
  }

  // 📤 EXPORT FLIGHT DATA
  public static exportFlightData(): FlightRecorderExport {
    const backups = MagicButtonVault.listBackups();
    
    return {
      exportId: `flight-data-${Date.now()}`,
      timestamp: Date.now(),
      appVersion: '2026.02.09', // Update with actual version
      totalLogs: this.logs.length,
      logs: this.logs,
      backups,
      stats: this.getStats(),
      vaultConfig: MagicButtonVault.getConfig() // Without PIN
    };
  }

  public static exportAsJSON(): string {
    return JSON.stringify(this.exportFlightData(), null, 2);
  }

  public static exportAsCSV(): string {
    const headers = [
      'timestamp', 'phase', 'previousPhase', 'trigger', 'author', 
      'component', 'message', 'ownerPin', 'backupCreated'
    ];
    
    const rows = this.logs.map(log => [
      new Date(log.timestamp).toISOString(),
      log.phase,
      log.previousPhase || '',
      log.trigger,
      log.author,
      log.component,
      `"${log.message.replace(/"/g, '""')}"`, // Escape quotes
      log.ownerPin ? 'YES' : 'NO',
      log.backupCreated || ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // 🔧 RECORDER CONTROLS
  public static startRecording(): void {
    this.isRecording = true;
    this.record('welcome', 'timer', 'owner', 'FlightRecorder', 'Recording started');
  }

  public static stopRecording(): void {
    this.record('welcome', 'timer', 'owner', 'FlightRecorder', 'Recording stopped');
    this.isRecording = false;
  }

  public static clearLogs(pin: string): boolean {
    if (!MagicButtonVault.verifyOwnerPin(pin)) {
      console.warn('🚨 Clear logs requires owner PIN');
      return false;
    }

    this.logs = [];
    console.log('🧹 Flight recorder logs cleared');
    return true;
  }

  // 🔍 PRIVATE UTILITIES
  private static captureStackTrace(): string {
    try {
      throw new Error();
    } catch (e) {
      const stack = (e as Error).stack || '';
      // Return only relevant lines, skip FlightRecorder itself
      return stack.split('\n').slice(3, 8).join('\n');
    }
  }

  private static logToConsole(log: MagicButtonChangeLog): void {
    const emoji = this.getLogEmoji(log);
    const color = this.getLogColor(log);
    
    if (typeof window !== 'undefined' && console.log) {
      console.log(
        `%c${emoji} Magic Button Flight Recorder %c${log.phase}%c ${log.message}`,
        'color: #00e6ff; font-weight: bold;',
        `color: ${color}; font-weight: bold; background: rgba(0,0,0,0.1); padding: 2px 4px; border-radius: 3px;`,
        'color: inherit; font-weight: normal;'
      );
    }

    // Also log critical events with more detail
    if (log.author === 'owner' || log.trigger === 'error' || log.backupCreated) {
      console.group(`🔍 Critical Event Details - ${log.id}`);
      console.log('Timestamp:', new Date(log.timestamp).toISOString());
      console.log('Trigger:', log.trigger);
      console.log('Author:', log.author);
      console.log('Component:', log.component);
      if (log.backupCreated) console.log('Backup Created:', log.backupCreated);
      if (log.ownerPin) console.log('🔑 Owner PIN used');
      console.groupEnd();
    }
  }

  private static getLogEmoji(log: MagicButtonChangeLog): string {
    switch (log.trigger) {
      case 'error': return '🚨';
      case 'success': return '✅';
      case 'transaction': return '⛽';
      case 'wallet_connect': return '🔗';
      case 'user_click': return '👆';
      case 'navigation': return '🧭';
      case 'timer': return '⏰';
      default: return '📊';
    }
  }

  private static getLogColor(log: MagicButtonChangeLog): string {
    switch (log.author) {
      case 'owner': return '#00ff00'; // Green for owner
      case 'safe': return '#00e6ff';  // Blue for safe
      case 'external': return '#ff9500'; // Orange for external
      default: return '#ffffff';
    }
  }

  private static cleanupOldLogs(): void {
    if (this.logs.length > this.maxLogs) {
      const toRemove = this.logs.length - this.maxLogs;
      this.logs.splice(0, toRemove);
    }
  }
}

export default FlightRecorder;