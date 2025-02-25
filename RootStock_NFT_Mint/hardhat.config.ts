import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

// Make sure these private keys are properly secured and never committed to public repositories
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";

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
      accounts: [PRIVATE_KEY],
      // Add timeout and confirmation blocks
      timeout: 60000, // 60 seconds
      gas: 2100000,
      gasPrice: 60000000, // 0.06 gwei
    },
    // Add a backup RSK testnet configuration using a different RPC
    rsktestnet_backup: {
      url: "https://testnet.rsk.co",
      chainId: 31,
      accounts: [PRIVATE_KEY],
      timeout: 60000,
    }
  },
  // Add more verbose logging
  mocha: {
    timeout: 100000
  }
};

export default config; 