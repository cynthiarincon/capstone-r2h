// handles generating trips with Groq AI and saving/getting trips from the database
import express from 'express'
import pool from '../db.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// ===== GENERATE TRIP =====
// POST /api/generateTrip -- sends selections to Groq and returns an itinerary
// anyone can generate a trip -- no login needed
router.post('/generateTrip', async (req, res) => {
  const { region, duration, style, group, selectedListings } = req.body

  console.log('generating trip for:', { region, duration, style, group })

  // build the prompt using the users selections
  let prompt = `Plan me a ${duration} trip in the ${region} region of Colombia.
  Travel style: ${style}. Traveling with: ${group}.
  Please provide a detailed day by day itinerary with activities, food recommendations, and travel tips.
  Write everything in English.`

  // if the user selected host listings weave them into the prompt
  if (selectedListings && selectedListings.length > 0) {
    const listingNames = selectedListings.map(l => l.title).join(', ')
    prompt += ` Please include these local experiences in the itinerary: ${listingNames}.`
  }

  try {
    // call the Groq API with the prompt
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }]
        })
      }
    )

    const data = await response.json()
    console.log('Groq response status:', response.status)

    const itinerary = data.choices?.[0]?.message?.content

    if (!itinerary) {
      console.error('No itinerary returned:', JSON.stringify(data))
      return res.status(500).json({ error: 'Failed to generate itinerary' })
    }

    res.json({ itinerary })

  } catch (err) {
    console.error('Groq error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ===== SAVE TRIP =====
// POST /api/saveTrip -- saves a trip to the database
// auth middleware checks the token before allowing this
router.post('/saveTrip', auth, async (req, res) => {
  const { region, duration, style, group, itinerary } = req.body

  // req.user comes from the auth middleware -- it has the logged in users id
  const userId = req.user.id

  try {
    await pool.query(
      'INSERT INTO trips (user_id, region, duration, style, travel_group, itinerary) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, region, duration, style, group, itinerary]
    )
    res.status(201).json({ message: 'Trip saved successfully!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ===== GET TRIPS =====
// GET /api/trips -- gets all saved trips for the logged in user
// auth middleware checks the token before allowing this
router.get('/trips', auth, async (req, res) => {
  const userId = req.user.id

  try {
    // get all trips for this user ordered by newest first
    const [rows] = await pool.query(
      'SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router