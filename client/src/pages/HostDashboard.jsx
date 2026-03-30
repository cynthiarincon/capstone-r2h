// useState manages the form data and the list of listings
// useEffect fetches the hosts listings when the page loads
import { useState, useEffect } from 'react'

function HostDashboard() {

  // ===== STATE =====
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    region: '',
    price: '',
    duration: '',
    contact: ''
  })
  const [listings, setListings] = useState([])
  const [contactError, setContactError] = useState('')
  // stores success or error messages to show in the form
  const [message, setMessage] = useState({ text: '', type: '' })
  // stores the logged in hosts username
  const [username, setUsername] = useState('')

  // ===== CHECK IF LOGGED IN =====
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')
    if (!token) {
      window.location.href = '/login'
      return
    }
    setUsername(storedUsername)
    fetchMyListings()
  }, [])

  // ===== FETCH MY LISTINGS =====
  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/mylistings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setListings(data)
    } catch (err) {
      console.error('Failed to fetch listings', err)
    }
  }

  // ===== HANDLE CHANGE =====
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ===== VALIDATE CONTACT =====
  const validateContact = (value) => {
    const validFormat = /^[0-9+\s\-()]+$/.test(value)
    const validLength = value.length >= 7
    if (!validFormat) {
      setContactError('Only numbers, +, dashes, and spaces allowed')
    } else if (!validLength) {
      setContactError('Must be at least 7 digits')
    } else {
      setContactError('')
    }
  }

  // ===== HANDLE SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    // show inline error instead of alert
    if (contactError) {
      setMessage({ text: 'Please fix the contact number before submitting.', type: 'error' })
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      if (response.ok) {
        // show success message in the form instead of alert
        setMessage({ text: 'Listing created successfully!', type: 'success' })
        setForm({ title: '', description: '', region: '', price: '', duration: '', contact: '' })
        setContactError('')
        setShowForm(false)
        fetchMyListings()
      } else {
        setMessage({ text: data.error, type: 'error' })
      }
    } catch (err) {
      console.error(err)
      setMessage({ text: 'Something went wrong. Please try again.', type: 'error' })
    }
  }

  // ===== DELETE LISTING =====
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:3000/api/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchMyListings()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="host-dashboard">

      {/* welcome message with the hosts username */}
      <h1>Welcome, {username}!</h1>
      <p>Manage your experience listings here.</p>

      {/* inline message -- shows success or error after form submit */}
      {message.text && (
        <p style={{
          color: message.type === 'error' ? 'var(--coral-red)' : 'var(--forest-green)',
          fontSize: '0.9rem',
          marginBottom: '1rem',
          fontWeight: '600'
        }}>
          {message.text}
        </p>
      )}

      {/* button to show or hide the create listing form */}
      <button
        className="btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ Create New Listing'}
      </button>

      {/* create listing form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="listing-form">

          <h2>New Listing</h2>

          <div className="form-group">
            <label className="form-label">Experience Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. City Walking Tour"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-input"
              placeholder="Describe your experience"
              value={form.description}
              onChange={handleChange}
              maxLength={150}
              required
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              {150 - form.description.length} characters remaining
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Region</label>
            <select
              name="region"
              className="form-input"
              value={form.region}
              onChange={handleChange}
              required
            >
              <option value="">Select a region</option>
              <option value="Caribe">Caribe</option>
              <option value="Andina">Andina</option>
              <option value="Pacífico">Pacífico</option>
              <option value="Orinoquía">Orinoquía</option>
              <option value="Amazonía">Amazonía</option>
              <option value="Insular">Insular</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Price</label>
            <input
              type="text"
              name="price"
              className="form-input"
              placeholder="e.g. $20"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration</label>
            <input
              type="text"
              name="duration"
              className="form-input"
              placeholder="e.g. 2 hours"
              value={form.duration}
              onChange={handleChange}
              required
            />
          </div>

          {/* contact with validation */}
          <div className="form-group">
            <label className="form-label">Contact Info</label>
            <input
              type="text"
              name="contact"
              className="form-input"
              placeholder="e.g. +57 300 123 4567"
              value={form.contact}
              onChange={(e) => {
                handleChange(e)
                validateContact(e.target.value)
              }}
              required
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Include country code (e.g. +57 for Colombia)
            </small>
            {contactError && (
              <p style={{ color: 'var(--coral-red)', fontSize: '0.85rem' }}>{contactError}</p>
            )}
          </div>

          <button type="submit" className="btn-primary">Submit Listing</button>

        </form>
      )}

      {/* my listings */}
      <div className="my-listings">
        <h2>My Listings</h2>
        {listings.length === 0 ? (
          <p>You have no listings yet. Create one above!</p>
        ) : (
          <div className="listings-grid">
            {listings.map(listing => (
              <div key={listing.id} className="listing-card">
                <h3>{listing.title}</h3>
                <p>Region: {listing.region}</p>
                <p>Price: {listing.price}</p>
                <p>Duration: {listing.duration}</p>
                <p>Contact: {listing.contact}</p>
                <button
                  className="btn-primary"
                  onClick={() => handleDelete(listing.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  )
}

export default HostDashboard