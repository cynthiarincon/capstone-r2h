import { useState, useEffect } from 'react'

function Account() {

  const [username, setUsername] = useState('')
  const [savedTrips, setSavedTrips] = useState([])
  const [loading, setLoading] = useState(true)

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

  const fetchSavedTrips = async (token) => {
    try {
      const response = await fetch('https://capstone-r2h.onrender.com/api/trips', {
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

      <h1>Welcome, {username}!</h1>
      <p>View and manage your saved trips here.</p>

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
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
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