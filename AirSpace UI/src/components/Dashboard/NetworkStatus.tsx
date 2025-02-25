import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NetworkStatus = () => {
  const [blockNumber, setBlockNumber] = useState<number>(16432789);
  const [gasPrice, setGasPrice] = useState<string>("12.4");
  const [networkStatus, setNetworkStatus] = useState<"healthy" | "congested" | "slow">("healthy");
  const [tps, setTps] = useState<number>(15);
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber(prev => prev + 1);
      setGasPrice(prev => {
        const newPrice = parseFloat(prev) + (Math.random() * 2 - 1);
        return newPrice.toFixed(1);
      });
      setTps(prev => {
        const newTps = prev + (Math.random() * 6 - 3);
        return Math.max(5, Math.min(30, Math.round(newTps)));
      });
      
      // Randomly change network status
      if (Math.random() > 0.9) {
        const statuses: Array<"healthy" | "congested" | "slow"> = ["healthy", "congested", "slow"];
        setNetworkStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusColor = () => {
    switch (networkStatus) {
      case "healthy": return "text-green-400";
      case "congested": return "text-yellow-400";
      case "slow": return "text-orange-400";
      default: return "text-white";
    }
  };
  
  return (
    <div className="bg-dark_grey bg-opacity-35 rounded-3xl p-6 h-full">
      <h2 className="text-2xl font-bold mb-4">Network Status</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted">Current Block</span>
          <motion.span 
            key={blockNumber}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-mono"
          >
            #{blockNumber.toLocaleString()}
          </motion.span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted">Gas Price</span>
          <motion.span 
            key={gasPrice}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-primary font-mono"
          >
            {gasPrice} Gwei
          </motion.span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted">Transactions/sec</span>
          <span className="text-white font-mono">{tps}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted">Status</span>
          <motion.span 
            key={networkStatus}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-medium ${getStatusColor()}`}
          >
            {networkStatus.charAt(0).toUpperCase() + networkStatus.slice(1)}
          </motion.span>
        </div>
        
        <div className="pt-4">
          <div className="w-full bg-deepSlate rounded-full h-2.5">
            <motion.div 
              className="bg-primary h-2.5 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${tps * 3}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus; 