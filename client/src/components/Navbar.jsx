import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <div className="navbar-logo">
          🌿 Explore Colombia
        </div>

        {/* Desktop links */}
        <div className="navbar-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/explore" className="nav-link">Explore</a>
          <a href="/planner" className="nav-link">Trip Planner</a>
          <a href="/login" className="btn-nav-outline">Sign In</a>
          <a href="/register" className="btn-nav-primary">Sign Up</a>
        </div>

        {/* Burger for mobile */}
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/explore" className="mobile-link" onClick={() => setMenuOpen(false)}>Explore</a>
          <a href="/planner" className="mobile-link" onClick={() => setMenuOpen(false)}>Trip Planner</a>
          <a href="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign In</a>
          <a href="/register" className="mobile-link btn-nav-primary" onClick={() => setMenuOpen(false)}>Sign Up</a>
        </div>
      )}
    </nav>
  )
}

export default Navbar