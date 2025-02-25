"use client";
import { useEffect, useState } from "react";
import Logo from "@/components/Layout/Header/Logo";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Account = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "",
    usdcBalance: "",
    walletAddress: "",
    physicalAddress: ""
  });

  useEffect(() => {
    // Get user data from localStorage
    const name = localStorage.getItem('userName') || 'John Doe';
    const usdcBalance = localStorage.getItem('usdcBalance') || '15,420.65';
    const walletAddress = localStorage.getItem('walletAddress') || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    const physicalAddress = localStorage.getItem('physicalAddress') || '350 5th Ave, New York, NY 10118';
    
    setUserData({
      name,
      usdcBalance,
      walletAddress,
      physicalAddress
    });
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('userName');
    localStorage.removeItem('usdcBalance');
    localStorage.removeItem('physicalAddress');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
    
    toast.success("Successfully logged out");
    router.push("/");
  };

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <div className="bg-darkmode/50 backdrop-blur-md border border-dark_border/20 rounded-xl p-6 mb-6">
        <h2 className="text-white text-xl font-medium mb-6">Account Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-muted text-sm block mb-1">Name</label>
            <div className="text-white text-lg">{userData.name}</div>
          </div>
          
          <div>
            <label className="text-muted text-sm block mb-1">USDC Balance</label>
            <div className="text-primary text-xl font-bold">${userData.usdcBalance}</div>
          </div>
          
          <div>
            <label className="text-muted text-sm block mb-1">Wallet Address</label>
            <div className="text-white text-sm bg-darkmode p-3 rounded-md border border-dark_border/40 font-mono">
              {userData.walletAddress}
            </div>
          </div>
          
          <div>
            <label className="text-muted text-sm block mb-1">Physical Address</label>
            <div className="text-white text-sm bg-darkmode p-3 rounded-md border border-dark_border/40">
              {userData.physicalAddress}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 w-full py-3 rounded-lg text-18 font-medium border border-red-600 hover:text-red-600 hover:bg-transparent transition-colors"
      >
        Logout
      </button>
    </>
  );
};

export default Account; 