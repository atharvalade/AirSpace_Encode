"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import { useState } from "react";
import Loader from "@/components/Common/Loader";

interface SignUpProps {
  onSuccess?: () => void;
}

const SignUp = ({ onSuccess }: SignUpProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [metaMaskLoading, setMetaMaskLoading] = useState(false);
  
  // Placeholder MetaMask connection handler
  const connectMetaMask = async () => {
    setMetaMaskLoading(true);
    try {
      // Simulate a delay for the loading state
      setTimeout(() => {
        // Store authentication state in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('walletAddress', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
        localStorage.setItem('userName', 'John Doe');
        localStorage.setItem('usdcBalance', '15,420.65');
        localStorage.setItem('physicalAddress', '350 5th Ave, New York, NY 10118');
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('authChange'));
        
        toast.success("Successfully signed up with MetaMask");
        setMetaMaskLoading(false);
        
        // Close modal if provided
        if (onSuccess) {
          onSuccess();
        }
        
        router.push("/");
      }, 1000);
    } catch (error: any) {
      toast.error("Failed to connect to MetaMask");
      setMetaMaskLoading(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setLoading(true);
    const data = new FormData(e.currentTarget);
    const value = Object.fromEntries(data.entries());
    const finalData = { ...value };

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalData),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Successfully registered");
        setLoading(false);
        
        // Close modal if provided
        if (onSuccess) {
          onSuccess();
        }
        
        router.push("/signin");
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      {/* MetaMask button */}
      <div className="mb-6">
        <button
          onClick={connectMetaMask}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-18 font-medium border border-dark_border border-opacity-60 hover:border-primary hover:text-primary"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.315 3L13.039 8.38L14.603 5.131L21.315 3Z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.68 3L10.899 8.44L9.397 5.131L2.68 3Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.336 16.897L16.152 20.477L20.878 21.882L22.262 16.968L18.336 16.897Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.746 16.968L3.122 21.882L7.848 20.477L5.664 16.897L1.746 16.968Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.551 11.072L6.199 13.233L10.883 13.443L10.716 8.38L7.551 11.072Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.441 11.072L13.234 8.32L13.039 13.443L17.723 13.233L16.441 11.072Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.848 20.477L10.591 19.01L8.183 17.001L7.848 20.477Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.409 19.01L16.152 20.477L15.817 17.001L13.409 19.01Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.152 20.477L13.409 19.01L13.632 20.939L13.607 21.823L16.152 20.477Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.848 20.477L10.393 21.823L10.376 20.939L10.591 19.01L7.848 20.477Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.432 15.67L8.108 14.952L9.756 14.159L10.432 15.67Z" fill="#233447" stroke="#233447" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.56 15.67L14.236 14.159L15.892 14.952L13.56 15.67Z" fill="#233447" stroke="#233447" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.848 20.477L8.2 16.897L5.664 16.968L7.848 20.477Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.8 16.897L16.152 20.477L18.336 16.968L15.8 16.897Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.723 13.233L13.039 13.443L13.568 15.67L14.244 14.159L15.9 14.952L17.723 13.233Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.108 14.952L9.764 14.159L10.432 15.67L10.969 13.443L6.199 13.233L8.108 14.952Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.199 13.233L8.183 17.001L8.108 14.952L6.199 13.233Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.9 14.952L15.817 17.001L17.723 13.233L15.9 14.952Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.969 13.443L10.432 15.67L11.094 18.362L11.314 14.533L10.969 13.443Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.039 13.443L12.702 14.525L12.898 18.362L13.568 15.67L13.039 13.443Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.568 15.67L12.898 18.362L13.409 19.01L15.817 17.001L15.9 14.952L13.568 15.67Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.108 14.952L8.183 17.001L10.591 19.01L11.094 18.362L10.432 15.67L8.108 14.952Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.607 21.823L13.632 20.939L13.426 20.758H10.574L10.376 20.939L10.393 21.823L7.848 20.477L8.827 21.27L10.549 22.5H13.443L15.173 21.27L16.152 20.477L13.607 21.823Z" fill="#C0AD9E" stroke="#C0AD9E" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.409 19.01L12.898 18.362H11.094L10.591 19.01L10.376 20.939L10.574 20.758H13.426L13.632 20.939L13.409 19.01Z" fill="#161616" stroke="#161616" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21.75 8.962L22.5 5.131L21.315 3L13.409 8.23L16.441 11.072L20.803 12.43L21.75 11.323L21.348 11.031L22.004 10.447L21.511 10.064L22.167 9.576L21.75 8.962Z" fill="#763D16" stroke="#763D16" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.5 5.131L2.25 8.962L1.825 9.576L2.481 10.064L1.996 10.447L2.652 11.031L2.25 11.323L3.189 12.43L7.551 11.072L10.583 8.23L2.677 3L1.5 5.131Z" fill="#763D16" stroke="#763D16" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.803 12.43L16.441 11.072L17.723 13.233L15.817 17.001L18.336 16.968H22.262L20.803 12.43Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.551 11.072L3.189 12.43L1.746 16.968H5.664L8.183 17.001L6.199 13.233L7.551 11.072Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.039 13.443L13.409 8.23L14.603 5.131H9.397L10.583 8.23L10.969 13.443L11.086 14.541L11.094 18.362H12.898L12.914 14.541L13.039 13.443Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign Up with MetaMask {metaMaskLoading && <Loader />}
        </button>
      </div>

      <span className="z-1 relative my-8 block text-center before:content-[''] before:absolute before:h-px before:w-40% before:bg-dark_border before:bg-opacity-60 before:left-0 before:top-3 after:content-[''] after:absolute after:h-px after:w-40% after:bg-dark_border after:bg-opacity-60 after:top-3 after:right-0">
        <span className="text-body-secondary relative z-10 inline-block px-3 text-base text-white">
          OR
        </span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            className="w-full rounded-md border border-dark_border border-opacity-60 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none text-white dark:focus:border-primary"
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            className="flex w-full items-center text-18 font-medium justify-center rounded-md bg-primary px-5 py-3 text-darkmode transition duration-300 ease-in-out hover:bg-transparent hover:text-primary border-primary border "
          >
            Sign Up {loading && <Loader />}
          </button>
        </div>
      </form>

      <p className="text-body-secondary mb-4 text-white text-base">
        By creating an account you are agree with our{" "}
        <a href="/#" className="text-primary hover:underline">
          Privacy
        </a>{" "}
        and{" "}
        <a href="/#" className="text-primary hover:underline">
          Policy
        </a>
      </p>

      <p className="text-body-secondary text-white text-base">
        Already have an account?{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;
