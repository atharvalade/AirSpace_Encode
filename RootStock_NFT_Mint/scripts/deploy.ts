import { ethers } from "hardhat";

async function main() {
    console.log("Deploying AirSpaceNFT to RSK Testnet...");

    const AirSpaceNFT = await ethers.getContractFactory("AirSpaceNFT");
    const airSpaceNFT = await AirSpaceNFT.deploy();

    await airSpaceNFT.deployed();

    console.log("AirSpaceNFT deployed to RSK at:", airSpaceNFT.address);
    console.log("Wait for 5 block confirmations...");
    
    // Wait for RSK block confirmations
    await airSpaceNFT.deployTransaction.wait(5);
    
    console.log("Contract deployment confirmed!");
    console.log("\nVerify on RSK Explorer:");
    console.log(`https://explorer.testnet.rsk.co/address/${airSpaceNFT.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
