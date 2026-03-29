/**
 * Mock Market Data Generator
 * 실제 백테스트 ELO/수익률 데이터를 기반으로 실시간 트레이딩 마켓을 시뮬레이션
 */
import { ETB_DATA } from './data'

// Seed-based pseudo-random for deterministic results
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export interface TeamToken {
  id: string
  name: string
  ticker: string
  color: string
  price: number
  previousPrice: number
  change24h: number
  change7d: number
  marketCap: number
  volume24h: number
  supply: number
  navPerToken: number
  eloRating: number
  eloRank: number
  reserveShare: number // % of reserve basket
  priceHistory: { time: string; price: number; nav: number }[]
  upcomingMatch?: { opponent: string; date: string; odds: { win: number; draw: number; lose: number } }
  recentMatches: { opponent: string; result: string; priceImpact: number; date: string }[]
  seasonStats: { wins: number; draws: number; losses: number; gf: number; ga: number }
  isBig6: boolean
}

export interface OrderBookEntry {
  price: number
  quantity: number
  total: number
}

export interface UserPortfolio {
  balance: number
  totalValue: number
  totalPnL: number
  totalPnLPercent: number
  holdings: { teamId: string; quantity: number; avgBuyPrice: number }[]
}

const TEAM_TICKERS: Record<string, string> = {
  'Manchester United': 'MANU', 'Manchester City': 'MCFC', 'Arsenal': 'ARS',
  'Liverpool': 'LFC', 'Chelsea': 'CFC', 'Tottenham': 'THFC',
  'Newcastle': 'NUFC', 'Aston Villa': 'AVFC', 'West Ham': 'WHU',
  'Brighton': 'BHA', 'Wolverhampton': 'WOL', 'AFC Bournemouth': 'BOU',
  'Crystal Palace': 'CRY', 'Brentford': 'BRE', 'Everton': 'EVE',
  'Fulham': 'FUL', 'Nottingham Forest': 'NFO', 'Ipswich': 'IPS',
  'Leicester': 'LEI', 'Southampton': 'SOU',
}

// 현재 시즌 EPL 팀 (mock 경기 일정용)
const CURRENT_TEAMS = [
  'Manchester United', 'Manchester City', 'Arsenal', 'Liverpool', 'Chelsea',
  'Tottenham', 'Newcastle', 'Aston Villa', 'West Ham', 'Brighton',
  'Wolverhampton', 'AFC Bournemouth', 'Crystal Palace', 'Brentford',
  'Everton', 'Fulham', 'Nottingham Forest', 'Ipswich', 'Leicester', 'Southampton',
]

const MATCH_RESULTS = ['W', 'D', 'L']

function generatePriceHistory(basePrice: number, nav: number, seed: number): { time: string; price: number; nav: number }[] {
  const history: { time: string; price: number; nav: number }[] = []
  let p = basePrice * 0.82
  let n = nav * 0.85
  const now = new Date()

  for (let i = 90; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const drift = (seededRandom(seed + i * 7) - 0.44) * basePrice * 0.028
    p = Math.max(p * 0.92, p + drift)
    n = n + basePrice * 0.00012 + (seededRandom(seed + i * 13) - 0.5) * basePrice * 0.005
    history.push({
      time: date.toISOString().split('T')[0],
      price: parseFloat(p.toFixed(4)),
      nav: parseFloat(n.toFixed(4)),
    })
  }
  history[history.length - 1].price = basePrice
  history[history.length - 1].nav = nav
  return history
}

function generateRecentMatches(teamName: string, seed: number): TeamToken['recentMatches'] {
  const opponents = CURRENT_TEAMS.filter(t => t !== teamName)
  const matches: TeamToken['recentMatches'] = []
  const now = new Date()

  for (let i = 0; i < 5; i++) {
    const oppIdx = Math.floor(seededRandom(seed + i * 31) * opponents.length)
    const resultIdx = Math.floor(seededRandom(seed + i * 47) * 3)
    const result = MATCH_RESULTS[resultIdx]
    const goals1 = Math.floor(seededRandom(seed + i * 59) * 4)
    const goals2 = Math.floor(seededRandom(seed + i * 67) * 3)
    const impact = result === 'W' ? seededRandom(seed + i * 73) * 3.5 + 0.5
      : result === 'L' ? -(seededRandom(seed + i * 79) * 3 + 0.5)
      : (seededRandom(seed + i * 83) - 0.5) * 1.5

    const date = new Date(now)
    date.setDate(date.getDate() - (i * 7 + 3))

    matches.push({
      opponent: opponents[oppIdx],
      result: `${result} ${goals1}-${goals2}`,
      priceImpact: parseFloat(impact.toFixed(2)),
      date: date.toISOString().split('T')[0],
    })
  }
  return matches
}

