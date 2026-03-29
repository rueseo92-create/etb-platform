import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'

interface PriceChartProps {
  data: { time: string; price: number; nav: number }[]
  height?: number
  showNav?: boolean
  positive?: boolean
  showAxes?: boolean
}

export default function PriceChart({ data, height = 300, showNav = true, positive = true, showAxes = true }: PriceChartProps) {
  const color = positive ? 'hsl(142 72% 50%)' : 'hsl(0 72% 56%)'
  const lastNav = data[data.length - 1]?.nav

  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        {showAxes && (
          <>
            <XAxis
              dataKey="time"
              tick={{ fill: 'hsl(215 15% 50%)', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: string) => v.slice(5)}
              interval={Math.floor(data.length / 5)}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: 'hsl(215 15% 50%)', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v.toFixed(1)}`}
              width={45}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            background: 'hsl(220 18% 10%)',
            border: '1px solid hsl(220 14% 18%)',
            borderRadius: 8,
            fontSize: 11,
          }}
          formatter={(value: unknown, name: unknown) => [
            `$${Number(value).toFixed(4)}`,
            String(name) === 'price' ? 'Price' : 'NAV',
          ]}
        />
        {showNav && lastNav && (
          <ReferenceLine y={lastNav} stroke="hsl(217 80% 56%)" strokeDasharray="4 4" strokeWidth={1} />
        )}
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          fill={color}
          fillOpacity={0.08}
          strokeWidth={1.5}
          dot={false}
        />
        {showNav && (
          <Area
            type="monotone"
            dataKey="nav"
            stroke="hsl(217 80% 56%)"
            fill="none"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
