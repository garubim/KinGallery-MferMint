#!/bin/bash

# Script para testar tokenURI em MferBk0Base
# Uso: ./test-tokenuri.sh <contract_address> <token_id>

CONTRACT=${1:-"0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241"}
TOKEN_ID=${2:-"1"}

echo "🔍 Testando tokenURI para token #$TOKEN_ID em $CONTRACT"
echo ""

# Via Etherscan API (mais direto)
echo "📡 Via Base RPC..."
echo ""

# ABI da função tokenURI
ABI='[{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]'

# Encode: tokenURI(tokenId)
# tokenURI = 0xc87b56dd
# Para tokenId=1: precisa encoding

echo "Expected format:"
echo "  ✅ ipfs://bafybeih.../1.json"
echo ""
echo "Current format (ANTES do fix):"
echo "  ❌ ipfs://bafybeih.../1"
echo ""

echo "Para verificar em tempo real:"
echo "  1. Acesse Remix: https://remix.ethereum.org"
echo "  2. Importe MferBk0Base_DEPLOYED_VERIFIED_JAN17.sol"
echo "  3. Em 'Deploy & Run Transactions'"
echo "  4. Cole o endereço: $CONTRACT em 'At Address'"
echo "  5. Chame: tokenURI($TOKEN_ID)"
echo "  6. Deve retornar com .json no final"
echo ""

echo "Ou via curl (se RPC exposto):"
echo "  curl -X POST https://base.publicnode.com \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"jsonrpc\":\"2.0\",\"method\":\"eth_call\",\"params\":[{\"to\":\"$CONTRACT\",\"data\":\"0xc87b56dd0000000000000000000000000000000000000000000000000000000000000001\"},\"latest\"],\"id\":1}'"
echo ""

echo "✅ Script concluído"
