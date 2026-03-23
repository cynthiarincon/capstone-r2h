// this file checks if a user is logged in before they can access protected routes
// it works like a bouncer at a door -- if you dont have a valid token you cant get in
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const auth = (req, res, next) => {

  // get the token from the request header
  // when the frontend sends a request it includes the token like: Authorization: Bearer <token>
  const token = req.headers.authorization?.split(' ')[1]

  // if there is no token, block the request
  if (!token) {
    return res.status(401).json({ error: 'No token provided, please log in' })
  }

  try {
    // verify the token using my JWT secret
    // if the token is valid it gives me back the user info I stored in it
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // attach the user info to the request so my routes can use it
    req.user = decoded

    // move on to the next step (the actual route)
    next()

  } catch (err) {
    return res.status(401).json({ error: 'Invalid token, please log in again' })
  }
}

export default auth