import { HashRouter, Route, Routes } from 'react-router-dom'
import TopBar from '@/components/TopBar'
import Dashboard from '@/pages/Landing'
import Markets from '@/pages/Markets'
import TeamDetail from '@/pages/TeamDetail'
import Reserve from '@/pages/Reserve'
import Clearinghouse from '@/pages/Clearinghouse'

export default function App() {
  return (
    <HashRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/team/:id" element={<TeamDetail />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/clearinghouse" element={<Clearinghouse />} />
      </Routes>
    </HashRouter>
  )
}
