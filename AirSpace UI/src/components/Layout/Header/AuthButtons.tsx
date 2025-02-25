"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

interface AuthButtonsProps {
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

const AuthButtons = ({ onSignInClick, onSignUpClick }: AuthButtonsProps) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status from localStorage on client side
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(authStatus);
      };
      
      // Check immediately
      checkAuth();
      
      // Set up event listener for storage changes
      window.addEventListener('storage', checkAuth);
      
      // Custom event for auth changes within the same window
      window.addEventListener('authChange', checkAuth);
      
      return () => {
        window.removeEventListener('storage', checkAuth);
        window.removeEventListener('authChange', checkAuth);
      };
    }
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
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <Link
            href="/account"
            className="text-primary border border-primary hover:bg-primary/10 px-6 py-2 rounded-lg transition-colors flex items-center"
          >
            <Icon icon="ph:user" className="mr-2 text-xl" /> Account
          </Link>
          <button
            onClick={handleLogout}
            className="text-darkmode bg-primary hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors border border-primary"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onSignInClick}
            className="text-white hover:text-primary transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onSignUpClick}
            className="bg-primary hover:bg-primary/90 text-darkmode px-6 py-2 rounded-lg transition-colors border border-primary"
          >
            Sign Up
          </button>
        </>
      )}
    </div>
  );
};

export default AuthButtons; 