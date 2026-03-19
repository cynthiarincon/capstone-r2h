import placeholderMap from '../assets/placeholdermap.png'

function Explore() {
  return (
    <main className="explore-page">

      <h1>Explore Colombia</h1>
      <p>Discover departments, regions, food, attractions and more.</p>

      {/* Region filters */}
      <div className="region-filters">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Caribe</button>
        <button className="filter-btn">Andina</button>
        <button className="filter-btn">Pacífico</button>
        <button className="filter-btn">Orinoquía</button>
        <button className="filter-btn">Amazonía</button>
        <button className="filter-btn">Insular</button>
      </div>
      <p>Filter departments by region using the buttons above.</p>

      {/* Map */}
      <div className="map-container">
        <img src={placeholderMap} alt="Map of Colombia" />
        <p>Placeholder map -- will be replaced with an interactive map built with react-simple-maps. Hover over a department to highlight it and click to see its attractions, dishes, airports and natural areas.</p>
      </div>

      {/* Regions */}
      <h2>Regions of Colombia</h2>
      <p>Colombia is divided into 6 natural regions. Data pulled from API-Colombia.</p>
      <div className="regions-grid">
      </div>

      {/* Departments */}
      <h2>Departments</h2>
      <p>All 32 departments with capital city and population. Filterable by region.</p>
      <div className="departments-grid">
      </div>

      {/* Tourist Attractions */}
      <h2>Tourist Attractions</h2>
      <p>Top attractions across Colombia with images, descriptions and locations.</p>
      <div className="attractions-grid">
      </div>

      {/* Typical Dishes */}
      <h2>Typical Dishes</h2>
      <p>Traditional Colombian food by department with ingredients and images.</p>
      <div className="dishes-grid">
      </div>

      {/* Natural Areas */}
      <h2>Natural Areas</h2>
      <p>National parks, rainforests, deserts and natural reserves across Colombia.</p>
      <div className="natural-grid">
      </div>

      {/* Airports */}
      <h2>Airports</h2>
      <p>International and national airports by department including IATA codes.</p>
      <div className="airports-grid">
      </div>

      {/* About Colombia */}
      <h2>About Colombia</h2>
      <p>Country overview including flag, currency, languages, population and borders.</p>
      <div className="overview-grid">
      </div>

    </main>
  )
}

export default Explore