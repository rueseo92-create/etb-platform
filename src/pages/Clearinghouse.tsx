import { useState } from 'react'
import StatCard from '@/components/StatCard'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'

type SimMode = 'A' | 'B' | 'C' | 'D'

const SIM_MODES: { mode: SimMode; label: string; labelKr: string; color: string; desc: string }[] = [
  { mode: 'A', label: 'No Clearinghouse', labelKr: '레이팅만', color: '#534AB7', desc: 'Rating changes only, no asset segregation' },
  { mode: 'B', label: 'Fixed Ratio', labelKr: '고정 비율', color: '#D85A30', desc: 'Fixed % of Reserve Pool in Clearinghouse' },
  { mode: 'C', label: 'Dynamic Ratio', labelKr: '동적 비율', color: '#1D9E75', desc: 'CH ratio based on unlisted team ratings' },
  { mode: 'D', label: 'Ignore Unlisted', labelKr: '비상장 무시', color: '#71717A', desc: 'Only listed-vs-listed matches counted' },
]

const SIM_RESULTS: Record<SimMode, {
  matches: number; listedPool: string; chBalance: string; chRatio: string;
  avgPrice: number; chNeg: number; topTeam: string; topElo: number;
}> = {
  A: { matches: 305444, listedPool: '100%', chBalance: '$0', chRatio: '0%', avgPrice: 0.320, chNeg: 0, topTeam: 'Juventus', topElo: 2192 },
  B: { matches: 305444, listedPool: '95%', chBalance: '$1.7M', chRatio: '5%', avgPrice: 0.304, chNeg: 0, topTeam: 'Juventus', topElo: 2192 },
  C: { matches: 305444, listedPool: '1.5%', chBalance: '$33.4M', chRatio: '98.5%', avgPrice: 0.005, chNeg: 0, topTeam: 'Juventus', topElo: 2192 },
  D: { matches: 10923, listedPool: '100%', chBalance: '$0', chRatio: '0%', avgPrice: 0.320, chNeg: 0, topTeam: 'Juventus', topElo: 1932 },
}

const SWEEP_DATA = [
  { ratio: '3%', rebal: 'Q', neg: 0, minCh: 2.61, price: 0.3099 },
  { ratio: '5%', rebal: 'Q', neg: 0, minCh: 4.61, price: 0.3036, optimal: true },
  { ratio: '7%', rebal: 'Q', neg: 0, minCh: 6.62, price: 0.2972 },
  { ratio: '10%', rebal: 'Q', neg: 0, minCh: 9.63, price: 0.2876 },
  { ratio: '15%', rebal: 'Q', neg: 0, minCh: 14.65, price: 0.2716 },
  { ratio: '20%', rebal: 'Q', neg: 0, minCh: 19.67, price: 0.2556 },
]

const PRICE_CHART = SWEEP_DATA.map(d => ({
  ratio: d.ratio,
  price: d.price,
  safety: d.minCh,
  optimal: d.optimal || false,
}))

