#!/usr/bin/env python3
"""
Script to generate Standard JSON Input for BaseScan contract verification
"""

import json
import os

# Read the flattened contract
contract_path = os.path.join(os.path.dirname(__file__), 'KinGallery_flattened.sol')
with open(contract_path, 'r', encoding='utf-8') as f:
    contract_content = f.read()

# Create the Standard JSON Input
standard_json = {
    "language": "Solidity",
    "sources": {
        "contracts/KinGallery_flattened.sol": {
            "content": contract_content
        }
    },
    "settings": {
        "optimizer": {
            "enabled": False,
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

# Write the output
output_path = os.path.join(os.path.dirname(__file__), 'KinGallery_StandardJSON_Complete.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(standard_json, f, indent=2, ensure_ascii=False)

print(f"✅ Standard JSON Input created successfully!")
print(f"📁 Output file: {output_path}")
print(f"📊 Contract content length: {len(contract_content)} characters")
print(f"\n🔍 To verify on BaseScan:")
print(f"   1. Go to your contract on BaseScan")
print(f"   2. Click 'Verify and Publish'")
print(f"   3. Select 'Solidity (Standard-Json-Input)'")
print(f"   4. Compiler: v0.8.19+commit.7dd6d404")
print(f"   5. Upload the generated JSON file")
print(f"   6. Enter constructor arguments if needed")
