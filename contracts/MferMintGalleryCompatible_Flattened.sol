// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// OpenZeppelin Contracts (last updated v4.9.0)

/**
 * @dev Interface of the ERC165 standard
 */
interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

/**
 * @dev Implementation of the {IERC165} interface.
 */
abstract contract ERC165 is IERC165 {
    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165) returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}

/**
 * @dev String operations.
 */
library Strings {
    bytes16 private constant _SYMBOLS = "0123456789abcdef";
    uint8 private constant _ADDRESS_LENGTH = 20;

    function toString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = Math.log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            assembly {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                assembly {
                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    function toHexString(uint256 value) internal pure returns (string memory) {
        unchecked {
            return toHexString(value, Math.log256(value) + 1);
        }
    }

    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    function toHexString(address value) internal pure returns (string memory) {
        return toHexString(uint256(uint160(value)), _ADDRESS_LENGTH);
    }
}

/**
 * @dev Math operations with safety checks.
 */
library Math {
    enum Rounding {
        Down,
        Up,
        Zero
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        return (a & b) + (a ^ b) / 2;
    }

    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        uint256 prod0;
        uint256 prod1;
        assembly {
            let mm := mulmod(x, y, not(0))
            prod0 := mul(x, y)
            prod1 := sub(sub(mm, prod0), lt(mm, prod0))
        }

        if (prod1 == 0) {
            return prod0 / denominator;
        }

        require(denominator > prod1, "Math: mulDiv overflow");

        uint256 remainder;
        assembly {
            remainder := mod(prod0, denominator)
            prod0 := div(prod0, denominator)
            prod1 := div(prod1, denominator)
            let delta := sub(denominator, remainder)
            prod1 := sub(prod1, gt(delta, prod0))
            prod0 := sub(prod0, delta)
        }

        return prod0;
    }

    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 result = 1 << (log2(a) >> 1);

        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
        }
    }

    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 1;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 1;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 1;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 1;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 1;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 1;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 1;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }
}

/**
 * @dev Provides information about the current execution context.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(_msgSender());
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

/**
 * @dev Interface of ERC721
 */
interface IERC721 is IERC165 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool _approved) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

/**
 * @dev ERC721 implementation
 */
contract ERC721 is Context, ERC165, IERC721 {
    using Strings for uint256;

    string private _name;
    string private _symbol;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC721).interfaceId || super.supportsInterface(interfaceId);
    }

    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 tokenId) public view virtual returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()), "ERC721: approve caller is not token owner or approved for all");
        _approve(to, tokenId);
    }

    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "ERC721: invalid token ID");
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) public virtual override {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _safeTransfer(from, to, tokenId, data);
    }

    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) internal virtual {
        _transfer(from, to, tokenId);
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    function _safeMint(address to, uint256 tokenId) internal virtual {
        _safeMint(to, tokenId, "");
    }

    function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual {
        _mint(to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal virtual {
        require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to the zero address");

        _approve(address(0), tokenId);
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    function _setApprovalForAll(address owner, address operator, bool approved) internal virtual {
        require(owner != operator, "ERC721: approve to caller");
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }
}

/**
 * @dev Interface for ERC2981 royalties
 */
interface IERC2981 is IERC165 {
    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount);
}

/**
 * @dev ERC2981 implementation
 */
abstract contract ERC2981 is IERC2981, ERC165 {
    struct RoyaltyInfo {
        address receiver;
        uint96 royaltyFraction;
    }

    RoyaltyInfo private _defaultRoyaltyInfo;

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) public view virtual override returns (address, uint256) {
        RoyaltyInfo memory royalty = _defaultRoyaltyInfo;
        uint256 royaltyAmount = (_salePrice * royalty.royaltyFraction) / 10000;
        return (royalty.receiver, royaltyAmount);
    }

    function _setDefaultRoyalty(address receiver, uint96 feeNumerator) internal virtual {
        require(feeNumerator <= 10000, "ERC2981: royalty fee will exceed salePrice");
        require(receiver != address(0), "ERC2981: invalid receiver");
        _defaultRoyaltyInfo = RoyaltyInfo(receiver, feeNumerator);
    }

    function _deleteDefaultRoyalty() internal virtual {
        delete _defaultRoyaltyInfo;
    }
}

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
