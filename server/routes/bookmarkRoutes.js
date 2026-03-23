// handles users bookmarking and unbookmarking host listings
import express from 'express'
import pool from '../db.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// ===== ADD BOOKMARK =====
// POST /api/bookmarks -- user bookmarks a listing
// requires login
router.post('/bookmarks', auth, async (req, res) => {
  const { listingId } = req.body
  const userId = req.user.id

  try {
    await pool.query(
      'INSERT INTO bookmarks (user_id, listing_id) VALUES (?, ?)',
      [userId, listingId]
    )
    res.status(201).json({ message: 'Listing bookmarked!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ===== GET BOOKMARKS =====
// GET /api/bookmarks -- gets all bookmarked listings for the logged in user
// joins the bookmarks table with the listings table to get full listing details
router.get('/bookmarks', auth, async (req, res) => {
  const userId = req.user.id

  try {
    // JOIN combines two tables -- get bookmark rows and the full listing details
    const [rows] = await pool.query(
      `SELECT listings.* FROM bookmarks 
       JOIN listings ON bookmarks.listing_id = listings.id 
       WHERE bookmarks.user_id = ?`,
      [userId]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ===== REMOVE BOOKMARK =====
// DELETE /api/bookmarks/:id -- user removes a bookmark
router.delete('/bookmarks/:id', auth, async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    await pool.query(
      'DELETE FROM bookmarks WHERE listing_id = ? AND user_id = ?',
      [id, userId]
    )
    res.json({ message: 'Bookmark removed!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router