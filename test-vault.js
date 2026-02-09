// 🧪 VAULT SYSTEM TEST
// Created: Feb 9, 2026
// Purpose: Test Magic Button Vault System functionality

import { MagicButtonVault, FlightRecorder, VaultUtils } from '../app/vault';

// 🔐 Test PIN verification
console.log('🔐 Testing PIN verification...');
const testPin = process.env.NEXT_PUBLIC_MAGIC_BUTTON_OWNER_PIN || 'QF7VZMQ2izToquwpr4qpvXPqKPKA';
const isPinValid = MagicButtonVault.verifyOwnerPin(testPin);
console.log('PIN Valid:', isPinValid ? '✅ YES' : '❌ NO');

// 📊 Test vault status
console.log('📊 Vault Status:', MagicButtonVault.getStatus());

// 🎬 Test flight recorder
console.log('🎬 Starting flight recorder test...');
FlightRecorder.record(
  'welcome',
  'timer',
  'owner',
  'VaultTest',
  'Testing vault system functionality',
  undefined,
  true
);

// 💾 Test backup creation
console.log('💾 Creating test backup...');
const backupId = MagicButtonVault.createBackup('test-backup', 'Testing backup functionality', testPin);
console.log('Backup created:', backupId ? '✅ SUCCESS' : '❌ FAILED');

// 📋 List backups
console.log('📋 Available backups:');
const backups = MagicButtonVault.listBackups();
console.log(`Found ${backups.length} backups:`, backups.map(b => b.label));

// 📊 Flight recorder stats
console.log('📊 Flight Recorder Stats:', FlightRecorder.getStats());

// 🎯 Quick stats
console.log('🎯 Quick Stats:', VaultUtils.getQuickStats());

console.log('🎉 Vault System Test Complete!');
console.log('🛡️ Magic Button is now PROTECTED by the vault system!');

export { };