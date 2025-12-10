'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StreamData {
  id: string
  timestamp: string
  value: number
  source: string
}

export default function RealtimeStream() {
  const [streamData, setStreamData] = useState<StreamData[]>([])

  useEffect(() => {
    // Simulate real-time data stream
    const interval = setInterval(() => {
      const newData: StreamData = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 500) + 200,
        source: ['Grid A', 'Grid B', 'Solar Panel', 'Wind Turbine'][Math.floor(Math.random() * 4)]
      }

      setStreamData(prev => [newData, ...prev].slice(0, 8))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {streamData.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-primary-500/20"
          >
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">{item.source}</p>
                <p className="text-gray-400 text-sm">{item.timestamp}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-400 font-bold">{item.value} kWh</p>
              <p className="text-gray-400 text-xs">Real-time</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
