import { ethers } from "hardhat";

async function main() {
    // Get the deployed contract address
    const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace with your contract address
    
    const LowCostNFTTransfer = await ethers.getContractFactory("LowCostNFTTransfer");
    const contract = LowCostNFTTransfer.attach(contractAddress);

    console.log("Executing NFT transfer...");

    // Execute the transfer with the required RBTC amount
    const tx = await contract.executeTransfer({
        value: ethers.utils.parseUnits("0.00000001", "ether")
    });

    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transfer completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 