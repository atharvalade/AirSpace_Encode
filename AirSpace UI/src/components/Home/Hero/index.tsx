"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import BuyCrypto from "./buy-form";
import SellCrypto from "./sell-form";
import { useEffect, useRef, useState, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";

// Dynamically import the map component with no SSR
const MapComponent = dynamic(() => import('./map-component').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-xl bg-darkmode/50 flex items-center justify-center">
      <div className="text-white">Loading 3D Map...</div>
    </div>
  )
}) as any;  // Add type assertion to avoid TypeScript error

// Sample building data with air rights information
const SAMPLE_BUILDINGS = [
  {
    id: 1,
    name: "Empire State Building",
    coordinates: [-73.9857, 40.7484],
    height: 381,
    pricePerSqFt: 582.24,
    availableSqFt: 15000,
    airRightsVolume: 250000,
    viewProtected: true
  },
  {
    id: 2,
    name: "Chrysler Building",
    coordinates: [-73.9755, 40.7516],
    height: 319,
    pricePerSqFt: 495.50,
    availableSqFt: 12000,
    airRightsVolume: 180000,
    viewProtected: false
  },
  {
    id: 3,
    name: "One World Trade Center",
    coordinates: [-74.0133, 40.7127],
    height: 541,
    pricePerSqFt: 625.75,
    availableSqFt: 18500,
    airRightsVolume: 320000,
    viewProtected: true
  },
  {
    id: 4,
    name: "30 Hudson Yards",
    coordinates: [-74.0023, 40.7539],
    height: 395,
    pricePerSqFt: 548.30,
    availableSqFt: 14200,
    airRightsVolume: 210000,
    viewProtected: false
  },
  {
    id: 5,
    name: "Bank of America Tower",
    coordinates: [-73.9845, 40.7557],
    height: 366,
    pricePerSqFt: 567.80,
    availableSqFt: 13800,
    airRightsVolume: 195000,
    viewProtected: true
  }
];

