import { useState, useMemo } from 'react'
import { ETB_DATA } from '@/lib/data'
import { MARKET_DATA } from '@/lib/mock-market'
import StatCard from '@/components/StatCard'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell,
} from 'recharts'

type SimTab = 'investor' | 'clearinghouse'

/* ── Clearinghouse Simulation Data ── */
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

/* ── Investor Simulation Helpers ── */
const BIG6_SET = new Set(ETB_DATA.big6 as readonly string[])
const CURRENT_TEAMS_SET = new Set(MARKET_DATA.map(t => t.name))

// Pre-selected investment portfolios
const PORTFOLIOS = [
  { id: 'big6', label: 'Big 6', labelKr: 'Big 6 균등', teams: ETB_DATA.big6 },
  { id: 'top10', label: 'Top 10 ELO', labelKr: '상위 10팀', teams: [] as string[] },
  { id: 'value', label: 'Value Pick', labelKr: '가성비 팀', teams: [] as string[] },
  { id: 'custom', label: 'Custom', labelKr: '직접 선택', teams: [] as string[] },
]

// Compute top10 and value picks from data
const balancedReturns = ETB_DATA.baskets.balanced.annual_returns
const sortedByElo = [...balancedReturns].sort((a, b) => b.final_elo - a.final_elo)
PORTFOLIOS[1].teams = sortedByElo.slice(0, 10).map(t => t.team)
// Value: non-Big6 teams with highest annual return
const valuePicks = [...balancedReturns]
  .filter(t => !BIG6_SET.has(t.team as string) && t.seasons_active >= 10)
  .sort((a, b) => b.annual_return_pct - a.annual_return_pct)
  .slice(0, 6)
  .map(t => t.team)
PORTFOLIOS[2].teams = valuePicks

const INVEST_AMOUNTS = [1000, 5000, 10000, 50000, 100000]

