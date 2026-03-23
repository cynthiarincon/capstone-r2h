// handles registering and logging in for both users and hosts
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// ===== REGISTER =====
// POST /api/register -- creates a new account
// anyone can hit this route -- no token needed
router.post('/register', async (req, res) => {
  const { username, password, role, businessName, department, bio } = req.body

  try {
    // hash the password before saving -- never store plain text passwords!
    // bcrypt scrambles the password so even if someone hacks the database they cant read it
    const hashedPassword = await bcrypt.hash(password, 10)

    // save the new user to the users table
    const [result] = await pool.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'user']
    )

    // get the id of the user we just created
    const userId = result.insertId

    // if this is a host account save their extra info to the hosts table
    if (role === 'host') {
      await pool.query(
        'INSERT INTO hosts (user_id, business_name, department, bio) VALUES (?, ?, ?, ?)',
        [userId, businessName, department, bio]
      )
    }

    res.status(201).json({ message: 'Account created successfully!' })

  } catch (err) {
    console.error(err)
    // ER_DUP_ENTRY means the username is already taken
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username already taken' })
    }
    res.status(500).json({ error: 'Server error' })
  }
})

// ===== LOGIN =====
// POST /api/login -- logs in and returns a JWT token
// the token is what proves the user is logged in on future requests
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    // look up the user by username in the database
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )

    // if no user found return an error
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    const user = rows[0]

    // compare the password they typed with the hashed password in the database
    // bcrypt does this comparison securely
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    // create a JWT token with the users info inside it
    // this token expires after 7 days
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // send the token and user info back to the frontend
    res.json({ token, username: user.username, role: user.role })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router