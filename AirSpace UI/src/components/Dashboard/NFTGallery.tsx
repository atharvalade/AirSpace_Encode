import { motion } from "framer-motion";
import { NFT } from "@/types/nft";
import { Icon } from "@iconify/react";

interface NFTGalleryProps {
  nfts: NFT[];
  onSelect: (nft: NFT) => void;
  selectedNFT: NFT | null;
}

const NFTGallery = ({ nfts, onSelect, selectedNFT }: NFTGalleryProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {nfts.map((nft, index) => (
        <motion.div
          key={nft.token_id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
            selectedNFT?.token_id === nft.token_id ? 'ring-2 ring-primary' : 'hover:scale-105'
          }`}
          onClick={() => onSelect(nft)}
        >
          <div className="aspect-square relative bg-deepSlate flex items-center justify-center">
            <Icon 
              icon="material-symbols:apartment" 
              className="text-6xl text-primary/50"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
            <h3 className="text-white text-sm font-medium truncate">{nft.title}</h3>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-primary">${nft.price}</span>
              <span className="text-xs text-white bg-primary/20 px-2 py-0.5 rounded-full">
                #{nft.token_id}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NFTGallery; 