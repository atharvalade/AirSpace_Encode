from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import json
import os

# Path to the JSON file relative to this script
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_WALLET = "0xa20C96EA7B9AbAe32217EbA25577cDe099039D5D"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        query_components = parse_qs(urlparse(self.path).query)
        wallet_address = query_components.get('wallet', [DEFAULT_WALLET])[0]
        
        # Format the wallet address for the filename
        wallet_prefix = wallet_address[:8]
        json_file_path = os.path.join(CURRENT_DIR, '..', f'wallet-nfts-{wallet_prefix}.json')
        
        # Check if we have data for this wallet
        if not os.path.exists(json_file_path):
            # If not, use the default wallet data
            json_file_path = os.path.join(CURRENT_DIR, '..', 'wallet-nfts-0xa20C96.json')
        
        try:
            with open(json_file_path, 'r') as f:
                nft_data = json.load(f)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'max-age=3600')
            self.end_headers()
            
            response_data = {
                'data': nft_data,
                'wallet': wallet_address
            }
            
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                'error': str(e),
                'message': 'Failed to load NFT data'
            }
            
            self.wfile.write(json.dumps(error_response).encode()) 