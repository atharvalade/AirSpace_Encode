import hypersync
from hypersync import (
    LogSelection,
    LogField,
    FieldSelection,
    TransactionField,
)
import asyncio
import json
import os
from web3 import Web3
import requests

# Define constants
CONTRACT_ADDRESS = "0x676AB843E8aDd6363779409Ee5057f4a26F46F59"
WALLET_ADDRESS = os.environ.get("WALLET_ADDRESS")
API_KEY = os.environ.get("HYPERINDEX_API_KEY", "")

# ERC721 Transfer event signature
TRANSFER_EVENT_SIGNATURE = "Transfer(address,address,uint256)"
# Make sure the topic has the 0x prefix
TRANSFER_TOPIC = Web3.keccak(text=TRANSFER_EVENT_SIGNATURE).hex()
if not TRANSFER_TOPIC.startswith("0x"):
    TRANSFER_TOPIC = "0x" + TRANSFER_TOPIC

async def fetch_nfts():
    if not WALLET_ADDRESS:
        print("Please set the WALLET_ADDRESS environment variable")
        return
    
    print(f"Fetching NFTs owned by: {WALLET_ADDRESS}")
    
    # Initialize HyperSync client for Rootstock
    client = hypersync.HypersyncClient(
        hypersync.ClientConfig(
            url="https://30.hypersync.xyz",  # Rootstock chain ID
            bearer_token=API_KEY if API_KEY else None,
        )
    )
    
    # Format the wallet address for the topic
    wallet_topic = "0x000000000000000000000000" + WALLET_ADDRESS[2:].lower()
    
    # Create a query for Transfer events to this wallet
    query = hypersync.Query(
        from_block=0,
        logs=[
            LogSelection(
                address=[CONTRACT_ADDRESS],  # Our NFT contract
                topics=[
                    [TRANSFER_TOPIC],  # Transfer event
                    [],  # from address (any)
                    [wallet_topic]  # to address (our wallet)
                ],
            )
        ],
        field_selection=FieldSelection(
            log=[
                LogField.TOPIC0,
                LogField.TOPIC1,
                LogField.TOPIC2,
                LogField.TOPIC3,
                LogField.DATA,
                LogField.TRANSACTION_HASH,
            ],
            transaction=[
                TransactionField.BLOCK_NUMBER,
            ],
        ),
    )
    
    config = hypersync.StreamConfig(
        hex_output=hypersync.HexOutput.PREFIXED,
        event_signature=TRANSFER_EVENT_SIGNATURE,
    )
    
    try:
        # Collect the data
        print("Querying HyperSync API...")
        print(f"Using Transfer topic: {TRANSFER_TOPIC}")
        print(f"Using wallet topic: {wallet_topic}")
        await client.collect_parquet("incoming_transfers", query, config)
        print("Data collected successfully!")
        
        # Now query for outgoing transfers (tokens no longer owned)
        outgoing_query = hypersync.Query(
            from_block=0,
            logs=[
                LogSelection(
                    address=[CONTRACT_ADDRESS],  # Our NFT contract
                    topics=[
                        [TRANSFER_TOPIC],  # Transfer event
                        [wallet_topic],  # from address (our wallet)
                        [],  # to address (any)
                    ],
                )
            ],
            field_selection=FieldSelection(
                log=[
                    LogField.TOPIC0,
                    LogField.TOPIC1,
                    LogField.TOPIC2,
                    LogField.TOPIC3,
                    LogField.DATA,
                ],
            ),
        )
        
        await client.collect_parquet("outgoing_transfers", outgoing_query, config)
        
        # Process the data to find currently owned NFTs
        import pandas as pd
        
        # Read the parquet files
        incoming_df = pd.read_parquet("incoming_transfers.parquet")
        outgoing_df = pd.read_parquet("outgoing_transfers.parquet")
        
        # Extract token IDs
        incoming_df['token_id'] = incoming_df['topic3'].apply(lambda x: int(x, 16))
        outgoing_df['token_id'] = outgoing_df['topic3'].apply(lambda x: int(x, 16))
        
        # Find tokens that are still owned (in incoming but not in outgoing)
        owned_token_ids = set(incoming_df['token_id']) - set(outgoing_df['token_id'])
        
        print(f"Found {len(owned_token_ids)} NFTs owned by this wallet")
        
        # Connect to the contract to fetch metadata
        from web3 import Web3, HTTPProvider
        
        # Connect to RSK Testnet
        w3 = Web3(HTTPProvider('https://public-node.testnet.rsk.co'))
        
        # Load contract ABI (simplified for this example)
        abi = [
            {
                "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
                "name": "tokenURI",
                "outputs": [{"internalType": "string", "name": "", "type": "string"}],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)
        
        # Fetch metadata for each token
        nft_details = []
        for token_id in owned_token_ids:
            print(f"\nFetching metadata for token ID: {token_id}")
            
            try:
                # Get transaction details from the dataframe
                tx_row = incoming_df[incoming_df['token_id'] == token_id].iloc[0]
                tx_hash = tx_row['transaction_hash']
                block_number = tx_row['block_number']
                
                # Get token URI from contract
                token_uri = contract.functions.tokenURI(token_id).call()
                print(f"Token URI: {token_uri}")
                
                # Extract IPFS hash and fetch metadata
                ipfs_hash = token_uri.replace('ipfs://', '')
                metadata_url = f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
                
                print(f"Fetching metadata from: {metadata_url}")
                response = requests.get(metadata_url)
                metadata = response.json()
                
                # Add to our collection
                nft_details.append({
                    "tokenId": token_id,
                    "transactionHash": tx_hash,
                    "blockNumber": block_number,
                    "ipfsHash": ipfs_hash,
                    "metadata": metadata
                })
                
                print(f"Successfully fetched metadata for token ID: {token_id}")
            except Exception as e:
                print(f"Error fetching metadata for token ID {token_id}: {e}")
        
        # Save results to JSON file
        output_file = f"wallet-nfts-{WALLET_ADDRESS[:8]}.json"
        with open(output_file, 'w') as f:
            json.dump(nft_details, f, indent=2)
        
        print(f"\nNFT details saved to {output_file}")
        
        # Display summary
        print("\n=== NFT SUMMARY ===")
        print(f"Found {len(nft_details)} NFTs owned by {WALLET_ADDRESS}:")
        
        for i, nft in enumerate(nft_details):
            print(f"\n{i+1}. Token ID: {nft['tokenId']}")
            print(f"   Title: {nft['metadata'].get('title') or nft['metadata'].get('name')}")
            print(f"   IPFS: {nft['ipfsHash']}")
            print(f"   TX: {nft['transactionHash']}")
            
    except Exception as e:
        print(f"Error using HyperSync API: {e}")
        print("Falling back to direct contract calls...")
        await fetch_nfts_directly()

async def fetch_nfts_directly():
    if not WALLET_ADDRESS:
        print("Please set the WALLET_ADDRESS environment variable")
        return
        
    print("Implementing direct contract call approach...")
    
    # Connect to RSK Testnet
    w3 = Web3(Web3.HTTPProvider('https://public-node.testnet.rsk.co'))
    
    # Load contract ABI (simplified for this example)
    abi = [
        {
            "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
            "name": "tokenURI",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
            "name": "ownerOf",
            "outputs": [{"internalType": "address", "name": "", "type": "address"}],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)
    
    # Check ownership for a range of token IDs (optimized to only check 1-6)
    max_token_id = 6  # We now know tokens 1-6 exist
    owned_tokens = []
    
    print(f"Checking ownership for token IDs 1-{max_token_id}...")
    for token_id in range(1, max_token_id + 1):
        try:
            owner = contract.functions.ownerOf(token_id).call()
            if owner.lower() == WALLET_ADDRESS.lower():
                print(f"Token ID {token_id} is owned by this wallet")
                owned_tokens.append(token_id)
            else:
                print(f"Token ID {token_id} is owned by: {owner}")
        except Exception as e:
            # Token might not exist or other error
            print(f"Token ID {token_id} check failed: {e}")
    
    print(f"Found {len(owned_tokens)} tokens owned by this wallet")
    
    # Fetch metadata for each owned token
    nft_details = []
    for token_id in owned_tokens:
        print(f"\nFetching metadata for token ID: {token_id}")
        
        try:
            # Get token URI
            token_uri = contract.functions.tokenURI(token_id).call()
            print(f"Token URI: {token_uri}")
            
            # Extract IPFS hash and fetch metadata
            ipfs_hash = token_uri.replace('ipfs://', '')
            metadata_url = f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
            
            print(f"Fetching metadata from: {metadata_url}")
            response = requests.get(metadata_url)
            metadata = response.json()
            
            # Add to our collection
            nft_details.append({
                "tokenId": token_id,
                "ipfsHash": ipfs_hash,
                "metadata": metadata
            })
            
            print(f"Successfully fetched metadata for token ID: {token_id}")
        except Exception as e:
            print(f"Error fetching metadata for token ID {token_id}: {e}")
    
    # Save results to JSON file
    output_file = f"wallet-nfts-{WALLET_ADDRESS[:8]}.json"
    with open(output_file, 'w') as f:
        json.dump(nft_details, f, indent=2)
    
    print(f"\nNFT details saved to {output_file}")
    
    # Display summary
    print("\n=== NFT SUMMARY ===")
    print(f"Found {len(nft_details)} NFTs owned by {WALLET_ADDRESS}:")
    
    for i, nft in enumerate(nft_details):
        print(f"\n{i+1}. Token ID: {nft['tokenId']}")
        print(f"   Title: {nft['metadata'].get('title') or nft['metadata'].get('name')}")
        print(f"   IPFS: {nft['ipfsHash']}")
    
    return nft_details

if __name__ == "__main__":
    asyncio.run(fetch_nfts()) 