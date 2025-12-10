/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.energy-forecast.demo',
    NEXT_PUBLIC_BLOCKCHAIN_NETWORK: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK || 'sepolia',
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
  },
}

module.exports = nextConfig
