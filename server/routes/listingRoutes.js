// handles creating and fetching host listings
import express from 'express'
import pool from '../db.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// ===== CREATE LISTING =====
// POST /api/listings -- host creates a new listing
// requires login -- only hosts should be able to do this
router.post('/listings', auth, async (req, res) => {
  const { title, description, region, price, duration, contact } = req.body

  // req.user.id is the logged in hosts user id
  const hostId = req.user.id

  try {
    await pool.query(
      'INSERT INTO listings (host_id, title, description, region, price, duration, contact) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [hostId, title, description, region, price, duration, contact]
    )
    res.status(201).json({ message: 'Listing created successfully!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ===== GET LISTINGS =====
// GET /api/listings -- gets all listings, filterable by region
// anyone can see listings -- no login needed
router.get('/listings', async (req, res) => {
  const { region } = req.query

  try {
    let query = 'SELECT * FROM listings'
    let params = []

    // if a region is provided filter listings by that region
    if (region) {
      query += ' WHERE region = ?'
      params.push(region)
    }

    const [rows] = await pool.query(query, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ===== GET MY LISTINGS =====
// GET /api/mylistings -- gets all listings created by the logged in host
router.get('/mylistings', auth, async (req, res) => {
  const hostId = req.user.id

  try {
    const [rows] = await pool.query(
      'SELECT * FROM listings WHERE host_id = ? ORDER BY created_at DESC',
      [hostId]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ===== DELETE LISTING =====
// DELETE /api/listings/:id -- host deletes their own listing
router.delete('/listings/:id', auth, async (req, res) => {
  const { id } = req.params
  const hostId = req.user.id

  try {
    await pool.query(
      'DELETE FROM listings WHERE id = ? AND host_id = ?',
      [id, hostId]
    )
    res.json({ message: 'Listing deleted successfully!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router