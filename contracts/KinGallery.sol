// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IMferMint {
    function mintFor(address to, string calldata paymentId) external;
    function mintForWithEthFromGallery(address to, string calldata paymentId) external payable;
}

contract KinGallery is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Address for address payable;

    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");

    // pending withdrawals (pull payments) for ETH credits (artist or other recipients)
    mapping(address => uint256) public pendingWithdrawals;

    IERC20 public immutable usdc;
    address public feeRecipient;
    uint256 public feeBps; // parts per 10k

    mapping(string => bool) public processedPayment;

    event FeeUpdated(address indexed recipient, uint256 bps);
    event Processed(address indexed artistContract, address indexed to, uint256 amount, string paymentId);
    event WithdrawnUSDC(address indexed to, uint256 amount);
    event WithdrawnETH(address indexed to, uint256 amount);

    // Fixed mint price in wei (0.0003 ETH)
    uint256 public constant MINT_PRICE = 300000000000000; // 0.0003 ether
    // Split amounts in wei
    uint256 public constant PAYEE1_AMOUNT = 170000000000000; // 0.00017
    uint256 public constant PAYEE2_AMOUNT = 130000000000000; // 0.00013

    modifier onlyRelayer() {
        require(hasRole(RELAYER_ROLE, msg.sender), "Only relayer");
        _;
    }

    constructor(address _usdc, address _multisig) {
        usdc = IERC20(_usdc);
        feeRecipient = address(0);
        feeBps = 0;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // Smart wallet
        _grantRole(DEFAULT_ADMIN_ROLE, _multisig); // Multisig
        _grantRole(RELAYER_ROLE, _multisig); // Multisig como relayer inicial
    }

    function setFee(address _recipient, uint256 _bps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_bps <= 10000, "bps too large");
        require(_recipient != address(0) || _bps == 0, "invalid fee recipient");
        feeRecipient = _recipient;
        feeBps = _bps;
        emit FeeUpdated(_recipient, _bps);
    }

    function setRelayer(address _relayer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_relayer != address(0), "zero relayer");
        _grantRole(RELAYER_ROLE, _relayer);
    }

    function removeRelayer(address _relayer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(RELAYER_ROLE, _relayer);
    }

    // Called by relayer (Wallet Server v2) to process a payment that resulted in USDC being sent to this KinGallery contract.
    function processPayment(address artistContract, address to, uint256 amount, string calldata paymentId) external onlyRelayer nonReentrant {
        require(!processedPayment[paymentId], "Payment already processed");
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient USDC in KinGallery");

        processedPayment[paymentId] = true;

        uint256 fee = 0;
        if (feeBps > 0 && feeRecipient != address(0)) {
            fee = (amount * feeBps) / 10000;
            if (fee > 0) {
                usdc.safeTransfer(feeRecipient, fee);
            }
        }

        uint256 net = amount - fee;

        // forward net to artist contract
        usdc.safeTransfer(artistContract, net);

        // call artist contract's mintFor
        IMferMint(artistContract).mintFor(to, paymentId);

        emit Processed(artistContract, to, amount, paymentId);
    }

    // Direct ETH mint: user sends ETH directly
    function payAndMint(address artistContract, address to, string calldata paymentId) external payable nonReentrant {
        require(msg.value == MINT_PRICE, "Price mismatch");
        require(!processedPayment[paymentId], "Payment already processed");

        processedPayment[paymentId] = true;

        // Forward to artist contract
        IMferMint(artistContract).mintForWithEthFromGallery{value: msg.value}(to, paymentId);

        emit Processed(artistContract, to, msg.value, paymentId);
    }

    // Withdraw functions
    function withdrawUSDC(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient USDC");
        usdc.safeTransfer(msg.sender, amount);
        emit WithdrawnUSDC(msg.sender, amount);
    }

    function withdrawETH(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(address(this).balance >= amount, "Insufficient ETH");
        payable(msg.sender).sendValue(amount);
        emit WithdrawnETH(msg.sender, amount);
    }

    // Emergency withdraw pending
    function withdrawPendingETH() external {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No pending withdrawal");
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).sendValue(amount);
        emit WithdrawnETH(msg.sender, amount);
    }
}