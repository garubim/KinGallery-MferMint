// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/common/ERC2981.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/access/Ownable.sol";

/**
 * @title MferMintGalleryCompatible
 * @notice Smart gallery-compatible NFT contract with creator-friendly pricing model:
 * 
 * MINTING FLOWS:
 * 1. creatorMint() → Artist mints FREE (no ETH, only gas)
 * 2. mintForWithEthFromGallery() + to==artist → Artist's ETH is refunded (generous model)
 * 3. mintForWithEthFromGallery() + to≠artist → Gallery receives ETH commission (normal flow)
 * 
 * This matches the Zora/Highlight/Transient Labs approach: 
 * Creators get generous terms, galleries only profit from third-party mints.
 */
contract MferMintGalleryCompatible is ERC721, ERC2981, Ownable {
    uint256 private _tokenIdCounter = 1;
    string private _baseTokenURI = "ipfs://metadata/";
    address public gallery;
    address public artist;
    uint96 public royaltyPercentage;
    
    mapping(bytes32 => bool) public mintedWithPaymentId;
    
    event MintedFor(address indexed to, uint256 indexed tokenId, bytes32 paymentId);
    event ArtistMinted(address indexed artist, uint256 tokenId, bytes32 paymentId);
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
    
    function mintFor(address to, bytes32 paymentId) external onlyGallery {
        require(to != address(0), "Invalid to");
        require(paymentId != bytes32(0), "Invalid paymentId");
        require(!mintedWithPaymentId[paymentId], "Used");
        
        mintedWithPaymentId[paymentId] = true;
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        
        emit MintedFor(to, tokenId, paymentId);
    }
    
    function mintForWithEthFromGallery(address to, bytes32 paymentId) external payable onlyGallery {
        require(to != address(0), "Invalid to");
        require(paymentId != bytes32(0), "Invalid paymentId");
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
        
        emit ArtistMinted(artist, tokenId, bytes32(0));
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

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        string memory baseURI = _baseURI();
        // Adiciona .json automaticamente no final da URI
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
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
