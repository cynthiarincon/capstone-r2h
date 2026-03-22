// useState manages all the selections and the itinerary output
import { useState } from 'react'

// placeholder listings -- will be fetched from the database by region later
const placeholderListings = [
  { id: 1, title: 'City Walking Tour', host: 'Carlos M.', price: '$20', duration: '2 hours' },
  { id: 2, title: 'Traditional Cooking Class', host: 'Maria L.', price: '$35', duration: '3 hours' },
  { id: 3, title: 'Coffee Farm Visit', host: 'Juan P.', price: '$25', duration: '4 hours' },
]

const regions = ['Caribe', 'Andina', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular']
const durations = ['1-3 days', '4-7 days', '8-14 days', '15+ days']
const styles = ['Adventure', 'Culture', 'Food', 'Relaxation', 'Mix of Everything']
const groups = ['Solo', 'Couple', 'Family', 'Friends']

function Planner() {
  // stores the users selections
  const [region, setRegion] = useState(null)
  const [duration, setDuration] = useState(null)
  const [style, setStyle] = useState(null)
  const [group, setGroup] = useState(null)
  // stores which host listings the user selected
  const [selectedListings, setSelectedListings] = useState([])
  // stores the itinerary returned from gemini
  const [itinerary, setItinerary] = useState(null)
  // tracks if the app is waiting for gemini to respond
  const [loading, setLoading] = useState(false)

  // toggles a listing on or off when clicked
  const toggleListing = (listing) => {
    if (selectedListings.find(l => l.id === listing.id)) {
      setSelectedListings(selectedListings.filter(l => l.id !== listing.id))
    } else {
      setSelectedListings([...selectedListings, listing])
    }
  }

  // sends the users selections to the backend which calls gemini
  const handleGenerate = async () => {
    if (!region || !duration || !style || !group) {
      alert('Please complete all steps before generating your itinerary.')
      return
    }
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
      alert('Failed to generate itinerary. Please try again.')
    } finally {
      setLoading(false)
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

      {/* step 5 -- pick host listings (only shows after region is selected) */}
      {region && (
        <div className="listings-step">
          <h2>Add local experiences to your trip</h2>
          <p>Select any host experiences you want included in your itinerary. These will be woven into your trip plan by the AI.</p>
          <div className="listings-grid">
            {placeholderListings.map(listing => (
              <div
                key={listing.id}
                className={`listing-card ${selectedListings.find(l => l.id === listing.id) ? 'selected' : ''}`}
                onClick={() => toggleListing(listing)}
              >
                <h3>{listing.title}</h3>
                <p>Host: {listing.host}</p>
                <p>Duration: {listing.duration}</p>
                <p>Price: {listing.price}</p>
                <p>{selectedListings.find(l => l.id === listing.id) ? '✓ Added' : '+ Add to trip'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* bookmarked listings -- will pull from the users saved listings once backend is connected */}
      {region && (
        <div className="listings-step">
          <h2>Your Bookmarked Experiences</h2>
          <p>Experiences you bookmarked from the Explore page will appear here. Sign in to see your bookmarks.</p>
          <div className="listings-grid">
            {/* bookmarked listing cards will go here once backend is connected */}
          </div>
        </div>
      )}

      {/* generate button -- sends selections to gemini via the backend */}
      <button
        className="btn-primary"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate My Itinerary'}
      </button>

      {/* itinerary output -- shows when gemini returns a response */}
      {itinerary && (
        <div className="itinerary-output">
          <h2>Your Itinerary</h2>
          <p>{itinerary}</p>
          <button className="btn-primary">Save Trip</button>
        </div>
      )}

      {/* placeholder -- shows before the user generates */}
      {!itinerary && !loading && (
        <div className="itinerary-placeholder">
          <h2>Your Itinerary</h2>
          <p>Complete the steps above and click Generate to see your personalized Colombia itinerary here.</p>
        </div>
      )}

      {/* saved trips -- will show real saved trips when backend is connected */}
      <div className="saved-trips">
        <h2>Your Saved Trips</h2>
        <p>Sign in to save and view your past itineraries.</p>
      </div>

    </main>
  )
}

export default Planner