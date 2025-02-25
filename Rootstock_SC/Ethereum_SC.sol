// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {
    // State variables
    IERC721 public nftContract;
    address payable public seller;
    address public buyer;
    uint256 public price;
    uint256 public nftId;
    bool public isCompleted;

    // Events
    event TradeExecuted(address seller, address buyer, uint256 nftId, uint256 price);
    event TradeFailed(address seller, address buyer, uint256 nftId, string reason);

    constructor(
        address _nftContract,
        uint256 _nftId,
        uint256 _price,
        address _buyer,
        address _seller
    ) {
        require(_nftContract != address(0), "Invalid NFT contract address");
        require(_buyer != address(0), "Invalid buyer address");
        require(_seller != address(0), "Invalid seller address");
        require(_price > 0, "Price must be greater than 0");

        nftContract = IERC721(_nftContract);
        seller = payable(_seller);
        buyer = _buyer;
        price = _price;
        nftId = _nftId;
        isCompleted = false;
    }

    function executeTradeAndTransfer() external payable nonReentrant {
        require(!isCompleted, "Trade already completed");
        require(msg.value == price, "Incorrect ETH amount");
        
        // Check NFT ownership
        require(nftContract.ownerOf(nftId) == seller, "Seller does not own the NFT");
        
        try nftContract.transferFrom(seller, buyer, nftId) {
            // Transfer ETH to seller
            (bool sent, ) = seller.call{value: msg.value}("");
            require(sent, "Failed to send ETH to seller");

            isCompleted = true;
            emit TradeExecuted(seller, buyer, nftId, msg.value);
        } catch Error(string memory reason) {
            emit TradeFailed(seller, buyer, nftId, reason);
            // Refund ETH to buyer
            payable(msg.sender).transfer(msg.value);
        }
    }

    function getTradeStatus() external view returns (
        address _nftContract,
        address _seller,
        address _buyer,
        uint256 _price,
        uint256 _nftId,
        bool _isCompleted
    ) {
        return (
            address(nftContract),
            seller,
            buyer,
            price,
            nftId,
            isCompleted
        );
    }
}