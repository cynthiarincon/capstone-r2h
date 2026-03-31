// useState manages the page data
// useEffect fetches data when the page loads
import { useState, useEffect } from 'react'

function Account() {

  // ===== STATE =====
  const [username, setUsername] = useState('')
  // stores the users saved trips from the database
  const [savedTrips, setSavedTrips] = useState([])
  // tracks if data is loading
  const [loading, setLoading] = useState(true)

  // ===== CHECK IF LOGGED IN AND FETCH DATA =====
  // runs once when the page loads
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')
    if (!token) {
      window.location.href = '/login'
      return
    }
    setUsername(storedUsername)
    fetchSavedTrips(token)
  }, [])

  // ===== FETCH SAVED TRIPS =====
  // gets all saved trips for the logged in user from the database
  const fetchSavedTrips = async (token) => {
    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/trips', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setSavedTrips(data)
    } catch (err) {
      console.error('Failed to fetch saved trips', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="account-page">

      {/* welcome message with the users username */}
      <h1>Welcome, {username}!</h1>
      <p>View and manage your saved trips here.</p>

      {/* saved trips section */}
      <div className="account-section">
        <h2>Your Saved Trips</h2>

        {loading ? (
          <p>Loading your trips...</p>
        ) : savedTrips.length === 0 ? (
          <p>You have no saved trips yet. Head to the Trip Planner to generate one!</p>
        ) : (
          <div className="trips-grid">
            {savedTrips.map(trip => (
              <div key={trip.id} className="trip-card">
              <h3>{trip.trip_name || trip.region}</h3>
              <p>{trip.region} · {trip.duration} · {trip.style}</p>
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

export default Account