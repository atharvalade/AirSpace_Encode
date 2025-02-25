import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { NFT } from "@/types/nft";

interface Transaction {
  id: string;
  type: string;
  tokenId: number;
  from: string;
  to: string;
  timestamp: number;
  value: string;
  gasUsed: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  nfts: NFT[];
  selectedNFT: NFT | null;
}

const TransactionHistory = ({ transactions, nfts, selectedNFT }: TransactionHistoryProps) => {
  const [filter, setFilter] = useState<string>("all");
  
  // Filter transactions based on selected NFT and filter type
  const filteredTransactions = transactions.filter(tx => {
    if (selectedNFT && tx.tokenId !== selectedNFT.token_id) {
      return false;
    }
    
    if (filter !== "all" && tx.type.toLowerCase() !== filter) {
      return false;
    }
    
    return true;
  });
  
  const getNFTTitle = (tokenId: number) => {
    const nft = nfts.find(n => n.token_id === tokenId);
    return nft ? nft.title : `NFT #${tokenId}`;
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Mint": return "text-blue-500";
      case "Transfer": return "text-purple-500";
      case "List": return "text-yellow-500";
      case "Sale": return "text-green-500";
      default: return "text-gray-500";
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${filter === "all" ? "bg-primary text-darkmode" : "bg-deepSlate text-white"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${filter === "mint" ? "bg-primary text-darkmode" : "bg-deepSlate text-white"}`}
            onClick={() => setFilter("mint")}
          >
            Mints
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${filter === "transfer" ? "bg-primary text-darkmode" : "bg-deepSlate text-white"}`}
            onClick={() => setFilter("transfer")}
          >
            Transfers
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-sm ${filter === "sale" ? "bg-primary text-darkmode" : "bg-deepSlate text-white"}`}
            onClick={() => setFilter("sale")}
          >
            Sales
          </button>
        </div>
        
        {selectedNFT && (
          <button 
            className="text-sm text-primary hover:underline"
            onClick={() => window.open(`https://sepolia.etherscan.io/token/0x676AB843E8aDd6363779409Ee5057f4a26F46F59?a=${selectedNFT.token_id}`, '_blank')}
          >
            View on Etherscan
          </button>
        )}
      </div>
      
      <div className="bg-deepSlate rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left">Event</th>
              <th className="px-4 py-3 text-left">NFT</th>
              <th className="px-4 py-3 text-left">From</th>
              <th className="px-4 py-3 text-left">To</th>
              <th className="px-4 py-3 text-right">Value</th>
              <th className="px-4 py-3 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx, index) => (
                <motion.tr 
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-700 hover:bg-gray-800/30"
                >
                  <td className={`px-4 py-3 ${getTypeColor(tx.type)}`}>{tx.type}</td>
                  <td className="px-4 py-3">{getNFTTitle(tx.tokenId)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{tx.from}</td>
                  <td className="px-4 py-3 font-mono text-xs">{tx.to}</td>
                  <td className="px-4 py-3 text-right text-primary">
                    {tx.value ? `$${parseInt(tx.value).toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-muted">
                    {format(new Date(tx.timestamp), 'MMM d, h:mm a')}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  {selectedNFT 
                    ? `No ${filter !== 'all' ? filter : ''} transactions found for ${selectedNFT.title}`
                    : `No ${filter !== 'all' ? filter : ''} transactions found`
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory; 