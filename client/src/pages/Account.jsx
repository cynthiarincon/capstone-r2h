// useState manages the user info and saved trips
// useEffect fetches data when the page loads
import { useState, useEffect } from 'react'

function Account() {
  // stores the logged in users info
  const [user, setUser] = useState(null)
  // stores the users saved trips
  const [trips, setTrips] = useState([])

  // check if logged in and fetch saved trips when page loads
  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const role = localStorage.getItem('role')

    if (!token) {
      window.location.href = '/login'
      return
    }

    setUser({ username, role })

    // fetch saved trips from the database
    fetch('http://localhost:3000/api/trips', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setTrips(data))
      .catch(err => console.error('Failed to load trips', err))
  }, [])

  return (
    <main className="account-page">

      {/* welcome message with username */}
      <h1>Welcome back, {user?.username}! 🌿</h1>
      <p>Here are your saved trips and experiences.</p>

      {/* account info */}
      <div className="account-info">
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Account type:</strong> {user?.role === 'host' ? 'Host' : 'User'}</p>
      </div>

      {/* saved trips */}
      <div className="saved-trips">
        <h2>My Saved Trips</h2>
        {trips.length === 0 ? (
          <p>You have no saved trips yet. Generate one on the Trip Planner!</p>
        ) : (
          <div className="trips-grid">
            {trips.map(trip => (
              <div key={trip.id} className="listing-card">
                <h3>{trip.region}</h3>
                <p>{trip.duration} | {trip.style} | {trip.travel_group}</p>
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