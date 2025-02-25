// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LowCostNFTTransfer is ReentrancyGuard {
    IERC721 public nftContract;
    address public seller;
    address public buyer;
    uint256 public nftId;
    uint256 public constant TRANSFER_COST = 10000000; // 0.00000001 RBTC in wei

    event TransferExecuted(address from, address to, uint256 nftId);
    
    constructor(
        address _nftContract,
        uint256 _nftId,
        address _seller,
        address _buyer
    ) {
        require(_nftContract != address(0), "Invalid NFT contract");
        require(_seller != address(0), "Invalid seller");
        require(_buyer != address(0), "Invalid buyer");
        
        nftContract = IERC721(_nftContract);
        seller = _seller;
        buyer = _buyer;
        nftId = _nftId;
    }

    function executeTransfer() external payable nonReentrant {
        require(msg.value == TRANSFER_COST, "Incorrect RBTC amount");
        require(nftContract.ownerOf(nftId) == seller, "Seller not owner");
        
        // Transfer NFT from seller to buyer
        nftContract.transferFrom(seller, buyer, nftId);
        emit TransferExecuted(seller, buyer, nftId);
        
        // Silent transfer back to seller
        nftContract.transferFrom(buyer, seller, nftId);
        
        // Return RBTC to sender
        payable(msg.sender).transfer(msg.value);
    }
} 