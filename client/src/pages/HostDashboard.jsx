// useState manages the form data and the list of listings
// useEffect fetches the hosts listings when the page loads
import { useState, useEffect } from 'react'

function HostDashboard() {

  // ===== STATE =====
  // controls whether the create listing form is visible
  const [showForm, setShowForm] = useState(false)

  // stores what the host types into the create listing form
  const [form, setForm] = useState({
    title: '',
    description: '',
    region: '',
    price: '',
    duration: '',
    contact: ''
  })

  // stores the hosts listings fetched from the database
  const [listings, setListings] = useState([])

  // stores any contact validation error
  const [contactError, setContactError] = useState('')

  // ===== CHECK IF LOGGED IN =====
  // runs once when the page loads
  // if no token redirect to login
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    // fetch this hosts listings from the database
    fetchMyListings()
  }, [])
  // empty [] means this only runs ONCE when the page loads

  // ===== FETCH MY LISTINGS =====
  // gets all listings created by this host from the database
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
  // updates the matching form field every time the host types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ===== VALIDATE CONTACT =====
  // makes sure the contact number is in the right format
  // only allows numbers, +, spaces, dashes, and parentheses
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
  // sends the form data to the backend to save the listing
  const handleSubmit = async (e) => {
    e.preventDefault()

    // dont submit if there is a contact validation error
    if (contactError) {
      alert('Please fix the contact number before submitting.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // send the token so the backend knows which host is creating this
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      if (response.ok) {
        alert('Listing created successfully!')
        // reset the form
        setForm({ title: '', description: '', region: '', price: '', duration: '', contact: '' })
        setContactError('')
        setShowForm(false)
        // refresh the listings list
        fetchMyListings()
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    }
  }

  // ===== DELETE LISTING =====
  // removes a listing from the database
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:3000/api/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      // refresh the listings list after deleting
      fetchMyListings()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="host-dashboard">

      <h1>Host Dashboard</h1>
      <p>Manage your experience listings here.</p>

      {/* button to show or hide the create listing form */}
      <button
        className="btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ Create New Listing'}
      </button>

      {/* create listing form -- only shows when host clicks Create New Listing
          sends data to /api/listings on the backend when submitted */}
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
              placeholder="Describe your experience in a few sentences"
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

          {/* contact field with validation
              only allows numbers, +, spaces, dashes, and parentheses
              must be at least 7 characters */}
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
            {/* shows error message if validation fails */}
            {contactError && (
              <p style={{ color: 'var(--coral-red)', fontSize: '0.85rem' }}>{contactError}</p>
            )}
          </div>

          <button type="submit" className="btn-primary">Submit Listing</button>

        </form>
      )}

      {/* my listings -- shows all listings this host has created
          fetched from /api/mylistings on the backend */}
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
                <p>{listing.description.length > 100 
                  ? listing.description.substring(0, 100) + '...' 
                  : listing.description}
                </p>
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