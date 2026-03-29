import { useState, useMemo } from 'react'
import { ETB_DATA } from '@/lib/data'
import { formatCurrency, formatPercent } from '@/lib/utils'
import SectionHeader from '@/components/SectionHeader'
import StatCard from '@/components/StatCard'
import type { BasketKey } from '@/lib/types'
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts'

const BIG6_COLORS: Record<string, string> = {
  'Manchester United': '#DA291C',
  'Manchester City': '#6CABDD',
  'Arsenal': '#EF0107',
  'Liverpool': '#C8102E',
  'Chelsea': '#034694',
  'Tottenham': '#132257',
}

export default function Backtest() {
  const [basket, setBasket] = useState<BasketKey>('balanced')
  const data = ETB_DATA.baskets[basket]
  const summary = data.summary

  // ELO Timeline chart data (Big 6 only)
  const eloChartData = useMemo(() => {
    const big6 = ETB_DATA.big6
    const allDates = new Set<string>()
    big6.forEach(team => {
      const tl = ETB_DATA.elo_timeline[team as keyof typeof ETB_DATA.elo_timeline]
      if (tl) (tl.dates as readonly string[]).forEach(d => allDates.add(d))
    })
    const sorted = [...allDates].sort()
    // Sample every 10th date
    const sampled = sorted.filter((_, i) => i % 10 === 0 || i === sorted.length - 1)

    return sampled.map(date => {
      const row: Record<string, string | number | null> = { date }
      big6.forEach(team => {
        const tl = ETB_DATA.elo_timeline[team as keyof typeof ETB_DATA.elo_timeline]
        if (!tl) { row[team] = null; return }
        const dates = tl.dates as readonly string[]
        const ratings = tl.ratings_smooth as readonly (number | null)[]
        // Find closest date
        let closest = 0
        for (let i = 0; i < dates.length; i++) {
          if (dates[i] <= date) closest = i
          else break
        }
        row[team] = ratings[closest]
      })
      return row
    })
  }, [])

  // Basket growth chart
  const growthData = useMemo(() => {
    const bg = data.basket_growth
    return (bg.dates as readonly string[]).map((d, i) => ({
      date: d,
      value: (bg.basket_values as readonly number[])[i],
    }))
  }, [data])

  // Returns bar chart (top 20)
  const returnsBar = useMemo(() => {
    return [...data.annual_returns]
      .sort((a, b) => b.total_return_pct - a.total_return_pct)
      .slice(0, 20)
      .map(t => ({
        team: t.team.length > 12 ? t.team.slice(0, 11) + '...' : t.team,
        fullName: t.team,
        total: t.total_return_pct,
        annual: t.annual_return_pct,
        is_big6: t.is_big6,
      }))
  }, [data])

  // Scatter: ELO vs Return
  const scatterData = useMemo(() => {
    return data.annual_returns.map(t => ({
      name: t.team,
      elo: t.final_elo,
      returnPct: t.annual_return_pct,
      is_big6: t.is_big6,
    }))
  }, [data])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SectionHeader
        badge="BACKTEST"
        title="31시즌 백테스트 검증"
        subtitle="1993/94 ~ 2024/25 실제 경기 데이터 기반 시뮬레이션"
      />

      {/* Basket toggle */}
      <div className="flex rounded-md bg-secondary overflow-hidden w-fit">
        {(['conservative', 'balanced', 'growth'] as const).map(b => (
          <button
            key={b}
            onClick={() => setBasket(b)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              basket === b ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {ETB_DATA.basket_defs[b].name_kr}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="최종 바스켓 가치" value={`${formatCurrency(summary.basket_final)}원`} valueClass="text-gain" />
        <StatCard label="성장 배수" value={`${summary.basket_multiple}x`} sub="1,000만원 초기 투입" />
        <StatCard label="최고 총수익 팀" value={summary.best_total.team} sub={formatPercent(summary.best_total.value)} />
        <StatCard label="평균 연 수익률" value={formatPercent(summary.avg_annual)} />
      </div>

      {/* ELO Timeline */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Big 6 ELO Rating Timeline</h3>
        <p className="text-xs text-muted-foreground mb-4">하이브리드 ELO (배당률 70% + ELO 30%) 10경기 이동평균</p>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={eloChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(220 14% 18%)' }}
                tickFormatter={(v: string) => v.slice(0, 4)}
                interval={Math.floor(eloChartData.length / 8)}
              />
              <YAxis
                domain={[1300, 2000]}
                tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(220 14% 18%)' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(220 18% 10%)',
                  border: '1px solid hsl(220 14% 18%)',
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />
              {ETB_DATA.big6.map(team => (
                <Line
                  key={team}
                  type="monotone"
                  dataKey={team}
                  stroke={BIG6_COLORS[team]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {ETB_DATA.big6.map(team => (
            <div key={team} className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: BIG6_COLORS[team] }} />
              <span className="text-xs text-muted-foreground">{team}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Basket Growth */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">바스켓 총 가치 성장</h3>
        <p className="text-xs text-muted-foreground mb-4">
          {ETB_DATA.basket_defs[basket].name_kr} 구성 | 초기 1,000만원
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(220 14% 18%)' }}
                tickFormatter={(v: string) => v.slice(0, 4)}
              />
              <YAxis
                tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(220 14% 18%)' }}
                tickFormatter={(v: number) => `${(v / 1e6).toFixed(0)}M`}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(220 18% 10%)',
                  border: '1px solid hsl(220 14% 18%)',
                  borderRadius: 8,
                  fontSize: 11,
                }}
                formatter={(value: unknown) => [`${formatCurrency(Number(value))}원`, '바스켓 가치']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(142 72% 50%)"
                fill="hsl(142 72% 50%)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Returns Bar */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">팀별 총 수익률 TOP 20</h3>
          <p className="text-xs text-muted-foreground mb-4">{ETB_DATA.basket_defs[basket].name_kr} 기준</p>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={returnsBar} layout="vertical" margin={{ left: 5, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis
                  type="number"
                  tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(220 14% 18%)' }}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="team"
                  width={85}
                  tick={{ fill: 'hsl(215 15% 50%)', fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(220 14% 18%)' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220 18% 10%)',
                    border: '1px solid hsl(220 14% 18%)',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  formatter={(value: unknown) => [`${Number(value).toFixed(1)}%`, '총 수익률']}
                  labelFormatter={(label: unknown) => {
                    const item = returnsBar.find(r => r.team === String(label))
                    return item?.fullName || String(label)
                  }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {returnsBar.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.is_big6
                        ? BIG6_COLORS[entry.fullName] || 'hsl(142 72% 50%)'
                        : entry.total >= 0 ? 'hsl(142 72% 50% / 0.6)' : 'hsl(0 72% 56% / 0.6)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scatter: ELO vs Return */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">ELO vs 연 수익률</h3>
          <p className="text-xs text-muted-foreground mb-4">높은 ELO = 높은 수익률 상관관계</p>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ScatterChart margin={{ left: 5, right: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis
                  type="number"
                  dataKey="elo"
                  name="ELO"
                  tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(220 14% 18%)' }}
                  label={{ value: 'ELO Rating', position: 'bottom', fill: 'hsl(215 15% 50%)', fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="returnPct"
                  name="연 수익률"
                  tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(220 14% 18%)' }}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220 18% 10%)',
                    border: '1px solid hsl(220 14% 18%)',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  formatter={(value: unknown, name: unknown) => [
                    String(name) === 'ELO' ? Number(value).toFixed(0) : `${Number(value).toFixed(1)}%`,
                    String(name) === 'ELO' ? 'ELO' : '연 수익률',
                  ]}
                  labelFormatter={() => ''}
                />
                <Scatter data={scatterData.filter(d => !d.is_big6)} fill="hsl(215 15% 50% / 0.5)" />
                <Scatter data={scatterData.filter(d => d.is_big6)} fill="hsl(142 72% 50%)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gain" />
              <span className="text-xs text-muted-foreground">Big 6</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
              <span className="text-xs text-muted-foreground">Other Teams</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
