'use client';

// 🛡️ SAFE MAGIC BUTTON - PROTECTED WRAPPER
// Created: Feb 9, 2026
// Purpose: Protect original MagicButton with Vault System

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MagicButtonVault from './MagicButtonVault';
import FlightRecorder from './FlightRecorder';
import { 
  SafeMagicButtonProps, 
  MagicButtonPhase, 
  MagicButtonTrigger,
  ModificationAuthor 
} from './types';

// 🔒 Import original Magic Button (will be moved to vault/protected/)
import OriginalMagicButton from '../components/MagicMintButton';

export default function SafeMagicButton({ isOnGalleryPage = false, ...props }: SafeMagicButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 🛡️ VAULT STATE
  const [currentPhase, setCurrentPhase] = useState<MagicButtonPhase>('welcome');
  const [isVaultLocked, setIsVaultLocked] = useState(true);
  const [ownerAccess, setOwnerAccess] = useState(false);
  
  // 📊 FLIGHT RECORDER
  const [recordingActive, setRecordingActive] = useState(true);
  const [showFlightRecorder, setShowFlightRecorder] = useState(
    process.env.NODE_ENV === 'development'
  );
  
  // 🔄 REFS for stable callbacks
  const phaseChangeRef = useRef<((phase: MagicButtonPhase, trigger: MagicButtonTrigger, author?: ModificationAuthor, pin?: string) => void) | null>(null);

  // 🚀 INITIALIZATION
  useEffect(() => {
    console.log('🛡️ SafeMagicButton initializing vault system...');
    
    // Record initialization
    FlightRecorder.record(
      'welcome',
      'timer',
      'safe',
      'SafeMagicButton',
      'Vault system initialized',
      undefined,
      false
    );
    
    // Create initial backup
    MagicButtonVault.createBackup('initialization', 'Safe wrapper startup');
    
    return () => {
      FlightRecorder.record(
        currentPhase,
        'timer',
        'safe',
        'SafeMagicButton',
        'Vault system cleanup'
      );
    };
  }, []);

  // 🎯 PHASE CHANGE HANDLER - Core vault function
  const handlePhaseChange = useCallback((
    newPhase: MagicButtonPhase,
    trigger: MagicButtonTrigger,
    author: ModificationAuthor = 'external',
    pin?: string
  ) => {
    const previousPhase = currentPhase;
    
    // 📊 Record the attempt
    FlightRecorder.recordPhaseChange(previousPhase, newPhase, trigger, author, !!pin);
    
    // 🔒 Vault authorization
    const success = MagicButtonVault.setPhase(newPhase, author, pin);
    
    if (success) {
      setCurrentPhase(newPhase);
      console.log(`✅ SafeMagicButton: Phase change successful - ${previousPhase} → ${newPhase}`);
    } else {
      console.error(`🚨 SafeMagicButton: Phase change BLOCKED - ${previousPhase} → ${newPhase}`);
      
      // Record the block
      FlightRecorder.record(
        previousPhase,
        'error',
        'external',
        'SafeMagicButton',
        `BLOCKED: Unauthorized phase change attempt to ${newPhase}`,
        previousPhase,
        false
      );
    }
  }, [currentPhase]);

  // Set the ref for stable callback
  phaseChangeRef.current = handlePhaseChange;

  // 🔐 OWNER ACCESS MANAGEMENT
  const checkOwnerAccess = useCallback((pin?: string) => {
    if (pin && MagicButtonVault.verifyOwnerPin(pin)) {
      setOwnerAccess(true);
      setIsVaultLocked(false);
      
      // Grace period for owner access (5 minutes)
      setTimeout(() => {
        setOwnerAccess(false);
        setIsVaultLocked(true);
      }, 5 * 60 * 1000);
      
      return true;
    }
    return false;
  }, []);

  // 🎮 SAFE EVENT HANDLERS - Replace original Magic Button handlers
  const handleSafeClick = useCallback(() => {
    FlightRecorder.recordUserClick(currentPhase, 'mint');
    
    // Different behavior based on current phase
    switch (currentPhase) {
      case 'welcome':
        handlePhaseChange('connected', 'user_click', 'safe');
        break;
      case 'connected':
        handlePhaseChange('minting', 'user_click', 'safe');
        break;
      case 'minting':
        // During minting, button should be disabled
        console.warn('🚨 Button clicked during minting - this should be prevented');
        break;
      case 'error':
        handlePhaseChange('welcome', 'user_click', 'safe');
        break;
      case 'success':
        handlePhaseChange('gallery_mode', 'navigation', 'safe');
        break;
      case 'gallery_mode':
        if (isOnGalleryPage) {
          router.push('/');
        }
        break;
    }
  }, [currentPhase, handlePhaseChange, isOnGalleryPage, router]);

  const handleWalletConnect = useCallback((address: string) => {
    FlightRecorder.recordWalletEvent(currentPhase, 'connect', address);
    handlePhaseChange('connected', 'wallet_connect', 'safe');
  }, [currentPhase, handlePhaseChange]);

  const handleTransactionStart = useCallback((txHash: string) => {
    FlightRecorder.recordTransaction('minting', txHash, 'pending');
    handlePhaseChange('minting', 'transaction', 'safe');
  }, [handlePhaseChange]);

  const handleTransactionSuccess = useCallback((txHash: string) => {
    FlightRecorder.recordTransaction('success', txHash, 'success');
    handlePhaseChange('success', 'success', 'safe');
  }, [handlePhaseChange]);

  const handleTransactionError = useCallback((error: Error | string) => {
    FlightRecorder.recordError('error', error);
    handlePhaseChange('error', 'error', 'safe');
  }, [handlePhaseChange]);

  // 🎯 SAFE PROPS - Pass only safe props to original component
  const safeProps = {
    ...props,
    isOnGalleryPage,
    // Override event handlers with safe versions
    onPhaseChange: handlePhaseChange,
    onClick: handleSafeClick,
    onWalletConnect: handleWalletConnect,
    onTransactionStart: handleTransactionStart,
    onTransactionSuccess: handleTransactionSuccess,
    onTransactionError: handleTransactionError,
    // Pass current phase for external visibility
    currentPhase: currentPhase,
    // Vault status
    vaultLocked: isVaultLocked,
    ownerAccess: ownerAccess,
  };

  return (
    <div className="safe-magic-button-container">
      {/* 🛡️ VAULT STATUS INDICATOR (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="vault-status-bar">
          <div className={`vault-indicator ${isVaultLocked ? 'locked' : 'unlocked'}`}>
            {isVaultLocked ? '🔒' : '🔓'} Vault {isVaultLocked ? 'LOCKED' : 'UNLOCKED'}
          </div>
          <div className="phase-indicator">
            📍 Phase: {currentPhase}
          </div>
          <div className="recording-indicator">
            {recordingActive ? '🎬' : '⏹️'} Recording {recordingActive ? 'ON' : 'OFF'}
          </div>
          {ownerAccess && (
            <div className="owner-access-indicator">
              🔑 OWNER ACCESS
            </div>
          )}
        </div>
      )}

      {/* 📊 FLIGHT RECORDER UI (Development only) */}
      {showFlightRecorder && process.env.NODE_ENV === 'development' && (
        <FlightRecorderUI 
          onToggleRecording={() => setRecordingActive(!recordingActive)}
          onClearLogs={() => {
            const pin = prompt('Enter owner PIN to clear logs:');
            if (pin) FlightRecorder.clearLogs(pin);
          }}
          onExportData={() => {
            const data = FlightRecorder.exportAsJSON();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `magic-button-flight-data-${Date.now()}.json`;
            a.click();
          }}
          onToggleUI={() => setShowFlightRecorder(!showFlightRecorder)}
        />
      )}

      {/* 🎯 ORIGINAL MAGIC BUTTON - Protected by vault */}
      <div className="protected-magic-button">
        <OriginalMagicButton {...safeProps} />
      </div>

      <style jsx>{`
        .safe-magic-button-container {
          position: relative;
        }

        .vault-status-bar {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          display: flex;
          gap: 12px;
          font-size: 11px;
          font-family: 'Courier New', monospace;
          z-index: 10000;
          border: 1px solid rgba(0, 230, 255, 0.3);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          max-width: 400px;
          flex-wrap: wrap;
        }

        /* Remove body padding adjustment */

        .vault-indicator.locked {
          color: #ff6b6b;
        }

        .vault-indicator.unlocked {
          color: #00ff00;
        }

        .phase-indicator {
          color: #00e6ff;
        }

        .recording-indicator {
          color: #ff9500;
        }

        .owner-access-indicator {
          color: #00ff00;
          font-weight: bold;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .protected-magic-button {
          /* Original Magic Button styling preserved */
        }
      `}</style>
    </div>
  );
}

