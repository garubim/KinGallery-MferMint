#!/usr/bin/env python3
"""
Script to generate ABI-encoded constructor arguments for BaseScan verification
"""

from web3 import Web3

# Constructor parameters (EDIT THESE WITH YOUR DEPLOYED VALUES)
USDC_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"  # Base USDC
MULTISIG_ADDRESS = "0xYOUR_MULTISIG_ADDRESS_HERE"  # Replace with your Gnosis Safe
PAYEE2_ADDRESS = "0xYOUR_GALLERY_ADDRESS_HERE"     # Replace with your Gallery address
RELAYER_ADDRESS = "0xYOUR_RELAYER_ADDRESS_HERE"    # Replace with your Relayer address
ADMIN_ADDRESS = "0xYOUR_ADMIN_ADDRESS_HERE"        # Replace with your Admin address

def encode_constructor_args():
    """Encode constructor arguments in ABI format"""
    
    # Verify addresses
    addresses = [USDC_ADDRESS, MULTISIG_ADDRESS, PAYEE2_ADDRESS, RELAYER_ADDRESS, ADMIN_ADDRESS]
    for addr in addresses:
        if not Web3.is_address(addr):
            print(f"⚠️  Invalid address: {addr}")
            print("Please edit the script and update the addresses.")
            return None
        
        if "YOUR_" in addr.upper():
            print(f"⚠️  Please replace placeholder: {addr}")
            return None
    
    # Encode constructor parameters
    w3 = Web3()
    encoded = w3.codec.encode(
        ['address', 'address', 'address', 'address', 'address'],
        [
            Web3.to_checksum_address(USDC_ADDRESS),
            Web3.to_checksum_address(MULTISIG_ADDRESS),
            Web3.to_checksum_address(PAYEE2_ADDRESS),
            Web3.to_checksum_address(RELAYER_ADDRESS),
            Web3.to_checksum_address(ADMIN_ADDRESS)
        ]
    )
    
    return encoded.hex()

def main():
    print("=" * 70)
    print("KinGallery Constructor Arguments Encoder")
    print("=" * 70)
    print()
    print("Constructor Parameters:")
    print(f"  1. USDC:     {USDC_ADDRESS}")
    print(f"  2. Multisig: {MULTISIG_ADDRESS}")
    print(f"  3. Gallery:  {PAYEE2_ADDRESS}")
    print(f"  4. Relayer:  {RELAYER_ADDRESS}")
    print(f"  5. Admin:    {ADMIN_ADDRESS}")
    print()
    
    encoded = encode_constructor_args()
    
    if encoded:
        print("✅ Constructor Arguments (ABI-encoded):")
        print()
        print(encoded)
        print()
        print("📋 Copy the hex string above and paste it in BaseScan")
        print("   under 'Constructor Arguments ABI-encoded'")
        print()
        print("=" * 70)
    else:
        print()
        print("❌ Failed to encode constructor arguments.")
        print("   Please edit the script and update the addresses.")
        print()

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("⚠️  web3 library not found. Install with:")
        print("   pip3 install web3")
    except Exception as e:
        print(f"❌ Error: {e}")
