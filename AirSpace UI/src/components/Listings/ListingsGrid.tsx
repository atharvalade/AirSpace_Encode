"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { NFT } from "@/types/nft";
import { AgreementDialog } from "./AgreementDialog";

// Add these constants at the top of the file
const SELLER_DETAILS = {
  address: "0x676AB843E8aDd6363779409Ee5057f4a26F46F59",
  physical_address: "123 Blockchain Street, Crypto City, CC 12345",
  name: "AirSpace Holdings LLC"
};

const BUYER_DETAILS = {
  address: "0x123ABC456DEF789GHI987JKL654MNO321PQR",
  physical_address: "456 Token Avenue, Digital Town, DT 67890",
  name: "Eddie Murphy"
};

export const ListingsGrid = () => {
  const [listings, setListings] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [agreementText, setAgreementText] = useState<string | null>(null);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/nfts/');
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setListings(data); // Using the API response directly as it matches our NFT interface
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleBuyClick = async (nft: NFT) => {
    setSelectedNFT(nft);
    setAgreementLoading(true);
    setIsAgreementOpen(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/nft/agreement/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nft_token_id: nft.token_id, // Using token_id from API
          nft_value: nft.price.replace(/,/g, ''),
          buyer_address: BUYER_DETAILS.address,
          seller_address: SELLER_DETAILS.address,
          Seller_Physical: SELLER_DETAILS.physical_address,
          Buyer_Physical: BUYER_DETAILS.physical_address,
          Seller_Name: SELLER_DETAILS.name,
          Buyer_Name: BUYER_DETAILS.name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch agreement');
      }

      const data = await response.json();
      setAgreementText(data.agreement);
    } catch (err) {
      console.error('Error fetching agreement:', err);
      // Generate placeholder agreement instead of error message
      const placeholderAgreement = `
**Agreement Between ${SELLER_DETAILS.name} and ${BUYER_DETAILS.name}: NFT Purchase Agreement for ${nft.title}**

This Agreement is made effective as of ${new Date().toLocaleDateString()}.

**1. Purchase Price and Payment Terms**
Buyer agrees to pay ${nft.price} USDC for the NFT Token ID: ${nft.token_id}.

**2. Property Details**
- Property Address: ${nft.property_address}
- Current Height: ${nft.current_height}
- Maximum Height: ${nft.maximum_height}
- Available Floors: ${nft.available_floors}

**3. Parties**
Seller:
- Name: ${SELLER_DETAILS.name}
- Address: ${SELLER_DETAILS.physical_address}
- Wallet: ${SELLER_DETAILS.address}

Buyer:
- Name: ${BUYER_DETAILS.name}
- Address: ${BUYER_DETAILS.physical_address}
- Wallet: ${BUYER_DETAILS.address}

**4. Ownership Transfer**
Upon receipt of complete payment, all rights and ownership will be transferred to the buyer.

**5. Terms and Conditions**
- The seller guarantees the authenticity of the air rights
- This transaction is governed by smart contract ${nft.contract_address}
- All transfers are final and irreversible

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

Seller: _________________ Date: _________________
${SELLER_DETAILS.name}

Buyer: _________________ Date: _________________
${BUYER_DETAILS.name}
`;
      setAgreementText(placeholderAgreement);
    } finally {
      setAgreementLoading(false);
    }
  };

  const getListingImage = (title: string) => {
    const firstWord = title.split(' ')[0].toLowerCase();
    switch (firstWord) {
      case 'niagara':
        return "/images/hero/banner-image.png"; // Keep existing Niagara image
      case 'vancouver':
        return "/images/listings/vancouver.png";
      case 'miami':
        return "/images/listings/miami.png";
      case 'sydney':
        return "/images/listings/sydney.png";
      case 'dubai':
        return "/images/listings/dubai.png";
      default:
        return "/images/hero/banner-image.png";
    }
  };

  if (loading) return <div className="text-white text-center py-20">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-20">{error}</div>;

  return (
    <>
      <div className="grid gap-8">
        {listings.map((listing) => (
          <div key={listing.token_id} className="grid lg:grid-cols-2 gap-8 bg-dark_grey bg-opacity-35 rounded-3xl p-8">
            <div className="relative h-[400px]">
              <Image
                src={getListingImage(listing.title)}
                alt={listing.title}
                fill
                className="object-cover rounded-2xl"
                priority={listing.token_id === 1}
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-white text-28 mb-4">{listing.title}</h2>
                <p className="text-muted text-opacity-80 text-16 mb-4">
                  {listing.property_address}
                </p>
                <p className="text-muted text-opacity-60 text-18 mb-6">
                  {listing.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-deepSlate p-4 rounded-xl">
                    <p className="text-muted text-16">Current Height</p>
                    <p className="text-white text-24">{listing.current_height}</p>
                  </div>
                  <div className="bg-deepSlate p-4 rounded-xl">
                    <p className="text-muted text-16">Max Allowed Height</p>
                    <p className="text-white text-24">{listing.maximum_height}</p>
                  </div>
                </div>
                <div className="bg-deepSlate p-4 rounded-xl mb-8">
                  <p className="text-muted text-16">Floors to be Bought</p>
                  <p className="text-primary text-24">{listing.available_floors}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-16">Price</p>
                  <p className="text-primary text-32">{listing.price} USDC</p>
                </div>
                <button 
                  className="bg-primary text-darkmode px-8 py-3 rounded-lg text-18 font-medium hover:bg-opacity-90 transition-all"
                  onClick={() => handleBuyClick(listing)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AgreementDialog
        isOpen={isAgreementOpen}
        onClose={() => setIsAgreementOpen(false)}
        agreement={agreementText}
        loading={agreementLoading}
        nft={selectedNFT}
      />
    </>
  );
}; 