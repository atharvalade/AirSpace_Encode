"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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

interface GlobalActivityMapProps {
  nfts: NFT[];
  transactions: Transaction[];
}

const GlobalActivityMap = ({ nfts, transactions }: GlobalActivityMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXRoYXJ2YWxhZGUiLCJhIjoiY203azliYXBmMGYxbjJqcHJucHltamx1MSJ9.MIDkONe-6BnGL4vlCqCBjw';
    
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.5,
      projection: 'globe'
    });
    
    map.current = mapInstance;
    
    mapInstance.on('load', () => {
      setMapLoaded(true);
      
      // Add atmosphere and glow to the globe
      mapInstance.setFog({
        color: 'rgb(12, 20, 39)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.4,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });
      
      // Add NFT locations to the map
      nfts.forEach((nft) => {
        if (nft.latitude && nft.longitude) {
          // Create a popup
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'custom-popup'
          }).setHTML(`
            <div class="bg-darkmode/90 p-2 rounded-lg border border-primary/30 text-white text-xs">
              <div class="font-medium">${nft.title}</div>
              <div class="text-primary">$${nft.price}</div>
            </div>
          `);
          
          // Create a marker
          const el = document.createElement('div');
          el.className = 'nft-marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = '#FF4D94';
          el.style.boxShadow = '0 0 10px 2px rgba(255, 77, 148, 0.6)';
          
          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat([nft.longitude, nft.latitude])
            .setPopup(popup)
            .addTo(mapInstance);
        }
      });
      
      // Simulate transaction activity with animations
      let animationIndex = 0;
      const animateTransactions = () => {
        if (!mapLoaded || !map.current) return;
        
        // Get a random NFT
        const randomNft = nfts[Math.floor(Math.random() * nfts.length)];
        if (!randomNft || !randomNft.latitude || !randomNft.longitude) return;
        
        // Create a pulse effect
        const size = 100;
        const pulseDiv = document.createElement('div');
        pulseDiv.className = 'pulse-effect';
        pulseDiv.style.width = `${size}px`;
        pulseDiv.style.height = `${size}px`;
        pulseDiv.style.borderRadius = '50%';
        pulseDiv.style.backgroundColor = 'rgba(255, 77, 148, 0.3)';
        pulseDiv.style.position = 'absolute';
        pulseDiv.style.transform = 'translate(-50%, -50%)';
        pulseDiv.style.animation = 'pulse 2s ease-out';
        
        // Add pulse to map
        const marker = new mapboxgl.Marker(pulseDiv)
          .setLngLat([randomNft.longitude, randomNft.latitude])
          .addTo(map.current);
        
        // Remove after animation completes
        setTimeout(() => {
          marker.remove();
        }, 2000);
        
        animationIndex++;
        if (animationIndex < 20) {
          setTimeout(animateTransactions, 3000);
        }
      };
      
      // Start transaction animations after a delay
      setTimeout(animateTransactions, 2000);
    });
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [nfts, transactions]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-full rounded-xl" />
      <style jsx global>{`
        .mapboxgl-popup {
          z-index: 10;
        }
        
        .mapboxgl-popup-content {
          padding: 0;
          background: transparent;
          border-radius: 12px;
          box-shadow: none;
        }
        
        .mapboxgl-popup-tip {
          display: none;
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default GlobalActivityMap; 