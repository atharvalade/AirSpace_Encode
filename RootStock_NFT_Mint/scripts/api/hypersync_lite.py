import json
import os
import asyncio
from web3 import Web3
import requests
import hypersync
from hypersync import (
    LogSelection,
    LogField,
    FieldSelection,
    TransactionField,
)

# Define constants
CONTRACT_ADDRESS = "0x676AB843E8aDd6363779409Ee5057f4a26F46F59"
API_KEY = os.environ.get("HYPERINDEX_API_KEY", "")

# ERC721 Transfer event signature
TRANSFER_EVENT_SIGNATURE = "Transfer(address,address,uint256)"
TRANSFER_TOPIC = Web3.keccak(text=TRANSFER_EVENT_SIGNATURE).hex()
if not TRANSFER_TOPIC.startswith("0x"):
    TRANSFER_TOPIC = "0x" + TRANSFER_TOPIC

async def fetch_nfts(wallet_address):
    """Fetch NFTs owned by a wallet using HyperSync"""
    if not wallet_address:
        return {"error": "Wallet address is required"}
    
    print(f"Fetching NFTs owned by: {wallet_address}")
    
    # Initialize HyperSync client for Rootstock
    client = hypersync.HypersyncClient(
        hypersync.ClientConfig(
            url="https://30.hypersync.xyz",  # Rootstock chain ID
            bearer_token=API_KEY if API_KEY else None,
        )
    )
    
    # Format the wallet address for the topic
    wallet_topic = "0x000000000000000000000000" + wallet_address[2:].lower()
    
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
        # Instead of collecting to Parquet, we'll use the stream API
        # and process the data in memory
        incoming_transfers = []
        
        # Stream incoming transfers
        async for event in client.stream_logs(query, config):
            incoming_transfers.append({
                'topic3': event.log.topic3,
                'transaction_hash': event.log.transaction_hash,
                'block_number': event.transaction.block_number
            })
        
        # Now query for outgoing transfers
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
        
        outgoing_transfers = []
        
        # Stream outgoing transfers
        async for event in client.stream_logs(outgoing_query, config):
            outgoing_transfers.append({
                'topic3': event.log.topic3
            })
        
        # Process the data to find currently owned NFTs
        # Extract token IDs
        incoming_token_ids = [int(transfer['topic3'], 16) for transfer in incoming_transfers]
        outgoing_token_ids = [int(transfer['topic3'], 16) for transfer in outgoing_transfers]
        
        # Find tokens that are still owned (in incoming but not in outgoing)
        owned_token_ids = set(incoming_token_ids) - set(outgoing_token_ids)
        
        print(f"Found {len(owned_token_ids)} NFTs owned by this wallet")
        
        # Connect to the contract to fetch metadata
        w3 = Web3(Web3.HTTPProvider('https://public-node.testnet.rsk.co'))
        
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
                # Find the transaction details from incoming transfers
                tx_details = next((t for t in incoming_transfers if int(t['topic3'], 16) == token_id), None)
                
                if tx_details:
                    tx_hash = tx_details['transaction_hash']
                    block_number = tx_details['block_number']
                else:
                    tx_hash = None
                    block_number = None
                
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
        
        return nft_details
        
    except Exception as e:
        print(f"Error using HyperSync API: {e}")
        print("Falling back to direct contract calls...")
        return await fetch_nfts_directly(wallet_address)

async def fetch_nfts_directly(wallet_address):
    """Fetch NFTs owned by a wallet directly from the contract"""
    if not wallet_address:
        return {"error": "Wallet address is required"}
    
    print(f"Fetching NFTs directly for wallet: {wallet_address}")
    
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
            if owner.lower() == wallet_address.lower():
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
    
    return nft_details 

if __name__ == "__main__":
    # Get wallet address from environment variable
    wallet_address = os.environ.get("WALLET_ADDRESS")
    if not wallet_address:
        print("Please set the WALLET_ADDRESS environment variable")
        exit(1)
    
    print(f"Starting NFT fetch for wallet: {wallet_address}")
    
    # Run the async function
    nft_details = asyncio.run(fetch_nfts(wallet_address))
    
    # Save results to JSON file
    output_file = f"wallet-nfts-{wallet_address[:8]}.json"
    with open(output_file, 'w') as f:
        json.dump(nft_details, f, indent=2)
    
    print(f"\nNFT details saved to {output_file}")
    
    # Display summary
    if nft_details:
        print("\n=== NFT SUMMARY ===")
        print(f"Found {len(nft_details)} NFTs owned by {wallet_address}:")
        
        for i, nft in enumerate(nft_details):
            print(f"\n{i+1}. Token ID: {nft['tokenId']}")
            print(f"   Title: {nft['metadata'].get('title') or nft['metadata'].get('name')}")
            print(f"   IPFS: {nft['ipfsHash']}")
            if 'transactionHash' in nft:
                print(f"   TX: {nft['transactionHash']}") 