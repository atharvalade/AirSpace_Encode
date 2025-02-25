import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

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

interface NFTActivityFeedProps {
  transactions: Transaction[];
}

const NFTActivityFeed = ({ transactions }: NFTActivityFeedProps) => {
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    setDisplayedTransactions(transactions.slice(0, 5));
  }, [transactions]);
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Mint": return "bg-blue-500";
      case "Transfer": return "bg-purple-500";
      case "List": return "bg-yellow-500";
      case "Sale": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Mint": return "🔨";
      case "Transfer": return "🔄";
      case "List": return "📋";
      case "Sale": return "💰";
      default: return "📝";
    }
  };
  
  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-4">
      <AnimatePresence>
        {displayedTransactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-deepSlate rounded-xl p-4 border-l-4 border-primary"
          >
            <div className="flex items-start">
              <div className={`${getTypeColor(tx.type)} w-10 h-10 rounded-full flex items-center justify-center text-lg mr-3 flex-shrink-0`}>
                {getTypeIcon(tx.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white truncate">
                    {tx.type} NFT #{tx.tokenId}
                  </h3>
                  <span className="text-xs text-muted ml-2 flex-shrink-0">
                    {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <div className="mt-1 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted mr-2">From:</span>
                    <span className="text-white font-mono text-xs truncate">{tx.from}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted mr-2">To:</span>
                    <span className="text-white font-mono text-xs truncate">{tx.to}</span>
                  </div>
                  {tx.value && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted mr-2">Value:</span>
                      <span className="text-primary font-mono text-xs">${parseInt(tx.value).toLocaleString()} USDC</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs">
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${tx.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View on Etherscan
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NFTActivityFeed; 