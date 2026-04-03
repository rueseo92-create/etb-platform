import { useState } from 'react'
import { ETB_DATA } from '@/lib/data'

type Lang = 'en' | 'kr'
const t = (en: string, kr: string, lang: Lang) => lang === 'en' ? en : kr

const balanced = ETB_DATA.baskets.balanced
const big6Returns = (balanced.annual_returns as unknown as { team: string; annual_return_pct: number; total_return_pct: number; final_elo: number; is_big6: boolean; seasons_active: number }[])
  .filter(r => (ETB_DATA.big6 as unknown as string[]).includes(r.team))
  .sort((a, b) => b.final_elo - a.final_elo)
const allReturns = [...(balanced.annual_returns as unknown as { team: string; annual_return_pct: number; total_return_pct: number; final_elo: number; is_big6: boolean; seasons_active: number }[])]
  .sort((a, b) => b.final_elo - a.final_elo)
const summary = balanced.summary as unknown as { basket_final: number; basket_multiple: number; avg_annual: number; median_annual: number; best_total: { team: string; value: number }; best_annual: { team: string; value: number } }

/* ── Table of Contents ── */
const TOC = [
  { id: 'abstract', num: '', label: 'Abstract' },
  { id: 'introduction', num: '1', label: 'Introduction' },
  { id: 'architecture', num: '2', label: 'System Architecture: Triple-Layer Pipeline' },
  { id: 'svi', num: '3', label: 'Sporting Value Index (SVI)' },
  { id: 'nav', num: '4', label: 'NAV Computation & Dual Price Structure' },
  { id: 'asset-basket', num: '5', label: 'L1 Asset Basket' },
  { id: 'clearinghouse', num: '6', label: 'Clearinghouse Mechanism' },
  { id: 'supply', num: '7', label: 'Token Supply Model' },
  { id: 'backtest', num: '8', label: 'Backtest Validation' },
  { id: 'risk', num: '9', label: 'Risk Analysis' },
  { id: 'regulatory', num: '10', label: 'Regulatory Framework' },
  { id: 'conclusion', num: '11', label: 'Conclusion' },
  { id: 'questions', num: '', label: 'Appendix: Open Questions' },
]

