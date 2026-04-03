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
  'hero', 'problem', 'solution', 'pipeline', 'svi', 'market',
  'backtest', 'clearinghouse', 'reserve', 'tokenomics', 'roadmap',
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
            <div className="hidden lg:flex items-center gap-1 mr-4">
              {SECTIONS.map(s => (
                <button key={s} onClick={() => scrollTo(s)}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 hover:bg-primary transition-colors"
                  title={s}
                />
              ))}
            </div>

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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative max-w-[1000px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-mono text-primary">
              {t('32 Seasons Backtested \u00b7 884K Matches \u00b7 SVI Engine', '32\uc2dc\uc98c \ubc31\ud14c\uc2a4\ud2b8 \u00b7 884K \uacbd\uae30 \u00b7 SVI \uc5d4\uc9c4', lang)}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-foreground">{t('Exchange-Traded', '\uac70\ub798\uc18c \uae30\ubc18', lang)}</span>
            <br />
            <span className="text-primary">{t('Betting', '\uc2a4\ud3ec\uce20 \ubca0\ud305', lang)}</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground font-medium max-w-[750px] mx-auto mb-4 leading-relaxed italic">
            {t(
              '"If value moves, you should be able to invest in it."',
              '"\uac00\uce58\uac00 \uc6c0\uc9c1\uc778\ub2e4\uba74, \ud22c\uc790\ud560 \uc218 \uc788\uc5b4\uc57c \ud55c\ub2e4."',
              lang,
            )}
          </p>

          <p className="text-sm sm:text-base text-muted-foreground max-w-[700px] mx-auto mb-12 leading-relaxed">
            {t(
              'Transforming sports into a high-value investment market where winning is a scalable financial asset.',
              '\uc2a4\ud3ec\uce20\ub97c \uc2b9\ub9ac\uac00 \ud655\uc7a5 \uac00\ub2a5\ud55c \uae08\uc735 \uc790\uc0b0\uc774 \ub418\ub294 \uace0\ubd80\uac00\uac00\uce58 \ud22c\uc790 \uc2dc\uc7a5\uc73c\ub85c \uc804\ud658.',
              lang,
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {[
              { v: '9.96x', l: t('Asset Growth (31yr)', '\uc790\uc0b0 \uc131\uc7a5 (31\ub144)', lang) },
              { v: '+5.5%', l: t('Avg Annual Return', '\ud3c9\uade0 \uc5f0\uc218\uc775\ub960', lang) },
              { v: 'No AP', l: t('Autonomous Price Discovery', '\uc790\uc728\uc801 \uac00\uaca9 \ubc1c\uacac', lang) },
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
          <SectionLabel text={t('The Problem', '\ubb38\uc81c', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t('Why Can\'t You Invest in Sports Teams?', '\uc65c \uc2a4\ud3ec\uce20 \ud300\uc5d0 \ud22c\uc790\ud560 \uc218 \uc5c6\ub294\uac00?', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'Sports generate $500B+ in annual value, yet there is no accessible way to invest in team performance. Four structural barriers prevent this.',
              '\uc2a4\ud3ec\uce20\ub294 \uc5f0\uac04 5,000\uc5b5 \ub2ec\ub7ec \uc774\uc0c1\uc758 \uac00\uce58\ub97c \ucc3d\ucd9c\ud558\uc9c0\ub9cc, \ud300 \uc131\uc801\uc5d0 \ud22c\uc790\ud560 \uc811\uadfc \uac00\ub2a5\ud55c \ubc29\ubc95\uc774 \uc5c6\uc2b5\ub2c8\ub2e4. \ub124 \uac00\uc9c0 \uad6c\uc870\uc801 \uc7a5\ubcbd\uc774 \uc874\uc7ac\ud569\ub2c8\ub2e4.',
              lang,
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                num: '01',
                title: t('Access Barrier', '\uc811\uadfc \uc7a5\ubcbd', lang),
                desc: t(
                  'Only billionaires can buy football clubs. The average fan has zero pathway to invest in the teams they follow.',
                  '\uc5b5\ub9cc\uc7a5\uc790\ub9cc \ucd95\uad6c \ud074\ub7fd\uc744 \uc0b4 \uc218 \uc788\uc74c. \uc77c\ubc18 \ud32c\uc740 \uc790\uc2e0\uc774 \uc751\uc6d0\ud558\ub294 \ud300\uc5d0 \ud22c\uc790\ud560 \ubc29\ubc95\uc774 \uc804\ubb34.',
                  lang,
                ),
              },
              {
                num: '02',
                title: t('No Listed Instruments', '\uc0c1\uc7a5 \uc885\ubaa9 \ubd80\uc7ac', lang),
                desc: t(
                  'Of 500+ professional football clubs worldwide, only a handful are publicly traded. There\'s no market for the rest.',
                  '\uc804 \uc138\uacc4 500\uac1c \uc774\uc0c1\uc758 \ud504\ub85c\ucd95\uad6c \ud074\ub7fd \uc911 \uc0c1\uc7a5\ub41c \uac74 \uc190\uc5d0 \uaf3c\uc744 \uc815\ub3c4. \ub098\uba38\uc9c0 \ud300\uc740 \uc2dc\uc7a5 \uc790\uccb4\uac00 \uc5c6\uc74c.',
                  lang,
                ),
              },
              {
                num: '03',
                title: t('Performance-Price Disconnect', '\uc131\uc801-\uc8fc\uac00 \uad34\ub9ac', lang),
                desc: t(
                  'Man Utd is publicly traded, but its stock moves on sponsorship deals and ownership drama \u2014 not match results. Winning the league doesn\'t reliably move the price.',
                  '\ub9e8\uc720\ub294 \uc0c1\uc7a5\ub418\uc5b4 \uc788\uc9c0\ub9cc \uc8fc\uac00\ub294 \uc2a4\ud3f0\uc11c \uacc4\uc57d\uacfc \uad6c\ub2e8\uc8fc \uc774\uc288\ub85c \uc6c0\uc9c1\uc784 \u2014 \uacbd\uae30 \uacb0\uacfc\uac00 \uc544\ub2d8. \ub9ac\uadf8 \uc6b0\uc2b9\ud574\ub3c4 \uc8fc\uac00 \uc0c1\uc2b9\uc774 \ubcf4\uc7a5\ub418\uc9c0 \uc54a\uc74c.',
                  lang,
                ),
              },
              {
                num: '04',
                title: t('Prediction Market Limits', '\ud504\ub9ac\ub515\uc158 \ub9c8\ucf13 \ud55c\uacc4', lang),
                desc: t(
                  'Existing prediction markets are single-match, all-or-nothing bets. No compounding, no long-term exposure, no residual value after the match ends.',
                  '\uae30\uc874 \ud504\ub9ac\ub515\uc158 \ub9c8\ucf13\uc740 \ub2e8\uc77c \uacbd\uae30, \uc62c\uc778 \uad6c\uc870. \ubcf5\ub9ac \uc131\uc7a5 \uc5c6\uace0, \uc7a5\uae30 \ud3ec\uc9c0\uc158 \uc5c6\uace0, \uacbd\uae30 \ud6c4 \uc794\uc5ec \uac00\uce58 \uc81c\ub85c.',
                  lang,
                ),
              },
            ].map(c => (
              <div key={c.num} className="rounded-xl border border-border bg-card p-6">
                <span className="text-xs font-mono text-primary/40 mb-2 block">{c.num}</span>
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
          <SectionLabel text={t('The Solution', '\uc194\ub8e8\uc158', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t('ETB: Exchange-Traded Betting', 'ETB: Exchange-Traded Betting', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-[700px]">
            {t(
              'Team tokens backed by diversified financial assets, priced by a Sporting Value Index. No house edge. No bookmaker. Autonomous price discovery where NAV is the intrinsic floor and market price reflects investor conviction.',
              '\ub2e4\ubcc0\ud654\ub41c \uae08\uc735 \uc790\uc0b0\uc73c\ub85c \ubcf4\uc99d\ub418\uace0, Sporting Value Index\ub85c \uac00\uaca9\uc774 \uacb0\uc815\ub418\ub294 \ud300 \ud1a0\ud070. \ud558\uc6b0\uc2a4 \uc5e3\uc9c0 \uc5c6\uc74c. \ubd81\uba54\uc774\ucee4 \uc5c6\uc74c. NAV\uac00 \ub0b4\uc7ac\uc801 \ud558\ud55c\uc774\uace0 \uc2dc\uc7a5\uac00\uac00 \ud22c\uc790\uc790 \ud655\uc2e0\uc744 \ubc18\uc601\ud558\ub294 \uc790\uc728\uc801 \uac00\uaca9 \ubc1c\uacac.',
              lang,
            )}
          </p>

          {/* Dual price structure highlight */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 mb-8">
            <h3 className="text-sm font-bold text-accent mb-4">{t('Dual Price Structure (Like Equities)', '\uc774\uc911 \uac00\uaca9 \uad6c\uc870 (\uc8fc\uc2dd\uacfc \ub3d9\uc77c)', lang)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-background/50 border border-border p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">NAV ({t('Intrinsic Value', '\ub0b4\uc7ac \uac00\uce58', lang)})</p>
                <p className="text-lg font-bold text-foreground mb-2">{t('Determined by match results', '\uacbd\uae30 \uacb0\uacfc\ub85c \uacb0\uc815', lang)}</p>
                <p className="text-xs text-muted-foreground">{t('SVI rating changes allocate reserve pool shares. Win = NAV up, Lose = NAV down. Objective, on-chain verifiable.', 'SVI \ub808\uc774\ud305 \ubcc0\ub3d9\uc774 \uc900\ube44\uae08 \ud480 \uc9c0\ubd84\uc744 \ubc30\ubd84. \uc2b9\ub9ac = NAV \uc0c1\uc2b9, \ud328\ubc30 = NAV \ud558\ub77d. \uac1d\uad00\uc801, \uac80\uc99d \uac00\ub2a5.', lang)}</p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t('Market Price', '\uc2dc\uc7a5\uac00', lang)} ({t('Market Value', '\uc2dc\uc7a5 \uac00\uce58', lang)})</p>
                <p className="text-lg font-bold text-foreground mb-2">{t('Determined by investor expectations', '\ud22c\uc790\uc790 \uae30\ub300\uac10\uc73c\ub85c \uacb0\uc815', lang)}</p>
                <p className="text-xs text-muted-foreground">{t('Can trade at premium or discount to NAV. Just like P/E ratios in equities \u2014 analysts find valuation gaps and profit.', 'NAV \ub300\ube44 \ud504\ub9ac\ubbf8\uc5c4 \ub610\ub294 \ub514\uc2a4\uce74\uc6b4\ud2b8\ub85c \uac70\ub798. \uc8fc\uc2dd\uc758 PER\ucc98\ub7fc \u2014 \ubd84\uc11d\uac00\uac00 \ubca8\ub958\uc5d0\uc774\uc158 \uac6d\uc744 \ucc3e\uc544 \uc218\uc775\uc744 \ub0c4.', lang)}</p>
              </div>
            </div>
            <p className="text-xs text-primary mt-4 font-medium">
              {t('\u2192 No AP (Authorized Participant). No forced convergence. The market decides.', '\u2192 AP(\uc9c0\uc815\ucc38\uac00\ud68c\uc0ac) \uc5c6\uc74c. \uac15\uc81c \uc218\ub834 \uc5c6\uc74c. \uc2dc\uc7a5\uc774 \uacb0\uc815.', lang)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                before: t('Only billionaires own clubs', '\uc5b5\ub9cc\uc7a5\uc790\ub9cc \ud074\ub7fd \uc18c\uc720', lang),
                after: t('Anyone buys team tokens from $10', '\ub204\uad6c\ub098 $10\ubd80\ud130 \ud300 \ud1a0\ud070 \uad6c\ub9e4', lang),
              },
              {
                before: t('Stock price ignores match results', '\uc8fc\uac00\uac00 \uacbd\uae30 \uacb0\uacfc \ubb34\uc2dc', lang),
                after: t('SVI directly links wins to NAV', 'SVI\uac00 \uc2b9\ub9ac\ub97c NAV\uc5d0 \uc9c1\uacb0', lang),
              },
              {
                before: t('Single-match all-or-nothing bet', '\ub2e8\uc77c \uacbd\uae30 \uc62c\uc778 \ubca0\ud305', lang),
                after: t('Season-long exposure with residual value', '\uc2dc\uc98c \uc7a5\uae30 \ud3ec\uc9c0\uc158 + \uc794\uc5ec \uac00\uce58', lang),
              },
              {
                before: t('House edge 5-15% guaranteed loss', '\ud558\uc6b0\uc2a4 \uc5e3\uc9c0 5-15% \ubd88\uac00\ud53c', lang),
                after: t('Asset basket compounds at +5.5%/yr', '\uc790\uc0b0 \ubc14\uc2a4\ucf13 \uc5f0 +5.5% \ubcf5\ub9ac \uc131\uc7a5', lang),
              },
            ].map((c, i) => (
              <div key={i} className="flex items-stretch rounded-xl border border-border overflow-hidden">
                <div className="flex-1 p-4 bg-loss/5 border-r border-border">
                  <p className="text-[10px] text-loss uppercase tracking-wider mb-1">{t('Status Quo', '\ud604\uc7ac', lang)}</p>
                  <p className="text-sm text-foreground">{c.before}</p>
                </div>
                <div className="flex-1 p-4 bg-gain/5">
                  <p className="text-[10px] text-gain uppercase tracking-wider mb-1">ETB</p>
                  <p className="text-sm text-foreground">{c.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRIPLE-LAYER PIPELINE ═══ */}
      <section ref={ref('pipeline')} className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Architecture', '\uc544\ud0a4\ud14d\ucc98', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('Triple-Layer Pipeline', 'Triple-Layer Pipeline', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'Three distinct layers separate asset custody, value computation, and price discovery \u2014 each independently auditable.',
              '\uc790\uc0b0 \uc218\ud0c1, \uac00\uce58 \uc0b0\uc815, \uac00\uaca9 \ubc1c\uacac\uc758 \uc138 \uacc4\uce35\uc744 \ubd84\ub9ac \u2014 \uac01\uac01 \ub3c5\ub9bd\uc801\uc73c\ub85c \uac10\uc0ac \uac00\ub2a5.',
              lang,
            )}
          </p>

          <div className="space-y-4">
            {/* Layer 1 */}
            <div className="rounded-xl border-2 border-accent/40 bg-accent/5 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20 text-accent font-mono font-bold text-sm">L1</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{t('Asset Basket', 'Asset Basket', lang)}</h3>
                  <p className="text-xs text-accent font-medium">{t('Primary Market \u2014 Custody & Yield', 'Primary Market \u2014 \uc218\ud0c1 & \uc218\uc775', lang)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'All capital deposited into a diversified basket of real financial assets. This creates the NAV floor for every team token.',
                  '\ubaa8\ub4e0 \uc790\ubcf8\uc774 \uc2e4\uc81c \uae08\uc735 \uc790\uc0b0\uc758 \ubd84\uc0b0 \ubc14\uc2a4\ucf13\uc5d0 \uc608\uce58. \ubaa8\ub4e0 \ud300 \ud1a0\ud070\uc758 NAV \ud558\ud55c\uc744 \ud615\uc131.',
                  lang,
                )}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { asset: t('US/UK Treasury', '\ubbf8/\uc601 \uad6d\ucc44', lang), color: '#6CABDD' },
                  { asset: 'Nasdaq-100 ETF', color: '#3fb950' },
                  { asset: t('Fan Tokens', '\ud32c \ud1a0\ud070', lang), color: '#A855F7' },
                  { asset: t('Prediction Revenue', '\ud504\ub9ac\ub515\uc158 \uc218\uc775', lang), color: '#d29922' },
                ].map(a => (
                  <div key={a.asset} className="flex items-center gap-2 rounded-md bg-background/50 border border-border px-3 py-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                    <span className="text-xs font-medium text-foreground">{a.asset}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg width="24" height="32" viewBox="0 0 24 32" fill="none" className="text-primary/40">
                <path d="M12 0v24M6 18l6 6 6-6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {/* Layer 2 */}
            <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary font-mono font-bold text-sm">L2</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{t('Settlement Engine', 'Settlement Engine', lang)}</h3>
                  <p className="text-xs text-primary font-medium">{t('Sporting Value Index (SVI)', 'Sporting Value Index (SVI)', lang)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'Every match result updates the SVI. The index determines each team\'s share of the L1 Asset Basket. This is the NAV engine \u2014 objective, algorithmic, backtested over 884K matches.',
                  '\ubaa8\ub4e0 \uacbd\uae30 \uacb0\uacfc\uac00 SVI\ub97c \uc5c5\ub370\uc774\ud2b8. \uc778\ub371\uc2a4\uac00 L1 Asset Basket\uc5d0\uc11c \uac01 \ud300\uc758 \uc9c0\ubd84\uc744 \uacb0\uc815. \uc774\uac83\uc774 NAV \uc5d4\uc9c4 \u2014 \uac1d\uad00\uc801, \uc54c\uace0\ub9ac\uc988\ub9c9, 884K \uacbd\uae30 \ubc31\ud14c\uc2a4\ud2b8 \uc644\ub8cc.',
                  lang,
                )}
              </p>
              <div className="font-mono text-sm text-center text-primary bg-background/50 rounded-lg border border-primary/20 p-3">
                NAV = (Team_SVI / Total_SVI) x L1_Assets / Token_Supply
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <svg width="24" height="32" viewBox="0 0 24 32" fill="none" className="text-primary/40">
                <path d="M12 0v24M6 18l6 6 6-6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {/* Layer 3 */}
            <div className="rounded-xl border-2 border-warning/40 bg-warning/5 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/20 text-warning font-mono font-bold text-sm">L3</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{t('Secondary Market', 'Secondary Market', lang)}</h3>
                  <p className="text-xs text-warning font-medium">{t('Autonomous Price Discovery', '\uc790\uc728\uc801 \uac00\uaca9 \ubc1c\uacac', lang)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'Investors trade tokens on the open market. Price can deviate from NAV \u2014 premium reflects bullish conviction, discount reflects bearish sentiment. No AP forces convergence. Analysts profit by finding valuation gaps, just like equity markets.',
                  '\ud22c\uc790\uc790\uac00 \uacf5\uac1c \uc2dc\uc7a5\uc5d0\uc11c \ud1a0\ud070\uc744 \uac70\ub798. \uac00\uaca9\uc774 NAV\uc5d0\uc11c \ubc97\uc5b4\ub0a0 \uc218 \uc788\uc74c \u2014 \ud504\ub9ac\ubbf8\uc5c4\uc740 \uac15\uc138 \ud655\uc2e0, \ub514\uc2a4\uce74\uc6b4\ud2b8\ub294 \uc57d\uc138 \uc2ec\ub9ac. AP\uac00 \uc218\ub834\uc744 \uac15\uc81c\ud558\uc9c0 \uc54a\uc74c. \uc8fc\uc2dd\uc2dc\uc7a5\ucc98\ub7fc \ubd84\uc11d\uac00\uac00 \ubca8\ub958\uc5d0\uc774\uc158 \uac6d\uc744 \ucc3e\uc544 \uc218\uc775.',
                  lang,
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-md bg-background/50 border border-border px-3 py-2 text-xs">
                  <span className="text-gain font-mono">+15%</span> <span className="text-muted-foreground">{t('Premium = "This team will dominate"', 'Premium = "\uc774 \ud300\uc774 \ub2e4 \uc774\uae34\ub2e4"', lang)}</span>
                </div>
                <div className="rounded-md bg-background/50 border border-border px-3 py-2 text-xs">
                  <span className="text-loss font-mono">-8%</span> <span className="text-muted-foreground">{t('Discount = "Underperformer, sell"', 'Discount = "\uc800\uc131\uacfc, \ub9e4\ub3c4"', lang)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SVI ═══ */}
      <section ref={ref('svi')} className="py-24 sm:py-32 bg-card/50">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Valuation Engine', '\uac00\uce58 \uc0b0\uc815 \uc5d4\uc9c4', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t('Sporting Value Index (SVI)', 'Sporting Value Index (SVI)', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'A proprietary index that converts match outcomes into financial value. Calibrated using ELO methodology + betting odds, backtested over 32 seasons and 884K matches.',
              '\uacbd\uae30 \uacb0\uacfc\ub97c \uae08\uc735 \uac00\uce58\ub85c \ubcc0\ud658\ud558\ub294 \ub3c5\uc810 \uc778\ub371\uc2a4. ELO \ubc29\ubc95\ub860 + \ubc30\ub2f9\ub960\ub85c \ubcf4\uc815, 32\uc2dc\uc98c 884K \uacbd\uae30 \ubc31\ud14c\uc2a4\ud2b8 \uc644\ub8cc.',
              lang,
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                title: t('Input', '\uc785\ub825', lang),
                items: [
                  t('Match result (W/D/L)', '\uacbd\uae30 \uacb0\uacfc (W/D/L)', lang),
                  t('Opponent SVI rating', '\uc0c1\ub300 SVI \ub808\uc774\ud305', lang),
                  t('Tournament weight', '\ub300\ud68c \uac00\uc911\uce58', lang),
                  t('Betting odds calibration', '\ubc30\ub2f9\ub960 \ubcf4\uc815', lang),
                ],
              },
              {
                title: t('Engine', '\uc5d4\uc9c4', lang),
                items: [
                  t('K-value system', 'K-value \uc2dc\uc2a4\ud15c', lang),
                  t('Dynamic K by match type', '\uacbd\uae30 \uc720\ud615\ubcc4 \ub3d9\uc801 K', lang),
                  t('Expected outcome model', '\uc608\uc0c1 \uacb0\uacfc \ubaa8\ub378', lang),
                  t('Smoothing algorithm', '\uc2a4\ubb34\ub529 \uc54c\uace0\ub9ac\uc998', lang),
                ],
              },
              {
                title: t('Output', '\ucd9c\ub825', lang),
                items: [
                  t('Team SVI score', '\ud300 SVI \uc810\uc218', lang),
                  t('Reserve pool share %', '\uc900\ube44\uae08 \ud480 \uc9c0\ubd84 %', lang),
                  t('NAV per token', '\ud1a0\ud070\ub2f9 NAV', lang),
                  t('Historical performance', '\uacfc\uac70 \uc131\uacfc', lang),
                ],
              },
            ].map(col => (
              <div key={col.title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold text-primary mb-3">{col.title}</h3>
                <div className="space-y-2">
                  {col.items.map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label={t('Matches Processed', '\ucc98\ub9ac\ub41c \uacbd\uae30', lang)} value="884K+" sub={t('Global football', '\uae00\ub85c\ubc8c \ucd95\uad6c', lang)} />
            <MetricCard label={t('Teams Rated', '\ub808\uc774\ud305 \ud300', lang)} value="51" sub={t('EPL backtested', 'EPL \ubc31\ud14c\uc2a4\ud2b8', lang)} />
            <MetricCard label={t('Seasons', '\uc2dc\uc98c', lang)} value="32" sub="1993 \u2014 2025" />
            <MetricCard label={t('Negative Events', '\ubd80\uc815\uc801 \uc774\ubca4\ud2b8', lang)} value="0" sub={t('NAV failures', 'NAV \uc2e4\ud328', lang)} valueClass="text-gain" />
          </div>
        </div>
      </section>

      {/* ═══ MARKET ═══ */}
      <section ref={ref('market')} className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Market Opportunity', '\uc2dc\uc7a5 \uae30\ud68c', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            {t('Where Three Markets Converge', '\uc138 \uc2dc\uc7a5\uc774 \uc218\ub834\ud558\ub294 \uc9c0\uc810', lang)}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { v: '$300B', l: t('Sports Betting', '\uc2a4\ud3ec\uce20 \ubca0\ud305', lang), sub: '2024' },
              { v: '$45B', l: t('Football Betting', '\ucd95\uad6c \ubca0\ud305', lang), sub: t('Largest segment', '\ucd5c\ub300 \uc138\uadf8\uba3c\ud2b8', lang) },
              { v: '4.7B', l: t('Football Fans', '\ucd95\uad6c \ud32c', lang), sub: t('Worldwide', '\uc804 \uc138\uacc4', lang) },
              { v: '$4.2T', l: t('Global ETF Market', '\uae00\ub85c\ubc8c ETF', lang), sub: t('Model we follow', 'ETB \ubaa8\ub378', lang) },
            ].map(s => (
              <div key={s.l} className="rounded-xl border border-border bg-card p-5 text-center">
                <p className="text-2xl sm:text-3xl font-mono font-bold text-primary">{s.v}</p>
                <p className="text-xs font-medium text-foreground mt-2">{s.l}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="text-sm font-bold text-primary mb-3">{t('ETB is Not...', 'ETB\ub294...', lang)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">{t('Not Gambling', '\ub3c4\ubc15\uc774 \uc544\ub2d8', lang)}</p>
                <p className="text-xs">{t('Asset-backed. NAV floor exists. Regulated as a financial product, not a bet.', '\uc790\uc0b0 \ubc31\ub4dc. NAV \ud558\ud55c \uc874\uc7ac. \ubca0\ud305\uc774 \uc544\ub2cc \uae08\uc735\uc0c1\ud488\uc73c\ub85c \uaddc\uc81c.', lang)}</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">{t('Not Crypto', '\ud06c\ub9bd\ud1a0\uac00 \uc544\ub2d8', lang)}</p>
                <p className="text-xs">{t('Backed by Treasuries + Nasdaq-100 + real revenue. Not speculation on hype.', '\uad6d\ucc44 + Nasdaq-100 + \uc2e4\uc81c \uc218\uc775\uc73c\ub85c \ubcf4\uc99d. \ud558\uc774\ud504 \ud22c\uae30\uac00 \uc544\ub2d8.', lang)}</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">{t('Not Fantasy', '\ud310\ud0c0\uc9c0\uac00 \uc544\ub2d8', lang)}</p>
                <p className="text-xs">{t('Real financial returns. 32-season backtest. Institutional-grade risk model.', '\uc2e4\uc81c \uae08\uc735 \uc218\uc775. 32\uc2dc\uc98c \ubc31\ud14c\uc2a4\ud2b8. \uae30\uad00\uae09 \ub9ac\uc2a4\ud06c \ubaa8\ub378.', lang)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BACKTEST ═══ */}
      <section ref={ref('backtest')} className="py-24 sm:py-32 bg-card/50">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Backtest Results', '\ubc31\ud14c\uc2a4\ud2b8 \uacb0\uacfc', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('32 Seasons of Proof', '32\uc2dc\uc98c\uc758 \uc99d\uac70', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'Every EPL team since 1993, every match result, priced through the SVI engine and reserve basket model.',
              '1993\ub144 \uc774\ud6c4 \ubaa8\ub4e0 EPL \ud300, \ubaa8\ub4e0 \uacbd\uae30 \uacb0\uacfc\ub97c SVI \uc5d4\uc9c4\uacfc \uc900\ube44\uae08 \ubc14\uc2a4\ucf13 \ubaa8\ub378\ub85c \uac00\uaca9 \uc0b0\uc815.',
              lang,
            )}
          </p>

          <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-sm font-bold text-foreground">
                {t('Big 6 SVI Performance \u2014 Balanced Basket', 'Big 6 SVI \uc131\uacfc \u2014 \uade0\ud615 \ubc14\uc2a4\ucf13', lang)}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    <th className="text-left px-6 py-3">{t('Team', '\ud300', lang)}</th>
                    <th className="text-right px-4 py-3">{t('Final SVI', '\ucd5c\uc885 SVI', lang)}</th>
                    <th className="text-right px-4 py-3">{t('Total Return', '\ucd1d \uc218\uc775\ub960', lang)}</th>
                    <th className="text-right px-4 py-3">{t('Annual Return', '\uc5f0 \uc218\uc775\ub960', lang)}</th>
                    <th className="text-right px-6 py-3">{t('Seasons', '\uc2dc\uc98c', lang)}</th>
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label={t('Best Performer', '\ucd5c\uace0 \uc218\uc775\ud300', lang)} value={summary.best_total.team} sub={`+${summary.best_total.value.toFixed(0)}% total`} />
            <MetricCard label={t('Best Annual', '\ucd5c\uace0 \uc5f0\uc218\uc775', lang)} value={summary.best_annual.team} sub={`+${summary.best_annual.value.toFixed(1)}%/yr`} />
            <MetricCard label={t('Reserve Multiple', '\uc900\ube44\uae08 \ubc30\uc218', lang)} value={`${summary.basket_multiple}x`} sub="$10M \u2192 $99.6M" valueClass="text-primary" />
            <MetricCard label={t('Zero Failures', '\uc2e4\ud328 0\uac74', lang)} value="0" sub={t('negative NAV events', 'NAV \ub9c8\uc774\ub108\uc2a4 \uc774\ubca4\ud2b8', lang)} valueClass="text-gain" />
          </div>
        </div>
      </section>

      {/* ═══ CLEARINGHOUSE ═══ */}
      <section ref={ref('clearinghouse')} className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Risk Management', '\ub9ac\uc2a4\ud06c \uad00\ub9ac', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t('The Clearinghouse', '\uccad\uc0b0\uc18c \uba54\ucee4\ub2c8\uc998', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'When unlisted teams beat listed teams, it drains the reserve pool. The Clearinghouse absorbs this impact with a 5% buffer.',
              '\ube44\uc0c1\uc7a5 \ud300\uc774 \uc0c1\uc7a5 \ud300\uc744 \uc774\uae30\uba74 \uc900\ube44\uae08 \ud480\uc774 \uac10\uc18c. \uccad\uc0b0\uc18c\uac00 5% \ubc84\ud37c\ub85c \uc774 \uc601\ud5a5\uc744 \ud761\uc218.',
              lang,
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { mode: 'A', label: t('No CH', 'CH \uc5c6\uc74c', lang), price: '$0.320', status: 'risk' as const, note: t('No protection', '\ubcf4\ud638 \uc5c6\uc74c', lang) },
              { mode: 'B', label: t('Fixed 5%', '\uace0\uc815 5%', lang), price: '$0.304', status: 'best' as const, note: t('Optimal', '\ucd5c\uc801', lang) },
              { mode: 'C', label: t('Dynamic', '\ub3d9\uc801', lang), price: '$0.005', status: 'fail' as const, note: t('98.5% absorbed', '98.5% \ud761\uc218', lang) },
              { mode: 'D', label: t('Ignore', '\ubb34\uc2dc', lang), price: '$0.320', status: 'risk' as const, note: t('96% data lost', '96% \ub370\uc774\ud130 \uc190\uc2e4', lang) },
            ].map(m => (
              <div key={m.mode} className={`rounded-xl border p-5 ${
                m.status === 'best' ? 'border-primary/50 bg-primary/5' : m.status === 'fail' ? 'border-loss/30 bg-loss/5' : 'border-border bg-card'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">Sim {m.mode}</span>
                  {m.status === 'best' && (
                    <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full uppercase">
                      {t('Best', '\ucd5c\uc801', lang)}
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
              <h3 className="text-sm font-bold text-primary">{t('Recommendation: CH 5% + Quarterly Rebalance', '\uad8c\uc7a5: CH 5% + \ubd84\uae30\ubcc4 \ub9ac\ubc38\ub7f0\uc2f1', lang)}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                '305,444 matches simulated over 25 years. Token price maintained at $0.304 with zero negative events. 4.61% minimum safety buffer at all times.',
                '25\ub144\uac04 305,444\uacbd\uae30 \uc2dc\ubbac\ub808\uc774\uc158. \ud1a0\ud070 \uac00\uaca9 $0.304 \uc720\uc9c0, \ubd80\uc815\uc801 \uc774\ubca4\ud2b8 0\uac74. \ud56d\uc0c1 \ucd5c\uc18c 4.61% \uc548\uc804 \ubc84\ud37c.',
                lang,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ RESERVE ═══ */}
      <section ref={ref('reserve')} className="py-24 sm:py-32 bg-card/50">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('L1 Asset Basket', 'L1 Asset Basket', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            {t('Diversified Reserve Composition', '\ub2e4\ubcc0\ud654 \uc900\ube44\uae08 \uad6c\uc131', lang)}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { asset: t('US/UK Treasury', '\ubbf8/\uc601 \uad6d\ucc44', lang), weight: '30%', color: '#6CABDD', desc: t('Stability & yield', '\uc548\uc815\uc131 & \uc774\uc790\uc218\uc775', lang), ret: '+4.2%/yr' },
              { asset: 'Nasdaq-100 ETF', weight: '35%', color: '#3fb950', desc: t('Growth engine', '\uc131\uc7a5 \uc5d4\uc9c4', lang), ret: '+12.4%/yr' },
              { asset: t('Fan Tokens', '\ud32c \ud1a0\ud070', lang), weight: '20%', color: '#A855F7', desc: t('Sports ecosystem', '\uc2a4\ud3ec\uce20 \uc0dd\ud0dc\uacc4', lang), ret: t('Variable', '\ubcc0\ub3d9', lang) },
              { asset: t('Prediction Rev.', '\ud504\ub9ac\ub515\uc158 \uc218\uc775', lang), weight: '15%', color: '#d29922', desc: t('Platform revenue', '\ud50c\ub7ab\ud3fc \uc218\uc775', lang), ret: t('Performance', '\uc131\uacfc \uae30\ubc18', lang) },
            ].map(a => (
              <div key={a.asset} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                  <span className="text-sm font-bold text-foreground">{a.asset}</span>
                </div>
                <p className="text-2xl font-mono font-bold text-foreground mb-1">{a.weight}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
                <p className="text-xs font-mono text-gain mt-2">{a.ret}</p>
                <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: a.weight, backgroundColor: a.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">{t('Yield Distribution', '\uc218\uc775 \ubc30\ubd84', lang)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-gain/5 border border-gain/20 p-4">
                <p className="text-2xl font-mono font-bold text-gain">70%</p>
                <p className="text-sm font-medium text-foreground mt-1">{t('Reserve Reinvestment', '\uc900\ube44\uae08 \uc7ac\ud22c\uc790', lang)}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('Compounds NAV growth over time', '\uc2dc\uac04\uc5d0 \ub530\ub77c NAV \ubcf5\ub9ac \uc131\uc7a5', lang)}</p>
              </div>
              <div className="rounded-lg bg-accent/5 border border-accent/20 p-4">
                <p className="text-2xl font-mono font-bold text-accent">30%</p>
                <p className="text-sm font-medium text-foreground mt-1">{t('Token Value Accrual', '\ud1a0\ud070 \uac00\uce58 \uadc0\uc18d', lang)}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('Directly flows to token holders', '\ud1a0\ud070 \ubcf4\uc720\uc790\uc5d0\uac8c \uc9c1\uc811 \uadc0\uc18d', lang)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TOKENOMICS ═══ */}
      <section ref={ref('tokenomics')} className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Tokenomics', '\ud1a0\ud070 \uc774\ucf54\ub178\ubbf9\uc2a4', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t('Token Structure', '\ud1a0\ud070 \uad6c\uc870', lang)}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-[700px]">
            {t(
              'Each team has its own token. NAV is determined by SVI. Market price floats freely \u2014 no AP, no forced peg.',
              '\uac01 \ud300\uc774 \uace0\uc720 \ud1a0\ud070 \ubcf4\uc720. NAV\ub294 SVI\ub85c \uacb0\uc815. \uc2dc\uc7a5\uac00\ub294 \uc790\uc720\ub86d\uac8c \uc6c0\uc9c1\uc784 \u2014 AP \uc5c6\uc74c, \uac15\uc81c \ud398\uadf8 \uc5c6\uc74c.',
              lang,
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground">{t('NAV Formula (L2)', 'NAV \uacf5\uc2dd (L2)', lang)}</h3>
              <div className="rounded-lg bg-secondary p-4 font-mono text-sm text-center text-primary">
                NAV = (Team_SVI / Total_SVI) x L1_Assets / Supply
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>{t('\u2022 Win \u2192 SVI up \u2192 reserve share up \u2192 NAV up', '\u2022 \uc2b9\ub9ac \u2192 SVI \uc0c1\uc2b9 \u2192 \uc9c0\ubd84 \uc0c1\uc2b9 \u2192 NAV \uc0c1\uc2b9', lang)}</p>
                <p>{t('\u2022 L1 asset growth lifts all NAVs over time', '\u2022 L1 \uc790\uc0b0 \uc131\uc7a5\uc774 \uc2dc\uac04\uc5d0 \ub530\ub77c \ubaa8\ub4e0 NAV\ub97c \uc0c1\uc2b9', lang)}</p>
                <p>{t('\u2022 Market price floats around NAV (like PER)', '\u2022 \uc2dc\uc7a5\uac00\ub294 NAV \uc8fc\ubcc0\uc73c\ub85c \ubcc0\ub3d9 (PER\ucc98\ub7fc)', lang)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground">{t('Dynamic Supply Model', '\ub3d9\uc801 \uacf5\uae09 \ubaa8\ub378', lang)}</h3>
              <div className="space-y-3">
                <div className="rounded-lg bg-loss/5 border border-loss/20 p-3">
                  <p className="text-xs font-bold text-loss mb-1">{t('Fixed Supply Problem', '\uace0\uc815 \uacf5\uae09 \ubb38\uc81c', lang)}</p>
                  <p className="text-[11px] text-muted-foreground">{t('1M/team \u2192 NAV dilution -56% when scaling 20\u219251 teams', '1M/\ud300 \u2192 20\u219251\ud300 \ud655\uc7a5 \uc2dc NAV -56% \ud76c\uc11d', lang)}</p>
                </div>
                <div className="rounded-lg bg-gain/5 border border-gain/20 p-3">
                  <p className="text-xs font-bold text-gain mb-1">{t('Solution: SVI-Proportional Supply', '\ud574\uacb0: SVI \ube44\ub840 \uacf5\uae09', lang)}</p>
                  <p className="text-[11px] text-muted-foreground">{t('Top team 1M, weaker teams ~600K + L1 injection at each new listing', '\uc0c1\uc704\ud300 1M, \ud558\uc704\ud300 ~600K + \uc2e0\uaddc \uc0c1\uc7a5 \uc2dc L1 \uc790\uae08 \uc8fc\uc785', lang)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ROADMAP ═══ */}
      <section ref={ref('roadmap')} className="py-24 sm:py-32 bg-card/50">
        <div className="max-w-[1000px] mx-auto px-6">
          <SectionLabel text={t('Roadmap', '\ub85c\ub4dc\ub9f5', lang)} />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12">
            {t('Path to Market', '\uc2dc\uc7a5 \uc9c4\uc785 \ub85c\ub4dc\ub9f5', lang)}
          </h2>

          <div className="space-y-0">
            {[
              {
                phase: 'Phase 1',
                time: t('Completed', '\uc644\ub8cc', lang),
                title: t('Research & Validation', '\uc5f0\uad6c \ubc0f \uac80\uc99d', lang),
                items: [
                  t('884K match SVI backtesting', '884K \uacbd\uae30 SVI \ubc31\ud14c\uc2a4\ud305', lang),
                  t('Reserve basket simulation (31yr)', '\uc900\ube44\uae08 \ubc14\uc2a4\ucf13 \uc2dc\ubbac\ub808\uc774\uc158 (31\ub144)', lang),
                  t('Clearinghouse optimization (CH 5%)', '\uccad\uc0b0\uc18c \ucd5c\uc801\ud654 (CH 5%)', lang),
                  t('Supply stress test (fixed vs dynamic)', '\uacf5\uae09 \uc2a4\ud2b8\ub808\uc2a4 \ud14c\uc2a4\ud2b8 (\uace0\uc815 vs \ub3d9\uc801)', lang),
                ],
                done: true,
              },
              {
                phase: 'Phase 2',
                time: 'Q3 2026',
                title: t('Platform Development', '\ud50c\ub7ab\ud3fc \uac1c\ubc1c', lang),
                items: [
                  t('L3 trading engine & order book', 'L3 \ud2b8\ub808\uc774\ub529 \uc5d4\uc9c4 & \uc624\ub354\ubd81', lang),
                  t('Real-time SVI pricing feed', '\uc2e4\uc2dc\uac04 SVI \uac00\uaca9 \ud53c\ub4dc', lang),
                  t('L1 asset custody integration', 'L1 \uc790\uc0b0 \uc218\ud0c1 \ud1b5\ud569', lang),
                  t('Regulatory framework (UK/EU/KR)', '\uaddc\uc81c \ud504\ub808\uc784\uc6cc\ud06c (UK/EU/KR)', lang),
                ],
                done: false,
              },
              {
                phase: 'Phase 3',
                time: 'Q1 2027',
                title: t('Beta Launch', '\ubca0\ud0c0 \ub7f0\uce6d', lang),
                items: [
                  t('EPL 20 teams listed via SVI', 'EPL 20\ud300 SVI \uae30\ubc18 \uc0c1\uc7a5', lang),
                  t('L1 basket live deployment', 'L1 \ubc14\uc2a4\ucf13 \uc2e4\uc81c \uc6b4\uc6a9', lang),
                  t('Autonomous price discovery (no AP)', '\uc790\uc728\uc801 \uac00\uaca9 \ubc1c\uacac (AP \uc5c6\uc74c)', lang),
                  t('Closed beta with institutional investors', '\uae30\uad00 \ud22c\uc790\uc790 \ud074\ub85c\uc988\ub4dc \ubca0\ud0c0', lang),
                ],
                done: false,
              },
              {
                phase: 'Phase 4',
                time: 'Q3 2027',
                title: t('Scale', '\ud655\uc7a5', lang),
                items: [
                  t('Multi-league: La Liga, Bundesliga, Serie A', '\uba40\ud2f0 \ub9ac\uadf8: \ub77c\ub9ac\uac00, \ubd84\ub370\uc2a4\ub9ac\uac00, \uc138\ub9ac\uc5d0A', lang),
                  t('Dynamic SVI-proportional supply rollout', '\ub3d9\uc801 SVI \ube44\ub840 \uacf5\uae09 \ubaa8\ub378 \ucd9c\uc2dc', lang),
                  t('Derivatives & structured products', '\ud30c\uc0dd\uc0c1\ud488 & \uad6c\uc870\ud654 \uc0c1\ud488', lang),
                  t('Regulatory licensing (FCA/BaFin)', '\uaddc\uc81c \ub77c\uc774\uc120\uc2a4 (FCA/BaFin)', lang),
                ],
                done: false,
              },
            ].map((p, i) => (
              <div key={p.phase} className="flex gap-4 sm:gap-8">
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
      <section className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <p className="text-xl sm:text-2xl text-primary font-medium italic mb-4">
            {t(
              '"Transforming sports into a high-value investment market where winning is a scalable financial asset."',
              '"\uc2a4\ud3ec\uce20\ub97c \uc2b9\ub9ac\uac00 \ud655\uc7a5 \uac00\ub2a5\ud55c \uae08\uc735 \uc790\uc0b0\uc774 \ub418\ub294 \uace0\ubd80\uac00\uac00\uce58 \ud22c\uc790 \uc2dc\uc7a5\uc73c\ub85c \uc804\ud658."',
              lang,
            )}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
            {t('If value moves, you should be able to invest in it.', '\uac00\uce58\uac00 \uc6c0\uc9c1\uc778\ub2e4\uba74, \ud22c\uc790\ud560 \uc218 \uc788\uc5b4\uc57c \ud55c\ub2e4.', lang)}
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a
              href="https://rueseo92-create.github.io/etb-platform/#/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t('Explore Platform', '\ud50c\ub7ab\ud3fc \uc0b4\ud3b4\ubcf4\uae30', lang)} &rarr;
            </a>
            <a
              href="https://rueseo92-create.github.io/etb-platform/#/simulation"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              {t('View Simulations', '\uc2dc\ubbac\ub808\uc774\uc158 \ubcf4\uae30', lang)}
            </a>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {t(
                'This presentation contains forward-looking statements based on historical backtesting. Past performance does not guarantee future results.',
                '\ubcf8 \uc790\ub8cc\ub294 \uacfc\uac70 \ubc31\ud14c\uc2a4\ud305\uc744 \uae30\ubc18\uc73c\ub85c \ud55c \uc804\ub9dd\uc744 \ud3ec\ud568\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4. \uacfc\uac70 \uc131\uacfc\uac00 \ubbf8\ub798 \uacb0\uacfc\ub97c \ubcf4\uc7a5\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.',
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
