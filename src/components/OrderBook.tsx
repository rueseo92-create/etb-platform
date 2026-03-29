import { generateOrderBook, type TeamToken } from '@/lib/mock-market'
import { useMemo } from 'react'

export default function OrderBook({ team }: { team: TeamToken }) {
  const { bids, asks } = useMemo(
    () => generateOrderBook(team.price, team.name.length * 137),
    [team.price, team.name]
  )

  const maxTotal = Math.max(bids[bids.length - 1]?.total || 0, asks[0]?.total || 0)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-semibold text-foreground mb-3">Order Book</h3>

      {/* Header */}
      <div className="grid grid-cols-3 text-[10px] text-muted-foreground mb-1 px-1">
        <span>Price</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (sells) - reversed so lowest is at bottom */}
      <div className="space-y-px">
        {asks.map((entry, i) => (
          <div key={`ask-${i}`} className="relative grid grid-cols-3 text-xs font-mono py-0.5 px-1">
            <div
              className="absolute inset-0 bg-loss/10 rounded-sm"
              style={{ width: `${(entry.total / maxTotal) * 100}%`, right: 0, left: 'auto' }}
            />
            <span className="relative text-loss">{entry.price.toFixed(2)}</span>
            <span className="relative text-right text-foreground">{entry.quantity}</span>
            <span className="relative text-right text-muted-foreground">{entry.total}</span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="my-1.5 py-1.5 border-y border-border text-center">
        <span className="text-sm font-mono font-bold text-foreground">${team.price.toFixed(2)}</span>
        <span className="text-[10px] text-muted-foreground ml-2">
          Spread: ${(team.price * 0.006).toFixed(4)}
        </span>
      </div>

      {/* Bids (buys) */}
      <div className="space-y-px">
        {bids.map((entry, i) => (
          <div key={`bid-${i}`} className="relative grid grid-cols-3 text-xs font-mono py-0.5 px-1">
            <div
              className="absolute inset-0 bg-gain/10 rounded-sm"
              style={{ width: `${(entry.total / maxTotal) * 100}%`, right: 0, left: 'auto' }}
            />
            <span className="relative text-gain">{entry.price.toFixed(2)}</span>
            <span className="relative text-right text-foreground">{entry.quantity}</span>
            <span className="relative text-right text-muted-foreground">{entry.total}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
