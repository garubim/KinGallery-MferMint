#!/usr/bin/env python3
import json

# Read the flattened contract
with open('MferBk0Base_flattened.sol', 'r') as f:
    contract_content = f.read()

# Create Standard JSON Input
standard_json = {
    "language": "Solidity",
    "sources": {
        "contracts/MferBk0Base_flattened.sol": {
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

# Write to output file
with open('MferBk0Base_StandardJSON_Input.json', 'w') as f:
    json.dump(standard_json, f, indent=2)

print("✅ Standard JSON Input criado: MferBk0Base_StandardJSON_Input.json")
print(f"📝 Tamanho do arquivo: {len(json.dumps(standard_json))} bytes")
