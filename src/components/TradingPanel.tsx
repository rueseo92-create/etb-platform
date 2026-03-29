import { useState } from 'react'
import type { TeamToken } from '@/lib/mock-market'

interface TradingPanelProps {
  team: TeamToken
}

export default function TradingPanel({ team }: TradingPanelProps) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [amount, setAmount] = useState('')
  const [limitPrice, setLimitPrice] = useState(team.price.toFixed(2))

  const qty = parseFloat(amount) || 0
  const price = orderType === 'market' ? team.price : (parseFloat(limitPrice) || 0)
  const total = qty * price
  const fee = total * 0.001

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      {/* Buy / Sell toggle */}
      <div className="grid grid-cols-2 gap-1 p-1 rounded-md bg-secondary mb-4">
        <button
          onClick={() => setSide('buy')}
          className={`py-2 rounded text-sm font-semibold transition-colors ${
            side === 'buy'
              ? 'bg-gain text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`py-2 rounded text-sm font-semibold transition-colors ${
            side === 'sell'
              ? 'bg-loss text-white'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Order type */}
      <div className="flex gap-3 mb-4">
        {(['market', 'limit'] as const).map(t => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`text-xs font-medium pb-1 border-b-2 transition-colors ${
              orderType === t
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'market' ? 'Market' : 'Limit'}
          </button>
        ))}
      </div>

      {/* Price (limit only) */}
      {orderType === 'limit' && (
        <div className="mb-3">
          <label className="text-xs text-muted-foreground mb-1 block">Price (USD)</label>
          <input
            type="number"
            value={limitPrice}
            onChange={e => setLimitPrice(e.target.value)}
            step="0.01"
            className="w-full rounded-md bg-secondary border border-border px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      {/* Amount */}
      <div className="mb-3">
        <label className="text-xs text-muted-foreground mb-1 block">Amount ({team.ticker})</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0"
          className="w-full rounded-md bg-secondary border border-border px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="flex gap-2 mt-2">
          {[25, 50, 75, 100].map(pct => (
            <button
              key={pct}
              onClick={() => setAmount(Math.floor((5420 / price) * pct / 100).toString())}
              className="flex-1 rounded bg-secondary/80 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2 py-3 border-t border-border">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Price</span>
          <span className="font-mono text-foreground">
            {orderType === 'market' ? 'Market' : `$${price.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Total</span>
          <span className="font-mono text-foreground">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Fee (0.1%)</span>
          <span className="font-mono text-foreground">${fee.toFixed(2)}</span>
        </div>
      </div>

      <button
        className={`w-full mt-3 rounded-md py-2.5 text-sm font-semibold transition-colors ${
          side === 'buy'
            ? 'bg-gain text-primary-foreground hover:bg-gain/90'
            : 'bg-loss text-white hover:bg-loss/90'
        }`}
      >
        {side === 'buy' ? 'Buy' : 'Sell'} {team.ticker}
      </button>

      <p className="text-[10px] text-muted-foreground text-center mt-2">
        Demo mode — no real transactions
      </p>
    </div>
  )
}
