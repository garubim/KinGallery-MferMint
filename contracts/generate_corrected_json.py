#!/usr/bin/env python3
"""
Generate corrected Standard JSON Input with optimizer ENABLED
"""

import json
import os

# Read the flattened contract
contract_path = 'KinGallery_flattened.sol'
with open(contract_path, 'r', encoding='utf-8') as f:
    contract_content = f.read()

# Create the Standard JSON Input with OPTIMIZER ENABLED (200 runs)
standard_json = {
    "language": "Solidity",
    "sources": {
        "contracts/KinGallery_flattened.sol": {
            "content": contract_content
        }
    },
    "settings": {
        "optimizer": {
            "enabled": True,  # ENABLED!
            "runs": 200
        },
        "outputSelection": {
            "*": {
                "*": [
                    "abi",
                    "evm.bytecode",
                    "evm.deployedBytecode",
                    "evm.methodIdentifiers"
                ],
                "": [
                    "ast"
                ]
            }
        },
        "evmVersion": "paris",
        "viaIR": False,
        "metadata": {
            "useLiteralContent": True,
            "bytecodeHash": "ipfs"
        }
    }
}

# Write the corrected output
output_path = 'KinGallery_StandardJSON_CORRECTED.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(standard_json, f, indent=2, ensure_ascii=False)

print("=" * 70)
print("✅ CORRECTED Standard JSON created!")
print("=" * 70)
print()
print("🔧 Configuration:")
print("   - Optimizer: ENABLED")
print("   - Runs: 200")
print("   - EVM Version: paris")
print("   - Compiler: Solidity 0.8.19")
print()
print(f"📁 Output: {output_path}")
print(f"📊 Size: {os.path.getsize(output_path) / 1024:.1f} KB")
print()
print("🎯 This matches your deployed contract!")
print()
print("Next: Upload this file to BaseScan")
