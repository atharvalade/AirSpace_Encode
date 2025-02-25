import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Ensure private key is properly formatted
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// Verify key length
if (PRIVATE_KEY.length !== 64) {
  console.warn(`Warning: Private key length is ${PRIVATE_KEY.length}, expected 64 characters`);
}

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    rsktestnet: {
      url: "https://public-node.testnet.rsk.co",
      chainId: 31,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`] : [],
      timeout: 150000, // 2.5 minutes
      gasMultiplier: 1.25
    }
  },
  // Add more verbose logging
  mocha: {
    timeout: 100000
  }
};

export default config; 