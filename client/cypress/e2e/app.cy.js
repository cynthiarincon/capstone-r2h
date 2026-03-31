// E2E tests for Explore Colombia
// these tests simulate a real user going through the app

describe('Explore Colombia', () => {

  // test that the home page loads
  it('should load the home page', () => {
    cy.visit('http://localhost:5173')
    cy.contains('Explore Colombia').should('exist')
  })

  // test that the explore page loads and map shows
  it('should load the explore page with the map', () => {
    cy.visit('http://localhost:5173/explore')
    cy.get('svg').should('exist')
  })

  // test that login page loads with sign in and sign up tabs
  it('should load the login page', () => {
    cy.visit('http://localhost:5173/login')
    cy.contains('Sign In').should('exist')
    cy.contains('Sign Up').should('exist')
  })

  // test that a user can register
  it('should allow a user to register', () => {
    cy.visit('http://localhost:5173/login')
    cy.contains('Sign Up').click()
    cy.get('input[name="username"]').type('cypressuser')
    cy.get('input[name="password"]').type('test1234')
    cy.get('input[name="confirmPassword"]').type('test1234')
    cy.contains('Create Account').click()
    cy.contains('Account created').should('exist')
  })

  // test that a user can log in
  it('should allow a user to log in', () => {
    cy.visit('http://localhost:5173/login')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('test123')
    cy.contains('Sign In').click()
    cy.url().should('eq', 'http://localhost:5173/')
  })

  // test that trip planner redirects to login if not signed in
  it('should redirect to login if not signed in and visiting planner', () => {
    cy.clearLocalStorage()
    cy.visit('http://localhost:5173/planner')
    cy.url().should('include', '/login')
  })

  // test that trip planner loads when signed in
  it('should load trip planner when signed in', () => {
    cy.visit('http://localhost:5173/login')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('test123')
    cy.contains('Sign In').click()
    cy.visit('http://localhost:5173/planner')
    cy.contains('Trip Planner').should('exist')
  })

  // test that navbar shows log out when logged in
  it('should show logout button when logged in', () => {
    cy.visit('http://localhost:5173/login')
    cy.get('input[name="username"]').type('testuser')
    cy.get('input[name="password"]').type('test123')
    cy.contains('Sign In').click()
    cy.contains('Log Out').should('exist')
  })

})