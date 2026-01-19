#!/usr/bin/env python3
"""
Generate Standard JSON Input for MferMintGalleryCompatible using flattened source
"""
import json
import os

contract_path = os.path.join(os.path.dirname(__file__), 'MferMintGalleryCompatible_Flattened.sol')
with open(contract_path, 'r', encoding='utf-8') as f:
    contract_content = f.read()

standard_json = {
    "language": "Solidity",
    "sources": {
        "contracts/MferMintGalleryCompatible_Flattened.sol": {
            "content": contract_content
        }
    },
    "settings": {
        "optimizer": {
            "enabled": True,
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

output_path = os.path.join(os.path.dirname(__file__), 'MferMint_StandardJSON_CORRECTED.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(standard_json, f, indent=2, ensure_ascii=False)

print('✅ Wrote', output_path)
print('📊 Size:', os.path.getsize(output_path))
