'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Shield, Database, Activity, BarChart3 } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-Time Predictions',
      description: 'LSTM-powered energy forecasting with sub-second latency using Spark Streaming'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Blockchain Security',
      description: 'Decentralized prediction storage on Ethereum with immutable audit trails'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Big Data Processing',
      description: 'Apache Spark for distributed real-time data processing at scale'
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Live Monitoring',
      description: 'WebSocket-based real-time dashboard with streaming metrics'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'ML-Driven Insights',
      description: 'Deep learning models trained on historical energy consumption patterns'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Comprehensive analytics with predictive accuracy metrics'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold text-white">EnergyForecast</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Decentralized Energy
              <br />
              <span className="gradient-text">Forecasting Platform</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Harness the power of LSTM neural networks, Apache Spark streaming, and blockchain technology
              for real-time, transparent, and accurate energy predictions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-lg bg-primary-600 text-white text-lg font-semibold hover:bg-primary-700 transition transform hover:scale-105"
              >
                Launch Dashboard
              </Link>
              <button className="px-8 py-4 rounded-lg glass-card text-white text-lg font-semibold hover:bg-white/10 transition">
                View Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-gray-400 text-lg">Enterprise-grade energy forecasting infrastructure</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass-card p-6 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <div className="text-primary-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['LSTM', 'Spark Streaming', 'FastAPI', 'Ethereum', 'React', 'Tailwind', 'Docker', 'PostgreSQL'].map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                className="glass-card p-6 rounded-lg"
              >
                <span className="text-white font-semibold">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2024 Decentralized Energy Forecasting. Built with LSTM, Spark, and Blockchain.</p>
        </div>
      </footer>
    </div>
  )
}
