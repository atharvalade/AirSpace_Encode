import { ethers } from "hardhat";
import axios from "axios";

async function main() {
  try {
    // Get the contract
    const contractAddress = "0x676AB843E8aDd6363779409Ee5057f4a26F46F59";
    const AirSpaceNFT = await ethers.getContractFactory("AirSpaceNFT");
    const contract = AirSpaceNFT.attach(contractAddress);
    
    // Check if a specific token ID was provided
    const tokenId = process.env.TOKEN_ID;
    
    if (tokenId) {
      // Read a specific token
      await readTokenMetadata(contract, parseInt(tokenId));
    } else {
      // Try to read from the minted-nfts.json file
      const fs = require('fs');
      if (fs.existsSync('./minted-nfts.json')) {
        const mintedNFTs = JSON.parse(fs.readFileSync('./minted-nfts.json', 'utf8'));
        console.log(`Found ${mintedNFTs.length} minted NFTs in the local file.`);
        
        for (const nft of mintedNFTs) {
          await readTokenMetadata(contract, parseInt(nft.tokenId));
          console.log("\n-----------------------------------\n");
        }
      } else {
        console.log("No minted-nfts.json file found. Please provide a TOKEN_ID environment variable.");
      }
    }
  } catch (error) {
    console.error("Error reading NFT metadata:", error);
  }
}

async function readTokenMetadata(contract: any, tokenId: number) {
  try {
    console.log(`Reading metadata for token ID: ${tokenId}`);
    
    // Get the token URI
    const tokenURI = await contract.tokenURI(tokenId);
    console.log("Token URI:", tokenURI);
    
    // Extract IPFS hash
    const ipfsHash = tokenURI.replace('ipfs://', '');
    
    // Fetch metadata from IPFS via Pinata gateway
    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    console.log("Fetching metadata from:", metadataUrl);
    
    const response = await axios.get(metadataUrl);
    const metadata = response.data;
    
    console.log("\nNFT Metadata:");
    console.log(JSON.stringify(metadata, null, 2));
    
    // Get the owner of the token
    const owner = await contract.ownerOf(tokenId);
    console.log("\nOwner:", owner);
    
    return metadata;
  } catch (error) {
    console.error(`Error reading token ${tokenId}:`, error);
    return null;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 