export default function Simulation() {
  const [tab, setTab] = useState<SimTab>('investor')

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Simulation Lab</h1>
          <p className="text-sm text-muted-foreground">
            Backtest investment strategies and explore clearinghouse mechanics.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-mono text-primary">
            32 seasons
          </span>
          <span className="inline-flex items-center rounded-full bg-gain/10 border border-gain/20 px-3 py-1 text-xs font-mono text-gain">
            51 teams
          </span>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex rounded-md bg-secondary overflow-hidden w-fit">
        <button
          onClick={() => setTab('investor')}
          className={`px-5 py-2 text-sm font-medium transition-colors ${
            tab === 'investor' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Investor Simulation
        </button>
        <button
          onClick={() => setTab('clearinghouse')}
          className={`px-5 py-2 text-sm font-medium transition-colors ${
            tab === 'clearinghouse' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Clearinghouse
        </button>
      </div>

      {tab === 'investor' ? <InvestorSim /> : <ClearinghouseSim />}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   INVESTOR SIMULATION
   ═══════════════════════════════════════════════════ */
function InvestorSim() {
  const [portfolioId, setPortfolioId] = useState('big6')
  const [investAmount, setInvestAmount] = useState(10000)
  const [customTeams, setCustomTeams] = useState<Set<string>>(new Set())

  const balanced = ETB_DATA.baskets.balanced
  const tokenPrices = balanced.token_price as unknown as Record<string, { dates: string[]; prices: number[] }>
  const basketGrowth = balanced.basket_growth as unknown as { dates: string[]; basket_values: number[] }

  const selectedPortfolio = PORTFOLIOS.find(p => p.id === portfolioId)!
  const activeTeams = portfolioId === 'custom'
    ? Array.from(customTeams)
    : selectedPortfolio.teams

  const toggleCustomTeam = (team: string) => {
    setCustomTeams(prev => {
      const next = new Set(prev)
      if (next.has(team)) next.delete(team)
      else if (next.size < 10) next.add(team)
      return next
    })
  }

  // Compute investment growth chart
  const simData = useMemo(() => {
    if (activeTeams.length === 0) return []

    const dates = basketGrowth.dates
    const perTeam = investAmount / activeTeams.length

    return dates.map((date, i) => {
      let totalValue = 0
      let teamCount = 0

      for (const team of activeTeams) {
        const tp = tokenPrices[team]
        if (!tp || i >= tp.prices.length) continue
        const startPrice = tp.prices[0]
        if (startPrice <= 0) continue
        const tokens = perTeam / startPrice
        totalValue += tokens * tp.prices[i]
        teamCount++
      }

      // If some teams don't have data for all dates, scale up
      if (teamCount > 0 && teamCount < activeTeams.length) {
        totalValue = totalValue * (activeTeams.length / teamCount)
      }

      const year = date.slice(0, 4)
      return {
        date,
        year,
        portfolio: Math.round(totalValue),
        basket: Math.round(investAmount * (basketGrowth.basket_values[i] / basketGrowth.basket_values[0])),
      }
    })
  }, [activeTeams, investAmount, tokenPrices, basketGrowth])

  // Per-team return table
  const teamReturns = useMemo(() => {
    return activeTeams.map(team => {
      const tp = tokenPrices[team]
      const ret = balancedReturns.find(r => r.team === team)
      if (!tp || !ret) return null
      const startPrice = tp.prices[0]
      const endPrice = tp.prices[tp.prices.length - 1]
      const growth = startPrice > 0 ? ((endPrice / startPrice - 1) * 100) : 0
      const invested = investAmount / activeTeams.length
      const finalVal = startPrice > 0 ? (invested / startPrice) * endPrice : 0
      const pnl = finalVal - invested
      return {
        team,
        invested,
        finalVal,
        pnl,
        growth,
        annualReturn: ret.annual_return_pct,
        elo: ret.final_elo,
        isBig6: ret.is_big6,
        isListed: CURRENT_TEAMS_SET.has(team),
      }
    }).filter(Boolean) as {
      team: string; invested: number; finalVal: number; pnl: number;
      growth: number; annualReturn: number; elo: number; isBig6: boolean; isListed: boolean;
    }[]
  }, [activeTeams, investAmount, tokenPrices])

  const totalFinal = teamReturns.reduce((s, t) => s + t.finalVal, 0)
  const totalPnl = totalFinal - investAmount
  const totalGrowth = investAmount > 0 ? ((totalFinal / investAmount - 1) * 100) : 0
  const avgAnnual = teamReturns.length > 0
    ? teamReturns.reduce((s, t) => s + t.annualReturn, 0) / teamReturns.length
    : 0

  return (
    <div className="space-y-6">
      {/* Config row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Portfolio selector */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Portfolio Strategy</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PORTFOLIOS.map(p => (
              <button
                key={p.id}
                onClick={() => setPortfolioId(p.id)}
                className={`rounded-md border p-3 text-left transition-all ${
                  portfolioId === p.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                    : 'border-border bg-card hover:bg-surface-elevated'
                }`}
              >
                <p className="text-sm font-semibold text-foreground">{p.label}</p>
                <p className="text-[10px] text-muted-foreground">{p.labelKr}</p>
                {p.id !== 'custom' && (
                  <p className="text-[10px] text-muted-foreground mt-1">{p.teams.length} teams</p>
                )}
              </button>
            ))}
          </div>

          {/* Custom team picker */}
          {portfolioId === 'custom' && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Select up to 10 teams ({customTeams.size}/10)</p>
              <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto">
                {ETB_DATA.teams.filter(t => balancedReturns.some(r => r.team === t)).map(team => (
                  <button
                    key={team}
                    onClick={() => toggleCustomTeam(team)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-mono border transition-colors ${
                      customTeams.has(team)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Investment amount */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Investment Amount</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {INVEST_AMOUNTS.map(amt => (
              <button
                key={amt}
                onClick={() => setInvestAmount(amt)}
                className={`rounded-md border px-4 py-2 text-sm font-mono transition-all ${
                  investAmount === amt
                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/30'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                ${amt.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Quick summary */}
          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Initial Investment</span>
              <span className="font-mono text-foreground">${investAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Teams Selected</span>
              <span className="font-mono text-foreground">{activeTeams.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Per Team</span>
              <span className="font-mono text-foreground">
                ${activeTeams.length > 0 ? Math.round(investAmount / activeTeams.length).toLocaleString() : 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Backtest Period</span>
              <span className="font-mono text-foreground">1993 — 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Result stats */}
      {activeTeams.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Final Value"
              value={`$${Math.round(totalFinal).toLocaleString()}`}
              sub={`from $${investAmount.toLocaleString()}`}
              valueClass="text-gain"
            />
            <StatCard
              label="Total Return"
              value={`+${totalGrowth.toFixed(1)}%`}
              sub={`${(totalFinal / investAmount).toFixed(1)}x multiple`}
              valueClass="text-gain"
            />
            <StatCard
              label="Avg Annual Return"
              value={`+${avgAnnual.toFixed(1)}%`}
              sub="per team average"
            />
            <StatCard
              label="Total P&L"
              value={`${totalPnl >= 0 ? '+' : ''}$${Math.round(totalPnl).toLocaleString()}`}
              sub={`${activeTeams.length} teams`}
              valueClass={totalPnl >= 0 ? 'text-gain' : 'text-loss'}
            />
          </div>

          {/* Growth chart */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Portfolio Growth (1993 — 2025)</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Your portfolio vs balanced reserve basket, both starting at ${investAmount.toLocaleString()}
            </p>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={simData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                  <XAxis dataKey="year" tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fill: 'hsl(215 15% 50%)', fontSize: 10 }} tickLine={false} axisLine={false}
                    tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 11 }}
                    formatter={(value: unknown, name: unknown) => [
                      `$${Number(value).toLocaleString()}`,
                      String(name) === 'portfolio' ? 'Your Portfolio' : 'Reserve Basket',
                    ]}
                    labelFormatter={(label: unknown) => `Season ending ${String(label)}`}
                  />
                  <Area type="monotone" dataKey="basket" stroke="hsl(215 15% 40%)" fill="hsl(215 15% 40%)" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="portfolio" stroke="hsl(142 72% 50%)" fill="hsl(142 72% 50%)" fillOpacity={0.12} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded bg-gain" />
                <span className="text-xs text-muted-foreground">Your Portfolio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded bg-muted-foreground" style={{ borderTop: '2px dashed hsl(215 15% 40%)' }} />
                <span className="text-xs text-muted-foreground">Reserve Basket</span>
              </div>
            </div>
          </div>

          {/* Per-team breakdown */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Team Breakdown</h3>
            <div className="overflow-hidden rounded-md border border-border">
              <div className="grid grid-cols-[1fr_5rem_5rem_5rem_5rem_4rem] gap-x-2 px-4 py-2 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider bg-muted/30">
                <span>Team</span>
                <span className="text-right">Invested</span>
                <span className="text-right">Final</span>
                <span className="text-right">P&L</span>
                <span className="text-right">Annual</span>
                <span className="text-right">ELO</span>
              </div>
              {[...teamReturns].sort((a, b) => b.pnl - a.pnl).map(t => (
                <div
                  key={t.team}
                  className="grid grid-cols-[1fr_5rem_5rem_5rem_5rem_4rem] gap-x-2 px-4 py-2.5 border-b border-border/50 text-xs items-center hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {t.isBig6 && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                    {!t.isBig6 && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />}
                    <span className="text-sm text-foreground truncate">{t.team}</span>
                    {t.isListed && (
                      <span className="text-[8px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">LISTED</span>
                    )}
                  </div>
                  <span className="text-right font-mono text-muted-foreground">${Math.round(t.invested).toLocaleString()}</span>
                  <span className="text-right font-mono text-foreground">${Math.round(t.finalVal).toLocaleString()}</span>
                  <span className={`text-right font-mono ${t.pnl >= 0 ? 'text-gain' : 'text-loss'}`}>
                    {t.pnl >= 0 ? '+' : ''}${Math.round(t.pnl).toLocaleString()}
                  </span>
                  <span className="text-right font-mono text-foreground">+{t.annualReturn.toFixed(1)}%</span>
                  <span className="text-right font-mono text-muted-foreground">{t.elo.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTeams.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Select teams to begin simulation</p>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CLEARINGHOUSE SIMULATION
   ═══════════════════════════════════════════════════ */
function ClearinghouseSim() {
  const [selected, setSelected] = useState<SimMode>('B')
  const result = SIM_RESULTS[selected]

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <p className="text-sm text-muted-foreground -mt-2">
        How should unlisted team matches affect listed token values? 4 strategies compared over 25 years.
      </p>

      {/* Badge row */}
      <div className="flex gap-2">
        <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-mono text-primary">
          305,444 matches
        </span>
        <span className="inline-flex items-center rounded-full bg-gain/10 border border-gain/20 px-3 py-1 text-xs font-mono text-gain">
          106 listed teams
        </span>
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
