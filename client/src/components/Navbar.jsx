// useState manages whether the mobile menu is open
// useEffect runs when the page loads to check if the user is logged in
import { useState, useEffect } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  // stores the logged in users info from localStorage
  // localStorage is where I saved the token and username after login
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
        <div className="navbar-logo">🌿 Explore Colombia</div>

        {/* desktop links */}
        <div className="navbar-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/explore" className="nav-link">Explore</a>
          <a href="/planner" className="nav-link">Trip Planner</a>

          {/* if logged in show username and logout, if not show sign in and sign up */}
          {user ? (
            <>
              {/* show host dashboard link if the user is a host */}
              {user.role === 'host' && (
                <a href="/host-dashboard" className="nav-link">My Dashboard</a>
              )}
              <a href="/account" className="nav-link">Hi, {user.username}!</a>
              <button className="btn-nav-outline" onClick={handleLogout}>Log Out</button>
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
              {user.role === 'host' && (
                <a href="/host-dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>My Dashboard</a>
              )}
              <a href="/account" className="mobile-link" onClick={() => setMenuOpen(false)}>Hi, {user.username}!</a>
              <button className="mobile-link" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <a href="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign In</a>
              <a href="/login?mode=register" className="mobile-link btn-nav-primary" onClick={() => setMenuOpen(false)}>Sign Up</a>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar