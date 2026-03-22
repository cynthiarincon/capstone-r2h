// hooks I need for this page
import { useState, useEffect, useRef } from 'react'

// d3 helps me draw the map as an SVG
import * as d3 from 'd3'

// the colombia map shape data
const COLOMBIA_GEO = 'https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/3aadedf47badbdac823b00dbe259f6bc6d9e1899/colombia.geo.json'

function Explore() {
  // all my state variables
  const [departments, setDepartments] = useState([])
  const [touristic, setTouristic] = useState([])
  const [dishes, setDishes] = useState([])
  const [airports, setAirports] = useState([])
  const [festivals, setFestivals] = useState([])
  const [heritage, setHeritage] = useState([])
  const [regions, setRegions] = useState([])
  const [selectedDept, setSelectedDept] = useState(null)
  const [hoveredDept, setHoveredDept] = useState(null)
  // this connects to the svg element so d3 can draw on it
  const svgRef = useRef(null)

  // fetch all the data I need from api-colombia when the page loads
  useEffect(() => {
    fetch('https://api-colombia.com/api/v1/Department')
      .then(r => r.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Failed to load departments', err))

    fetch('https://api-colombia.com/api/v1/TouristicAttraction')
      .then(r => r.json())
      .then(data => setTouristic(data))
      .catch(err => console.error('Failed to load touristic', err))

    fetch('https://api-colombia.com/api/v1/TypicalDish')
      .then(r => r.json())
      .then(data => setDishes(data))
      .catch(err => console.error('Failed to load dishes', err))

    fetch('https://api-colombia.com/api/v1/Airport')
      .then(r => r.json())
      .then(data => setAirports(data))
      .catch(err => console.error('Failed to load airports', err))

    fetch('https://api-colombia.com/api/v1/TraditionalFairAndFestival')
      .then(r => r.json())
      .then(data => setFestivals(data))
      .catch(err => console.error('Failed to load festivals', err))

    fetch('https://api-colombia.com/api/v1/IntangibleHeritage')
      .then(r => r.json())
      .then(data => setHeritage(data))
      .catch(err => console.error('Failed to load heritage', err))

    fetch('https://api-colombia.com/api/v1/Region')
      .then(r => r.json())
      .then(data => setRegions(data))
      .catch(err => console.error('Failed to load regions', err))
  }, [])

  // draw the map once departments are loaded
  useEffect(() => {
    if (!svgRef.current) return

    const width = 500
    const height = 600

    // clear the map before redrawing
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto')

    // center the map on colombia
    const projection = d3.geoMercator()
      .center([-74, 4])
      .scale(800)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    // load the geojson and draw each department
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
        // turn yellow on hover
        .on('mouseenter', function(event, d) {
          d3.select(this).attr('fill', '#f4c430')
          setHoveredDept(d.properties.NOMBRE_DPT)
        })
        // back to green when not hovering
        .on('mouseleave', function() {
          d3.select(this).attr('fill', '#1a5c38')
          setHoveredDept(null)
        })
        // find the matching department from api-colombia when clicked
        .on('click', function(event, d) {
          console.log('clicked:', d.properties.NOMBRE_DPT)
          const name = d.properties.NOMBRE_DPT
          const match = departments.find(
            dept => dept.name.toLowerCase() === name.toLowerCase()
          )
          setSelectedDept(match || { name })
        })
    })
  }, [departments])

  // filter data to only show info for the clicked department
  const deptTouristic = selectedDept ? touristic.filter(t => t.city?.departmentId === selectedDept.id) : []
  const deptDishes = selectedDept ? dishes.filter(d => d.departmentId === selectedDept.id) : []
  const deptAirports = selectedDept ? airports.filter(a => a.deparmentId === selectedDept.id) : []
  const deptFestivals = selectedDept ? festivals.filter(f => f.city?.departmentId === selectedDept.id) : []
  const deptHeritage = selectedDept ? heritage.filter(h => h.departmentId === selectedDept.id) : []
  const deptRegion = selectedDept ? regions.find(r => r.id === selectedDept.regionId)?.name || '--' : '--'

  return (
    <main className="explore-page">

      <h1>Explore Colombia</h1>
      <p>Hover over a department to see its name. Click to learn more about it.</p>

      {/* map */}
      <div className="map-container">
        <svg ref={svgRef} />
        {hoveredDept && <p className="map-tooltip">📍 {hoveredDept}</p>}
      </div>

      {/* detail panel -- shows when you click a department */}
      {selectedDept ? (
        <div className="dept-panel">
          <button className="close-btn" onClick={() => setSelectedDept(null)}>✕ Close</button>
          <h2>{selectedDept.name}</h2>
          <p><strong>Region:</strong> {deptRegion}</p>
          <p><strong>Capital:</strong> {selectedDept.cityCapital?.name || '--'}</p>
          <p><strong>Population:</strong> {selectedDept.population?.toLocaleString() || '--'}</p>
          <p><strong>Surface:</strong> {selectedDept.surface?.toLocaleString()} km²</p>
          <p><strong>Municipalities:</strong> {selectedDept.municipalities}</p>

          {/* tourist attractions */}
          {deptTouristic.length > 0 && (
            <div>
              <h3>🎭 Tourist Attractions</h3>
              {deptTouristic.map(t => (
                <div key={t.id} className="detail-item">
                  <strong>{t.name}</strong>
                  <p className="detail-desc">{t.description}</p>
                  {t.images?.[0] && <img src={t.images[0]} alt={t.name} className="detail-img" onError={(e) => e.target.style.display = 'none'} />}
                </div>
              ))}
            </div>
          )}

          {/* typical dishes */}
          {deptDishes.length > 0 && (
            <div>
              <h3>🍽️ Typical Dishes</h3>
              {deptDishes.map(d => (
                <div key={d.id} className="detail-item">
                  <strong>{d.name}</strong>
                  <p className="detail-desc">Ingredients: {d.ingredients}</p>
                  {d.imageUrl && <img src={d.imageUrl} alt={d.name} className="detail-img" onError={(e) => e.target.style.display = 'none'} />}
                </div>
              ))}
            </div>
          )}

          {/* festivals */}
          {deptFestivals.length > 0 && (
            <div>
              <h3>🎉 Festivals & Fairs</h3>
              {deptFestivals.map(f => (
                <div key={f.id} className="detail-item">
                  <strong>{f.name}</strong>
                  <p className="detail-desc">{f.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* cultural heritage */}
          {deptHeritage.length > 0 && (
            <div>
              <h3>🏛️ Cultural Heritage</h3>
              {deptHeritage.map(h => (
                <div key={h.id} className="detail-item">
                  <strong>{h.name}</strong>
                  <p className="detail-desc">{h.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* airports */}
          {deptAirports.length > 0 && (
            <div>
              <h3>✈️ Airports</h3>
              {deptAirports.map(a => (
                <div key={a.id} className="detail-item">
                  <strong>{a.name}</strong>
                  <p className="detail-desc">Type: {a.type} | IATA: {a.iataCode}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      ) : (
        <div className="dept-panel">
          <h2>Click a department on the map</h2>
          <p>Select any department to see its region, capital, population, tourist attractions, typical dishes, festivals, cultural heritage, and airports.</p>
        </div>
      )}

      {/* host listings -- will come from the database later */}
      <div>
        <h2>Local Experiences</h2>
        <p>Host-offered experiences will appear here once hosts start creating listings.</p>
      </div>

    </main>
  )
}

export default Explore