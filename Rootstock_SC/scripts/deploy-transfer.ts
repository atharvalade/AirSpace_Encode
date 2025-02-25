import { ethers } from "hardhat";
import { parseEther } from "ethers";

async function main() {
    const [deployer] = await ethers.getSigners();
    
    // Get private keys from env
    const sellerPrivateKey = process.env.SELLER_PRIVATE_KEY!;
    const buyerPrivateKey = process.env.BUYER_PRIVATE_KEY!;
    
    // Create wallet instances
    const sellerWallet = new ethers.Wallet(sellerPrivateKey, ethers.provider);
    const buyerWallet = new ethers.Wallet(buyerPrivateKey, ethers.provider);

    console.log("Deploying LowCostNFTTransfer...");

    const LowCostNFTTransfer = await ethers.getContractFactory("LowCostNFTTransfer");
    const contract = await LowCostNFTTransfer.deploy(
        process.env.NFT_CONTRACT_ADDRESS,
        process.env.NFT_ID,
        sellerWallet.address,
        buyerWallet.address
    );

    await contract.deployed();

    console.log("LowCostNFTTransfer deployed to:", contract.address);
    // Format RBTC amount using parseEther
    const transferCost = "0.00000001";
    console.log("Transfer cost:", transferCost, "RBTC");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 