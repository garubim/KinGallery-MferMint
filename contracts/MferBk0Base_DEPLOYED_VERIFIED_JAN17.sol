/**
 * MferBk0Base - DEPLOYED & VERIFIED (Jan 17, 2026)
 * 
 * ⚠️ ESTE É O ARQUIVO ORIGINAL DO CONTRATO DEPLOYADO E VERIFICADO
 * 
 * Informações de Deployment:
 * - Endereço: 0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241 (Base Mainnet)
 * - Compiler: solc 0.8.19+commit.7dd6d404
 * - Status: ✅ Verificado em Sourcify (Exact Match)
 * - Verificação: 2026-01-17 05:35:12 UTC
 * - Tx Hash: 0x6cb08e99875985e9a1e934becba3cf783d0c4359801f99bcda44cdd81062d93e
 * - Block: 40919376
 * - Deployer: 0xbcd980d37293CBee62Bf5f93a26a0B744C18964D
 * - Storage: mapping(string => bool) mintedWithPaymentId ✅
 * 
 * ⚠️ NÃO EDITAR ESTE ARQUIVO DIRETAMENTE
 * 
 * Este arquivo é um backup histórico do código-fonte original que foi
 * compilado e deployado. Se precisar fazer alterações, crie um novo arquivo
 * com versão incrementada (ex: MferBk0Base_v2.sol).
 * 
 * Para verificar o código original no Sourcify:
 * https://repo.sourcify.dev/8453/0x01ECF65958dB5d1859d815ffC96b7b8C5e16E241
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/common/ERC2981.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/access/Ownable.sol";

/**
 * @title MferBk0Base
 * @notice Smart gallery-compatible NFT contract with creator-friendly pricing model:
 * 
 * MINTING FLOWS:
 * 1. creatorMint() → Artist mints FREE (no ETH, only gas)
 * 2. mintForWithEthFromGallery() + to==artist → Artist's ETH is refunded (generous model)
 * 3. mintForWithEthFromGallery() + to≠artist → Gallery receives ETH commission (normal flow)
 * 
 * This matches the Zora/Highlight/Transient Labs approach: 
 * Creators get generous terms, galleries only profit from third-party mints.
 * 
 * COMPATÍVEL COM KinGallery: usa string calldata paymentId
 */
contract MferBk0Base is ERC721, ERC2981, Ownable {
    uint256 private _tokenIdCounter = 1;
    string private _baseTokenURI = "ipfs://metadata/";
    address public gallery;
    address public artist;
    uint96 public royaltyPercentage;
    
    // Storage layout confirmado via Sourcify:
    // mapping(string => bool) public mintedWithPaymentId
    mapping(string => bool) public mintedWithPaymentId;
    
    event MintedFor(address indexed to, uint256 indexed tokenId, string paymentId);
    event ArtistMinted(address indexed artist, uint256 tokenId, string paymentId);
    event RoyaltyUpdated(uint96 percentage);
    
    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        address initialOwner_
    ) ERC721(name_, symbol_) Ownable() {
        require(initialOwner_ != address(0), "Invalid owner");
        if (bytes(baseURI_).length > 0) {
            require(bytes(baseURI_)[bytes(baseURI_).length - 1] == '/', "BaseURI must end with /");
            _baseTokenURI = baseURI_;
        }
        gallery = initialOwner_;
        artist = initialOwner_;
        royaltyPercentage = 500; // 5% default
        
        // Set default royalty: 5% to artist
        _setDefaultRoyalty(initialOwner_, 500);
    }
    
    modifier onlyGallery() {
        require(msg.sender == gallery, "Only gallery");
        _;
    }
    
    modifier onlyArtist() {
        require(msg.sender == artist, "Only artist");
        _;
    }
    
    function mintFor(address to, string calldata paymentId) external onlyGallery {
        require(to != address(0), "Invalid to");
        require(bytes(paymentId).length > 0, "Invalid paymentId");
        require(!mintedWithPaymentId[paymentId], "Used");
        
        mintedWithPaymentId[paymentId] = true;
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        
        emit MintedFor(to, tokenId, paymentId);
    }
    
    function mintForWithEthFromGallery(address to, string calldata paymentId) external payable onlyGallery {
        require(to != address(0), "Invalid to");
        require(bytes(paymentId).length > 0, "Invalid paymentId");
        require(!mintedWithPaymentId[paymentId], "Used");
        
        mintedWithPaymentId[paymentId] = true;
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        
        uint256 ethToTransfer = msg.value;
        
        // If artist is minting their own work via gallery, refund the fee
        // This keeps the creator's ETH in their wallet
        if (to == artist && msg.value > 0) {
            (bool success, ) = payable(to).call{value: msg.value}("");
            require(success, "Refund failed");
            ethToTransfer = 0;
        } else if (msg.value > 0) {
            // Normal flow: gallery gets the commission
            (bool success, ) = payable(owner()).call{value: msg.value}("");
            require(success, "Transfer failed");
        }
        
        emit MintedFor(to, tokenId, paymentId);
    }
    
    function creatorMint() external onlyArtist returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(artist, tokenId);
        
        emit ArtistMinted(artist, tokenId, "");
        return tokenId;
    }
    
    function setRoyalty(uint96 newPercentage) external onlyOwner {
        require(newPercentage <= 10000, "Max 100%");
        royaltyPercentage = newPercentage;
        _setDefaultRoyalty(artist, newPercentage);
        
        emit RoyaltyUpdated(newPercentage);
    }
    
    function setArtist(address newArtist) external onlyOwner {
        require(newArtist != address(0), "Invalid artist");
        artist = newArtist;
        _setDefaultRoyalty(newArtist, royaltyPercentage);
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function setBaseURI(string memory newURI) external onlyOwner {
        _baseTokenURI = newURI;
    }
    
    function setGallery(address newGallery) external onlyOwner {
        require(newGallery != address(0), "Invalid gallery");
        gallery = newGallery;
    }
    
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "Withdrawal failed");
        }
    }
    
    function withdrawTo(address recipient) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(recipient).call{value: balance}("");
            require(success, "Withdrawal failed");
        }
    }
    
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    receive() external payable {}
}