// 📊 FLIGHT RECORDER UI COMPONENT
function FlightRecorderUI({ 
  onToggleRecording, 
  onClearLogs, 
  onExportData, 
  onToggleUI 
}: {
  onToggleRecording: () => void;
  onClearLogs: () => void;
  onExportData: () => void;
  onToggleUI: () => void;
}) {
  const [logs, setLogs] = useState(FlightRecorder.getLogs(10));
  const [stats, setStats] = useState(FlightRecorder.getStats());

  // Refresh logs every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(FlightRecorder.getLogs(10));
      setStats(FlightRecorder.getStats());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flight-recorder-ui">
      <div className="flight-recorder-header">
        <h3>📊 Magic Button Flight Recorder</h3>
        <button onClick={onToggleUI} className="close-btn">×</button>
      </div>
      
      <div className="flight-recorder-stats">
        <div>Total Events: {stats.totalEvents}</div>
        <div>Crashes: {stats.crashEvents}</div>
        <div>Rollbacks: {stats.rollbackEvents}</div>
      </div>

      <div className="flight-recorder-controls">
        <button onClick={onToggleRecording}>📹 Toggle Recording</button>
        <button onClick={onClearLogs}>🧹 Clear Logs</button>
        <button onClick={onExportData}>📤 Export Data</button>
      </div>

      <div className="flight-recorder-logs">
        <h4>Recent Events:</h4>
        {logs.slice(0, 5).map(log => (
          <div key={log.id} className={`log-entry log-${log.author}`}>
            <span className="log-time">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className="log-phase">{log.phase}</span>
            <span className="log-message">{log.message}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .flight-recorder-ui {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 320px;
          background: rgba(0, 0, 0, 0.95);
          border: 1px solid rgba(0, 230, 255, 0.3);
          border-radius: 8px;
          color: white;
          font-size: 11px;
          font-family: 'Courier New', monospace;
          z-index: 9999;
          max-height: 400px;
          overflow-y: auto;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .flight-recorder-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(0, 230, 255, 0.2);
        }

        .flight-recorder-header h3 {
          margin: 0;
          font-size: 12px;
          color: #00e6ff;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 16px;
        }

        .flight-recorder-stats {
          display: flex;
          gap: 12px;
          padding: 8px 12px;
          background: rgba(0, 230, 255, 0.1);
        }

        .flight-recorder-controls {
          display: flex;
          gap: 4px;
          padding: 8px 12px;
        }

        .flight-recorder-controls button {
          background: rgba(0, 230, 255, 0.2);
          border: 1px solid rgba(0, 230, 255, 0.3);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          cursor: pointer;
        }

        .flight-recorder-logs {
          padding: 8px 12px;
        }

        .flight-recorder-logs h4 {
          margin: 0 0 8px 0;
          font-size: 11px;
          color: #00e6ff;
        }

        .log-entry {
          padding: 4px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .log-time {
          color: #888;
          margin-right: 8px;
        }

        .log-phase {
          color: #00e6ff;
          margin-right: 8px;
          font-weight: bold;
        }

        .log-message {
          color: white;
        }

        .log-owner {
          background: rgba(0, 255, 0, 0.1);
        }

        .log-external {
          background: rgba(255, 149, 0, 0.1);
        }
      `}</style>
    </div>
  );
}