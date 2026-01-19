#!/usr/bin/env python3
"""
Script to validate the Standard JSON Input before uploading to BaseScan
"""

import json
import os

def validate_json():
    """Validate the Standard JSON Input file"""
    
    json_path = os.path.join(os.path.dirname(__file__), 'KinGallery_StandardJSON_Complete.json')
    
    print("=" * 70)
    print("Standard JSON Input Validator")
    print("=" * 70)
    print()
    
    # Check if file exists
    if not os.path.exists(json_path):
        print("❌ File not found:", json_path)
        return False
    
    print(f"✅ File found: {os.path.basename(json_path)}")
    
    # Check file size
    file_size = os.path.getsize(json_path)
    print(f"📊 File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
    
    # Try to parse JSON
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print("✅ Valid JSON format")
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
        return False
    
    # Validate structure
    print()
    print("Validating structure...")
    
    # Check language
    if data.get('language') == 'Solidity':
        print("✅ Language: Solidity")
    else:
        print(f"⚠️  Language: {data.get('language')}")
    
    # Check sources
    sources = data.get('sources', {})
    if sources:
        print(f"✅ Sources: {len(sources)} file(s)")
        for source_path, source_data in sources.items():
            content_length = len(source_data.get('content', ''))
            print(f"   - {source_path}: {content_length:,} characters")
    else:
        print("❌ No sources found")
        return False
    
    # Check settings
    settings = data.get('settings', {})
    if settings:
        print("✅ Settings found")
        
        # Check optimizer
        optimizer = settings.get('optimizer', {})
        optimizer_enabled = optimizer.get('enabled', True)
        optimizer_runs = optimizer.get('runs', 200)
        
        if optimizer_enabled == False:
            print(f"   ✅ Optimizer: Disabled (enabled: false)")
        else:
            print(f"   ⚠️  Optimizer: ENABLED (should be disabled for this contract)")
        
        print(f"   - Runs: {optimizer_runs}")
        
        # Check EVM version
        evm_version = settings.get('evmVersion', 'paris')
        print(f"   - EVM Version: {evm_version}")
        
        # Check viaIR
        via_ir = settings.get('viaIR', False)
        print(f"   - Via IR: {via_ir}")
        
    else:
        print("❌ No settings found")
        return False
    
    print()
    print("=" * 70)
    print("✅ Validation Complete!")
    print()
    print("Summary:")
    print(f"  - File: KinGallery_StandardJSON_Complete.json ({file_size/1024:.1f} KB)")
    print(f"  - Compiler: Solidity")
    print(f"  - Optimizer: {'Disabled' if not optimizer_enabled else 'ENABLED (WARNING)'}")
    print(f"  - EVM Version: {evm_version}")
    print()
    print("🎯 Ready to upload to BaseScan!")
    print()
    print("Next steps:")
    print("  1. Go to https://basescan.org/address/YOUR_CONTRACT_ADDRESS")
    print("  2. Click 'Verify and Publish'")
    print("  3. Select 'Solidity (Standard-Json-Input)'")
    print("  4. Compiler: v0.8.19+commit.7dd6d404")
    print("  5. Upload KinGallery_StandardJSON_Complete.json")
    print()
    
    return True

if __name__ == "__main__":
    try:
        validate_json()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
