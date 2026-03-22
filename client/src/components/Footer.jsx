function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* brand */}
        <div className="footer-brand">
          <p className="footer-logo">🌿 Explore Colombia</p>
          <p className="footer-tagline">Explore. Discover. Plan.</p>
        </div>

        {/* explore links */}
        <div className="footer-section">
          <h4 className="footer-heading">Explore</h4>
          <p className="footer-item">Home</p>
          <p className="footer-item">Explore Colombia</p>
          <p className="footer-item">Trip Planner</p>
          <p className="footer-item">Sign In</p>
        </div>

        {/* social media */}
        <div className="footer-section">
          <h4 className="footer-heading">Follow Us</h4>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="social-link">Instagram</a>
          <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="social-link">TikTok</a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="social-link">YouTube</a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-link">Facebook</a>
        </div>

      </div>

      {/* copyright */}
      <div className="footer-bottom">
        <p>© 2026 Explore Colombia. All rights reserved.</p>
        <p>Built as an apprenticeship capstone for Road to Hire Cohort 18.</p>
      </div>

    </footer>
  )
}

export default Footer