import { useState, useEffect } from 'react'

const destinations = [
  { name: 'Medellín', region: 'Antioquia', tag: 'City of Eternal Spring', color: '#2d6a4f' },
  { name: 'Cartagena', region: 'Bolívar', tag: 'Historic Walled City', color: '#e63946' },
  { name: 'San Andrés', region: 'Archipiélago', tag: 'Caribbean Paradise', color: '#1a4a6b' },
  { name: 'Pereira', region: 'Risaralda', tag: 'Coffee Region', color: '#6b3a1f' },
  { name: 'Amazonas', region: 'Amazonia', tag: 'Jungle Adventure', color: '#1a5c38' },
  { name: 'La Tatacoa', region: 'Huila', tag: 'Desert & Stars', color: '#c17f3a' }
]

const features = [
  { icon: '🗺️', title: 'Explore 32 Departments', desc: 'Discover every corner of Colombia through an interactive map powered by real data.' },
  { icon: '🌿', title: 'Culture & Cuisine', desc: 'Dive into regional dishes, natural areas, tourist attractions, and local traditions.' },
  { icon: '✈️', title: 'Plan Your Trip', desc: 'Get a personalized AI-powered itinerary based on your travel style and interests.' },
]

const heroSlides = [
  { eyebrow: 'Explore', title: 'Descubre Colombia', subtitle: '32 departments. 6 regions. One unforgettable journey.' },
  { eyebrow: 'Explore', title: 'La Costa Caribe', subtitle: 'Sun, history, and the warmth of the Caribbean coast.' },
  { eyebrow: 'Explore', title: 'El Eje Cafetero', subtitle: 'Rolling green hills, coffee farms, and colonial towns.' },
]

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <main>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="leaf leaf-left">🌿</div>
        <div className="leaf leaf-right">🌺</div>

        <div className="hero-content">
          <p className="hero-eyebrow">{slide.eyebrow}</p>
          <h1 className="hero-title">{slide.title}</h1>
          <p className="hero-subtitle">{slide.subtitle}</p>
          <div className="hero-buttons">
            <button className="btn-primary">Explore Colombia</button>
            <button className="btn-outline">Plan My Trip</button>
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="stats-strip">
        <div className="stat">
          <span className="stat-number">32</span>
          <span className="stat-label">Departments</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-number">6</span>
          <span className="stat-label">Regions</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-number">52M+</span>
          <span className="stat-label">People</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-number">1</span>
          <span className="stat-label">Country to Discover</span>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features">
        <div className="section-header">
          <p className="section-eyebrow">What you can do</p>
          <h2 className="section-title">Everything you need to discover Colombia</h2>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FLOWER DIVIDER ===== */}
      <div className="flower-divider">
        <span>🌸</span><span>🌺</span><span>🌼</span>
        <span>🌸</span><span>🌺</span><span>🌼</span>
        <span>🌸</span><span>🌺</span><span>🌼</span>
      </div>

      {/* ===== DESTINATIONS ===== */}
      <section className="destinations">
        <div className="section-header">
          <p className="section-eyebrow">Featured destinations</p>
          <h2 className="section-title">Where will you go first?</h2>
        </div>
        <div className="destinations-grid">
          {destinations.map((d, i) => (
            <div className="destination-card" key={i}>
              <div className="destination-img" style={{ backgroundColor: d.color }}>
                <span className="destination-tag">{d.tag}</span>
              </div>
              <div className="destination-info">
                <h3 className="destination-name">{d.name}</h3>
                <p className="destination-region">📍 {d.region}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY SIGN UP ===== */}
      <section className="why-signup">
        <div className="section-header">
          <p className="section-eyebrow">Create a free account</p>
          <h2 className="section-title">More when you sign up</h2>
        </div>
        <div className="why-grid">
          <div className="why-card">
            <span className="why-icon">💾</span>
            <h3 className="why-title">Save Your Trips</h3>
            <p className="why-desc">Build and save personalized itineraries to your profile and come back anytime.</p>
          </div>
          <div className="why-card">
            <span className="why-icon">🤖</span>
            <h3 className="why-title">AI Trip Planner</h3>
            <p className="why-desc">Get a custom Colombia itinerary built just for you based on your travel style.</p>
          </div>
          <div className="why-card">
            <span className="why-icon">📍</span>
            <h3 className="why-title">Trip History</h3>
            <p className="why-desc">View and edit all your past itineraries in one place.</p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta">
        <div className="cta-leaves">
          <span>🌿</span><span>🌺</span><span>🌸</span>
        </div>
        <h2 className="cta-title">Ready to discover Colombia?</h2>
        <p className="cta-subtitle">Create a free account to save trips and get personalized itineraries.</p>
        <div className="cta-buttons">
          <button className="btn-primary">Get Started</button>
          <button className="btn-outline">Sign In</button>
        </div>
      </section>

    </main>
  )
}

export default Home