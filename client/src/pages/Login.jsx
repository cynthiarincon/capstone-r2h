import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function Login() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('user')
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    department: '',
    bio: ''
  })
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setMode('register')
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    try {
      if (mode === 'register') {
        const response = await fetch('https://capstone-r2h.onrender.com/api/register', {
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
          setMessage({ text: 'Account created! Please sign in.', type: 'success' })
          setMode('login')
        } else {
          setMessage({ text: data.error, type: 'error' })
        }

      } else {
        const response = await fetch('https://capstone-r2h.onrender.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password
          })
        })
        const data = await response.json()
        if (response.ok) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('username', data.username)
          localStorage.setItem('role', data.role)
          window.location.href = '/'
        } else {
          setMessage({ text: data.error, type: 'error' })
        }
      }

    } catch (err) {
      console.error(err)
      setMessage({ text: 'Something went wrong. Please try again.', type: 'error' })
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">

        <div className="role-toggle">
          <button className={`role-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
          <button className={`role-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Sign Up</button>
        </div>

        <h1 className="login-title">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h1>
        <p className="login-subtitle">{mode === 'login' ? 'Sign in to your account' : 'Join Explore Colombia'}</p>

        {message.text && (
          <p style={{
            color: message.type === 'error' ? 'var(--coral-red)' : 'var(--forest-green)',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="login-form">

          {mode === 'register' && (
            <div className="role-toggle">
              <button type="button" className={`role-btn ${role === 'user' ? 'active' : ''}`} onClick={() => setRole('user')}>User</button>
              <button type="button" className={`role-btn ${role === 'host' ? 'active' : ''}`} onClick={() => setRole('host')}>Host</button>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-input" placeholder="Enter your username" value={form.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
          </div>

          {/* forgot password link -- aesthetic only for now */}
          {mode === 'login' && (
            <p style={{ fontSize: '0.85rem', color: 'var(--forest-green)', textAlign: 'right', cursor: 'pointer', marginTop: '-0.5rem' }}>
              Forgot password?
            </p>
          )}

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" name="confirmPassword" className="form-input" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          )}

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

          <button type="submit" className="btn-primary login-submit">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

        </form>

      </div>
    </main>
  )
}

export default Login