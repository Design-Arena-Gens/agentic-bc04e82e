'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface MetricsCardProps {
  icon: React.ReactNode
  title: string
  value: string
  change: string
  positive: boolean
}

export default function MetricsCard({ icon, title, value, change, positive }: MetricsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-primary-400">{icon}</div>
        <div className={`flex items-center text-sm ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  )
}
