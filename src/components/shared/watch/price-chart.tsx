'use client'

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const data = [
  { date: '2019-01', price: 35000 },
  { date: '2019-06', price: 37500 },
  { date: '2019-12', price: 36000 },
  { date: '2020-06', price: 38000 },
  { date: '2020-12', price: 39500 },
  { date: '2021-06', price: 41000 },
  { date: '2021-12', price: 40000 },
  { date: '2022-06', price: 43000 },
  { date: '2022-12', price: 41500 },
  { date: '2023-06', price: 42426 },
]

export function PriceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ECECEC33" />
        <XAxis dataKey="date" stroke="#878787" tick={{ fill: '#878787' }} />
        <YAxis
          stroke="#878787"
          tick={{ fill: '#878787' }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#000',
            border: '1px solid #ECECEC22',
            borderRadius: '26px',
            padding: '16px',
          }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#878787' }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#2E62E8"
          strokeWidth={2}
          dot={false}
          activeDot={{
            r: 6,
            fill: '#2E62E8',
            stroke: '#fff',
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
