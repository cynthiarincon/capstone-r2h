import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// allows my React app (frontend) to talk to this server (backend)
app.use(cors())

// parses incoming JSON so the server can read data sent from the frontend
app.use(express.json())

// test routes -- just to make sure the server is working
app.get('/', (req, res) => {
  res.json({ message: 'Heelloooo' })
})

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' })
})

// POST /api/generateTrip -- builds a prompt and sends it to Groq
// Groq returns a personalized Colombia itinerary based on the users selections
app.post('/api/generateTrip', async (req, res) => {
  const { region, duration, style, group, selectedListings } = req.body

  console.log('Received request:', { region, duration, style, group })

  // build the prompt using the users selections
  let prompt = `Plan me a ${duration} trip in the ${region} region of Colombia.
  Travel style: ${style}. Traveling with: ${group}.
  Please provide a detailed day by day itinerary with activities, food recommendations, and travel tips.
  Write everything in English.`

  // if the user picked host listings add them to the prompt
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

// when I run node server.js this is the message I see
app.listen(3000, () => {
  console.log('Woohoo server is running on port 3000!')
})