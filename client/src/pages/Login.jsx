import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function Login() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [role, setRole] = useState('user') // 'user' or 'admin'
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' })

  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setMode('register')
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submitted', { mode, role, form })
    // backend connection comes later
  }

  return (
    <main className="login-page">

      <div className="login-card">

        {/* Role toggle */}
        <div className="role-toggle">
          <button
            className={`role-btn ${role === 'user' ? 'active' : ''}`}
            onClick={() => setRole('user')}
          >
            User
          </button>
          <button
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
        </div>

        <h1 className="login-title">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="login-subtitle">
          {role === 'admin' ? 'Admin access only' : 'Your Colombia adventure awaits'}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="btn-primary login-submit">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Switch between login and register */}
        <p className="login-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="login-switch-btn"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

      </div>
    </main>
  )
}

export default Login