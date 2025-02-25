"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NFT } from "@/types/nft";
import NFTActivityFeed from "./NFTActivityFeed";
import MarketMetrics from "./MarketMetrics";
import TransactionHistory from "./TransactionHistory";
import NFTGallery from "./NFTGallery";
import NetworkStatus from "./NetworkStatus";
import dynamic from "next/dynamic";

// Dynamically import the map component with no SSR
const GlobalActivityMap = dynamic(() => import("./GlobalActivityMap"), {
  ssr: false,
});

// Define interface for the API response
interface ApiNFT {
  tokenId: number;
  ipfsHash: string;
  metadata: {
    title: string;
    name: string;
    description: string;
    attributes: {
      trait_type: string;
      value: string | number;
    }[];
    properties: {
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
  };
}

interface ApiResponse {
  data: ApiNFT[];
  wallet: string;
}

// Mock transaction data (will be replaced with HyperSync data)
const mockTransactions = [
  {
    id: "0x1a2b3c4d5e6f",
    type: "Mint",
    tokenId: 2,
    from: "0x0000...0000",
    to: "0xa20C...D5D",
    timestamp: Date.now() - 3600000 * 2,
    value: "250000",
    gasUsed: "0.0042",
  },
  {
    id: "0x2b3c4d5e6f7g",
    type: "Transfer",
    tokenId: 3,
    from: "0xa20C...D5D",
    to: "0xb30D...E6E",
    timestamp: Date.now() - 3600000 * 5,
    value: "375000",
    gasUsed: "0.0038",
  },
  {
    id: "0x3c4d5e6f7g8h",
    type: "List",
    tokenId: 4,
    from: "0xb30D...E6E",
    to: "Marketplace",
    timestamp: Date.now() - 3600000 * 8,
    value: "420000",
    gasUsed: "0.0035",
  },
  {
    id: "0x4d5e6f7g8h9i",
    type: "Sale",
    tokenId: 1,
    from: "Marketplace",
    to: "0xc40E...F7F",
    timestamp: Date.now() - 3600000 * 12,
    value: "100000",
    gasUsed: "0.0051",
  },
  {
    id: "0x5e6f7g8h9i0j",
    type: "Mint",
    tokenId: 5,
    from: "0x0000...0000",
    to: "0xd50F...G8G",
    timestamp: Date.now() - 3600000 * 24,
    value: "580000",
    gasUsed: "0.0044",
  },
];

// Mock market metrics (will be replaced with HyperSync data)
const mockMetrics = {
  totalVolume: "1,725,000",
  totalTransactions: 27,
  activeWallets: 18,
  averagePrice: "345,000",
  highestSale: "580,000",
  mintedNFTs: 6,
};

const Dashboard = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [metrics, setMetrics] = useState(mockMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await fetch("https://apinft-zeta.vercel.app/api/nfts");
        if (!response.ok) {
          throw new Error("Failed to fetch NFTs");
        }
        const apiResponse: ApiResponse = await response.json();

        // Transform API data to match our NFT interface
        const transformedNFTs: NFT[] = apiResponse.data.map((item) => {
          // Find attributes by trait_type
          const getAttributeValue = (traitType: string) => {
            const attr = item.metadata.attributes.find(
              (a) => a.trait_type === traitType
            );
            return attr ? String(attr.value) : "";
          };

          return {
            id: item.tokenId,
            token_id: item.tokenId,
            title: item.metadata.title,
            name: item.metadata.name,
            description: item.metadata.description,
            property_address: getAttributeValue("Property Address"),
            current_height: `${getAttributeValue("Current Height")} floors`,
            maximum_height: `${getAttributeValue("Maximum Height")} floors`,
            available_floors: `${getAttributeValue("Current Height")}-${getAttributeValue(
              "Maximum Height"
            )} floors`,
            price: getAttributeValue("Price")
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            latitude: item.metadata.properties.coordinates.latitude,
            longitude: item.metadata.properties.coordinates.longitude,
            contract_address: "0x676AB843E8aDd6363779409Ee5057f4a26F46F59", // Using the contract address from DeploymentProgress.tsx
            token_id: item.tokenId,
          };
        });

        setNfts(transformedNFTs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError(`Error fetching NFTs: ${(err as Error).message}`);
        setLoading(false);
      }
    };

    // Simulate real-time updates with HyperSync
    const simulateRealTimeUpdates = () => {
      const interval = setInterval(() => {
        // Randomly update a transaction
        setTransactions((prev) => {
          const newTransactions = [...prev];
          const randomIndex = Math.floor(Math.random() * newTransactions.length);
          const randomTransaction = { ...newTransactions[randomIndex] };
          
          // Simulate a new transaction
          if (Math.random() > 0.7) {
            const newTx = {
              id: `0x${Math.random().toString(16).substring(2, 14)}`,
              type: ["Mint", "Transfer", "List", "Sale"][Math.floor(Math.random() * 4)],
              tokenId: Math.floor(Math.random() * 6) + 1,
              from: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
              to: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
              timestamp: Date.now(),
              value: (Math.floor(Math.random() * 500000) + 100000).toString(),
              gasUsed: (Math.random() * 0.01).toFixed(4),
            };
            return [newTx, ...newTransactions.slice(0, 9)]; // Keep only the 10 most recent
          }
          
          return newTransactions;
        });
        
        // Randomly update metrics
        setMetrics((prev) => {
          const volumeIncrease = Math.floor(Math.random() * 50000);
          const newTotalVolume = parseInt(prev.totalVolume.replace(/,/g, "")) + volumeIncrease;
          
          return {
            ...prev,
            totalVolume: newTotalVolume.toLocaleString(),
            totalTransactions: prev.totalTransactions + (Math.random() > 0.7 ? 1 : 0),
            activeWallets: prev.activeWallets + (Math.random() > 0.8 ? 1 : 0),
            averagePrice: (newTotalVolume / (prev.mintedNFTs || 1)).toLocaleString(),
          };
        });
      }, 5000); // Update every 5 seconds
      
      return () => clearInterval(interval);
    };

    fetchNFTs();
    const cleanup = simulateRealTimeUpdates();
    
    return cleanup;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkmode flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Loading Web3 Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-darkmode flex items-center justify-center">
        <div className="bg-red-900/50 p-6 rounded-lg text-white max-w-md text-center">
          <p className="text-xl mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkmode text-white pt-32 pb-10 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center">
          Web3 Dashboard
        </h1>
        <p className="text-muted text-center mb-10">
          Real-time blockchain analytics powered by HyperSync
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MarketMetrics metrics={metrics} />
          </div>
          <div>
            <NetworkStatus />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-dark_grey bg-opacity-35 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">Global Activity Map</h2>
            <div className="h-[400px] rounded-xl overflow-hidden">
              <GlobalActivityMap nfts={nfts} transactions={transactions} />
            </div>
          </div>
          <div className="bg-dark_grey bg-opacity-35 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">Live Activity Feed</h2>
            <div className="h-[400px] overflow-auto">
              <NFTActivityFeed transactions={transactions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-dark_grey bg-opacity-35 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">NFT Gallery</h2>
            <NFTGallery 
              nfts={nfts} 
              onSelect={(nft) => setSelectedNFT(nft)}
              selectedNFT={selectedNFT}
            />
          </div>
          <div className="bg-dark_grey bg-opacity-35 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
            <TransactionHistory 
              transactions={transactions} 
              nfts={nfts}
              selectedNFT={selectedNFT}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 