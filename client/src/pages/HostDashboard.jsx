// Host Dashboard -- only accessible to users with a host account
// Hosts can create, view, edit and delete their experience listings

import { useState } from 'react'

function HostDashboard() {

  // Controls whether the create listing form is visible
  const [showForm, setShowForm] = useState(false)

  // Stores what the host is typing into the create listing form
  const [form, setForm] = useState({
    title: '',
    description: '',
    region: '',
    price: '',
    duration: '',
    contact: ''
  })

  // Updates the matching form field every time the host types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handles form submission -- backend connection comes later
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('new listing submitted', form)
    setShowForm(false)
  }

  return (
    <main className="host-dashboard">

      <h1>Host Dashboard</h1>
      <p>Manage your experience listings here.</p>

      {/* ===== CREATE LISTING BUTTON =====
          Toggles the create listing form on and off */}
      <button
        className="btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ Create New Listing'}
      </button>

      {/* ===== CREATE LISTING FORM =====
          Only shows when the host clicks Create New Listing
          Will POST to /api/listings on the backend when connected */}
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
              required
            />
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

          <div className="form-group">
            <label className="form-label">Contact Info</label>
            <input
              type="text"
              name="contact"
              className="form-input"
              placeholder="e.g. email or phone number"
              value={form.contact}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Submit Listing
          </button>

        </form>
      )}

      {/* ===== MY LISTINGS =====
          Shows all listings this host has created
          Data will be pulled from /api/listings when backend is connected */}
      <div className="my-listings">
        <h2>My Listings</h2>
        <p>Your published experience listings will appear here.</p>
        <div className="listings-grid">
          {/* listing cards will go here */}
        </div>
      </div>

    </main>
  )
}

export default HostDashboard