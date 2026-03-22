// useState manages component state -- selectedDept, hoveredDept, departments list
// useEffect runs code when the page first loads
// useRef gives us a reference to the SVG element so D3 can draw on it
import { useState, useEffect, useRef } from 'react'

// D3 is a data visualization library -- we use it to draw the Colombia map as an SVG
import * as d3 from 'd3'

// Free public GeoJSON for Colombia departments
const COLOMBIA_GEO = 'https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/3aadedf47badbdac823b00dbe259f6bc6d9e1899/colombia.geo.json'

function Explore() {
  // Stores all 32 departments from API-Colombia
  const [departments, setDepartments] = useState([])
  // Stores the department the user clicked on
  const [selectedDept, setSelectedDept] = useState(null)
  // Stores the department the user is hovering over
  const [hoveredDept, setHoveredDept] = useState(null)
  // Reference to the SVG element where D3 draws the map
  const svgRef = useRef(null)

  // ===== FETCH DEPARTMENTS =====
  // Fetches all departments from API-Colombia when the page loads
  useEffect(() => {
    fetch('https://api-colombia.com/api/v1/Department')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Failed to load departments', err))
  }, [])

  // ===== DRAW MAP =====
  // Draws the Colombia map using D3 once the GeoJSON is loaded
  useEffect(() => {
    if (!svgRef.current) return

    const width = 500
    const height = 600

    // Clear any previous map drawing
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto')

    // Mercator projection centered on Colombia
    const projection = d3.geoMercator()
      .center([-74, 4])
      .scale(800)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    // Fetch and draw the GeoJSON
    d3.json(COLOMBIA_GEO).then(geoData => {
      svg.selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#1a5c38')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .style('cursor', 'pointer')
        .on('mouseenter', function(event, d) {
          d3.select(this).attr('fill', '#f4c430')
          setHoveredDept(d.properties.NOMBRE_DPT)
        })
        .on('mouseleave', function() {
          d3.select(this).attr('fill', '#1a5c38')
          setHoveredDept(null)
        })
        .on('click', function(event, d) {
  console.log('clicked:', d.properties.NOMBRE_DPT)
  console.log('departments:', departments.map(d => d.name))
  const name = d.properties.NOMBRE_DPT
  const match = departments.find(
    dept => dept.name.toLowerCase() === name.toLowerCase()
  )
  console.log('match:', match)
  setSelectedDept(match || { name })
})
    })
  }, [departments])

  return (
    <main className="explore-page">

      <h1>Explore Colombia</h1>
      <p>Click a department on the map to learn more about it.</p>

      {/* ===== INTERACTIVE MAP =====
          Drawn with D3 using Colombia GeoJSON
          Hover turns department yellow, click opens detail panel */}
      <div className="map-container">
        <svg ref={svgRef} />
        {hoveredDept && (
          <p className="map-tooltip">{hoveredDept}</p>
        )}
      </div>

      {/* ===== DEPARTMENT DETAIL PANEL =====
          Shows when a department is clicked
          Data comes from API-Colombia */}
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
          All 32 departments as clickable cards
          Clicking a card opens the same detail panel as clicking the map */}
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