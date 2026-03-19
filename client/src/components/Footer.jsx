function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <p className="footer-logo">🌿 Explore Colombia</p>
          <p className="footer-tagline">Explore. Discover. Plan.</p>
          <p className="footer-about">A Colombia travel discovery platform powered by AI and real cultural data.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Explore</h4>
          <p className="footer-item">Home</p>
          <p className="footer-item">Explore Colombia</p>
          <p className="footer-item">Trip Planner</p>
          <p className="footer-item">Sign In</p>
        </div>

        {/* Company */}
        <div className="footer-section">
          <h4 className="footer-heading">Company</h4>
          <p className="footer-item">About</p>
          <p className="footer-item">Careers</p>
          <p className="footer-item">Contact Us</p>
          <p className="footer-item">Newsletter</p>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h4 className="footer-heading">Legal</h4>
          <p className="footer-item">Privacy Policy</p>
          <p className="footer-item">Terms of Service</p>
          <p className="footer-item">Cookie Policy</p>
        </div>

      </div>

      {/* Social Media */}
      <div className="footer-social">
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="social-link">Instagram</a>
        <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="social-link">TikTok</a>
        <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="social-link">YouTube</a>
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-link">Facebook</a>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 Descubre Colombia. All rights reserved.</p>
        <p>Built as an apprenticeship project for Road to Hire Cohort 18.</p>
      </div>

    </footer>
  )
}

export default Footer