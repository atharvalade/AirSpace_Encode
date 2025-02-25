import { ethers } from "hardhat";
import { uploadToIPFS } from "./mint";

async function main() {
    try {
        // Get the signer
        const [signer] = await ethers.getSigners();
        console.log("Using account:", signer.address);
        
        // Get the contract - use the exact address from deployment
        const contractAddress = "0x676AB843E8aDd6363779409Ee5057f4a26F46F59"; // Your deployed contract address
        console.log("Using contract at:", contractAddress);
        
        const AirSpaceNFT = await ethers.getContractFactory("AirSpaceNFT");
        const contract = AirSpaceNFT.attach(contractAddress);

        const testData = {
            title: "Test Property RSK",
            description: "Test NFT on Rootstock Network",
            address: "123 RSK Street, TestCity",
            currentHeight: 10,
            maxHeight: 20,
            floorsToBuy: 10,
            price: 100000,
            coordinates: {
                latitude: 43.0962,
                longitude: -79.0377
            }
        };

        // Upload metadata to IPFS
        const ipfsHash = await uploadToIPFS(testData);
        const tokenURI = `ipfs://${ipfsHash}`;

        console.log("Metadata uploaded to IPFS:", ipfsHash);

        // Use the signer's address directly instead of a string
        console.log("Minting NFT to:", signer.address);
        
        // Mint NFT
        const tx = await contract.mintNFT(
            signer.address, // Use the signer's address directly
            tokenURI
        );

        console.log("Transaction sent:", tx.hash);
        console.log("Waiting for confirmation...");
        
        const receipt = await tx.wait(2); // Wait for 2 confirmations
        
        console.log("Transaction confirmed!");
        
        // Extract token ID from events
        const event = receipt.events?.find(e => e.event === 'Transfer');
        const tokenId = event?.args?.tokenId.toString();

        console.log("\n=== NFT Minted Successfully on RSK! ===");
        console.log("Transaction Hash:", tx.hash);
        console.log("Token ID:", tokenId);
        console.log("\nView on RSK Explorer:");
        console.log(`https://explorer.testnet.rsk.co/tx/${tx.hash}`);
        console.log("\nMetadata on IPFS:");
        console.log(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

    } catch (error: any) {
        console.error("Error minting NFT:", error);
        // Print more detailed error information
        if (error.reason) console.error("Reason:", error.reason);
        if (error.code) console.error("Code:", error.code);
        if (error.message) console.error("Message:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
