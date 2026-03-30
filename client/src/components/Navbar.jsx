// useState manages whether the mobile menu is open
// useEffect runs when the page loads to check if the user is logged in
import { useState, useEffect } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  // stores the logged in users info from localStorage
  const [user, setUser] = useState(null)

  // when the navbar loads check if there is a token in localStorage
  // if there is a token the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const role = localStorage.getItem('role')
    if (token && username) {
      setUser({ token, username, role })
    }
  }, [])

  // logs the user out by removing their info from localStorage
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* logo */}
        <div className="navbar-logo">🌿 Descubre Colombia</div>

        {/* desktop links */}
        <div className="navbar-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/explore" className="nav-link">Explore</a>
          <a href="/planner" className="nav-link">Trip Planner</a>

          {/* show different links based on login state */}
          {user ? (
            <>
              {/* hosts see host dashboard, users see account */}
              {user.role === 'host' ? (
                <a href="/host-dashboard" className="nav-link">Dashboard</a>
              ) : (
                <a href="/account" className="nav-link">Dashboard</a>
              )}
              {/* logout button with proper contrast */}
              <button className="btn-nav-outline" onClick={handleLogout}>
              Log Out
            </button>
            </>
          ) : (
            <>
              <a href="/login" className="btn-nav-outline">Sign In</a>
              <a href="/login?mode=register" className="btn-nav-primary">Sign Up</a>
            </>
          )}
        </div>

        {/* burger for mobile */}
        <button
          className={`burger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/explore" className="mobile-link" onClick={() => setMenuOpen(false)}>Explore</a>
          <a href="/planner" className="mobile-link" onClick={() => setMenuOpen(false)}>Trip Planner</a>

          {user ? (
            <>
              {user.role === 'host' ? (
                <a href="/host-dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</a>
              ) : (
                <a href="/account" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</a>
              )}
              <button
                className="mobile-link"
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', textAlign: 'left', color: 'rgba(255,255,255,0.9)', cursor: 'pointer' }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign In</a>
              <a href="/login?mode=register" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign Up</a>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar