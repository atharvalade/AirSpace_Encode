import { ethers } from "hardhat";

async function main() {
  try {
    // Get network information
    const network = await ethers.provider.getNetwork();
    console.log("Connected to network:", {
      name: network.name,
      chainId: network.chainId
    });

    // Get signer information
    const [signer] = await ethers.getSigners();
    console.log("Using account:", signer.address);
    
    // Check balance
    const balance = await signer.getBalance();
    console.log("Account balance:", ethers.utils.formatEther(balance), "RBTC");
    
    // Check if contract exists
    const contractAddress = "0x676AB843E8aDd6363779409Ee5057f4a26F46F59"; // Your contract address
    const code = await ethers.provider.getCode(contractAddress);
    console.log("Contract exists:", code !== "0x");
    
  } catch (error) {
    console.error("Error checking connection:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 