export default function Whitepaper() {
  const [lang, setLang] = useState<Lang>('en')

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-[900px] mx-auto flex items-center justify-between px-6 h-12">
          <span className="text-sm font-mono text-muted-foreground">ETB Whitepaper v0.9</span>
          <button
            onClick={() => setLang(l => l === 'en' ? 'kr' : 'en')}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className={lang === 'en' ? 'text-primary font-bold' : ''}>EN</span>
            <span className="text-border">/</span>
            <span className={lang === 'kr' ? 'text-primary font-bold' : ''}>KR</span>
          </button>
        </div>
      </nav>

      <article className="max-w-[900px] mx-auto px-6 pt-20 pb-24">
        {/* Title */}
        <header className="text-center mb-16 pb-12 border-b border-border">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
            {t(
              'Exchange-Traded Betting (ETB): A Framework for Asset-Backed Sports Investment',
              'Exchange-Traded Betting (ETB): 자산 담보 스포츠 투자 프레임워크',
              lang,
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-4 italic">
            {t(
              '"If value moves, you should be able to invest in it."',
              '"가치가 움직인다면, 투자할 수 있어야 한다."',
              lang,
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-6">
            v0.9 Draft — April 2026
          </p>
        </header>

        {/* TOC */}
        <section className="mb-16">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">{t('Table of Contents', '목차', lang)}</h2>
          <div className="space-y-1.5">
            {TOC.map(item => (
              <a key={item.id} href={`#${item.id}`} className="flex items-baseline gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                {item.num && <span className="font-mono text-xs text-primary/50 w-6">{item.num}.</span>}
                {!item.num && <span className="w-6" />}
                <span className="group-hover:underline">{item.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ═══ ABSTRACT ═══ */}
        <Section id="abstract" title={t('Abstract', '초록', lang)}>
          <P lang={lang}
            en="We propose Exchange-Traded Betting (ETB), a financial instrument that transforms sports team performance into investable, asset-backed tokens. Each team token derives its Net Asset Value (NAV) from a Sporting Value Index (SVI) — a proprietary rating system calibrated over 884,000 global football matches — which determines the token's proportional claim on a diversified reserve basket comprising US/UK government bonds, Nasdaq-100 ETF, fan tokens, and sports prediction market revenue."
            kr="우리는 Exchange-Traded Betting (ETB)을 제안한다. 이는 스포츠 팀 성과를 투자 가능한 자산 담보 토큰으로 전환하는 금융 상품이다. 각 팀 토큰의 순자산가치(NAV)는 Sporting Value Index(SVI) — 884,000건의 글로벌 축구 경기로 보정된 독점 레이팅 시스템 — 에서 도출되며, 이는 미/영 국채, Nasdaq-100 ETF, 팬 토큰, 스포츠 프리딕션 마켓 수익으로 구성된 분산 준비금 바스켓에 대한 토큰의 비례적 청구권을 결정한다."
          />
          <P lang={lang}
            en="Unlike traditional ETFs, ETB operates without Authorized Participants (APs). Market prices are not mechanically pegged to NAV. Instead, NAV serves as the intrinsic floor value determined algorithmically by match outcomes, while market price reflects investor expectations — creating a dual price structure analogous to price-to-earnings ratios in equity markets. A Clearinghouse mechanism with a 5% reserve buffer absorbs the impact of unlisted team matches, validated across 305,444 simulated matches with zero negative events."
            kr="전통적 ETF와 달리 ETB는 지정참가회사(AP) 없이 운영된다. 시장 가격은 NAV에 기계적으로 고정되지 않는다. 대신 NAV는 경기 결과에 의해 알고리즘적으로 결정되는 내재 하한 가치로 기능하고, 시장가는 투자자 기대를 반영한다 — 주식시장의 주가수익비율(PER)과 유사한 이중 가격 구조를 형성한다. 5% 준비금 버퍼를 갖춘 청산소 메커니즘이 비상장 팀 경기의 영향을 흡수하며, 305,444건의 시뮬레이션 경기에서 부정적 이벤트 0건으로 검증되었다."
          />
          <P lang={lang}
            en={`Backtesting over 32 EPL seasons (1993–2025) across 51 teams demonstrates a reserve basket multiple of ${summary.basket_multiple}x ($10M → $${(summary.basket_final / 1e6).toFixed(1)}M), average annual returns of +${summary.avg_annual.toFixed(1)}%, and consistent positive NAV trajectories for all participating teams.`}
            kr={`51개 팀을 대상으로 한 32시즌(1993–2025) EPL 백테스트에서 준비금 바스켓 ${summary.basket_multiple}배 성장($10M → $${(summary.basket_final / 1e6).toFixed(1)}M), 평균 연수익률 +${summary.avg_annual.toFixed(1)}%, 참여 전 팀의 일관된 양(+)의 NAV 궤적이 입증되었다.`}
          />
        </Section>

        {/* ═══ 1. INTRODUCTION ═══ */}
        <Section id="introduction" num="1" title={t('Introduction', '서론', lang)}>
          <H3 lang={lang} en="1.1 Problem Statement" kr="1.1 문제 정의" />
          <P lang={lang}
            en="The global sports industry generates over $500 billion in annual revenue, yet offers no accessible mechanism for investing in team-level sporting performance. Four structural barriers prevent this market from forming:"
            kr="글로벌 스포츠 산업은 연간 5,000억 달러 이상의 수익을 창출하지만, 팀 수준의 스포츠 성과에 투자할 수 있는 접근 가능한 메커니즘을 제공하지 않는다. 네 가지 구조적 장벽이 이 시장의 형성을 방해한다:"
          />
          <P lang={lang}
            en="(1) Access Barrier — Club ownership requires hundreds of millions in capital, restricting participation to ultra-high-net-worth individuals. The average fan has no investment pathway. (2) Scarcity of Listed Instruments — Of 500+ professional football clubs globally, fewer than 20 are publicly traded, and those listings reflect corporate governance dynamics rather than sporting performance. (3) Performance-Price Disconnect — Manchester United (NYSE: MANU) demonstrates the core failure: its stock price correlates with sponsorship deals, ownership changes, and Glazer family dynamics rather than Premier League standings. Winning the league does not reliably increase share price. (4) Prediction Market Limitations — Existing platforms (Polymarket, sports books) offer single-match, binary outcome contracts with 5–15% house edges and zero residual value post-settlement."
            kr="(1) 접근 장벽 — 클럽 소유에는 수억 달러의 자본이 필요하며, 초고액 자산가에게만 참여가 제한된다. 일반 팬에게는 투자 경로가 없다. (2) 상장 종목 부재 — 전 세계 500개 이상의 프로 축구 클럽 중 상장된 곳은 20개 미만이며, 해당 상장은 기업 지배구조 역학을 반영할 뿐 스포츠 성과를 반영하지 않는다. (3) 성적-주가 괴리 — 맨체스터 유나이티드(NYSE: MANU)가 핵심 실패를 보여준다: 주가는 스폰서 계약, 소유권 변동, 글레이저 가문 이슈와 상관관계를 보이며 프리미어리그 순위와는 무관하다. 리그 우승이 주가 상승을 보장하지 않는다. (4) 프리딕션 마켓 한계 — 기존 플랫폼(Polymarket, 스포츠북)은 5–15% 하우스 엣지의 단일 경기 이진 결과 계약을 제공하며, 정산 후 잔여 가치는 제로이다."
          />
          <H3 lang={lang} en="1.2 Proposed Solution" kr="1.2 제안 솔루션" />
          <P lang={lang}
            en="ETB addresses all four barriers by creating team-specific tokens backed by a diversified reserve basket, priced by an algorithmic Sporting Value Index, and traded on an open secondary market without centralized price arbitrage. The name 'Exchange-Traded Betting' deliberately invokes the betting paradigm while structurally eliminating its negative-sum characteristics. The product is not a bet — it is a financial instrument with asset backing, NAV transparency, and compounding yield — but it draws from the same consumer motivation: conviction about sporting outcomes."
            kr="ETB는 분산 준비금 바스켓으로 담보되고, 알고리즘적 Sporting Value Index로 가격이 결정되며, 중앙화된 가격 차익거래 없이 공개 세컨더리 마켓에서 거래되는 팀 특정 토큰을 생성하여 네 가지 장벽을 모두 해결한다. 'Exchange-Traded Betting'이라는 이름은 의도적으로 베팅 패러다임을 환기하면서도 그 음의 합(negative-sum) 특성을 구조적으로 제거한다. 이 상품은 베팅이 아니다 — 자산 담보, NAV 투명성, 복리 수익을 갖춘 금융 상품이다 — 그러나 동일한 소비자 동기, 즉 스포츠 결과에 대한 확신에서 출발한다."
          />
        </Section>

        {/* ═══ 2. ARCHITECTURE ═══ */}
        <Section id="architecture" num="2" title={t('System Architecture: Triple-Layer Pipeline', '시스템 아키텍처: Triple-Layer Pipeline', lang)}>
          <P lang={lang}
            en="ETB is organized into three distinct, independently auditable layers. This separation ensures that asset custody (L1), value computation (L2), and price discovery (L3) cannot corrupt each other."
            kr="ETB는 세 개의 독립적이고 각각 감사 가능한 계층으로 구성된다. 이 분리는 자산 수탁(L1), 가치 산정(L2), 가격 발견(L3)이 서로를 오염시킬 수 없도록 보장한다."
          />
          <div className="my-6 rounded-lg border border-border bg-card p-5 font-mono text-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-accent font-bold w-8">L1</span>
              <span className="text-foreground">Asset Basket (Primary Market)</span>
              <span className="text-muted-foreground text-xs ml-auto">{t('Custody & Yield', '수탁 & 수익', lang)}</span>
            </div>
            <div className="flex items-center gap-3 pl-4 text-muted-foreground text-xs">↓ {t('Capital flows into diversified reserve', '자본이 분산 준비금으로 유입', lang)}</div>
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold w-8">L2</span>
              <span className="text-foreground">Settlement Engine (SVI)</span>
              <span className="text-muted-foreground text-xs ml-auto">{t('NAV Computation', 'NAV 산정', lang)}</span>
            </div>
            <div className="flex items-center gap-3 pl-4 text-muted-foreground text-xs">↓ {t('Match results update SVI → NAV per token', '경기 결과가 SVI 업데이트 → 토큰당 NAV', lang)}</div>
            <div className="flex items-center gap-3">
              <span className="text-warning font-bold w-8">L3</span>
              <span className="text-foreground">Secondary Market (Price Discovery)</span>
              <span className="text-muted-foreground text-xs ml-auto">{t('No AP', 'AP 없음', lang)}</span>
            </div>
          </div>
          <P lang={lang}
            en="Layer 1 (Asset Basket) holds all deposited capital in a diversified basket of financial instruments. This layer is the sole source of intrinsic value for all team tokens. Layer 2 (Settlement Engine) operates the Sporting Value Index, which processes match results and computes each team's proportional claim on L1 assets. This output is the NAV. Layer 3 (Secondary Market) is where investors trade team tokens. Critically, there is no Authorized Participant mechanism to force market prices toward NAV. Price deviation from NAV is a feature, not a bug — it represents the market's forward-looking assessment of a team's future performance, analogous to the price-to-earnings ratio in equity markets."
            kr="Layer 1(Asset Basket)은 모든 예치 자본을 금융 상품의 분산 바스켓에 보유한다. 이 계층은 모든 팀 토큰의 유일한 내재 가치 원천이다. Layer 2(Settlement Engine)는 Sporting Value Index를 운영하며, 경기 결과를 처리하고 L1 자산에 대한 각 팀의 비례적 청구권을 산정한다. 이 출력이 NAV이다. Layer 3(Secondary Market)에서 투자자들이 팀 토큰을 거래한다. 결정적으로, 시장 가격을 NAV로 수렴시키는 지정참가회사(AP) 메커니즘이 없다. NAV로부터의 가격 이탈은 버그가 아니라 기능이다 — 주식시장의 주가수익비율(PER)과 유사하게, 팀의 미래 성과에 대한 시장의 전망적 평가를 나타낸다."
          />
        </Section>

        {/* ═══ 3. SVI ═══ */}
        <Section id="svi" num="3" title={t('Sporting Value Index (SVI)', 'Sporting Value Index (SVI)', lang)}>
          <H3 lang={lang} en="3.1 Methodology" kr="3.1 방법론" />
          <P lang={lang}
            en="The SVI is a modified ELO rating system extended with dynamic K-value calibration and tournament weighting. For each match between teams A and B, the expected outcome is computed as:"
            kr="SVI는 동적 K-value 보정과 대회 가중치가 확장된 수정 ELO 레이팅 시스템이다. 팀 A와 B 사이의 각 경기에서 예상 결과는 다음과 같이 계산된다:"
          />
          <Formula text="E_A = 1 / (1 + 10^((SVI_B - SVI_A) / 400))" />
          <P lang={lang}
            en="After the match, the SVI update is:"
            kr="경기 후 SVI 업데이트:"
          />
          <Formula text="SVI_A' = SVI_A + K × W_t × (S_A - E_A)" />
          <P lang={lang}
            en="Where K is the dynamic K-factor (adjusted by match importance, team history, and rating stability), W_t is the tournament weight (Champions League > domestic league > friendly), and S_A is the actual result (1 for win, 0.5 for draw, 0 for loss)."
            kr="여기서 K는 동적 K 인자(경기 중요도, 팀 이력, 레이팅 안정성에 의해 조정), W_t는 대회 가중치(챔피언스리그 > 국내리그 > 친선경기), S_A는 실제 결과(승 1, 무 0.5, 패 0)이다."
          />
          <H3 lang={lang} en="3.2 Backtesting Parameters" kr="3.2 백테스팅 매개변수" />
          <div className="my-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  [t('Dataset', '데이터셋', lang), t('884,000+ global football matches', '884,000건 이상 글로벌 축구 경기', lang)],
                  [t('EPL Backtest', 'EPL 백테스트', lang), t('12,234 matches, 51 teams, 32 seasons (1993–2025)', '12,234 경기, 51팀, 32시즌 (1993–2025)', lang)],
                  [t('Global Simulation', '글로벌 시뮬레이션', lang), t('305,444 matches, 106 listed teams (2000–2025)', '305,444 경기, 106 상장팀 (2000–2025)', lang)],
                  [t('Initial SVI', '초기 SVI', lang), '1500'],
                  [t('Encoding', '인코딩', lang), 'Latin-1 (total_game.csv)'],
                ].map(([k, v], i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2 text-muted-foreground font-medium w-1/3">{k}</td>
                    <td className="px-4 py-2 font-mono text-foreground">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H3 lang={lang} en="3.3 EPL Big 6 Results" kr="3.3 EPL Big 6 결과" />
          <div className="my-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2">{t('Team', '팀', lang)}</th>
                  <th className="text-right px-4 py-2">{t('Final SVI', '최종 SVI', lang)}</th>
                  <th className="text-right px-4 py-2">{t('Total Return', '총 수익률', lang)}</th>
                  <th className="text-right px-4 py-2">{t('Annual', '연간', lang)}</th>
                  <th className="text-right px-4 py-2">{t('Seasons', '시즌', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {big6Returns.map(r => (
                  <tr key={r.team} className="border-b border-border/50">
                    <td className="px-4 py-2 text-foreground">{r.team}</td>
                    <td className="px-4 py-2 text-right font-mono">{r.final_elo.toFixed(0)}</td>
                    <td className="px-4 py-2 text-right font-mono text-gain">+{r.total_return_pct.toFixed(1)}%</td>
                    <td className="px-4 py-2 text-right font-mono text-gain">+{r.annual_return_pct.toFixed(1)}%</td>
                    <td className="px-4 py-2 text-right font-mono text-muted-foreground">{r.seasons_active}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Question lang={lang}
            en="Q3.1: How exactly does betting odds calibration integrate with the ELO K-value? Does the SVI formula incorporate pre-match odds as a Bayesian prior, or as a post-hoc correction factor? What is the mathematical relationship: SVI = f(ELO, odds), or are odds used only for K-value adjustment?"
            kr="Q3.1: 배당률 보정이 ELO K-value와 정확히 어떻게 통합되는가? SVI 공식이 경기 전 배당률을 베이지안 사전 확률로 포함하는가, 아니면 사후 보정 인자로 사용하는가? 수학적 관계는: SVI = f(ELO, odds)인가, 아니면 배당률이 K-value 조정에만 사용되는가?"
          />
          <Question lang={lang}
            en="Q3.2: What are the specific K-value ranges? Bitcoin whitepaper defined exact parameters. We need: K_base, K_min, K_max, and the functional form of K(match_importance, rating_stability)."
            kr="Q3.2: 구체적인 K-value 범위는? 비트코인 백서는 정확한 매개변수를 정의했다. 필요: K_base, K_min, K_max, 그리고 K(경기중요도, 레이팅안정성)의 함수 형태."
          />
        </Section>

        {/* ═══ 4. NAV ═══ */}
        <Section id="nav" num="4" title={t('NAV Computation & Dual Price Structure', 'NAV 산정 및 이중 가격 구조', lang)}>
          <H3 lang={lang} en="4.1 NAV Formula" kr="4.1 NAV 공식" />
          <Formula text="NAV_i = (SVI_i / Σ SVI_j) × L1_Total_Assets / Supply_i" />
          <P lang={lang}
            en="Where NAV_i is the per-token net asset value for team i, SVI_i is the team's current Sporting Value Index, the summation runs over all listed teams j, L1_Total_Assets is the total value of the Layer 1 Asset Basket, and Supply_i is the token supply for team i."
            kr="여기서 NAV_i는 팀 i의 토큰당 순자산가치, SVI_i는 해당 팀의 현재 Sporting Value Index, 합산은 모든 상장 팀 j에 대해 수행, L1_Total_Assets는 Layer 1 Asset Basket의 총가치, Supply_i는 팀 i의 토큰 공급량이다."
          />
          <P lang={lang}
            en="NAV updates occur after every match that involves a listed team. The causal chain is: Match Result → SVI Update → Reserve Share Reallocation → NAV Change."
            kr="NAV 업데이트는 상장 팀이 참여하는 모든 경기 후 발생한다. 인과 체인: 경기 결과 → SVI 업데이트 → 준비금 지분 재배분 → NAV 변동."
          />

          <H3 lang={lang} en="4.2 Dual Price Structure" kr="4.2 이중 가격 구조" />
          <P lang={lang}
            en="ETB deliberately operates without Authorized Participants. In traditional ETFs, APs arbitrage away price-NAV deviations through creation/redemption of shares. ETB instead allows the market price P_i to float freely around NAV_i:"
            kr="ETB는 의도적으로 지정참가회사(AP) 없이 운영된다. 전통적 ETF에서 AP는 주식 생성/환매를 통해 가격-NAV 편차를 차익거래한다. ETB는 대신 시장 가격 P_i가 NAV_i 주변에서 자유롭게 변동하도록 허용한다:"
          />
          <Formula text="P_i = NAV_i × (1 + Premium_i)" />
          <P lang={lang}
            en="Where Premium_i can be positive (bullish conviction) or negative (bearish sentiment). This is structurally identical to price-to-book ratios in equity markets. A team with strong recent form, upcoming favorable fixtures, or transfer window acquisitions may trade at a premium. A team facing relegation risk may trade at a discount. The premium/discount itself becomes a tradeable signal."
            kr="여기서 Premium_i는 양수(강세 확신) 또는 음수(약세 심리)가 될 수 있다. 이는 주식시장의 주가순자산비율(PBR)과 구조적으로 동일하다. 최근 폼이 좋거나, 유리한 경기 일정이 다가오거나, 이적 시장 영입이 있는 팀은 프리미엄에 거래될 수 있다. 강등 위험에 처한 팀은 디스카운트에 거래될 수 있다. 프리미엄/디스카운트 자체가 거래 가능한 신호가 된다."
          />

          <Question lang={lang}
            en="Q4.1: Without AP, how are new tokens minted when demand exceeds supply? In ETFs, the AP creation mechanism ensures supply elasticity. What is ETB's primary market mechanism? Can investors deposit directly into L1 and receive tokens (like ETF creation), or is supply fixed at listing?"
            kr="Q4.1: AP 없이, 수요가 공급을 초과할 때 새 토큰은 어떻게 발행되는가? ETF에서 AP 생성 메커니즘이 공급 탄력성을 보장한다. ETB의 프라이머리 마켓 메커니즘은? 투자자가 L1에 직접 예치하고 토큰을 받을 수 있는가(ETF 생성처럼), 아니면 공급량이 상장 시 고정되는가?"
          />
          <Question lang={lang}
            en="Q4.2: If Premium_i persists at extreme levels (e.g., +50% or -30%), what prevents market manipulation or prolonged mispricing? Is there any circuit breaker or disclosure requirement?"
            kr="Q4.2: Premium_i가 극단적 수준(예: +50% 또는 -30%)에서 지속되면, 시장 조작이나 장기 오가격을 방지하는 것은? 서킷 브레이커나 공시 요건이 있는가?"
          />
        </Section>

        {/* ═══ 5. ASSET BASKET ═══ */}
        <Section id="asset-basket" num="5" title={t('L1 Asset Basket', 'L1 Asset Basket', lang)}>
          <P lang={lang}
            en="The Layer 1 Asset Basket is the sole source of intrinsic value. It comprises four asset classes chosen for complementary risk/return profiles:"
            kr="Layer 1 Asset Basket은 유일한 내재 가치 원천이다. 상호 보완적인 위험/수익 프로필을 위해 선택된 네 가지 자산군으로 구성된다:"
          />
          <div className="my-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2">{t('Asset', '자산', lang)}</th>
                  <th className="text-right px-4 py-2">{t('Allocation', '배분', lang)}</th>
                  <th className="text-left px-4 py-2">{t('Role', '역할', lang)}</th>
                  <th className="text-right px-4 py-2">{t('Hist. Return', '과거 수익률', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [t('US/UK Government Bonds', '미/영 국채', lang), '30%', t('Stability, yield floor', '안정성, 수익 하한', lang), '+4.2%/yr'],
                  ['Nasdaq-100 ETF (QQQ)', '35%', t('Long-term growth engine', '장기 성장 엔진', lang), '+12.4%/yr'],
                  [t('Fan Tokens', '팬 토큰', lang), '20%', t('Sports ecosystem correlation', '스포츠 생태계 상관관계', lang), t('Variable', '변동', lang)],
                  [t('Prediction Market Revenue', '프리딕션 마켓 수익', lang), '15%', t('Platform revenue share', '플랫폼 수익 배분', lang), t('Performance-based', '성과 기반', lang)],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2 text-foreground">{row[0]}</td>
                    <td className="px-4 py-2 text-right font-mono text-primary font-bold">{row[1]}</td>
                    <td className="px-4 py-2 text-muted-foreground">{row[2]}</td>
                    <td className="px-4 py-2 text-right font-mono text-gain">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P lang={lang}
            en="The inclusion of Nasdaq-100 ETF is a deliberate departure from conservative ETF structures. Government bonds alone yield ~4% annually. Nasdaq-100 has delivered 12.4% CAGR over the past 20 years. The blended L1 basket is designed to deliver 7–9% annual returns, which compounds as the NAV floor for all tokens."
            kr="Nasdaq-100 ETF의 포함은 보수적 ETF 구조에서의 의도적 이탈이다. 국채만으로는 연 ~4% 수익에 그친다. Nasdaq-100은 지난 20년간 연 12.4% CAGR을 기록했다. 혼합 L1 바스켓은 연 7–9% 수익률을 달성하도록 설계되었으며, 이는 모든 토큰의 NAV 하한으로 복리 축적된다."
          />
          <P lang={lang}
            en="Yield Distribution: 70% of L1 yields are reinvested to compound NAV growth. 30% accrues directly to token holders."
            kr="수익 배분: L1 수익의 70%는 NAV 복리 성장을 위해 재투자된다. 30%는 토큰 보유자에게 직접 귀속된다."
          />

          <Question lang={lang}
            en="Q5.1: 'Fan Tokens' (20% allocation) — which specific fan tokens? Chiliz-based (CHZ)? What happens if the fan token market collapses (as it did in 2022, -80%)? Is there a correlation risk where L1 and L3 values decline simultaneously?"
            kr="Q5.1: '팬 토큰' (20% 배분) — 구체적으로 어떤 팬 토큰? Chiliz 기반(CHZ)? 팬 토큰 시장이 붕괴하면(2022년처럼 -80%) 어떻게 되는가? L1과 L3 가치가 동시에 하락하는 상관관계 위험이 있는가?"
          />
          <Question lang={lang}
            en="Q5.2: 'Prediction Market Revenue' (15%) — is ETB operating its own prediction market, or taking revenue share from external platforms? How is this revenue stream contractually secured? What is the revenue model: fees, spreads, or stake?"
            kr="Q5.2: '프리딕션 마켓 수익' (15%) — ETB가 자체 프리딕션 마켓을 운영하는가, 외부 플랫폼에서 수익 배분을 받는가? 이 수익 흐름은 계약적으로 어떻게 보장되는가? 수익 모델: 수수료, 스프레드, 스테이크?"
          />
          <Question lang={lang}
            en="Q5.3: What is the rebalancing schedule for L1 asset allocation? If Nasdaq-100 outperforms and reaches 50% of L1, is it rebalanced to 35%? What are the tax/transaction cost implications?"
            kr="Q5.3: L1 자산 배분의 리밸런싱 일정은? Nasdaq-100이 아웃퍼폼하여 L1의 50%에 도달하면 35%로 리밸런싱하는가? 세금/거래 비용의 영향은?"
          />
        </Section>

        {/* ═══ 6. CLEARINGHOUSE ═══ */}
        <Section id="clearinghouse" num="6" title={t('Clearinghouse Mechanism', '청산소 메커니즘', lang)}>
          <P lang={lang}
            en="When an unlisted team defeats a listed team, the listed team's SVI decreases, reducing its reserve share. But the value 'lost' has no recipient within the listed pool — it effectively leaks out of the system. The Clearinghouse absorbs this leakage."
            kr="비상장 팀이 상장 팀을 이기면 상장 팀의 SVI가 감소하여 준비금 지분이 줄어든다. 그러나 '손실된' 가치는 상장 풀 내에 수령자가 없다 — 사실상 시스템 밖으로 누출된다. 청산소가 이 누출을 흡수한다."
          />
          <H3 lang={lang} en="6.1 Four Simulation Modes" kr="6.1 네 가지 시뮬레이션 모드" />
          <div className="my-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2">{t('Mode', '모드', lang)}</th>
                  <th className="text-left px-4 py-2">{t('Strategy', '전략', lang)}</th>
                  <th className="text-right px-4 py-2">{t('Avg Token Price', '평균 토큰 가격', lang)}</th>
                  <th className="text-right px-4 py-2">{t('CH Neg Events', 'CH 부정 이벤트', lang)}</th>
                  <th className="text-left px-4 py-2">{t('Verdict', '평가', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['A', t('No Clearinghouse', '청산소 없음', lang), '$0.320', '0', t('No protection against leakage', '누출 보호 없음', lang)],
                  ['B', t('Fixed 5% CH buffer', '고정 5% CH 버퍼', lang), '$0.304', '0', t('Optimal — recommended', '최적 — 권장', lang)],
                  ['C', t('Dynamic ratio by unlisted SVI', '비상장 SVI 비례 동적', lang), '$0.005', '0', t('98.5% absorbed, token ~$0', '98.5% 흡수, 토큰 ~$0', lang)],
                  ['D', t('Ignore unlisted matches', '비상장 경기 무시', lang), '$0.320', '0', t('96% data discarded', '96% 데이터 폐기', lang)],
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-border/50 ${i === 1 ? 'bg-primary/5' : ''}`}>
                    <td className="px-4 py-2 font-mono text-foreground">Sim {row[0]}</td>
                    <td className="px-4 py-2 text-foreground">{row[1]}</td>
                    <td className={`px-4 py-2 text-right font-mono ${i === 2 ? 'text-loss' : 'text-foreground'}`}>{row[2]}</td>
                    <td className="px-4 py-2 text-right font-mono text-gain">{row[3]}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <H3 lang={lang} en="6.2 Optimal Configuration" kr="6.2 최적 구성" />
          <P lang={lang}
            en="CH ratio sweep across 12 configurations (3%–20% × Annual/Quarterly rebalancing) identified 5% quarterly rebalance as optimal: token price $0.3036, minimum safety buffer 4.61%, zero negative events across 25 years. The 5% buffer absorbs ~$1.7M in value leakage from the $33.9M reserve pool."
            kr="12개 구성(3%–20% × 연간/분기별 리밸런싱)에 걸친 CH 비율 스윕에서 5% 분기별 리밸런싱이 최적으로 확인: 토큰 가격 $0.3036, 최소 안전 버퍼 4.61%, 25년간 부정적 이벤트 0건. 5% 버퍼가 $33.9M 준비금 풀에서 ~$1.7M의 가치 누출을 흡수한다."
          />
        </Section>

        {/* ═══ 7. SUPPLY ═══ */}
        <Section id="supply" num="7" title={t('Token Supply Model', '토큰 공급 모델', lang)}>
          <H3 lang={lang} en="7.1 Fixed Supply Problem" kr="7.1 고정 공급 문제" />
          <P lang={lang}
            en="Stress testing revealed that fixed supply (1M tokens per team) causes severe problems when scaling from 20 to 51 listed teams:"
            kr="스트레스 테스트에서 고정 공급(팀당 1M 토큰)이 20팀에서 51팀으로 확장 시 심각한 문제를 야기함을 확인:"
          />
          <div className="my-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2">{t('Issue', '문제', lang)}</th>
                  <th className="text-right px-4 py-2">{t('Severity', '심각도', lang)}</th>
                  <th className="text-left px-4 py-2">{t('Detail', '상세', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [t('NAV Dilution', 'NAV 희석', lang), 'Critical', t('Existing investor NAV drops -56.2% (Liverpool: $7.09 → $3.10)', '기존 투자자 NAV -56.2% 하락 (Liverpool: $7.09 → $3.10)', lang)],
                  [t('Price Uniformity', '가격 균일화', lang), 'Warning', t('Top vs bottom team NAV ratio only 1.6x — insufficient differentiation', '상위 vs 하위 팀 NAV 비율 1.6x에 불과 — 차별화 부족', lang)],
                  [t('Oversupply', '과잉 공급', lang), 'Warning', t('1M tokens for teams with <5 active seasons creates illiquid markets', '5시즌 미만 팀에 1M 토큰은 비유동적 시장 생성', lang)],
                  [t('CH Obsolescence', 'CH 무용화', lang), 'Info', t('With all teams listed, unlisted pool = 0, Clearinghouse becomes dormant', '전체 팀 상장 시 비상장 풀 = 0, 청산소 휴면', lang)],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2 text-foreground">{row[0]}</td>
                    <td className={`px-4 py-2 text-right font-mono text-xs ${row[1] === 'Critical' ? 'text-loss' : row[1] === 'Warning' ? 'text-warning' : 'text-muted-foreground'}`}>{row[1]}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <H3 lang={lang} en="7.2 Proposed Solution: SVI-Proportional Supply" kr="7.2 제안 솔루션: SVI 비례 공급" />
          <Formula text="Supply_i = Supply_max × (SVI_i / SVI_max)" />
          <P lang={lang}
            en="Top-rated team receives 1M tokens; lower-rated teams receive proportionally fewer (bottom team ~600K). Combined with L1 reserve injection at each new listing, this prevents existing investor dilution while maintaining market cap differentiation."
            kr="최고 레이팅 팀이 1M 토큰을 받고, 하위 레이팅 팀은 비례적으로 적게 받는다(최하위 팀 ~600K). 신규 상장 시마다 L1 준비금 주입과 결합하여 기존 투자자 희석을 방지하면서 시가총액 차별화를 유지한다."
          />

          <Question lang={lang}
            en="Q7.1: When SVI changes (team improves/declines), does Supply_i get rebalanced? If Liverpool's SVI drops below Manchester City's, does Liverpool's supply decrease? How are existing token holders affected — forced buyback, dilution, or supply remains static after initial listing?"
            kr="Q7.1: SVI가 변동(팀 향상/하락)하면 Supply_i가 리밸런싱되는가? Liverpool의 SVI가 Manchester City 아래로 떨어지면 Liverpool의 공급량이 감소하는가? 기존 토큰 보유자에게 어떤 영향 — 강제 바이백, 희석, 또는 초기 상장 후 공급량 고정?"
          />
        </Section>

        {/* ═══ 8. BACKTEST ═══ */}
        <Section id="backtest" num="8" title={t('Backtest Validation', '백테스트 검증', lang)}>
          <P lang={lang}
            en={`The balanced basket backtest across 32 EPL seasons yields the following aggregate results:`}
            kr={`32 EPL 시즌에 걸친 균형 바스켓 백테스트의 종합 결과:`}
          />
          <div className="my-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  [t('Initial Reserve', '초기 준비금', lang), '$10,000,000'],
                  [t('Final Reserve', '최종 준비금', lang), `$${(summary.basket_final / 1e6).toFixed(1)}M`],
                  [t('Multiple', '배수', lang), `${summary.basket_multiple}x`],
                  [t('Avg Annual Return', '평균 연수익률', lang), `+${summary.avg_annual.toFixed(2)}%`],
                  [t('Median Annual Return', '중위 연수익률', lang), `+${summary.median_annual.toFixed(2)}%`],
                  [t('Best Total Return', '최고 총수익률', lang), `${summary.best_total.team}: +${summary.best_total.value.toFixed(1)}%`],
                  [t('Best Annual Return', '최고 연수익률', lang), `${summary.best_annual.team}: +${summary.best_annual.value.toFixed(1)}%/yr`],
                  [t('Teams with Positive Return', '양의 수익 팀', lang), `${allReturns.filter(r => r.total_return_pct > 0).length} / ${allReturns.length}`],
                  [t('Negative NAV Events', '부정적 NAV 이벤트', lang), '0'],
                ].map(([k, v], i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2 text-muted-foreground w-1/2">{k}</td>
                    <td className="px-4 py-2 font-mono text-foreground font-bold">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ═══ 9. RISK ═══ */}
        <Section id="risk" num="9" title={t('Risk Analysis', '위험 분석', lang)}>
          <P lang={lang}
            en="Key risk factors and mitigations:"
            kr="주요 위험 요인 및 완화:"
          />
          {[
            {
              risk: t('L1 Asset Drawdown', 'L1 자산 하락', lang),
              desc: t('Nasdaq-100 can drop 30%+ in a recession. With 35% allocation, L1 could lose 10%+ in a single year.', 'Nasdaq-100은 경기침체 시 30% 이상 하락 가능. 35% 배분으로 L1이 단일 연도에 10% 이상 손실 가능.', lang),
              mitigation: t('Bond allocation (30%) provides counter-cyclical buffer. Historical worst case: 2008 balanced basket still recovered within 3 years.', '국채 배분(30%)이 반경기적 버퍼 제공. 역사적 최악: 2008년 균형 바스켓도 3년 내 회복.', lang),
            },
            {
              risk: t('Liquidity Risk', '유동성 위험', lang),
              desc: t('Low-popularity teams may have thin order books. Without AP, extreme spreads can form.', '저인기 팀은 얇은 오더북 가능. AP 없이 극단적 스프레드 형성 가능.', lang),
              mitigation: t('[REQUIRES FOUNDER INPUT — see Q9.1]', '[설립자 입력 필요 — Q9.1 참조]', lang),
            },
            {
              risk: t('Oracle Risk', '오라클 위험', lang),
              desc: t('Match results must be fed into L2 accurately. Incorrect or delayed data corrupts SVI.', '경기 결과가 L2에 정확히 입력되어야 함. 부정확하거나 지연된 데이터가 SVI를 오염.', lang),
              mitigation: t('[REQUIRES FOUNDER INPUT — see Q9.2]', '[설립자 입력 필요 — Q9.2 참조]', lang),
            },
            {
              risk: t('Regulatory Risk', '규제 위험', lang),
              desc: t('Classification as gambling vs financial product determines applicable regulations.', '도박 vs 금융상품 분류가 적용 가능한 규제를 결정.', lang),
              mitigation: t('Asset-backed structure with NAV transparency positions ETB as a financial product, not a bet. See Section 10.', '자산 담보 구조와 NAV 투명성이 ETB를 베팅이 아닌 금융상품으로 포지셔닝. 10장 참조.', lang),
            },
          ].map((item, i) => (
            <div key={i} className="my-4 rounded-lg border border-border p-4">
              <p className="text-sm font-bold text-foreground mb-1">{item.risk}</p>
              <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
              <p className="text-xs text-primary"><span className="font-medium">{t('Mitigation:', '완화:', lang)}</span> {item.mitigation}</p>
            </div>
          ))}
          <Question lang={lang}
            en="Q9.1: Without AP, who provides initial liquidity for newly listed teams? Is there a designated market maker? What prevents extreme illiquidity for low-interest teams?"
            kr="Q9.1: AP 없이, 신규 상장 팀의 초기 유동성은 누가 제공하는가? 지정 마켓 메이커가 있는가? 저관심 팀의 극단적 비유동성을 방지하는 것은?"
          />
          <Question lang={lang}
            en="Q9.2: How are match results fed into the SVI engine? What is the oracle mechanism? Multiple data sources with consensus? What happens if a match result is disputed (VAR controversy, abandoned match)?"
            kr="Q9.2: 경기 결과가 SVI 엔진에 어떻게 입력되는가? 오라클 메커니즘은? 합의를 통한 다중 데이터 소스? 경기 결과가 분쟁 중이면(VAR 논란, 경기 중단) 어떻게 되는가?"
          />
          <Question lang={lang}
            en="Q9.3: Settlement timing — when a match ends, how quickly does SVI update? Real-time? End of matchday? What about 10+ matches occurring simultaneously on the last day of the season?"
            kr="Q9.3: 정산 타이밍 — 경기 종료 후 SVI 업데이트 속도? 실시간? 경기일 종료 시? 시즌 최종일에 10개 이상 경기가 동시에 진행되는 경우?"
          />
        </Section>

        {/* ═══ 10. REGULATORY ═══ */}
        <Section id="regulatory" num="10" title={t('Regulatory Framework', '규제 프레임워크', lang)}>
          <P lang={lang}
            en="ETB's regulatory classification hinges on a key distinction: the product is asset-backed with transparent NAV, unlike prediction markets which are zero-sum. The regulatory thesis:"
            kr="ETB의 규제 분류는 핵심 구분에 달려 있다: 제로섬인 프리딕션 마켓과 달리 이 상품은 투명한 NAV를 갖춘 자산 담보 상품이다. 규제 논리:"
          />
          <div className="my-4 space-y-2">
            {[
              t('(1) ETB tokens have intrinsic value (NAV floor from L1 assets) — unlike bets which have zero residual value post-settlement.', '(1) ETB 토큰은 내재 가치(L1 자산의 NAV 하한)를 보유 — 정산 후 잔여 가치가 제로인 베팅과 다름.', lang),
              t('(2) Returns are partially driven by L1 asset performance (Treasuries, Nasdaq-100), not purely by sporting outcome — this is investment, not gambling.', '(2) 수익의 일부가 스포츠 결과만이 아닌 L1 자산 성과(국채, Nasdaq-100)에 의해 구동 — 이는 투자이지 도박이 아님.', lang),
              t('(3) The dual price structure mirrors equity markets, not betting markets.', '(3) 이중 가격 구조는 베팅 시장이 아닌 주식시장을 반영.', lang),
              t('(4) Yield distribution (70/30) is structurally similar to REIT dividend requirements.', '(4) 수익 배분(70/30)은 구조적으로 REIT 배당 요건과 유사.', lang),
            ].map((item, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">{item}</p>
            ))}
          </div>
          <Question lang={lang}
            en="Q10.1: What is the target regulatory jurisdiction? UK FCA, EU MiFID II, US SEC, Korea FSC? Each has fundamentally different frameworks for novel financial instruments. The whitepaper needs a specific regulatory path, not a general thesis."
            kr="Q10.1: 목표 규제 관할권은? UK FCA, EU MiFID II, US SEC, 한국 FSC? 각각 신규 금융 상품에 대해 근본적으로 다른 프레임워크를 가짐. 백서에는 일반 논리가 아닌 구체적 규제 경로가 필요."
          />
          <Question lang={lang}
            en="Q10.2: Is ETB a collective investment scheme (like a fund), a derivative, or a security? This determines KYC/AML requirements, investor protections, and licensing needs."
            kr="Q10.2: ETB는 집합투자기구(펀드처럼), 파생상품, 또는 증권 중 무엇인가? 이것이 KYC/AML 요건, 투자자 보호, 라이선스 필요성을 결정."
          />
          <Question lang={lang}
            en="Q10.3: ETB's fee structure — management fees on L1? Transaction fees on L3? This is critical for both regulatory classification and business model viability."
            kr="Q10.3: ETB의 수수료 구조 — L1 운용 수수료? L3 거래 수수료? 이는 규제 분류와 비즈니스 모델 실현 가능성 모두에 핵심."
          />
        </Section>

        {/* ═══ 11. CONCLUSION ═══ */}
        <Section id="conclusion" num="11" title={t('Conclusion', '결론', lang)}>
          <P lang={lang}
            en="Exchange-Traded Betting proposes a fundamentally new asset class: sports performance as a financial instrument. The Triple-Layer Pipeline separates concerns cleanly. The Sporting Value Index provides objective, backtested valuation. The dual price structure (NAV + market premium) creates a genuine investment market rather than a betting platform. 32 seasons of EPL backtest data demonstrate consistent returns, and the Clearinghouse mechanism ensures system integrity when unlisted teams interact with the listed pool."
            kr="Exchange-Traded Betting은 근본적으로 새로운 자산군, 즉 금융 상품으로서의 스포츠 성과를 제안한다. Triple-Layer Pipeline이 관심사를 깔끔하게 분리한다. Sporting Value Index가 객관적이고 백테스트된 밸류에이션을 제공한다. 이중 가격 구조(NAV + 시장 프리미엄)가 베팅 플랫폼이 아닌 진정한 투자 시장을 창출한다. 32시즌 EPL 백테스트 데이터가 일관된 수익을 증명하며, 청산소 메커니즘이 비상장 팀이 상장 풀과 상호작용할 때 시스템 무결성을 보장한다."
          />
          <P lang={lang}
            en="Key open questions remain around primary market mechanics (token creation without AP), oracle infrastructure, regulatory jurisdiction selection, and fee structure. These are addressed in the Appendix and will be resolved in v1.0."
            kr="프라이머리 마켓 메커니즘(AP 없는 토큰 생성), 오라클 인프라, 규제 관할권 선택, 수수료 구조에 대한 핵심 미결 질문이 남아 있다. 이들은 부록에서 다루어지며 v1.0에서 해결될 예정이다."
          />
        </Section>

        {/* ═══ APPENDIX: QUESTIONS ═══ */}
        <Section id="questions" title={t('Appendix: Open Questions for v1.0', '부록: v1.0을 위한 미결 질문', lang)}>
          <P lang={lang}
            en="The following questions represent logic gaps that must be resolved to achieve Bitcoin whitepaper-level rigor. Each question maps to a specific section."
            kr="다음 질문들은 비트코인 백서 수준의 엄밀성을 달성하기 위해 반드시 해결되어야 하는 논리적 공백이다. 각 질문은 특정 섹션에 매핑된다."
          />
          <div className="my-6 space-y-4">
            {[
              { section: '§3 SVI', q: lang === 'en' ? 'Q3.1 — Exact mathematical integration of betting odds into SVI formula.' : 'Q3.1 — SVI 공식에 배당률의 정확한 수학적 통합.' },
              { section: '§3 SVI', q: lang === 'en' ? 'Q3.2 — Specific K-value ranges and functional forms.' : 'Q3.2 — 구체적 K-value 범위와 함수 형태.' },
              { section: '§4 NAV', q: lang === 'en' ? 'Q4.1 — Primary market token creation/redemption mechanism without AP.' : 'Q4.1 — AP 없는 프라이머리 마켓 토큰 생성/환매 메커니즘.' },
              { section: '§4 NAV', q: lang === 'en' ? 'Q4.2 — Circuit breaker / guardrails for extreme premium/discount.' : 'Q4.2 — 극단적 프리미엄/디스카운트에 대한 서킷 브레이커/가드레일.' },
              { section: '§5 L1', q: lang === 'en' ? 'Q5.1 — Fan token specification and correlation risk.' : 'Q5.1 — 팬 토큰 명세 및 상관관계 위험.' },
              { section: '§5 L1', q: lang === 'en' ? 'Q5.2 — Prediction market revenue model and contractual structure.' : 'Q5.2 — 프리딕션 마켓 수익 모델 및 계약 구조.' },
              { section: '§5 L1', q: lang === 'en' ? 'Q5.3 — L1 rebalancing schedule and cost implications.' : 'Q5.3 — L1 리밸런싱 일정 및 비용 영향.' },
              { section: '§7 Supply', q: lang === 'en' ? 'Q7.1 — Supply adjustment mechanics when SVI changes post-listing.' : 'Q7.1 — 상장 후 SVI 변동 시 공급량 조정 메커니즘.' },
              { section: '§9 Risk', q: lang === 'en' ? 'Q9.1 — Initial liquidity provision and market making without AP.' : 'Q9.1 — AP 없는 초기 유동성 제공 및 마켓 메이킹.' },
              { section: '§9 Risk', q: lang === 'en' ? 'Q9.2 — Oracle mechanism for match result data feed.' : 'Q9.2 — 경기 결과 데이터 피드의 오라클 메커니즘.' },
              { section: '§9 Risk', q: lang === 'en' ? 'Q9.3 — Settlement timing and simultaneous match handling.' : 'Q9.3 — 정산 타이밍 및 동시 경기 처리.' },
              { section: '§10 Reg', q: lang === 'en' ? 'Q10.1 — Target regulatory jurisdiction and specific licensing path.' : 'Q10.1 — 목표 규제 관할권 및 구체적 라이선스 경로.' },
              { section: '§10 Reg', q: lang === 'en' ? 'Q10.2 — Product classification (CIS, derivative, security).' : 'Q10.2 — 상품 분류 (CIS, 파생상품, 증권).' },
              { section: '§10 Reg', q: lang === 'en' ? 'Q10.3 — Fee structure (L1 management, L3 transaction).' : 'Q10.3 — 수수료 구조 (L1 운용, L3 거래).' },
              { section: t('General', '일반', lang), q: lang === 'en' ? 'Q.G1 — Governance: who decides to add new leagues/teams? Who manages L1 basket? DAO or centralized?' : 'Q.G1 — 거버넌스: 신규 리그/팀 추가 결정 주체? L1 바스켓 관리 주체? DAO 또는 중앙화?' },
              { section: t('General', '일반', lang), q: lang === 'en' ? 'Q.G2 — Cross-league SVI normalization when expanding to La Liga, Bundesliga.' : 'Q.G2 — 라리가, 분데스리가 확장 시 크로스리그 SVI 정규화.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-xs font-mono text-primary/50 shrink-0 w-20 pt-0.5">{item.section}</span>
                <span className="text-muted-foreground">{item.q}</span>
              </div>
            ))}
          </div>
        </Section>

      </article>
    </div>
  )
}

/* ── Sub-components ── */

function Section({ id, num, title, children }: { id: string; num?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-16">
      <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
        {num && <span className="font-mono text-primary mr-2">{num}.</span>}
        {title}
      </h2>
      {children}
    </section>
  )
}

function H3({ lang, en, kr }: { lang: Lang; en: string; kr: string }) {
  return <h3 className="text-sm font-bold text-foreground mt-6 mb-3">{lang === 'en' ? en : kr}</h3>
}

function P({ lang, en, kr }: { lang: Lang; en: string; kr: string }) {
  return <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-justify">{lang === 'en' ? en : kr}</p>
}

function Formula({ text }: { text: string }) {
  return (
    <div className="my-4 rounded-lg bg-secondary/50 border border-border p-4 font-mono text-sm text-center text-primary">
      {text}
    </div>
  )
}

function Question({ lang, en, kr }: { lang: Lang; en: string; kr: string }) {
  return (
    <div className="my-4 rounded-lg border border-warning/30 bg-warning/5 p-4">
      <p className="text-xs text-warning font-bold mb-1">OPEN QUESTION</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{lang === 'en' ? en : kr}</p>
    </div>
  )
}
