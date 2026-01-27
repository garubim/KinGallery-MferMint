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

    // Public name for BaseScan verification
    string public name = "KinGallery";

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

    /**
     * @dev Constructor for KinGallery v2
     * @param _usdc Base USDC address: 0x833589fCD6eDb6E08f4c7C32d4f71b54bda02913
     * @param _multisig Gnosis Safe multisig: 0x4d639D1Bd428899599F0Da564926DA1a1A3bd3a8
     * @param _payee2 Gallery (Smart Wallet): 0x26dcd83d4e449059abf0334e4435d48e74f28eb0
     */
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

        // Grant ADMIN_ROLE to deployer, multisig, and payee2
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

    // --- Core Minting Functions ---

    /**
     * @dev Mint with ETH payment
     * Splits payment: 0.0002 ETH to artist, 0.0001 ETH to gallery
     */
    function payAndMint(
        address artistContract,
        address to,
        string calldata paymentId
    ) external payable nonReentrant whenNotPaused {
        require(artistContract != ADDRESS_ZERO, "Invalid artist contract");
        require(to != ADDRESS_ZERO, "Invalid recipient");
        require(bytes(paymentId).length > 0, "Invalid paymentId");
        require(msg.value >= mintPrice, "Insufficient ETH");
        require(!processedPayment[paymentId], "Payment already processed");

        processedPayment[paymentId] = true;

        // Get artist from contract
        address artistPayee = IMferMint(artistContract).owner();
        require(artistPayee != ADDRESS_ZERO, "Artist not found");

        // Check payee2 is set
        require(payee2 != ADDRESS_ZERO, "Gallery payee not set");

        // Transfer to artist (0.0002 ETH)
        if (PAYEE1_AMOUNT > 0) {
            (bool success, ) = payable(artistPayee).call{value: PAYEE1_AMOUNT}("");
            require(success, "Artist transfer failed");
        }

        // Transfer to gallery (0.0001 ETH)
        if (PAYEE2_AMOUNT > 0) {
            (bool success, ) = payable(payee2).call{value: PAYEE2_AMOUNT}("");
            require(success, "Gallery transfer failed");
        }

        // Calculate remaining value for mint
        uint256 remainingValue = msg.value - PAYEE1_AMOUNT - PAYEE2_AMOUNT;

        // Call artist contract to mint
        IMferMint(artistContract).mintForWithEthFromGallery{value: remainingValue}(to, paymentId);

        emit Processed(artistContract, artistPayee, to, msg.value, paymentId);
    }

    /**
     * @dev Process USDC payment (future implementation)
     */
    function processPayment(
        address artistContract,
        address to,
        uint256 amount,
        string calldata paymentId
    ) external nonReentrant whenNotPaused {
        require(artistContract != ADDRESS_ZERO, "Invalid artist contract");
        require(to != ADDRESS_ZERO, "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(bytes(paymentId).length > 0, "Invalid paymentId");
        require(!processedPayment[paymentId], "Payment already processed");

        processedPayment[paymentId] = true;

        // Transfer USDC from sender to contract
        usdc.safeTransferFrom(msg.sender, address(this), amount);

        // Call artist contract to mint
        IMferMint(artistContract).mintFor(to, paymentId);

        emit Processed(artistContract, msg.sender, to, amount, paymentId);
    }

    // --- Withdrawal Functions ---

    function withdrawETH(address payable to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(to != ADDRESS_ZERO, "Invalid recipient");
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Withdrawal failed");
        emit WithdrawnETH(to, amount);
    }

    function withdrawUSDC(address to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(to != ADDRESS_ZERO, "Invalid recipient");
        usdc.safeTransfer(to, amount);
        emit WithdrawnUSDC(to, amount);
    }

    // --- Utility Functions ---

    receive() external payable {
        emit ETHReceived(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getUSDCBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}