const Hero = () => {
  const router = useRouter();
  const [isBuying, setIsBuyingOpen] = useState(false);
  const [isSelling, setIsSellingOpen] = useState(false);
  const BuyRef = useRef<HTMLDivElement>(null);
  const SellRef = useRef<HTMLDivElement>(null);
  const [listingData, setListingData] = useState({
    physicalAddress: "",
    pricePerSqft: ""
  });
  const [loading, setLoading] = useState(false);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (BuyRef.current && !BuyRef.current.contains(event.target as Node)) {
        setIsBuyingOpen(false);
      }
      if (SellRef.current && !SellRef.current.contains(event.target as Node)) {
        setIsSellingOpen(false);
      }
    },
    [BuyRef, SellRef]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    document.body.style.overflow = isBuying || isSelling ? "hidden" : "";
  }, [isBuying, isSelling]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleBuyClick = () => {
    router.push("/listings");
  };

  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Listing submitted:", listingData);
      toast.success("Property submitted for verification");
      setIsSellingOpen(false);
      setListingData({ physicalAddress: "", pricePerSqft: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <section
      className="relative pt-40 pb-32 overflow-hidden"
      id="main-banner"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3 animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* Floating icons using Iconify instead of SVG files */}
      <div className="absolute left-[5%] top-[15%] opacity-20 hidden lg:block">
        <Icon icon="ph:cube" className="text-primary text-7xl" />
      </div>
      
      <div className="absolute right-[8%] bottom-[20%] opacity-20 hidden lg:block">
        <Icon icon="ph:buildings" className="text-primary text-8xl" />
      </div>

      <div className="container mx-auto px-4 relative max-w-5xl">
        {/* Main heading with animated underline */}
        <div className="relative mb-6 pt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white text-center font-bold text-3xl md:text-4xl lg:text-5xl max-w-4xl mx-auto leading-tight tracking-tight"
          >
            Secure Your <span className="text-primary relative">View Rights
              <span className="absolute bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
            </span> with the Power of <span className="text-primary relative">Blockchain
              <span className="absolute bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
            </span>
          </motion.h1>
        </div>

        {/* Subtitle with character-by-character typing animation */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          className="text-muted text-center mt-6 mb-10 max-w-2xl mx-auto text-base h-20 md:h-16"
        >
          <TypewriterEffect text="The first marketplace to tokenize, buy, and sell property air rights, ensuring your views remain unobstructed and your property value protected." />
        </motion.div>

        {/* CTA Buttons with enhanced styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mt-10 mb-16"
        >
          <button
            onClick={handleBuyClick}
            className="bg-primary hover:bg-primary/90 border border-primary rounded-lg text-lg font-medium text-darkmode py-3 px-8 transition-all duration-300 flex items-center shadow-glow-sm hover:shadow-glow"
          >
            <Icon icon="ph:shopping-cart" className="mr-2 text-xl" /> Buy Air Rights
          </button>
          <button
            onClick={() => setIsSellingOpen(true)}
            className="bg-transparent hover:bg-primary/10 border border-primary rounded-lg text-lg font-medium text-primary py-3 px-8 transition-all duration-300 flex items-center"
          >
            <Icon icon="ph:buildings" className="mr-2 text-xl" /> List Property
          </button>
        </motion.div>

        {/* Feature cards with enhanced styling */}
        <motion.div 
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-3 gap-6 mt-12 mb-16"
        >
          <motion.div 
            variants={fadeIn}
            className="bg-darkmode/50 backdrop-blur-md border border-dark_border/20 rounded-xl p-8 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300"
          >
            <div className="bg-primary/20 p-5 rounded-full mb-6">
              <Icon icon="ph:shield-check" className="text-primary text-3xl" />
            </div>
            <h3 className="text-white text-xl font-medium mb-4">Secure Ownership</h3>
            <p className="text-muted text-base">Blockchain-verified ownership of air rights with legal backing and immutable records</p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="bg-darkmode/50 backdrop-blur-md border border-dark_border/20 rounded-xl p-8 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300"
          >
            <div className="bg-primary/20 p-5 rounded-full mb-6">
              <Icon icon="ph:currency-circle-dollar" className="text-primary text-3xl" />
            </div>
            <h3 className="text-white text-xl font-medium mb-4">Value Protection</h3>
            <p className="text-muted text-base">Protect and increase your property value by securing view rights for generations to come</p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="bg-darkmode/50 backdrop-blur-md border border-dark_border/20 rounded-xl p-8 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300"
          >
            <div className="bg-primary/20 p-5 rounded-full mb-6">
              <Icon icon="ph:handshake" className="text-primary text-3xl" />
            </div>
            <h3 className="text-white text-xl font-medium mb-4">Easy Trading</h3>
            <p className="text-muted text-base">Seamless marketplace for buying and selling air rights with transparent pricing</p>
          </motion.div>
        </motion.div>

        {/* 3D Map Visualization - replacing the static image */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 relative"
        >
          <MapComponent buildings={SAMPLE_BUILDINGS} />
        </motion.div>
      </div>

      {/* List Property Modal */}
      {isSelling && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg px-8 pt-14 pb-8 text-center bg-dark_grey bg-opacity-90 backdrop-blur-md">
            <button
              onClick={() => setIsSellingOpen(false)}
              className="absolute right-4 top-4 text-white hover:text-primary"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 10L18.625 2.375C18.9062 2.09375 18.9062 1.65625 18.625 1.375C18.3438 1.09375 17.9062 1.09375 17.625 1.375L10 9L2.375 1.375C2.09375 1.09375 1.65625 1.09375 1.375 1.375C1.09375 1.65625 1.09375 2.09375 1.375 2.375L9 10L1.375 17.625C1.09375 17.9062 1.09375 18.3438 1.375 18.625C1.5 18.75 1.6875 18.8438 1.875 18.8438C2.0625 18.8438 2.25 18.7812 2.375 18.625L10 11L17.625 18.625C17.75 18.75 17.9375 18.8438 18.125 18.8438C18.3125 18.8438 18.5 18.7812 18.625 18.625C18.9062 18.3438 18.9062 17.9062 18.625 17.625L11 10Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            
            <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
              <Logo />
            </div>
            
            <h2 className="text-white text-xl font-medium mb-6">List Your Property</h2>
            
            <form onSubmit={handleListingSubmit}>
              <div className="mb-[22px]">
                <input
                  type="text"
                  placeholder="Physical Address of Building"
                  value={listingData.physicalAddress}
                  onChange={(e) => setListingData({...listingData, physicalAddress: e.target.value})}
                  required
                  className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
                />
              </div>
              
              <div className="mb-[22px]">
                <input
                  type="number"
                  placeholder="Expected Price per sqft (USDC)"
                  value={listingData.pricePerSqft}
                  onChange={(e) => setListingData({...listingData, pricePerSqft: e.target.value})}
                  required
                  className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
                />
              </div>
              
              <div className="mb-6">
                <button
                  type="submit"
                  className="flex w-full items-center text-18 font-medium justify-center rounded-md bg-primary px-5 py-3 text-darkmode transition duration-300 ease-in-out hover:bg-transparent hover:text-primary border-primary border"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-darkmode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Submit for Verification"
                  )}
                </button>
              </div>
            </form>
            
            <p className="text-body-secondary text-white text-sm">
              Our team will verify your property details and contact you within 2-3 business days.
            </p>
          </div>
        </div>
      )}
      
      {/* Add these custom animations to your global CSS */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .shadow-glow {
          box-shadow: 0 0 15px rgba(var(--color-primary-rgb), 0.3);
        }
        
        .shadow-glow-sm {
          box-shadow: 0 0 10px rgba(var(--color-primary-rgb), 0.2);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-600 {
          animation-delay: 0.6s;
        }
        
        .cursor-blink {
          display: inline-block;
          margin-left: 1px;
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
        
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
      `}</style>
    </section>
  );
};

const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);
    
    return () => clearInterval(typingInterval);
  }, [text]);
  
  return (
    <p className="relative inline-block">
      {displayText}
      <span className="cursor-blink">|</span>
    </p>
  );
};

export default Hero;
