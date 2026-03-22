import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Explore from './pages/Explore'
import Planner from './pages/Planner'
import Footer from './components/Footer'
import Account from './pages/Account'
import HostDashboard from './pages/HostDashboard'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/account" element={<Account />} />
        <Route path="/host-dashboard" element={<HostDashboard />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App