import { ethers } from "hardhat";
import { uploadToIPFS } from "./mint";

// Define the NFT metadata structure
interface NFTMetadata {
  title: string;
  description: string;
  address: string;
  currentHeight: number | string;
  maxHeight: number | string;
  floorsToBuy: string;
  price: number | string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Function to convert string values to numbers where needed
function prepareMetadata(metadata: NFTMetadata): any {
  // Extract numeric values from strings if needed
  const currentHeight = typeof metadata.currentHeight === 'string' 
    ? parseInt(metadata.currentHeight.toString().split(' ')[0]) 
    : metadata.currentHeight;
  
  const maxHeight = typeof metadata.maxHeight === 'string'
    ? parseInt(metadata.maxHeight.toString().split(' ')[0])
    : metadata.maxHeight;
  
  // Extract price as number (remove commas and convert to number)
  const price = typeof metadata.price === 'string'
    ? parseInt(metadata.price.toString().replace(/,/g, ''))
    : metadata.price;
  
  // Extract floors to buy range
  const floorsToBuy = typeof metadata.floorsToBuy === 'string' && metadata.floorsToBuy.includes('-')
    ? parseInt(metadata.floorsToBuy.split('-')[1]) - parseInt(metadata.floorsToBuy.split('-')[0]) + 1
    : metadata.floorsToBuy;

  // Return formatted metadata
  return {
    title: metadata.title,
    description: metadata.description,
    address: metadata.address,
    currentHeight,
    maxHeight,
    floorsToBuy,
    price,
    coordinates: metadata.coordinates || {
      // Default coordinates if not provided
      latitude: 0,
      longitude: 0
    }
  };
}

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

    // Define the NFT metadata collection
    const nftCollection: NFTMetadata[] = [
      {
        title: "Niagara Falls Hotel View Rights",
        description: "Secure the pristine view of Niagara Falls by purchasing air rights above the existing hotel structure. Prime location with unobstructed views of the falls.",
        address: "6650 Niagara Parkway, Niagara Falls, ON L2G 0L0",
        currentHeight: "10 floors",
        maxHeight: "25 floors",
        floorsToBuy: "11-25 floors",
        price: "250,000",
        coordinates: {
          latitude: 43.0962,
          longitude: -79.0377
        }
      },
      {
        title: "Vancouver Harbor View Rights",
        description: "Protect your panoramic view of Vancouver's harbor and North Shore mountains. Strategic location in downtown Vancouver.",
        address: "1128 West Georgia Street, Vancouver, BC V6E 0A8",
        currentHeight: "15 floors",
        maxHeight: "30 floors",
        floorsToBuy: "16-30 floors",
        price: "375,000",
        coordinates: {
          latitude: 49.2827,
          longitude: -123.1207
        }
      },
      {
        title: "Miami Beach Oceanfront Rights",
        description: "Preserve your ocean view in South Beach Miami. Excellent opportunity to secure views of the Atlantic Ocean.",
        address: "1100 Collins Avenue, Miami Beach, FL 33139",
        currentHeight: "8 floors",
        maxHeight: "20 floors",
        floorsToBuy: "9-20 floors",
        price: "420,000",
        coordinates: {
          latitude: 25.7825,
          longitude: -80.1340
        }
      },
      {
        title: "Sydney Opera House View Rights",
        description: "Once-in-a-lifetime opportunity to secure air rights with direct views of the Sydney Opera House and Harbor Bridge.",
        address: "71 Macquarie Street, Sydney NSW 2000",
        currentHeight: "12 floors",
        maxHeight: "28 floors",
        floorsToBuy: "13-28 floors",
        price: "580,000",
        coordinates: {
          latitude: -33.8568,
          longitude: 151.2153
        }
      },
      {
        title: "Dubai Marina View Rights",
        description: "Secure spectacular views of Dubai Marina and the Arabian Gulf. Premium location in the heart of New Dubai.",
        address: "Dubai Marina, Plot No. JLT-PH2-T2A Dubai, UAE",
        currentHeight: "20 floors",
        maxHeight: "45 floors",
        floorsToBuy: "21-45 floors",
        price: "680,000",
        coordinates: {
          latitude: 25.0657,
          longitude: 55.1403
        }
      }
    ];

    console.log(`Starting to mint ${nftCollection.length} NFTs...`);
    
    // Store the results for each minted NFT
    const mintedNFTs = [];

    // Process each NFT in sequence
    for (let i = 0; i < nftCollection.length; i++) {
      console.log(`\n[${i+1}/${nftCollection.length}] Processing: ${nftCollection[i].title}`);
      
      // Prepare the metadata for IPFS
      const preparedData = prepareMetadata(nftCollection[i]);
      
      // Upload metadata to IPFS
      const ipfsHash = await uploadToIPFS(preparedData);
      const tokenURI = `ipfs://${ipfsHash}`;
      
      console.log("Metadata uploaded to IPFS:", ipfsHash);
      console.log("Minting NFT to:", signer.address);
      
      // Mint NFT
      const tx = await contract.mintNFT(
        signer.address,
        tokenURI
      );
      
      console.log("Transaction sent:", tx.hash);
      console.log("Waiting for confirmation...");
      
      const receipt = await tx.wait(2); // Wait for 2 confirmations
      
      // Extract token ID from events
      const event = receipt.events?.find((e: any) => e.event === 'Transfer');
      const tokenId = event?.args?.tokenId.toString();
      
      console.log("NFT minted successfully!");
      console.log("Token ID:", tokenId);
      
      // Store the minted NFT details
      mintedNFTs.push({
        title: nftCollection[i].title,
        tokenId,
        ipfsHash,
        transactionHash: tx.hash
      });
    }
    
    // Print summary of all minted NFTs
    console.log("\n=== MINTING SUMMARY ===");
    console.log(`Successfully minted ${mintedNFTs.length} NFTs:`);
    
    mintedNFTs.forEach((nft, index) => {
      console.log(`\n${index+1}. ${nft.title}`);
      console.log(`   Token ID: ${nft.tokenId}`);
      console.log(`   IPFS: ${nft.ipfsHash}`);
      console.log(`   TX: ${nft.transactionHash}`);
      console.log(`   View on RSK Explorer: https://explorer.testnet.rsk.co/tx/${nft.transactionHash}`);
      console.log(`   Metadata on IPFS: https://gateway.pinata.cloud/ipfs/${nft.ipfsHash}`);
    });
    
    // Save the minted NFTs data to a JSON file for future reference
    const fs = require('fs');
    fs.writeFileSync(
      './minted-nfts.json', 
      JSON.stringify(mintedNFTs, null, 2)
    );
    console.log("\nMinted NFTs data saved to minted-nfts.json");

  } catch (error: any) {
    console.error("Error minting NFTs:", error);
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