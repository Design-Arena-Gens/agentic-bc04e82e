'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, Database, TrendingUp, Wallet, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import PredictionChart from '@/components/PredictionChart'
import MetricsCard from '@/components/MetricsCard'
import WalletConnect from '@/components/WalletConnect'
import RealtimeStream from '@/components/RealtimeStream'
import { fetchPredictions, fetchMetrics, fetchBlockchainStatus } from '@/lib/api'

export default function Dashboard() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: fetchPredictions,
    refetchInterval: 5000,
  })

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    refetchInterval: 10000,
  })

  const { data: blockchainStatus } = useQuery({
    queryKey: ['blockchain'],
    queryFn: fetchBlockchainStatus,
    refetchInterval: 15000,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold text-white">EnergyForecast</span>
            </Link>
            <WalletConnect
              onConnect={(address) => {
                setWalletConnected(true)
                setWalletAddress(address)
              }}
              onDisconnect={() => {
                setWalletConnected(false)
                setWalletAddress('')
              }}
            />
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Real-time energy forecasting and blockchain metrics</p>
          </motion.div>

          {/* Status Banner */}
          {walletConnected && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 glass-card p-4 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              </div>
              {blockchainStatus && (
                <span className="text-gray-400 text-sm">
                  Block: {blockchainStatus.blockNumber} | Gas: {blockchainStatus.gasPrice} Gwei
                </span>
              )}
            </motion.div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              icon={<Activity className="w-6 h-6" />}
              title="Current Prediction"
              value={metrics?.currentPrediction || '0 kWh'}
              change="+12.5%"
              positive={true}
            />
            <MetricsCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Model Accuracy"
              value={metrics?.modelAccuracy || '94.2%'}
              change="+2.1%"
              positive={true}
            />
            <MetricsCard
              icon={<Database className="w-6 h-6" />}
              title="Data Points Processed"
              value={metrics?.dataPoints || '1.2M'}
              change="+45K"
              positive={true}
            />
            <MetricsCard
              icon={<Zap className="w-6 h-6" />}
              title="Predictions Today"
              value={metrics?.predictionsToday || '8,432'}
              change="+1.2K"
              positive={true}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Energy Consumption Forecast</h2>
              <PredictionChart data={predictions?.hourly || []} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Model Performance</h2>
              <PredictionChart data={predictions?.accuracy || []} type="accuracy" />
            </motion.div>
          </div>

          {/* Real-time Stream */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-xl mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
              Live Data Stream
            </h2>
            <RealtimeStream />
          </motion.div>

          {/* Blockchain Transactions */}
          {walletConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Recent Blockchain Transactions</h2>
              <div className="space-y-3">
                {blockchainStatus?.recentTransactions?.map((tx: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Prediction Stored</p>
                      <p className="text-gray-400 text-sm">{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary-400">{tx.value} kWh</p>
                      <p className="text-gray-400 text-sm">{tx.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
