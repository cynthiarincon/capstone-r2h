import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function Login() {
  const [searchParams] = useSearchParams()
  // login or register
  const [mode, setMode] = useState('login')
  // user or host
  const [role, setRole] = useState('user')
  // form fields
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    department: '',
    bio: ''
  })

  // open register tab if coming from navbar sign up button
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

        {/* sign in / sign up tabs */}
        <div className="role-toggle">
          <button className={`role-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
          <button className={`role-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Sign Up</button>
        </div>

        <h1 className="login-title">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h1>
        <p className="login-subtitle">{mode === 'login' ? 'Sign in to your account' : 'Join Explore Colombia'}</p>

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

          {/* confirm password -- only on register */}
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" name="confirmPassword" className="form-input" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          )}

          {/* host only fields -- only on register as host */}
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