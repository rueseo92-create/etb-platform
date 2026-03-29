import { useState, useMemo } from 'react'
import { ETB_DATA } from '@/lib/data'
import { MARKET_DATA } from '@/lib/mock-market'
import type { BasketKey } from '@/lib/types'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const ASSET_COLORS: Record<string, string> = {
  us_treasury: '#6CABDD',
  sp500: '#3fb950',
  gold: '#d29922',
}

const ASSET_LABELS: Record<string, string> = {
  us_treasury: 'US Treasury',
  sp500: 'S&P 500',
  gold: 'Gold',
}

export default function Reserve() {
  const [selected, setSelected] = useState<BasketKey>('balanced')
  const defs = ETB_DATA.basket_defs
  const assets = ETB_DATA.asset_history.assets
  const basketCum = ETB_DATA.asset_history.basket_cumulative

  const selectedDef = defs[selected]
  const summary = ETB_DATA.baskets[selected].summary

  const pieData = useMemo(() => {
    return Object.entries(selectedDef.composition).map(([key, info]) => ({
      name: ASSET_LABELS[key] || key,
      value: (info as { weight: number }).weight * 100,
      color: ASSET_COLORS[key],
    }))
  }, [selectedDef])

  const chartData = useMemo(() => {
    const years = assets.us_treasury.years
    return years.map((y: number, i: number) => {
      const row: Record<string, number> = { year: y }
      for (const [key, asset] of Object.entries(assets)) {
        row[key] = (asset as unknown as { cumulative: number[] }).cumulative[i]
      }
      row.basket = basketCum[selected].cumulative[i]
      return row
    })
  }, [selected, assets, basketCum])

  const totalReserve = 125_000_000 // Mock total reserve

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">Reserve Basket</h1>
        <p className="text-sm text-muted-foreground">Full transparency into the underlying assets backing all team tokens.</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Reserve</p>
          <p className="text-xl font-mono font-bold text-foreground mt-1">${(totalReserve / 1e6).toFixed(0)}M</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Growth (31yr)</p>
          <p className="text-xl font-mono font-bold text-gain mt-1">{summary.basket_multiple}x</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Annual Yield</p>
          <p className="text-xl font-mono font-bold text-gain mt-1">+{summary.avg_annual.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Listed Teams</p>
          <p className="text-xl font-mono font-bold text-foreground mt-1">{MARKET_DATA.length}</p>
        </div>
      </div>

      {/* Basket selector */}
      <div className="flex rounded-md bg-secondary overflow-hidden w-fit">
        {(['conservative', 'balanced', 'growth'] as const).map(b => (
          <button
            key={b}
            onClick={() => setSelected(b)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selected === b ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {defs[b].name_kr}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart + composition */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Asset Composition</h3>
          <div className="flex items-center gap-6">
            <div className="w-[200px] h-[200px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    dataKey="value" stroke="none"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(220 18% 10%)',
                      border: '1px solid hsl(220 14% 18%)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value: unknown) => [`${Number(value).toFixed(0)}%`, 'Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 flex-1">
              {pieData.map(c => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                      <span className="text-sm text-foreground">{c.name}</span>
                    </div>
                    <span className="text-sm font-mono text-foreground">{c.value.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.value}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Asset details */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Asset Details</h3>
          <div className="space-y-3">
            {Object.entries(selectedDef.composition).map(([akey, info]) => {
              const typedInfo = info as { weight: number; name: string; name_kr: string }
              const value = totalReserve * typedInfo.weight
              return (
                <div key={akey} className="rounded-md bg-secondary/50 p-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{typedInfo.name}</span>
                    <span className="text-sm font-mono text-foreground">${(value / 1e6).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{typedInfo.name_kr}</span>
                    <span className="text-xs text-muted-foreground">{(typedInfo.weight * 100).toFixed(0)}% allocation</span>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${typedInfo.weight * 100}%`, background: ASSET_COLORS[akey] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Growth chart */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Cumulative Growth (1993 = $100)</h3>
        <p className="text-xs text-muted-foreground mb-4">Individual assets vs {selectedDef.name_kr} basket</p>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="year" tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 11 }}
                formatter={(value: unknown, name: unknown) => [`$${Number(value).toFixed(1)}`, ASSET_LABELS[String(name)] || selectedDef.name_kr]}
              />
              <Area type="monotone" dataKey="sp500" stroke="#3fb950" fill="#3fb950" fillOpacity={0.05} strokeWidth={1.5} />
              <Area type="monotone" dataKey="gold" stroke="#d29922" fill="#d29922" fillOpacity={0.05} strokeWidth={1.5} />
              <Area type="monotone" dataKey="us_treasury" stroke="#6CABDD" fill="#6CABDD" fillOpacity={0.05} strokeWidth={1.5} />
              <Area type="monotone" dataKey="basket" stroke="hsl(142 72% 50%)" fill="hsl(142 72% 50%)" fillOpacity={0.12} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {Object.entries(ASSET_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: ASSET_COLORS[key] }} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded bg-gain" />
            <span className="text-xs text-muted-foreground">{selectedDef.name_kr}</span>
          </div>
        </div>
      </div>

      {/* Team allocations */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Team Reserve Allocations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {MARKET_DATA.map(t => (
            <div key={t.id} className="rounded-md bg-secondary/50 p-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-foreground truncate">{t.ticker}</p>
                <p className="text-xs text-muted-foreground">{t.reserveShare.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yield model */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Yield Distribution Model</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-md bg-secondary p-4">
            <p className="text-sm font-semibold text-gain mb-1">70% — Reserve Reinvestment</p>
            <p className="text-xs text-muted-foreground">Compounds NAV growth, ensuring token values increase over time independent of match outcomes.</p>
          </div>
          <div className="rounded-md bg-secondary p-4">
            <p className="text-sm font-semibold text-accent mb-1">30% — Token Value Increase</p>
            <p className="text-xs text-muted-foreground">Directly accrues to token holders, distributed proportionally across all team allocations.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
