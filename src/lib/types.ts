export interface TeamReturn {
  team: string
  annual_return_pct: number
  total_return_pct: number
  seasons_active: number
  final_elo: number
  final_share_pct: number
  is_big6: boolean
}

export interface BasketSummary {
  basket_final: number
  basket_multiple: number
  best_total: { team: string; value: number }
  best_annual: { team: string; value: number }
  avg_annual: number
  median_annual: number
}

export interface BasketDef {
  name: string
  name_kr: string
  desc: string
  composition: Record<string, {
    weight: number
    name: string
    name_kr: string
    color: string
  }>
}

export type BasketKey = 'conservative' | 'balanced' | 'growth'
