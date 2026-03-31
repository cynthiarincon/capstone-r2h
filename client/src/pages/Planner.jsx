// useState manages all the selections and the itinerary output
// useEffect runs code when the page first loads
import { useState, useEffect } from 'react'

// react-markdown renders the AI itinerary with proper formatting
import ReactMarkdown from 'react-markdown'

const regions = ['Caribe', 'Andina', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular']
const durations = ['1-3 days', '4-7 days', '8-14 days', '15+ days']
const styles = ['Adventure', 'Culture', 'Food', 'Relaxation', 'Mix of Everything']
const groups = ['Solo', 'Couple', 'Family', 'Friends']

function Planner() {

  // ===== STATE =====
  const [user, setUser] = useState(null)
  const [region, setRegion] = useState(null)
  const [duration, setDuration] = useState(null)
  const [style, setStyle] = useState(null)
  const [group, setGroup] = useState(null)
  const [selectedListings, setSelectedListings] = useState([])
  const [listings, setListings] = useState([])
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tripName, setTripName] = useState('')
  // stores success message after saving
  const [savedMsg, setSavedMsg] = useState('')
  // stores the users saved trips from the database
  const [savedTrips, setSavedTrips] = useState([])

  // ===== CHECK IF LOGGED IN =====
  // runs once when the page loads
  // if no token redirect to login
  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    if (!token) {
      window.location.href = '/login'
      return
    }
    setUser({ token, username })
    // fetch real listings and saved trips when page loads
    fetchSavedTrips()
  }, [])

  // ===== FETCH LISTINGS BY REGION =====
  // when user picks a region fetch real listings from the database
  useEffect(() => {
    if (region) {
      fetch(`http://localhost:3000/api/listings?region=${region}`)
        .then(r => r.json())
        .then(data => setListings(data))
        .catch(err => console.error('Failed to fetch listings', err))
    }
  }, [region])
  // the [region] means this runs every time region changes

  // ===== FETCH SAVED TRIPS =====
  // gets all saved trips for the logged in user from the database
  const fetchSavedTrips = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/trips', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setSavedTrips(data)
    } catch (err) {
      console.error('Failed to fetch saved trips', err)
    }
  }

  // ===== TOGGLE LISTING =====
  const toggleListing = (listing) => {
    if (selectedListings.find(l => l.id === listing.id)) {
      setSelectedListings(selectedListings.filter(l => l.id !== listing.id))
    } else {
      setSelectedListings([...selectedListings, listing])
    }
  }

  // ===== GENERATE ITINERARY =====
  const handleGenerate = async () => {
    if (!region || !duration || !style || !group) {
      setError('Please complete all steps before generating your itinerary.')
      return
    }
    setError('')
    setSavedMsg('')
    setLoading(true)
    setItinerary(null)
    try {
      const response = await fetch('http://localhost:3000/api/generateTrip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region, duration, style, group, selectedListings })
      })
      const data = await response.json()
      setItinerary(data.itinerary)
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ===== SAVE TRIP =====
  // sends the itinerary to the backend to save in the database
  // the token proves who is saving it
  const handleSaveTrip = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/saveTrip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ region, duration, style, group, itinerary, tripName })
      })
      if (response.ok) {
        setSavedMsg('Trip saved successfully!')
        // refresh the saved trips list
        fetchSavedTrips()
      } else {
        setError('Failed to save trip. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <main className="planner-page">

      <h1>Trip Planner</h1>
      <p>Answer a few questions and our AI will build you a personalized Colombia itinerary.</p>

      {/* step 1 -- pick a region */}
      <h2>Where do you want to go?</h2>
      <p>Select a region of Colombia.</p>
      <div className="planner-options">
        {regions.map(r => (
          <button
            key={r}
            className={`option-btn ${region === r ? 'selected' : ''}`}
            onClick={() => setRegion(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* step 2 -- pick a duration */}
      <h2>How many days?</h2>
      <p>Choose how long your trip will be.</p>
      <div className="planner-options">
        {durations.map(d => (
          <button
            key={d}
            className={`option-btn ${duration === d ? 'selected' : ''}`}
            onClick={() => setDuration(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* step 3 -- pick a travel style */}
      <h2>What is your travel style?</h2>
      <p>Pick what matters most to you on this trip.</p>
      <div className="planner-options">
        {styles.map(s => (
          <button
            key={s}
            className={`option-btn ${style === s ? 'selected' : ''}`}
            onClick={() => setStyle(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* step 4 -- pick a travel group */}
      <h2>Who are you traveling with?</h2>
      <p>This helps the AI personalize your itinerary.</p>
      <div className="planner-options">
        {groups.map(g => (
          <button
            key={g}
            className={`option-btn ${group === g ? 'selected' : ''}`}
            onClick={() => setGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* step 5 -- real host listings fetched from database by region */}
      {region && (
        <div className="listings-step">
          <h2>Add local experiences to your trip</h2>
          <p>Select any host experiences you want included in your itinerary.</p>
          {listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map(listing => (
                <div
                  key={listing.id}
                  className={`listing-card ${selectedListings.find(l => l.id === listing.id) ? 'selected' : ''}`}
                  onClick={() => toggleListing(listing)}
                >
                  <h3>{listing.title}</h3>
                  <p>Duration: {listing.duration}</p>
                  <p>Price: {listing.price}</p>
                  <p>{selectedListings.find(l => l.id === listing.id) ? '✓ Added' : '+ Add to trip'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No host listings yet for the {region} region.</p>
          )}
        </div>
      )}

      {/* inline error message */}
      {error && (
        <p style={{ color: 'var(--coral-red)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '600' }}>
          {error}
        </p>
      )}

      {/* generate button */}
      <button
        className="btn-primary"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate My Itinerary'}
      </button>

      {/* itinerary output -- shows when Groq returns a response */}
      {itinerary && (
        <div className="itinerary-output">
          <h2>Your Itinerary</h2>
          <ReactMarkdown>{itinerary}</ReactMarkdown>
      {user && (
        <>
          {/* trip name input -- shows after itinerary is generated */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Name your trip</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Summer Colombia Trip 2026"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              maxLength={50}
            />
          </div>
          <button
            className="btn-primary"
            onClick={handleSaveTrip}
            disabled={savedMsg !== '' || !tripName}
            style={{ marginTop: '1rem' }}
          >
            {savedMsg ? '✓ Saved!' : 'Save Trip'}
          </button>
          {savedMsg && (
            <p style={{ color: 'var(--forest-green)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '600' }}>
              {savedMsg}
            </p>
          )}
        </>
      )}
      </div>
      )}

      {/* placeholder -- shows before the user generates */}
      {!itinerary && !loading && (
        <div className="itinerary-placeholder">
          <h2>Your Itinerary</h2>
          <p>Complete the steps above and click Generate to see your personalized Colombia itinerary here.</p>
        </div>
      )}

      {/* saved trips -- fetched from the database
          shows all trips this user has previously saved */}
      <div className="saved-trips">
        <h2>Your Saved Trips</h2>
        {savedTrips.length === 0 ? (
          <p>You have no saved trips yet. Generate and save one above!</p>
        ) : (
          <div className="trips-grid">
            {savedTrips.map(trip => (
              <div key={trip.id} className="trip-card">
                <h3>{trip.region}</h3>
                <p>{trip.duration} · {trip.style} · {trip.travel_group}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Saved on {new Date(trip.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  )
}

export default Planner