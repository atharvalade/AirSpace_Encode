"use client";
import { useState, useRef } from "react";

// Dummy data for air right prices
const priceData = [
  { city: "IA", price: "$819.21", isUp: false },
  { city: "CHI", price: "$205.38", isUp: true },
  { city: "ORL", price: "$831.37", isUp: false },
  { city: "LA", price: "$752.29", isUp: true },
  { city: "ATL", price: "$594.29", isUp: false },
  { city: "SF", price: "$1,284.29", isUp: true },
  { city: "LV", price: "$194.95", isUp: false },
  { city: "NSH", price: "$832.19", isUp: true },
  { city: "NYC", price: "$582.24", isUp: true },
];

const AirRightPrices = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  return (
    <div className="bg-darkmode py-4 overflow-hidden border-t border-b border-dark_border border-opacity-20">
      <div className="container-fluid mx-auto">
        <div className="flex items-center">
          <div className="text-white font-medium px-4 whitespace-nowrap">
            AIR RIGHT PRICES
          </div>
          
          <div 
            className="overflow-hidden flex-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              className="flex items-center space-x-8 animate-ticker"
              style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            >
              {[...priceData, ...priceData, ...priceData].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                  <span className="text-white">{item.city}</span>
                  <span 
                    className={`${item.isUp ? 'text-green-500' : 'text-red-500'} font-medium`}
                  >
                    {item.price} 
                    {item.isUp ? (
                      <span className="ml-1">↗</span>
                    ) : (
                      <span className="ml-1">↘</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        .animate-ticker {
          animation: ticker 12s linear infinite;
          animation-play-state: running;
        }
      `}</style>
    </div>
  );
};

export default AirRightPrices; 