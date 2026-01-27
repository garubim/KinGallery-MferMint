// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/common/ERC2981.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/access/Ownable.sol";

/**
 * @title MferBk0Base
 * @notice Smart gallery-compatible NFT contract
 * 
 * MINTING FLOWS:
 * 1. creatorMint() → Artist mints FREE (only gas)
 * 2. mintForWithEthFromGallery() + to==artist → Refund artist's ETH
 * 3. mintForWithEthFromGallery() + to≠artist → Gallery keeps ETH commission
 * 
 * Storage: mapping(string => bool) mintedWithPaymentId ✅
 * Interface: mintForWithEthFromGallery(address,string) payable ✅
 * Max Supply: 1000 ERC-721 tokens ✅
 */
contract MferBk0Base is ERC721, ERC2981, Ownable {
    uint256 private _tokenIdCounter = 1;
    string private _baseTokenURI = "ipfs://metadata/";
    address public gallery;
    address public artist;
    uint96 public royaltyPercentage;
    
    // CRITICAL: maxTotalSupply for BaseScan verification
    uint256 public maxTotalSupply = 1000;
    
    // Storage layout: string-based paymentId mapping (NOT bytes32!)
    mapping(string => bool) public mintedWithPaymentId;
    
    event MintedFor(address indexed to, uint256 indexed tokenId, string paymentId);
    event ArtistMinted(address indexed artist, uint256 tokenId, string paymentId);
    event GalleryUpdated(address indexed newGallery);
    event ArtistUpdated(address indexed newArtist);
    event RoyaltyUpdated(uint96 percentage);
    
    /**
     * @dev Constructor
     * @param name_ "Mfer-0-Base"
     * @param symbol_ "MFR0BASE"
     * @param baseURI_ "https://[your-app]/api/metadata/" (MUST end with /)
     * @param initialOwner_ Artist EOA: 0xbcd980d37293CBee62Bf5f93a26a0B744C18964D
     */
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

    // --- Artist Minting (FREE) ---
    
    /**
     * @dev Artist mints for free (only gas cost)
     */
    function creatorMint(string calldata paymentId) external onlyArtist {
        require(bytes(paymentId).length > 0, "Invalid paymentId");
        require(!mintedWithPaymentId[paymentId], "Used");
        
        mintedWithPaymentId[paymentId] = true;
        uint256 tokenId = _tokenIdCounter++;
        require(tokenId <= maxTotalSupply, "Max supply reached");
        
        _safeMint(artist, tokenId);
        emit ArtistMinted(artist, tokenId, paymentId);
    }

    // --- Gallery Minting (ETH PAYMENT) ---
    
    /**
     * @dev Called by KinGallery after payment is processed
     * If to == artist: refund ETH (generous model)
     * If to != artist: gallery keeps ETH commission
     */
    function mintForWithEthFromGallery(address to, string calldata paymentId) external payable onlyGallery {
        require(to != address(0), "Invalid to");
        require(bytes(paymentId).length > 0, "Invalid paymentId");
        require(!mintedWithPaymentId[paymentId], "Used");
        
        mintedWithPaymentId[paymentId] = true;
        uint256 tokenId = _tokenIdCounter++;
        require(tokenId <= maxTotalSupply, "Max supply reached");
        
        _safeMint(to, tokenId);
        
        // Generous model: refund artist if they're minting for themselves
        if (to == artist && msg.value > 0) {
            (bool success, ) = payable(to).call{value: msg.value}("");
            require(success, "Refund failed");
        } else if (msg.value > 0) {
            // Normal flow: gallery keeps the commission
            (bool success, ) = payable(gallery).call{value: msg.value}("");
            require(success, "Transfer failed");
        }
        
        emit MintedFor(to, tokenId, paymentId);
    }

    // --- Admin Functions ---
    
    function setGallery(address _gallery) external onlyOwner {
        require(_gallery != address(0), "Invalid gallery");
        gallery = _gallery;
        emit GalleryUpdated(_gallery);
    }

    function setArtist(address _artist) external onlyOwner {
        require(_artist != address(0), "Invalid artist");
        artist = _artist;
        emit ArtistUpdated(_artist);
    }

    function setRoyalty(uint96 _percentage) external onlyOwner {
        require(_percentage <= 10000, "Royalty too high");
        royaltyPercentage = _percentage;
        _setDefaultRoyalty(artist, _percentage);
        emit RoyaltyUpdated(_percentage);
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        require(_maxSupply >= _tokenIdCounter - 1, "Cannot reduce below minted count");
        maxTotalSupply = _maxSupply;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        require(bytes(baseURI_)[bytes(baseURI_).length - 1] == '/', "BaseURI must end with /");
        _baseTokenURI = baseURI_;
    }

    // --- Metadata ---
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        string memory baseURI = _baseURI();
        return string(abi.encodePacked(baseURI, _toString(tokenId), ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // --- Utility ---
    
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    function remainingSupply() external view returns (uint256) {
        return maxTotalSupply - (_tokenIdCounter - 1);
    }

    receive() external payable {}
}
