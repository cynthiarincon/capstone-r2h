import { useState } from 'react'

const regions = ['Caribe', 'Andina', 'Pacífico', 'Orinoquía', 'Amazonía', 'Insular']
const durations = ['1-3 days', '4-7 days', '8-14 days', '15+ days']
const styles = ['Adventure', 'Culture', 'Food', 'Relaxation', 'Mix of Everything']
const groups = ['Solo', 'Couple', 'Family', 'Friends']

function Planner() {
  const [region, setRegion] = useState(null)
  const [duration, setDuration] = useState(null)
  const [style, setStyle] = useState(null)
  const [group, setGroup] = useState(null)
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)

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
        body: JSON.stringify({ region, duration, style, group })
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
      <p>Answer 4 quick questions and our AI will build you a personalized Colombia itinerary.</p>

      {/* Step 1 -- Region */}
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

      {/* Step 2 -- Duration */}
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

      {/* Step 3 -- Travel style */}
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

      {/* Step 4 -- Travel group */}
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

      {/* Generate button */}
      <button
        className="btn-primary"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate My Itinerary'}
      </button>

      {/* Itinerary output */}
      {itinerary && (
        <div className="itinerary-output">
          <h2>Your Itinerary</h2>
          <p>{itinerary}</p>
          <button className="btn-primary">Save Trip</button>
        </div>
      )}

      {!itinerary && !loading && (
        <div className="itinerary-placeholder">
          <h2>Your Itinerary</h2>
          <p>Complete the steps above and click Generate to see your personalized Colombia itinerary here.</p>
        </div>
      )}

      {/* Saved trips */}
      <div className="saved-trips">
        <h2>Your Saved Trips</h2>
        <p>Sign in to save and view your past itineraries.</p>
      </div>

    </main>
  )
}

export default Planner