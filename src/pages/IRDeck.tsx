import { useState, useRef } from 'react'
import { ETB_DATA } from '@/lib/data'

type Lang = 'en' | 'kr'

const t = (en: string, kr: string, lang: Lang) => lang === 'en' ? en : kr

/* ── Static Data ── */
const balanced = ETB_DATA.baskets.balanced
const big6Returns = (balanced.annual_returns as unknown as { team: string; annual_return_pct: number; total_return_pct: number; final_elo: number; is_big6: boolean; seasons_active: number }[])
  .filter(r => (ETB_DATA.big6 as unknown as string[]).includes(r.team))
  .sort((a, b) => b.final_elo - a.final_elo)

const summary = balanced.summary as unknown as { basket_final: number; basket_multiple: number; avg_annual: number; best_total: { team: string; value: number }; best_annual: { team: string; value: number } }

const SECTIONS = [
  'hero', 'problem', 'solution', 'how', 'market', 'backtest',
  'clearinghouse', 'reserve', 'tokenomics', 'roadmap',
] as const

export default function IRDeck() {
  const [lang, setLang] = useState<Lang>('en')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' })
  }

  const ref = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground">
              ETB
            </div>
            <span className="text-sm font-semibold text-foreground hidden sm:inline">
              {t('Investor Presentation', '투자자 발표자료', lang)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Section dots - desktop */}
            <div className="hidden lg:flex items-center gap-1 mr-4">
              {SECTIONS.map(s => (
                <button key={s} onClick={() => scrollTo(s)}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 hover:bg-primary transition-colors"
                  title={s}
                />
              ))}
            </div>

            {/* Lang toggle */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'kr' : 'en')}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <span className={lang === 'en' ? 'text-primary font-bold' : ''}>EN</span>
              <span className="text-border">/</span>
              <span className={lang === 'kr' ? 'text-primary font-bold' : ''}>KR</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section ref={ref('hero')} className="min-h-screen flex items-center justify-center pt-14 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative max-w-[1000px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-mono text-primary">
              {t('32 Seasons Backtested · 51 Teams · 12,234 Matches', '32시즌 백테스트 · 51팀 · 12,234경기', lang)}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-foreground">{t('Exchange-Traded', '거래소 기반', lang)}</span>
            <br />
            <span className="text-primary">{t('Betting', '스포츠 베팅', lang)}</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-[650px] mx-auto mb-10 leading-relaxed">
            {t(
              'A regulated, transparent sports investment platform where team tokens are backed by real reserve assets and priced by ELO performance.',
              '팀 토큰이 실제 준비금 자산으로 뒷받침되고 ELO 성적으로 가격이 결정되는, 규제 가능하고 투명한 스포츠 투자 플랫폼.',
              lang,
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {[
              { v: '9.96x', l: t('Reserve Growth (31yr)', '준비금 성장 (31년)', lang) },
              { v: '+5.5%', l: t('Avg Annual Yield', '평균 연수익률', lang) },
              { v: '$0', l: t('Investor Loss', '투자자 손실', lang) },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-3xl sm:text-4xl font-mono font-bold text-primary">{s.v}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          <button onClick={() => scrollTo('problem')}
            className="animate-bounce text-muted-foreground hover:text-primary transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </button>
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section ref={ref('problem')} className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('The Problem', '문제', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t('Sports Betting is Broken', '스포츠 베팅은 고장났다', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'The $300B global gambling market extracts value from fans. The house always wins. There\'s no transparency, no asset backing, and no long-term value creation.',
              '3,000억 달러 규모의 글로벌 도박 시장은 팬들로부터 가치를 추출합니다. 하우스가 항상 이깁니다. 투명성, 자산 뒷받침, 장기 가치 창출이 없습니다.',
              lang,
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: '🎰',
                title: t('Negative EV', '음의 기대값', lang),
                desc: t(
                  'Traditional betting has a built-in house edge of 5–15%. Long-term, every bettor loses.',
                  '전통 베팅은 5~15%의 하우스 엣지가 내재되어 있어 장기적으로 모든 베터가 손실.',
                  lang,
                ),
              },
              {
                icon: '🔒',
                title: t('Zero Transparency', '투명성 제로', lang),
                desc: t(
                  'Odds are set by bookmakers with hidden models. No way to verify fairness or underlying exposure.',
                  '오즈는 북메이커의 숨겨진 모델로 설정. 공정성이나 실제 노출을 검증할 방법 없음.',
                  lang,
                ),
              },
              {
                icon: '📉',
                title: t('No Asset Value', '자산 가치 없음', lang),
                desc: t(
                  'A bet is a pure liability. Win or lose, you\'re left with nothing. No compounding, no growth.',
                  '베팅은 순수 부채. 이기든 지든 남는 것이 없음. 복리 성장 불가.',
                  lang,
                ),
              },
            ].map(c => (
              <div key={c.title} className="rounded-xl border border-border bg-card p-6">
                <span className="text-2xl mb-3 block">{c.icon}</span>
                <h3 className="text-sm font-bold text-foreground mb-2">{c.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section ref={ref('solution')} className="py-24 sm:py-32 bg-card/50">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('The Solution', '솔루션', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t('ETB: Betting Meets Finance', 'ETB: 베팅과 금융의 만남', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'Instead of placing bets, you invest in team tokens backed by real financial assets. Performance is measured by ELO ratings, and returns come from a professionally managed reserve basket.',
              '베팅 대신, 실제 금융 자산으로 뒷받침되는 팀 토큰에 투자합니다. 성과는 ELO 레이팅으로 측정되고, 수익은 전문적으로 운용되는 준비금 바스켓에서 발생합니다.',
              lang,
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                before: t('Bet on one match', '한 경기에 베팅', lang),
                after: t('Invest in a team\'s season', '팀의 시즌에 투자', lang),
              },
              {
                before: t('House edge eats profit', '하우스 엣지가 이익을 잠식', lang),
                after: t('Reserve basket compounds', '준비금 바스켓이 복리 성장', lang),
              },
              {
                before: t('Opaque odds', '불투명한 오즈', lang),
                after: t('Transparent ELO + NAV', '투명한 ELO + NAV', lang),
              },
              {
                before: t('Win/lose binary', '승/패 이진법', lang),
                after: t('Tradeable token with residual value', '잔여 가치가 있는 거래 가능 토큰', lang),
              },
            ].map((c, i) => (
              <div key={i} className="flex items-stretch gap-3 rounded-xl border border-border overflow-hidden">
                <div className="flex-1 p-4 bg-loss/5 border-r border-border">
                  <p className="text-[10px] text-loss uppercase tracking-wider mb-1">{t('Before', '기존', lang)}</p>
                  <p className="text-sm text-foreground">{c.before}</p>
                </div>
                <div className="flex-1 p-4 bg-gain/5">
                  <p className="text-[10px] text-gain uppercase tracking-wider mb-1">{t('After (ETB)', 'ETB', lang)}</p>
                  <p className="text-sm text-foreground">{c.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={ref('how')} className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('How It Works', '작동 방식', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            {t('Three Pillars', '세 가지 핵심 축', lang)}
          </h2>

          <div className="space-y-8">
            {[
              {
                num: '01',
                title: t('ELO Rating Engine', 'ELO 레이팅 엔진', lang),
                desc: t(
                  'Every match updates team ELO ratings using a K-value system calibrated over 25+ years of data. Ratings determine each team\'s share of the reserve pool.',
                  '모든 경기가 25년 이상의 데이터로 보정된 K-value 시스템을 사용해 팀 ELO 레이팅을 업데이트합니다. 레이팅이 준비금 풀에서 각 팀의 배분을 결정합니다.',
                  lang,
                ),
                metrics: [
                  { k: t('Matches processed', '처리된 경기', lang), v: '884K+' },
                  { k: t('Teams rated', '레이팅된 팀', lang), v: '51' },
                  { k: t('Seasons backtested', '백테스트 시즌', lang), v: '32' },
                ],
              },
              {
                num: '02',
                title: t('Reserve Basket', '준비금 바스켓', lang),
                desc: t(
                  'All invested capital goes into a diversified basket of US Treasuries, S&P 500, and Gold. This creates a floor value for every token and generates compounding yield.',
                  '모든 투자 자본이 미국 국채, S&P 500, 금으로 구성된 분산 바스켓에 투입됩니다. 이는 모든 토큰의 최저 가치를 만들고 복리 수익을 생성합니다.',
                  lang,
                ),
                metrics: [
                  { k: t('31-year multiple', '31년 배수', lang), v: `${summary.basket_multiple}x` },
                  { k: t('Avg annual', '연평균', lang), v: `+${summary.avg_annual.toFixed(1)}%` },
                  { k: t('Composition', '구성', lang), v: t('Treasury+S&P+Gold', '국채+S&P+금', lang) },
                ],
              },
              {
                num: '03',
                title: t('Clearinghouse', '청산소', lang),
                desc: t(
                  'A 5% reserve buffer absorbs the impact of unlisted team matches on listed token values. Quarterly rebalancing ensures zero negative events across 25 years of simulation.',
                  '5% 준비금 버퍼가 비상장 팀 경기가 상장 토큰 가치에 미치는 영향을 흡수합니다. 분기별 리밸런싱으로 25년 시뮬레이션에서 부정적 이벤트 0건을 보장합니다.',
                  lang,
                ),
                metrics: [
                  { k: t('Optimal CH ratio', '최적 CH 비율', lang), v: '5%' },
                  { k: t('Negative events', '부정적 이벤트', lang), v: '0' },
                  { k: t('Rebalancing', '리밸런싱', lang), v: t('Quarterly', '분기별', lang) },
                ],
              },
            ].map(p => (
              <div key={p.num} className="flex gap-6 rounded-xl border border-border bg-card p-6 sm:p-8">
                <span className="text-4xl font-mono font-bold text-primary/20 shrink-0 hidden sm:block">{p.num}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-4">
                    {p.metrics.map(m => (
                      <div key={m.k} className="rounded-md bg-secondary/50 px-3 py-2">
                        <p className="text-[10px] text-muted-foreground uppercase">{m.k}</p>
                        <p className="text-sm font-mono font-bold text-foreground">{m.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MARKET ═══ */}
      <section ref={ref('market')} className="py-24 sm:py-32 bg-card/50">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Market Opportunity', '시장 기회', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            {t('A $300B Market, Ripe for Disruption', '3,000억 달러 시장, 혁신 준비 완료', lang)}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { v: '$300B', l: t('Global Sports Betting', '글로벌 스포츠 베팅', lang), sub: '2024' },
              { v: '$45B', l: t('Football Betting', '축구 베팅', lang), sub: t('Largest segment', '최대 세그먼트', lang) },
              { v: '4.7B', l: t('Football Fans', '축구 팬', lang), sub: t('Worldwide', '전 세계', lang) },
              { v: '12%', l: t('Market CAGR', '시장 성장률', lang), sub: '2024–2030' },
            ].map(s => (
              <div key={s.l} className="rounded-xl border border-border bg-card p-5 text-center">
                <p className="text-2xl sm:text-3xl font-mono font-bold text-primary">{s.v}</p>
                <p className="text-xs font-medium text-foreground mt-2">{s.l}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="text-sm font-bold text-primary mb-3">{t('ETB\'s Unique Position', 'ETB의 고유 포지션', lang)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">{t('Not Gambling', '도박이 아님', lang)}</p>
                <p className="text-xs">{t('Asset-backed tokens with NAV floor. Regulatable as a financial product.', 'NAV 하한이 있는 자산 뒷받침 토큰. 금융상품으로 규제 가능.', lang)}</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">{t('Not Crypto', '크립토가 아님', lang)}</p>
                <p className="text-xs">{t('No blockchain dependency. Backed by US Treasury, S&P, Gold — not speculation.', '블록체인 의존 없음. 미국 국채, S&P, 금으로 뒷받침 — 투기가 아님.', lang)}</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">{t('Not Fantasy', '판타지가 아님', lang)}</p>
                <p className="text-xs">{t('Real monetary returns backed by mathematical models tested over 32 seasons of data.', '32시즌 데이터로 검증된 수학적 모델로 뒷받침되는 실제 금전적 수익.', lang)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BACKTEST ═══ */}
      <section ref={ref('backtest')} className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Backtest Results', '백테스트 결과', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('32 Seasons of Proof', '32시즌의 증거', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'Every EPL team since 1993, every match result, priced through our ELO engine and reserve basket model.',
              '1993년 이후 모든 EPL 팀, 모든 경기 결과를 ELO 엔진과 준비금 바스켓 모델로 가격 산정.',
              lang,
            )}
          </p>

          {/* Big 6 performance */}
          <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-sm font-bold text-foreground">
                {t('Big 6 Performance — Balanced Basket', 'Big 6 성과 — 균형 바스켓', lang)}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    <th className="text-left px-6 py-3">{t('Team', '팀', lang)}</th>
                    <th className="text-right px-4 py-3">{t('Final ELO', '최종 ELO', lang)}</th>
                    <th className="text-right px-4 py-3">{t('Total Return', '총 수익률', lang)}</th>
                    <th className="text-right px-4 py-3">{t('Annual Return', '연 수익률', lang)}</th>
                    <th className="text-right px-6 py-3">{t('Seasons', '시즌', lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {big6Returns.map(r => (
                    <tr key={r.team} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: (ETB_DATA.team_colors as Record<string, string>)[r.team] || '#888' }} />
                          <span className="font-medium text-foreground">{r.team}</span>
                        </div>
                      </td>
                      <td className="text-right px-4 py-3 font-mono text-foreground">{r.final_elo.toFixed(0)}</td>
                      <td className="text-right px-4 py-3 font-mono text-gain">+{r.total_return_pct.toFixed(1)}%</td>
                      <td className="text-right px-4 py-3 font-mono text-gain">+{r.annual_return_pct.toFixed(1)}%</td>
                      <td className="text-right px-6 py-3 font-mono text-muted-foreground">{r.seasons_active}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label={t('Best Performer', '최고 수익팀', lang)}
              value={summary.best_total.team}
              sub={`+${summary.best_total.value.toFixed(0)}% total`}
            />
            <MetricCard
              label={t('Best Annual', '최고 연수익', lang)}
              value={summary.best_annual.team}
              sub={`+${summary.best_annual.value.toFixed(1)}%/yr`}
            />
            <MetricCard
              label={t('Reserve Multiple', '준비금 배수', lang)}
              value={`${summary.basket_multiple}x`}
              sub={t('$10M → $99.6M', '$10M → $99.6M', lang)}
              valueClass="text-primary"
            />
            <MetricCard
              label={t('Zero Failures', '실패 0건', lang)}
              value="0"
              sub={t('negative NAV events', 'NAV 마이너스 이벤트', lang)}
              valueClass="text-gain"
            />
          </div>
        </div>
      </section>

      {/* ═══ CLEARINGHOUSE ═══ */}
      <section ref={ref('clearinghouse')} className="py-24 sm:py-32 bg-card/50">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Risk Management', '리스크 관리', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t('The Clearinghouse', '청산소 메커니즘', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'When unlisted teams beat listed teams, it could drain the reserve pool. The Clearinghouse absorbs this impact.',
              '비상장 팀이 상장 팀을 이기면 준비금 풀이 감소할 수 있습니다. 청산소가 이 영향을 흡수합니다.',
              lang,
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { mode: 'A', label: t('No CH', 'CH 없음', lang), price: '$0.320', status: 'risk', note: t('No protection', '보호 없음', lang) },
              { mode: 'B', label: t('Fixed 5%', '고정 5%', lang), price: '$0.304', status: 'best', note: t('Optimal', '최적', lang) },
              { mode: 'C', label: t('Dynamic', '동적', lang), price: '$0.005', status: 'fail', note: t('98.5% absorbed', '98.5% 흡수', lang) },
              { mode: 'D', label: t('Ignore', '무시', lang), price: '$0.320', status: 'risk', note: t('96% data lost', '96% 데이터 손실', lang) },
            ].map(m => (
              <div key={m.mode} className={`rounded-xl border p-5 ${
                m.status === 'best' ? 'border-primary/50 bg-primary/5' : m.status === 'fail' ? 'border-loss/30 bg-loss/5' : 'border-border bg-card'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">Sim {m.mode}</span>
                  {m.status === 'best' && (
                    <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full uppercase">
                      {t('Best', '최적', lang)}
                    </span>
                  )}
                </div>
                <p className={`text-2xl font-mono font-bold ${
                  m.status === 'best' ? 'text-primary' : m.status === 'fail' ? 'text-loss' : 'text-foreground'
                }`}>{m.price}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{m.note}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <h3 className="text-sm font-bold text-primary">{t('Recommendation: CH 5% + Quarterly Rebalance', '권장: CH 5% + 분기별 리밸런싱', lang)}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                '305,444 matches simulated over 25 years. Token price maintained at $0.304 with zero negative events. 4.61% minimum safety buffer at all times.',
                '25년간 305,444경기 시뮬레이션. 토큰 가격 $0.304 유지, 부정적 이벤트 0건. 항상 최소 4.61% 안전 버퍼 유지.',
                lang,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ RESERVE ═══ */}
      <section ref={ref('reserve')} className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Asset Backing', '자산 뒷받침', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            {t('Reserve Basket Composition', '준비금 바스켓 구성', lang)}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { asset: t('US Treasury', '미국 국채', lang), weight: '40%', color: '#6CABDD', desc: t('Stability & yield', '안정성 및 이자수익', lang) },
              { asset: t('S&P 500', 'S&P 500', lang), weight: '35%', color: '#3fb950', desc: t('Growth engine', '성장 엔진', lang) },
              { asset: t('Gold', '금', lang), weight: '25%', color: '#d29922', desc: t('Inflation hedge', '인플레이션 헤지', lang) },
            ].map(a => (
              <div key={a.asset} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: a.color }} />
                  <span className="text-lg font-bold text-foreground">{a.asset}</span>
                </div>
                <p className="text-3xl font-mono font-bold text-foreground mb-1">{a.weight}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
                <div className="mt-4 h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: a.weight, backgroundColor: a.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">{t('Yield Distribution', '수익 배분', lang)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-gain/5 border border-gain/20 p-4">
                <p className="text-2xl font-mono font-bold text-gain">70%</p>
                <p className="text-sm font-medium text-foreground mt-1">{t('Reserve Reinvestment', '준비금 재투자', lang)}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('Compounds NAV growth over time', '시간에 따라 NAV 성장을 복리 축적', lang)}</p>
              </div>
              <div className="rounded-lg bg-accent/5 border border-accent/20 p-4">
                <p className="text-2xl font-mono font-bold text-accent">30%</p>
                <p className="text-sm font-medium text-foreground mt-1">{t('Token Value Increase', '토큰 가치 증가', lang)}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('Directly accrues to token holders', '토큰 보유자에게 직접 귀속', lang)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TOKENOMICS ═══ */}
      <section ref={ref('tokenomics')} className="py-24 sm:py-32 bg-card/50">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Tokenomics', '토큰 이코노믹스', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t('Token Structure', '토큰 구조', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'Each listed team has its own token. Price reflects ELO-weighted share of the reserve basket.',
              '각 상장 팀은 고유 토큰을 가집니다. 가격은 준비금 바스켓의 ELO 가중 지분을 반영합니다.',
              lang,
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground">{t('Price Formula', '가격 공식', lang)}</h3>
              <div className="rounded-lg bg-secondary p-4 font-mono text-sm text-center text-foreground">
                NAV = (Team_ELO / Total_ELO) × Reserve / Supply
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>{t('• Token price tracks NAV with market spread', '• 토큰 가격은 시장 스프레드를 가진 NAV를 추적', lang)}</p>
                <p>{t('• Win → ELO up → share up → price up', '• 승리 → ELO 상승 → 지분 상승 → 가격 상승', lang)}</p>
                <p>{t('• Lose → ELO down → share down → price down', '• 패배 → ELO 하락 → 지분 하락 → 가격 하락', lang)}</p>
                <p>{t('• Reserve growth lifts all tokens over time', '• 준비금 성장이 시간에 따라 모든 토큰을 상승', lang)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground">{t('Supply Model (Proposed)', '공급 모델 (제안)', lang)}</h3>
              <div className="space-y-3">
                <div className="rounded-lg bg-loss/5 border border-loss/20 p-3">
                  <p className="text-xs font-bold text-loss mb-1">{t('Fixed Supply Problem', '고정 공급 문제', lang)}</p>
                  <p className="text-[11px] text-muted-foreground">{t('All teams at 1M tokens → NAV dilution -56% when scaling from 20→51 teams', '모든 팀 1M 토큰 → 20→51팀 확장 시 NAV -56% 희석', lang)}</p>
                </div>
                <div className="rounded-lg bg-gain/5 border border-gain/20 p-3">
                  <p className="text-xs font-bold text-gain mb-1">{t('Dynamic Supply Solution', '동적 공급 솔루션', lang)}</p>
                  <p className="text-[11px] text-muted-foreground">{t('ELO-proportional supply (top=1M, bottom=~600K) + reserve injection at listing', 'ELO 비례 공급 (상위=1M, 하위=~600K) + 상장 시 준비금 추가', lang)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ROADMAP ═══ */}
      <section ref={ref('roadmap')} className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Roadmap', '로드맵', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            {t('Path to Market', '시장 진입 로드맵', lang)}
          </h2>

          <div className="space-y-0">
            {[
              {
                phase: 'Phase 1',
                time: t('Completed', '완료', lang),
                title: t('Research & Validation', '연구 및 검증', lang),
                items: [
                  t('884K match ELO backtesting', '884K 경기 ELO 백테스팅', lang),
                  t('Reserve basket simulation (31yr)', '준비금 바스켓 시뮬레이션 (31년)', lang),
                  t('Clearinghouse optimization', '청산소 최적화', lang),
                  t('Supply stress testing', '공급 스트레스 테스트', lang),
                ],
                done: true,
              },
              {
                phase: 'Phase 2',
                time: 'Q3 2026',
                title: t('Platform Development', '플랫폼 개발', lang),
                items: [
                  t('Trading engine & order book', '트레이딩 엔진 및 오더북', lang),
                  t('Real-time ELO pricing', '실시간 ELO 가격 결정', lang),
                  t('Mobile app prototype', '모바일 앱 프로토타입', lang),
                  t('Regulatory framework research', '규제 프레임워크 연구', lang),
                ],
                done: false,
              },
              {
                phase: 'Phase 3',
                time: 'Q1 2027',
                title: t('Beta Launch', '베타 런칭', lang),
                items: [
                  t('EPL 20 teams listed', 'EPL 20팀 상장', lang),
                  t('Reserve basket live deployment', '준비금 바스켓 실제 운용', lang),
                  t('Clearinghouse activation', '청산소 활성화', lang),
                  t('Closed beta with select investors', '선별 투자자 대상 클로즈드 베타', lang),
                ],
                done: false,
              },
              {
                phase: 'Phase 4',
                time: 'Q3 2027',
                title: t('Scale', '확장', lang),
                items: [
                  t('Multi-league expansion (La Liga, Bundesliga)', '멀티 리그 확장 (라리가, 분데스리가)', lang),
                  t('Dynamic supply model rollout', '동적 공급 모델 출시', lang),
                  t('Secondary market & derivatives', '세컨더리 마켓 및 파생상품', lang),
                  t('Regulatory licensing', '규제 라이선스 취득', lang),
                ],
                done: false,
              },
            ].map((p, i) => (
              <div key={p.phase} className="flex gap-4 sm:gap-8">
                {/* Timeline */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-3 h-3 rounded-full border-2 ${p.done ? 'bg-primary border-primary' : 'bg-background border-muted-foreground'}`} />
                  {i < 3 && <div className={`w-0.5 flex-1 min-h-[80px] ${p.done ? 'bg-primary/30' : 'bg-border'}`} />}
                </div>

                <div className="pb-8 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-mono font-bold ${p.done ? 'text-primary' : 'text-muted-foreground'}`}>{p.phase}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      p.done ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                    }`}>{p.time}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{p.title}</h3>
                  <div className="space-y-1.5">
                    {p.items.map(item => (
                      <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`w-1 h-1 rounded-full shrink-0 ${p.done ? 'bg-primary' : 'bg-muted-foreground'}`} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 sm:py-32 bg-card/50">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('Let\'s Build the Future of Sports Investment', '스포츠 투자의 미래를 함께 만들어갑시다', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-[600px] mx-auto">
            {t(
              'ETB transforms sports passion into regulated, transparent, and value-creating investment.',
              'ETB는 스포츠에 대한 열정을 규제 가능하고 투명하며 가치를 창출하는 투자로 전환합니다.',
              lang,
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://rueseo92-create.github.io/etb-platform/#/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t('Explore Platform', '플랫폼 살펴보기', lang)} →
            </a>
            <a
              href="https://rueseo92-create.github.io/etb-platform/#/simulation"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              {t('View Simulations', '시뮬레이션 보기', lang)}
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {t(
                'This presentation contains forward-looking statements based on historical backtesting. Past performance does not guarantee future results.',
                '본 자료는 과거 백테스팅을 기반으로 한 전망을 포함하고 있습니다. 과거 성과가 미래 결과를 보장하지 않습니다.',
                lang,
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Sub-components ── */

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-wider mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {text}
    </span>
  )
}

function MetricCard({ label, value, sub, valueClass }: { label: string; value: string; sub: string; valueClass?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-xl font-mono font-bold mt-1 ${valueClass || 'text-foreground'}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  )
}
