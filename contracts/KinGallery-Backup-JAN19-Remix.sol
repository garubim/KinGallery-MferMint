// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/ERC20/utils/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/access/AccessControl.sol";

interface IMferMint {
    function mintFor(address to, string calldata paymentId) external;
    function mintForWithEthFromGallery(address to, string calldata paymentId) external payable;
    function owner() external view returns (address);
}

contract KinGallery is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20Metadata;

    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    address private constant ADDRESS_ZERO = address(0);

    // State variables
    IERC20Metadata public immutable usdc;
    address public feeRecipient;
    uint256 public feeBps; // parts per 10k (e.g., 500 = 5%)

    // Payee addresses (configurable by admin)
    // payee1: Collection Issuer owner (REMOVED - now dynamic via owner())
    // payee2: Gallery address (fixed at deployment)
    address public payee2;
    uint256 public constant PAYEE1_AMOUNT = 200_000_000_000_000; // 0.0002 ETH (Artist)
    uint256 public constant PAYEE2_AMOUNT = 100_000_000_000_000; // 0.0001 ETH (Gallery)

    // Track processed payments to prevent replay attacks
    mapping(string => bool) public processedPayment;

    // Events
    event FeeUpdated(address indexed recipient, uint256 indexed oldBps, uint256 indexed newBps);
    event Processed(address indexed artistContract, address indexed artistPayee, address indexed to, uint256 amount, string paymentId);
    event WithdrawnUSDC(address indexed to, uint256 amount);
    event WithdrawnETH(address indexed to, uint256 amount);
    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);
    event GalleryPayeeUpdated(address indexed newPayee2);
    event ETHReceived(address indexed sender, uint256 amount);
    event MintPriceUpdated(uint256 indexed newPrice);

    // Mint price in wei (0.0003 ETH default, configurable by admin)
    uint256 public mintPrice = 300_000_000_000_000;



    modifier onlyNonRenouncingAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only admin");
        _;
    }

    constructor(
        address _usdc,
        address _multisig,
        address _payee2
    ) {
        usdc = IERC20Metadata(_usdc);
        require(_usdc != ADDRESS_ZERO, "USDC address required");

        feeRecipient = _multisig;
        require(_multisig != ADDRESS_ZERO, "Invalid multisig");

        feeBps = 0;
        payee2 = _payee2;  // Gallery address (fixed)
        require(_payee2 != ADDRESS_ZERO, "Gallery payee required");

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, _multisig);
        _grantRole(DEFAULT_ADMIN_ROLE, _payee2);
    }

    // --- Admin Functions ---
    function setFee(address _recipient, uint256 _bps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_bps <= 10000, "bps too large");
        require(_recipient != ADDRESS_ZERO || _bps == 0, "invalid fee recipient");
        uint256 oldBps = feeBps;
        feeRecipient = _recipient;
        feeBps = _bps;
        emit FeeUpdated(_recipient, oldBps, _bps);
    }

    function setGalleryPayee(address _payee2) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_payee2 != ADDRESS_ZERO, "invalid payee");
        payee2 = _payee2;
        emit GalleryPayeeUpdated(_payee2);
    }

    function setMintPrice(uint256 _price) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_price > 0, "Price must be > 0");
        mintPrice = _price;
        emit MintPriceUpdated(_price);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }



    // --- ERC-165 Support ---
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // --- Core Logic ---
    function processPayment(
        address artistContract,
        address to,
        uint256 amount,
        string calldata paymentId
    ) external nonReentrant whenNotPaused {
        require(!processedPayment[paymentId], "Payment already processed");
        
        // Cache balance to save gas
        uint256 contractBalance = usdc.balanceOf(address(this));
        require(contractBalance >= amount, "Insufficient USDC");
        
        require(to != ADDRESS_ZERO, "invalid recipient");
        require(artistContract != ADDRESS_ZERO, "invalid artist contract");

        processedPayment[paymentId] = true;

        // Get artist owner dynamically
        address artistPayee;
        try IMferMint(artistContract).owner() returns (address _owner) {
            require(_owner != ADDRESS_ZERO, "Artist owner not configured");
            artistPayee = _owner;
        } catch {
            revert("Artist contract must implement owner() function");
        }

        // Calculate and deduct fee (if applicable)
        uint256 fee = (feeBps > 0 && feeRecipient != ADDRESS_ZERO)
            ? (amount * feeBps) / 10000
            : 0;

        if (fee > 0) {
            usdc.safeTransfer(feeRecipient, fee);
        }

        uint256 amountAfterFee = amount - fee;
        usdc.safeTransfer(artistPayee, amountAfterFee);

        // Mint NFT with error handling
        try IMferMint(artistContract).mintFor(to, paymentId) {
            // Success
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("Minting failed: ", reason)));
        } catch {
            revert("Minting failed: unknown error");
        }
        
        emit Processed(artistContract, artistPayee, to, amount, paymentId);
    }

    function payAndMint(
        address artistContract,
        address to,
        string calldata paymentId
    ) external payable nonReentrant whenNotPaused {
        // 1. Checks (require statements)
        require(msg.value == mintPrice, "Incorrect payment amount");
        require(!processedPayment[paymentId], "Payment already processed");
        require(to != ADDRESS_ZERO, "invalid recipient");
        require(artistContract != ADDRESS_ZERO, "invalid artist contract");
        require(payee2 != ADDRESS_ZERO, "Gallery payee not set");

        // 2. Effects (state changes)
        processedPayment[paymentId] = true;

        // Get artist owner dynamically
        address artistPayee;
        try IMferMint(artistContract).owner() returns (address _owner) {
            require(_owner != ADDRESS_ZERO, "Artist owner not configured");
            artistPayee = _owner;
        } catch {
            revert("Artist contract must implement owner() function");
        }

        // 3. Interactions (external calls)
        // Split payment (fail early if transfers fail)
        if (PAYEE1_AMOUNT > 0) {
            (bool success1, ) = payable(artistPayee).call{value: PAYEE1_AMOUNT}("");
            require(success1, "Artist transfer failed");
        }
        if (PAYEE2_AMOUNT > 0) {
            (bool success2, ) = payable(payee2).call{value: PAYEE2_AMOUNT}("");
            require(success2, "Gallery transfer failed");
        }

        // Mint NFT with error handling (forward remaining ETH after payee splits)
        uint256 remainingValue = mintPrice - PAYEE1_AMOUNT - PAYEE2_AMOUNT;
        try IMferMint(artistContract).mintForWithEthFromGallery{value: remainingValue}(to, paymentId) {
            // Success
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("Minting failed: ", reason)));
        } catch {
            revert("Minting failed: unknown error");
        }
        
        emit Processed(artistContract, artistPayee, to, mintPrice, paymentId);
    }

    // --- Withdrawals ---
    function withdrawUSDC(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        require(amount > 0, "amount must be > 0");
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient USDC");
        usdc.safeTransfer(msg.sender, amount);
        emit WithdrawnUSDC(msg.sender, amount);
    }

    function withdrawETH(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        require(amount > 0, "amount must be > 0");
        require(address(this).balance >= amount, "Insufficient ETH");
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");
        emit WithdrawnETH(msg.sender, amount);
    }

    // --- Fallback for ETH (defensive) ---
    receive() external payable {
        emit ETHReceived(msg.sender, msg.value);
    }
}
