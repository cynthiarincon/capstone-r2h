import medellin from '../assets/medellin.png'
import cartagena from '../assets/Cartagena.png'
import sanandres from '../assets/sanandres.png'
import amazonas from '../assets/amazonas.png'
import pereira from '../assets/pereira.png'
import tatacoa from '../assets/tatacoa.png'

// destinations
const destinations = [
  { name: 'Cartagena', region: 'Caribe', tag: 'Coast', image: cartagena },
  { name: 'Medellín', region: 'Andina', tag: 'City', image: medellin },
  { name: 'San Andrés', region: 'Insular', tag: 'Island', image: sanandres },
  { name: 'Amazonas', region: 'Amazonía', tag: 'Jungle', image: amazonas },
  { name: 'Pereira', region: 'Andina', tag: 'Coffee', image: pereira },
  { name: 'Tatacoa', region: 'Andina', tag: 'Desert', image: tatacoa },
]

// features -- describes what the app does, shown in the features section
const features = [
  { icon: '🗺️', title: 'Explore 32 Departments', desc: 'Discover every corner of Colombia through an interactive map powered by real data.' },
  { icon: '🌿', title: 'Culture & Cuisine', desc: 'Dive into regional dishes, natural areas, tourist attractions, and local traditions.' },
  { icon: '✈️', title: 'Plan Your Trip', desc: 'Get a personalized AI-powered itinerary based on your travel style and interests.' },
]

function Home() {
  return (
    <main>

      {/* ===== HERO =====
          Static hero section with app name, tagline, and two CTA buttons
          Decorative leaf emojis on left and right sides */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="leaf leaf-left">🌿</div>
        <div className="leaf leaf-right">🌺</div>
        <div className="hero-content">
          <p className="hero-eyebrow">Welcome to</p>
          <h1 className="hero-title">Explore Colombia</h1>
          <p className="hero-subtitle">32 departments. 6 regions. One unforgettable journey.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => window.location.href = '/explore'}>
  Explore Colombia
</button>
            <button className="btn-outline" onClick={() => window.location.href = '/planner'}>
  Plan My Trip
</button>
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP =====
          Quick facts about Colombia displayed in a horizontal strip
          Numbers are hardcoded since they don't change */}
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

      {/* ===== FEATURES =====
          Three cards explaining what the app does
          Maps through the features array above */}
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

      {/* ===== FLOWER DIVIDER =====
          Decorative section separator with flower emojis */}
      <div className="flower-divider">
        <span>🌸</span><span>🌺</span><span>🌼</span>
        <span>🌸</span><span>🌺</span><span>🌼</span>
        <span>🌸</span><span>🌺</span><span>🌼</span>
      </div>

      {/* ===== DESTINATIONS =====
          Featured destination cards with a color placeholder
          Will eventually pull real images from API-Colombia
          Maps through the destinations array above */}
      <section className="destinations">
        <div className="section-header">
          <p className="section-eyebrow">Featured destinations</p>
          <h2 className="section-title">Where will you go first?</h2>
        </div>
        <div className="destinations-grid">
          {destinations.map(dest => (
  <div key={dest.name} className="destination-card">
    <div
      className="destination-img"
      style={{
        backgroundImage: `url(${dest.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <span className="destination-tag">{dest.tag}</span>
    </div>
    <div className="destination-info">
      <p className="destination-name">{dest.name}</p>
      <p className="destination-region">{dest.region}</p>
    </div>
  </div>
))}
        </div>
      </section>

      {/* ===== WHY SIGN UP =====
          Three cards explaining the benefits of creating an account
          Encourages guests to register */}
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

      {/* ===== CTA =====
          Final call to action section at the bottom of the page
          Encourages users to sign up or sign in */}
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