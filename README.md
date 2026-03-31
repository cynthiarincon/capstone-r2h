# 🌿 Explore Colombia

### [Live Demo → capstone-r2h.vercel.app](https://capstone-r2h.vercel.app)

---
<img width="400" height="958" alt="Screenshot 2026-03-30 at 10 16 46 PM" src="https://github.com/user-attachments/assets/1361167f-244f-41ce-a539-cf7a61aa6b41" />

<img width="400" height="959" alt="Screenshot 2026-03-30 at 10 17 58 PM" src="https://github.com/user-attachments/assets/44e1268b-ac1e-434c-af3f-b07e6887b608" />


---

## What is Explore Colombia?

Explore Colombia is a full-stack travel discovery platform built for first-time visitors to Colombia. Instead of jumping between 10 different tabs, users can explore Colombia's 32 departments on an interactive map, discover real cultural data, and generate a personalized AI-powered itinerary — all in one place.

Built as a capstone project for Road to Hire Cohort 18.

---

## Features

- **Interactive D3.js Map** — Click any of Colombia's 32 departments to explore tourist attractions, typical dishes, festivals, cultural heritage, and airports pulled from API-Colombia
- **AI Trip Planner** — Generate a personalized day-by-day itinerary using Groq's Llama 3.3 model based on your region, travel style, duration, and group
- **Two Account Types** — Users can save trips and browse experiences. Hosts can create and manage local experience listings
- **JWT Authentication** — Secure register and login with bcrypt password hashing
- **Save Trips** — Name and save your AI-generated itineraries to your account
- **Host Listings** — Hosts create experience listings that appear on the Explore page and Trip Planner by region
- **Responsive Design** — Mobile-first layout with breakpoints at 768px and 1024px

---

## Tech Stack

**Frontend**
- React + Vite
- React Router
- D3.js
- react-markdown
- CSS custom properties

**Backend**
- Node.js + Express
- JWT (jsonwebtoken)
- bcrypt
- mysql2

**Database**
- MySQL on AWS RDS

**AI**
- Groq API (llama-3.3-70b-versatile)

**External API**
- API-Colombia (departments, tourist attractions, dishes, festivals, heritage, airports)

---

## Database Schema

5 tables connected by foreign keys:
```
users       -- stores all accounts (users and hosts)
hosts       -- extra info for host accounts
listings    -- host experience listings
trips       -- saved AI-generated itineraries
bookmarks   -- user saved listings
```

---

## Getting Started

### Prerequisites
- Node.js
- MySQL

### Clone the repo
```bash
git clone https://github.com/cynthiarincon/capstone-r2h.git
cd capstone-r2h
```

### Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```
DB_HOST=your-rds-endpoint
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=explore_colombia
GROQ_API_KEY=your-groq-api-key
JWT_SECRET=your-jwt-secret
PORT=3000
```

Run the database setup (creates all tables):
```bash
node db-setup.js
```

Start the server:
```bash
node server.js
```

### Set up the frontend
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:
```
VITE_API_URL=http://localhost:3000
```

Start the frontend:
```bash
npm run dev
```

App runs on `http://localhost:5173`

---

## API Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | /api/register | Create a new account | No |
| POST | /api/login | Login and receive JWT token | No |
| POST | /api/generateTrip | Generate AI itinerary via Groq | No |
| POST | /api/saveTrip | Save a trip to the database | Yes |
| GET | /api/trips | Get all saved trips for logged in user | Yes |
| POST | /api/listings | Create a new host listing | Yes |
| GET | /api/listings | Get all listings, filterable by region | No |
| GET | /api/mylistings | Get listings for the logged in host | Yes |
| DELETE | /api/listings/:id | Delete a listing | Yes |
| POST | /api/bookmarks | Bookmark a listing | Yes |
| GET | /api/bookmarks | Get bookmarked listings | Yes |
| DELETE | /api/bookmarks/:id | Remove a bookmark | Yes |

---

## Pages

| Page | Description |
|------|-------------|
| Home | Landing page with Colombia overview and featured destinations |
| Explore Colombia | Interactive D3.js map with real API-Colombia data by department |
| Trip Planner | AI-powered itinerary generator with host experience listings |
| Login | Register and login for users and hosts |
| Account | View and manage saved trips |
| Host Dashboard | Create and manage experience listings |

---

## Key Technical Decisions

- **D3.js over react-simple-maps** — react-simple-maps had peer dependency conflicts with React 19, so I used D3.js directly with a Colombia GeoJSON file
- **Groq over Gemini** — Gemini free tier had a `limit: 0` quota issue, Groq's free tier is more generous
- **JWT in localStorage** — Simple and effective for a student project. HTTP-only cookies would be a production improvement
- **Connection pool** — Used mysql2 connection pool instead of individual connections for better performance
- **Normalized database** — Separated users and hosts into two tables to avoid storing empty columns for regular users

---

## Challenges & Wins

**Biggest Challenge:**
Connecting to AWS RDS required enabling public access, adding a security group inbound rule for port 3306, and downloading an SSL certificate — all steps I had never done before.

**Biggest Win:**
Building the interactive D3.js map. I had to learn GeoJSON, D3's projection system, and figure out how to match ALL CAPS department names from GeoJSON to proper case names from API-Colombia using `.toLowerCase()`.

---

## What's Next

- English translation for API-Colombia Spanish content using Groq
- Bookmark button on Explore page
- Edit and delete saved trips

---

## Author

**Cynthia Rincon**
Road to Hire Cohort 18 | Full-Stack Software Development Apprentice
