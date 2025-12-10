from web3 import Web3
from typing import Dict, Optional
import json
import os
from datetime import datetime

class BlockchainService:
    def __init__(self):
        # Connect to Ethereum network (use Infura or local node)
        self.w3 = None
        self.contract = None
        self.contract_address = os.getenv('CONTRACT_ADDRESS', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2')
        self._initialize_connection()

    def _initialize_connection(self):
        """Initialize Web3 connection"""
        try:
            # Try to connect to local node or Infura
            infura_url = os.getenv('INFURA_URL', 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID')
            self.w3 = Web3(Web3.HTTPProvider(infura_url))

            if self.w3.is_connected():
                print("✅ Connected to Ethereum network")
            else:
                print("⚠️  Using mock blockchain service (not connected)")
                self.w3 = None
        except Exception as e:
            print(f"⚠️  Blockchain connection failed: {e}")
            self.w3 = None

    def get_status(self) -> Dict:
        """Get blockchain network status"""
        if not self.w3 or not self.w3.is_connected():
            # Return mock data for demo
            return {
                "blockNumber": 12345678,
                "gasPrice": 25,
                "networkId": "sepolia",
                "recentTransactions": [
                    {
                        "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                        "value": 342,
                        "timestamp": "2 min ago"
                    },
                    {
                        "hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                        "value": 298,
                        "timestamp": "5 min ago"
                    },
                    {
                        "hash": "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
                        "value": 415,
                        "timestamp": "8 min ago"
                    }
                ]
            }

        try:
            block_number = self.w3.eth.block_number
            gas_price = self.w3.eth.gas_price
            gas_price_gwei = self.w3.from_wei(gas_price, 'gwei')

            return {
                "blockNumber": block_number,
                "gasPrice": float(gas_price_gwei),
                "networkId": self.w3.eth.chain_id,
                "recentTransactions": self._get_recent_transactions()
            }
        except Exception as e:
            print(f"Error getting blockchain status: {e}")
            return {"error": str(e)}

    def _get_recent_transactions(self, limit: int = 5):
        """Get recent transactions from the contract"""
        try:
            # This would query actual transactions in production
            # For now, return mock data
            return [
                {
                    "hash": "0x" + "1234567890abcdef" * 4,
                    "value": 342,
                    "timestamp": "2 min ago"
                }
            ]
        except Exception as e:
            return []

    async def store_prediction(self, prediction: float, contract_address: str) -> str:
        """Store prediction on blockchain"""
        if not self.w3 or not self.w3.is_connected():
            # Return mock transaction hash
            return "0x" + "abcdef1234567890" * 4

        try:
            # Load contract ABI
            contract_abi = self._load_contract_abi()

            # Create contract instance
            contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(contract_address),
                abi=contract_abi
            )

            # Get account
            account = self.w3.eth.accounts[0]

            # Build transaction
            tx = contract.functions.storePrediction(
                int(prediction),
                "LSTM-v1.0",
                95  # confidence
            ).build_transaction({
                'from': account,
                'nonce': self.w3.eth.get_transaction_count(account),
                'gas': 200000,
                'gasPrice': self.w3.eth.gas_price
            })

            # Sign and send transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, private_key=os.getenv('PRIVATE_KEY'))
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)

            return self.w3.to_hex(tx_hash)

        except Exception as e:
            print(f"Error storing prediction: {e}")
            return "0x" + "error" * 15

    def _load_contract_abi(self):
        """Load contract ABI"""
        # In production, load from file
        return [
            {
                "inputs": [
                    {"name": "_value", "type": "uint256"},
                    {"name": "_modelVersion", "type": "string"},
                    {"name": "_confidence", "type": "uint256"}
                ],
                "name": "storePrediction",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]

    def get_latest_prediction(self) -> Optional[Dict]:
        """Get latest prediction from blockchain"""
        if not self.w3 or not self.contract:
            return None

        try:
            # Call contract method
            prediction = self.contract.functions.getLatestPrediction().call()
            return {
                "timestamp": prediction[0],
                "value": prediction[1],
                "predictor": prediction[2],
                "modelVersion": prediction[3],
                "confidence": prediction[4]
            }
        except Exception as e:
            print(f"Error getting latest prediction: {e}")
            return None
