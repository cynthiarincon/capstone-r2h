// main server file -- sets up express and connects all the routes
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// import all my route files
import authRoutes from './routes/authRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
import listingRoutes from './routes/listingRoutes.js'
import bookmarkRoutes from './routes/bookmarkRoutes.js'

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

// connect all my routes to the app
// every route in authRoutes will start with /api
app.use('/api', authRoutes)
app.use('/api', tripRoutes)
app.use('/api', listingRoutes)
app.use('/api', bookmarkRoutes)

// when I run node server.js this is the message I see
app.listen(3000, () => {
  console.log('Woohoo server is running on port 3000!')
})