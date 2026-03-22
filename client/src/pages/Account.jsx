// Account page -- shown to logged in users
// Displays saved trips and bookmarked host listings

function Account() {
  return (
    <main className="account-page">

      <h1>My Account</h1>

      {/* ===== USER INFO =====
          Will show username and account type (user or host)
          Data pulled from JWT token / backend */}
      <div className="account-info">
        <h2>Welcome back!</h2>
        <p>Username: --</p>
        <p>Account type: User</p>
      </div>

      {/* ===== SAVED TRIPS =====
          Shows all itineraries the user has generated and saved
          Data pulled from /api/trips */}
      <div className="saved-trips">
        <h2>My Saved Trips</h2>
        <p>Your saved itineraries will appear here.</p>
        <div className="trips-grid">
          {/* trip cards will go here */}
        </div>
      </div>

      {/* ===== BOOKMARKED LISTINGS =====
          Shows all host listings the user has bookmarked from the Explore page
          Data pulled from /api/bookmarks */}
      <div className="bookmarked-listings">
        <h2>Bookmarked Experiences</h2>
        <p>Host experiences you have saved from the Explore page will appear here.</p>
        <div className="listings-grid">
          {/* listing cards will go here */}
        </div>
      </div>

    </main>
  )
}

export default Account