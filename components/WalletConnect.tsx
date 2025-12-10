'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Wallet } from 'lucide-react'

interface WalletConnectProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const addr = await accounts[0].getAddress()
          setAddress(addr)
          setConnected(true)
          onConnect(addr)
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('Please install MetaMask to use this feature')
      return
    }

    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const addr = await signer.getAddress()

      setAddress(addr)
      setConnected(true)
      onConnect(addr)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet')
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    setAddress('')
    setConnected(false)
    onDisconnect()
  }

  if (connected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="glass-card px-4 py-2 rounded-lg">
          <span className="text-white text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connectWallet}
      disabled={loading}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-50"
    >
      <Wallet className="w-4 h-4" />
      <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  )
}