function generateUpcomingMatch(teamName: string, seed: number): TeamToken['upcomingMatch'] {
  const opponents = CURRENT_TEAMS.filter(t => t !== teamName)
  const oppIdx = Math.floor(seededRandom(seed * 97) * opponents.length)
  const now = new Date()
  const matchDate = new Date(now)
  matchDate.setDate(matchDate.getDate() + Math.floor(seededRandom(seed * 101) * 7) + 1)

  return {
    opponent: opponents[oppIdx],
    date: matchDate.toISOString().split('T')[0],
    odds: {
      win: parseFloat((1.5 + seededRandom(seed * 103) * 2.5).toFixed(2)),
      draw: parseFloat((2.8 + seededRandom(seed * 107) * 1.5).toFixed(2)),
      lose: parseFloat((2.0 + seededRandom(seed * 109) * 3).toFixed(2)),
    },
  }
}

export function buildMarketData(): TeamToken[] {
  const balanced = ETB_DATA.baskets.balanced.annual_returns
  const sorted = [...balanced].sort((a, b) => b.final_elo - a.final_elo)
  // Only include current EPL teams + some others for a realistic 20-team market
  const currentTeamSet = new Set(CURRENT_TEAMS)
  const marketTeams = sorted.filter(t => currentTeamSet.has(t.team)).slice(0, 20)

  return marketTeams.map((team, rank) => {
    const seed = team.team.length * 137 + team.final_elo
    const share = team.final_share_pct
    // Price: ELO-based, normalized so top team ~$20, bottom ~$3
    const price = parseFloat(((team.final_elo - 1300) / 30).toFixed(2))
    const nav = parseFloat((price * (0.96 + seededRandom(seed) * 0.06)).toFixed(2))
    const change24h = parseFloat(((seededRandom(seed + 1) - 0.45) * 6).toFixed(2))
    const change7d = parseFloat(((seededRandom(seed + 2) - 0.42) * 12).toFixed(2))
    const supply = 1_000_000
    const volume24h = Math.floor(price * supply * (0.02 + seededRandom(seed + 3) * 0.08))

    const color = ETB_DATA.team_colors[team.team as keyof typeof ETB_DATA.team_colors] || `hsl(${Math.floor(seededRandom(seed + 4) * 360)} 60% 50%)`

    return {
      id: (TEAM_TICKERS[team.team] || team.team.slice(0, 4).toUpperCase()).toLowerCase(),
      name: team.team,
      ticker: TEAM_TICKERS[team.team] || team.team.slice(0, 4).toUpperCase(),
      color,
      price,
      previousPrice: parseFloat((price / (1 + change24h / 100)).toFixed(2)),
      change24h,
      change7d,
      marketCap: Math.floor(price * supply),
      volume24h,
      supply,
      navPerToken: nav,
      eloRating: team.final_elo,
      eloRank: rank + 1,
      reserveShare: share,
      priceHistory: generatePriceHistory(price, nav, seed),
      upcomingMatch: generateUpcomingMatch(team.team, seed),
      recentMatches: generateRecentMatches(team.team, seed),
      seasonStats: {
        wins: Math.floor(12 + seededRandom(seed + 10) * 16),
        draws: Math.floor(3 + seededRandom(seed + 11) * 8),
        losses: Math.floor(2 + seededRandom(seed + 12) * 12),
        gf: Math.floor(30 + seededRandom(seed + 13) * 50),
        ga: Math.floor(15 + seededRandom(seed + 14) * 40),
      },
      isBig6: team.is_big6,
    }
  })
}

export function generateOrderBook(price: number, seed: number): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } {
  const bids: OrderBookEntry[] = []
  const asks: OrderBookEntry[] = []
  let bidTotal = 0
  let askTotal = 0

  for (let i = 0; i < 8; i++) {
    const bidPrice = parseFloat((price - (i + 1) * price * 0.003).toFixed(4))
    const bidQty = Math.floor(50 + seededRandom(seed + i * 19) * 500)
    bidTotal += bidQty
    bids.push({ price: bidPrice, quantity: bidQty, total: bidTotal })

    const askPrice = parseFloat((price + (i + 1) * price * 0.003).toFixed(4))
    const askQty = Math.floor(50 + seededRandom(seed + i * 23) * 500)
    askTotal += askQty
    asks.push({ price: askPrice, quantity: askQty, total: askTotal })
  }
  return { bids, asks: asks.reverse() }
}

export const MARKET_DATA = buildMarketData()

export const USER_PORTFOLIO: UserPortfolio = {
  balance: 5_420.00,
  totalValue: 18_935.47,
  totalPnL: 2_145.32,
  totalPnLPercent: 12.78,
  holdings: [
    { teamId: 'manu', quantity: 250, avgBuyPrice: 11.20 },
    { teamId: 'ars', quantity: 180, avgBuyPrice: 13.50 },
    { teamId: 'mcfc', quantity: 120, avgBuyPrice: 17.80 },
    { teamId: 'cfc', quantity: 300, avgBuyPrice: 10.90 },
    { teamId: 'lfc', quantity: 150, avgBuyPrice: 15.20 },
  ],
}

export function getTeamById(id: string): TeamToken | undefined {
  return MARKET_DATA.find(t => t.id === id)
}
