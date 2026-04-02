import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import TopBar from '@/components/TopBar'
import Dashboard from '@/pages/Landing'
import Markets from '@/pages/Markets'
import TeamDetail from '@/pages/TeamDetail'
import Reserve from '@/pages/Reserve'
import Simulation from '@/pages/Simulation'
import IRDeck from '@/pages/IRDeck'

function AppLayout() {
  const location = useLocation()
  const hideTopBar = location.pathname === '/ir'

  return (
    <>
      {!hideTopBar && <TopBar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/team/:id" element={<TeamDetail />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/ir" element={<IRDeck />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  )
}
