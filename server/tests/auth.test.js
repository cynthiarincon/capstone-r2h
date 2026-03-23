// simple tests to make sure my auth routes work
// run with: cd server then node tests/auth.test.js

const BASE_URL = 'http://localhost:3000/api'

// test register
const testRegister = async () => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser2',
      password: 'test123',
      role: 'user'
    })
  })
  const data = await response.json()
  console.log('Register test:', response.ok ? '✅ PASSED' : '❌ FAILED', data.message || data.error)
}

// test login
const testLogin = async () => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser',
      password: 'test123'
    })
  })
  const data = await response.json()
  console.log('Login test:', response.ok ? '✅ PASSED' : '❌ FAILED', data.token ? 'token received' : data.error)
  return data.token
}

// test generate trip
const testGenerateTrip = async () => {
  const response = await fetch(`${BASE_URL}/generateTrip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      region: 'Caribe',
      duration: '1-3 days',
      style: 'Adventure',
      group: 'Solo'
    })
  })
  const data = await response.json()
  console.log('Generate trip test:', response.ok ? '✅ PASSED' : '❌ FAILED', data.itinerary ? 'itinerary received' : data.error)
}

// test get listings
const testGetListings = async () => {
  const response = await fetch(`${BASE_URL}/listings`)
  const data = await response.json()
  console.log('Get listings test:', response.ok ? '✅ PASSED' : '❌ FAILED', `${data.length} listings found`)
}

// run all tests
const runTests = async () => {
  console.log('running tests...\n')
  await testRegister()
  await testLogin()
  await testGenerateTrip()
  await testGetListings()
  console.log('\ndone!')
}

runTests()
