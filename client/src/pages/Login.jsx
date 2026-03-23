// useSearchParams reads the URL to check if ?mode=register was passed from the navbar
// useState manages all my form state and toggles
// useEffect runs code when the page first loads
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function Login() {
  // reads the URL to check if Sign Up button was clicked from the Navbar
  const [searchParams] = useSearchParams()

  // controls which tab is showing -- login or register
  const [mode, setMode] = useState('login')

  // controls which account type -- user or host
  const [role, setRole] = useState('user')

  // stores everything the user types into the form inputs
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    department: '',
    bio: ''
  })

  // if the url has ?mode=register open register tab automatically
  // this is how the navbar sign up button opens the register tab
  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setMode('register')
    }
  }, [])

  // updates the matching form field every time the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ===== HANDLE SUBMIT =====
  // this runs when the user clicks Sign In or Create Account
  // it calls my backend routes to register or login
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (mode === 'register') {
        // ===== REGISTER =====
        // send the form data to my /api/register route
        // the backend hashes the password and saves to the database
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
            role: role,
            businessName: form.businessName,
            department: form.department,
            bio: form.bio
          })
        })

        const data = await response.json()

        if (response.ok) {
          // registration worked -- switch to login tab
          alert('Account created! Please sign in.')
          setMode('login')
        } else {
          // something went wrong -- show the error
          alert(data.error)
        }

      } else {
        // ===== LOGIN =====
        // send username and password to my /api/login route
        // the backend checks the password and returns a JWT token
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password
          })
        })

        const data = await response.json()

        if (response.ok) {
          // login worked -- save the token and user info to localStorage
          // localStorage keeps this info even if the user refreshes the page
          localStorage.setItem('token', data.token)
          localStorage.setItem('username', data.username)
          localStorage.setItem('role', data.role)

          // redirect to home page
          alert(`Welcome back ${data.username}!`)
          window.location.href = '/'
        } else {
          alert(data.error)
        }
      }

    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">

        {/* sign in / sign up tabs */}
        <div className="role-toggle">
          <button className={`role-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
          <button className={`role-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Sign Up</button>
        </div>

        {/* title changes based on mode */}
        <h1 className="login-title">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h1>
        <p className="login-subtitle">{mode === 'login' ? 'Sign in to your account' : 'Join Descubre Colombia'}</p>

        <form onSubmit={handleSubmit} className="login-form">

          {/* user or host toggle -- only shows on register */}
          {mode === 'register' && (
            <div className="role-toggle">
              <button type="button" className={`role-btn ${role === 'user' ? 'active' : ''}`} onClick={() => setRole('user')}>User</button>
              <button type="button" className={`role-btn ${role === 'host' ? 'active' : ''}`} onClick={() => setRole('host')}>Host</button>
            </div>
          )}

          {/* username -- shows for everyone */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-input" placeholder="Enter your username" value={form.username} onChange={handleChange} required />
          </div>

          {/* password -- shows for everyone */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
          </div>

          {/* confirm password -- only shows on register */}
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" name="confirmPassword" className="form-input" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          )}

          {/* host only fields -- only shows when registering as host */}
          {mode === 'register' && role === 'host' && (
            <>
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input type="text" name="businessName" className="form-input" placeholder="Enter your business name" value={form.businessName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input type="text" name="department" className="form-input" placeholder="Which department are you based in?" value={form.department} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea name="bio" className="form-input" placeholder="Tell travelers about yourself" value={form.bio} onChange={handleChange} required />
              </div>
            </>
          )}

          {/* submit button -- text changes based on mode */}
          <button type="submit" className="btn-primary login-submit">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

        </form>

      </div>
    </main>
  )
}

export default Login