import express from 'express'
import cors from 'cors'

const app = express()

//Allows my React app (frontend) to talk to this server (backend)
app.use(cors())

// Parses incoming JSON so the server can read data sent from the frontend!
app.use(express.json())

//TEST
//Test routes - just to make sure the server is working
app.get('/', (req, res)=>{
    res.json({ Message: 'Heelloooo'})
})

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!'})
})

//When I node server.js - this is the message I see
app.listen(3000, ()=> {
    console.log('Woohoo servers running on port 3000!')
})