export default function Clearinghouse() {
  const [selected, setSelected] = useState<SimMode>('B')
  const result = SIM_RESULTS[selected]

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Clearinghouse Simulation</h1>
          <p className="text-sm text-muted-foreground">
            How should unlisted team matches affect listed token values? 4 strategies compared over 25 years.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-mono text-primary">
            305,444 matches
          </span>
          <span className="inline-flex items-center rounded-full bg-gain/10 border border-gain/20 px-3 py-1 text-xs font-mono text-gain">
            106 listed teams
          </span>
        </div>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SIM_MODES.map(sim => {
          const r = SIM_RESULTS[sim.mode]
          const isSelected = selected === sim.mode
          const isRecommended = sim.mode === 'B'
          return (
            <button
              key={sim.mode}
              onClick={() => setSelected(sim.mode)}
              className={`relative rounded-lg border p-4 text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                  : 'border-border bg-card hover:bg-surface-elevated'
              }`}
            >
              {isRecommended && (
                <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground uppercase tracking-wider">
                  Recommended
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sim.color }} />
                <span className="text-sm font-semibold text-foreground">Sim {sim.mode}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">{sim.labelKr}</span>
              </div>
              <p className="text-2xl font-mono font-bold" style={{ color: sim.mode === 'C' ? 'hsl(0 72% 50%)' : sim.color }}>
                ${r.avgPrice.toFixed(3)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">avg token price</p>
              <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Listed Pool</span>
                  <span className="font-mono text-foreground">{r.listedPool}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">CH Negative</span>
                  <span className="font-mono text-gain">{r.chNeg} events</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected sim details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Matches Processed"
          value={result.matches.toLocaleString()}
          sub={selected === 'D' ? '3.6% of total' : '100% of 2000–2025'}
          valueClass={selected === 'D' ? 'text-muted-foreground' : undefined}
        />
        <StatCard
          label="CH Balance"
          value={result.chBalance}
          sub={`${result.chRatio} of reserve`}
          valueClass={selected === 'C' ? 'text-loss' : undefined}
        />
        <StatCard
          label="Top Team"
          value={result.topTeam}
          sub={`ELO ${result.topElo}`}
        />
        <StatCard
          label="Avg Token Price"
          value={`$${result.avgPrice.toFixed(3)}`}
          valueClass={selected === 'C' ? 'text-loss' : 'text-gain'}
        />
      </div>

      {/* Bottom: Sweep + Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sweep chart */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground">CH Ratio Sweep — Sim B</h3>
            <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              12 configurations tested
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Token price vs safety buffer at different CH ratios (quarterly rebalance)</p>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={PRICE_CHART} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="ratio" tick={{ fill: 'hsl(215 15% 50%)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v: number) => `$${v.toFixed(2)}`}
                  domain={[0.24, 0.32]}
                />
                <Tooltip
                  contentStyle={{ background: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 11 }}
                  formatter={(value: unknown, name: unknown) => {
                    if (String(name) === 'price') return [`$${Number(value).toFixed(4)}`, 'Avg Price']
                    return [`${Number(value).toFixed(2)}%`, 'Min Safety']
                  }}
                />
                <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                  {PRICE_CHART.map((entry, i) => (
                    <Cell key={i} fill={entry.optimal ? 'hsl(142 72% 50%)' : 'hsl(215 15% 35%)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sweep table */}
          <div className="mt-4 overflow-hidden rounded-md border border-border">
            <div className="grid grid-cols-[4rem_4rem_4rem_5rem_1fr] gap-x-2 px-4 py-2 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider bg-muted/30">
              <span>Ratio</span>
              <span>Rebal</span>
              <span>CH Neg</span>
              <span>Min CH%</span>
              <span className="text-right">Avg Price</span>
            </div>
            {SWEEP_DATA.map(row => (
              <div
                key={row.ratio}
                className={`grid grid-cols-[4rem_4rem_4rem_5rem_1fr] gap-x-2 px-4 py-2 border-b border-border/50 text-xs items-center ${
                  row.optimal ? 'bg-primary/5' : ''
                }`}
              >
                <span className={`font-mono ${row.optimal ? 'text-primary font-bold' : 'text-foreground'}`}>
                  {row.ratio}
                </span>
                <span className="font-mono text-muted-foreground">{row.rebal === 'Q' ? 'Quarter' : 'Annual'}</span>
                <span className="font-mono text-gain">{row.neg}</span>
                <span className={`font-mono ${row.optimal ? 'text-primary' : 'text-muted-foreground'}`}>
                  {row.minCh.toFixed(2)}%
                </span>
                <span className={`font-mono text-right ${row.optimal ? 'text-primary font-bold' : 'text-foreground'}`}>
                  ${row.price.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation card */}
        <div className="rounded-lg border border-primary/30 bg-card p-6 flex flex-col">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-wider w-fit mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Optimal Configuration
          </span>

          <h2 className="text-3xl font-bold text-foreground mb-1">CH 5%</h2>
          <p className="text-lg font-semibold text-muted-foreground mb-4">Quarterly Rebalance</p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Token price maintained at $0.304 with full safety margin.
            Zero negative events across 25 years of simulation.
            Best balance of investor returns and system stability.
          </p>

          <div className="space-y-3 flex-1">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Token Price</span>
              <span className="text-sm font-mono font-bold text-foreground">$0.3036</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Safety Buffer</span>
              <span className="text-sm font-mono font-bold text-gain">4.61%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">CH Negative</span>
              <span className="text-sm font-mono font-bold text-gain">0 events</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Reserve Pool</span>
              <span className="text-sm font-mono font-bold text-foreground">$33.9M</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">Data Period</span>
              <span className="text-sm font-mono font-bold text-foreground">2000 — 2025</span>
            </div>
          </div>

          {/* Why each was rejected */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Why Others Were Rejected</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><span className="font-mono" style={{ color: '#534AB7' }}>Sim A</span> — No accounting for unlisted value transfer</p>
              <p><span className="font-mono" style={{ color: '#1D9E75' }}>Sim C</span> — 98.5% absorbed by CH, token price ~$0</p>
              <p><span className="font-mono" style={{ color: '#71717A' }}>Sim D</span> — 96% data discarded, unreliable ELO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
