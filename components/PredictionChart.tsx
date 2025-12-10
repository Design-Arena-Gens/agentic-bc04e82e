'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface PredictionChartProps {
  data: any[]
  type?: 'forecast' | 'accuracy'
}

export default function PredictionChart({ data, type = 'forecast' }: PredictionChartProps) {
  const defaultData = [
    { time: '00:00', value: 245, predicted: 240 },
    { time: '04:00', value: 180, predicted: 185 },
    { time: '08:00', value: 320, predicted: 315 },
    { time: '12:00', value: 420, predicted: 425 },
    { time: '16:00', value: 380, predicted: 375 },
    { time: '20:00', value: 290, predicted: 295 },
    { time: '24:00', value: 250, predicted: 248 },
  ]

  const accuracyData = [
    { time: 'Week 1', accuracy: 88 },
    { time: 'Week 2', accuracy: 90 },
    { time: 'Week 3', accuracy: 92 },
    { time: 'Week 4', accuracy: 94 },
  ]

  const chartData = data.length > 0 ? data : (type === 'accuracy' ? accuracyData : defaultData)

  if (type === 'accuracy') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="accuracy" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorAccuracy)" />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="time" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#fff' }}
        />
        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Actual" />
        <Line type="monotone" dataKey="predicted" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9' }} strokeDasharray="5 5" name="Predicted" />
      </LineChart>
    </ResponsiveContainer>
  )
}
