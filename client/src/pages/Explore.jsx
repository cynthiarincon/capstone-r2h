// useState manages component state -- selectedDept, hoveredDept, departments list
// useEffect runs the API fetch when the page first loads
import { useState, useEffect } from 'react'

// react-simple-maps library -- ComposableMap is the map wrapper,
// Geographies loads the GeoJSON shape data, Geography is each individual department shape
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

// Free public GeoJSON for Colombia departments
const COLOMBIA_GEO = 'https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/3aadedf47badbdac823b00dbe259f6bc6d9e1899/colombia.geo.json'

function Explore() {
  const [departments, setDepartments] = useState([])
  const [selectedDept, setSelectedDept] = useState(null)
  const [hoveredDept, setHoveredDept] = useState(null)

  // Fetch all departments from API-Colombia on page load
  useEffect(() => {
    fetch('https://api-colombia.com/api/v1/Department')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Failed to load departments', err))
  }, [])

  return (
    <main className="explore-page">

      <h1>Explore Colombia</h1>
      <p>Click a department on the map to learn more about it.</p>

      {/* ===== INTERACTIVE MAP =====
          Built with react-simple-maps and Colombia GeoJSON
          Hover highlights a department, click opens the detail panel */}
      <div className="map-container">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 800, center: [-74, 4] }}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={COLOMBIA_GEO}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredDept(geo.properties.NOMBRE_DPT)}
                  onMouseLeave={() => setHoveredDept(null)}
                  onClick={() => {
                    const match = departments.find(
                      d => d.name.toLowerCase() === geo.properties.NOMBRE_DPT.toLowerCase()
                    )
                    setSelectedDept(match || { name: geo.properties.NOMBRE_DPT })
                  }}
                  style={{
                    default: { fill: '#1a5c38', stroke: '#fff', strokeWidth: 0.5, outline: 'none' },
                    hover: { fill: '#f4c430', stroke: '#fff', strokeWidth: 0.5, outline: 'none' },
                    pressed: { fill: '#e63946', stroke: '#fff', strokeWidth: 0.5, outline: 'none' }
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>

        {/* Shows department name on hover */}
        {hoveredDept && (
          <p className="map-tooltip">{hoveredDept}</p>
        )}
      </div>

      {/* ===== DEPARTMENT DETAIL PANEL =====
          Shows when a department is clicked on the map
          Displays data from API-Colombia */}
      {selectedDept && (
        <div className="dept-panel">
          <button onClick={() => setSelectedDept(null)}>✕ Close</button>
          <h2>{selectedDept.name}</h2>
          <p><strong>Capital:</strong> {selectedDept.cityCapital?.name || '--'}</p>
          <p><strong>Population:</strong> {selectedDept.population?.toLocaleString() || '--'}</p>
          <p><strong>Surface:</strong> {selectedDept.surface?.toLocaleString()} km²</p>
          <p><strong>Municipalities:</strong> {selectedDept.municipalities}</p>
          <p>{selectedDept.description}</p>
        </div>
      )}

      {/* ===== DEPARTMENTS LIST =====
          Shows all departments as cards below the map */}
      <h2>All Departments</h2>
      <div className="departments-grid">
        {departments.map(dept => (
          <div
            key={dept.id}
            className="department-card"
            onClick={() => setSelectedDept(dept)}
          >
            <h3>{dept.name}</h3>
            <p>Capital: {dept.cityCapital?.name}</p>
            <p>Population: {dept.population?.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* ===== TOURIST ATTRACTIONS =====
          Coming soon -- will be pulled from /api/v1/Touristic */}
      <h2>Tourist Attractions</h2>
      <p>Coming soon.</p>

      {/* ===== TYPICAL DISHES =====
          Coming soon -- will be pulled from /api/v1/TypicalDish */}
      <h2>Typical Dishes</h2>
      <p>Coming soon.</p>

      {/* ===== NATURAL AREAS =====
          Coming soon -- will be pulled from /api/v1/NaturalArea */}
      <h2>Natural Areas</h2>
      <p>Coming soon.</p>

      {/* ===== AIRPORTS =====
          Coming soon -- will be pulled from /api/v1/Airport */}
      <h2>Airports</h2>
      <p>Coming soon.</p>

      {/* ===== ABOUT COLOMBIA =====
          Coming soon -- will be pulled from /api/v1/Country/Colombia */}
      <h2>About Colombia</h2>
      <p>Coming soon.</p>

    </main>
  )
}

export default Explore