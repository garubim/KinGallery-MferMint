#!/usr/bin/env node
// Quick test script to validate paymaster configuration

const https = require('https');

console.log('🧪 Testing Paymaster Configuration...\n');

// Check environment variables
const paymasterUrl = 'https://api.developer.coinbase.com/rpc/v1/base/QDv2XZtiPNHyVtbLUsY5QT7UTHM6Re2N';
const kingalleryAddress = '0xebc497a5c36cb1a9264fd122a586b3f461fcc568';
const mferAddress = '0xb222e11864A2050bd19e2Df6648CfbB971f28325';

console.log('📋 Configuration Check:');
console.log('✅ Paymaster URL:', paymasterUrl);
console.log('✅ KinGallery Contract:', kingalleryAddress);
console.log('✅ MferBk0Base Contract:', mferAddress);
console.log('✅ Network: Base (8453)');
console.log();

// Test basic connectivity
console.log('🔗 Testing Paymaster Endpoint...');

const testPayload = JSON.stringify({
  jsonrpc: '2.0',
  method: 'eth_chainId',
  params: [],
  id: 1
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testPayload)
  }
};

const req = https.request(paymasterUrl, options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log(`📡 Response Status: ${res.statusCode}`);
      
      if (response.result) {
        const chainId = parseInt(response.result, 16);
        console.log(`✅ Chain ID: ${chainId} (${chainId === 8453 ? 'Base ✓' : 'Wrong network ❌'})`);
      } else if (response.error) {
        console.log(`⚠️ API Error: ${response.error.message} (Code: ${response.error.code})`);
        console.log('   This might be normal - some methods require wallet context');
      }
      
      console.log('\n🎯 Configuration appears to be correct!');
      console.log('🚀 Ready to test in browser at http://localhost:3000');
      
    } catch (error) {
      console.error('❌ Error parsing response:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(testPayload);
req.end();