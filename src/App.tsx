import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PortfolioPage from './pages/PortfolioPage'
import GroupCode from './pages/GroupCode'
import TerminalPortfolio from './pages/TerminalPortfolio'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TerminalPortfolio />} />
      <Route path="/classic" element={<HomePage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/groupcode" element={<GroupCode />} />
    </Routes>
  )
}
