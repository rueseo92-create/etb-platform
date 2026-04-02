import { Link, useLocation } from 'react-router-dom'
import { MARKET_DATA, USER_PORTFOLIO } from '@/lib/mock-market'

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Markets', path: '/markets' },
  { label: 'Reserve', path: '/reserve' },
  { label: 'Simulation', path: '/simulation' },
]

export default function TopBar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      {/* Ticker tape */}
      <div className="overflow-hidden border-b border-border bg-muted/50 py-1">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...MARKET_DATA, ...MARKET_DATA].map((t, i) => (
            <span key={i} className="mx-4 text-xs font-mono">
              <span className="text-muted-foreground">{t.ticker}</span>
              <span className="ml-1.5 text-foreground">${t.price.toFixed(2)}</span>
              <span className={`ml-1.5 ${t.change24h >= 0 ? 'text-gain' : 'text-loss'}`}>
                {t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground">
              ETB
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground hidden sm:inline">
              Exchange-Traded Betting
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5">
            <span className="text-xs text-muted-foreground">Balance</span>
            <span className="text-sm font-mono font-semibold text-foreground">
              ${USER_PORTFOLIO.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <button className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Deposit
          </button>
        </div>
      </div>
    </header>
  )
}
