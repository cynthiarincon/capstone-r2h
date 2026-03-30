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
  const [listings, setListings] = useState([])
  const [selectedDept, setSelectedDept] = useState(null)
  const [hoveredDept, setHoveredDept] = useState(null)
  // tracks which items have their description expanded
  const [expanded, setExpanded] = useState({})
  // this connects to the svg element so d3 can draw on it
  const svgRef = useRef(null)

  // toggles the learn more description for an item
  const toggleExpand = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

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

    const width = 800
    const height = 700

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
      .center([-74, 5])
      .scale(1800)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    // load the geojson and draw each department
    d3.json(COLOMBIA_GEO).then(geoData => {
      svg.selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', path)
        // grey out departments with no api-colombia data
        .attr('fill', (d) => {
          const name = d.properties.NOMBRE_DPT
          const match = departments.find(
            dept => dept.name.toLowerCase() === name.toLowerCase()
          )
          return match ? '#1a5c38' : '#cccccc'
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .style('cursor', 'pointer')
        // turn yellow on hover
        .on('mouseenter', function(event, d) {
          d3.select(this).attr('fill', '#f4c430')
          setHoveredDept(d.properties.NOMBRE_DPT)
        })
        // back to original color when not hovering
        .on('mouseleave', function(event, d) {
          const name = d.properties.NOMBRE_DPT
          const match = departments.find(
            dept => dept.name.toLowerCase() === name.toLowerCase()
          )
          d3.select(this).attr('fill', match ? '#1a5c38' : '#cccccc')
          setHoveredDept(null)
        })
        // find the matching department from api-colombia when clicked
        .on('click', function(event, d) {
          console.log('clicked:', d.properties.NOMBRE_DPT)
          const name = d.properties.NOMBRE_DPT
          const match = departments.find(
            dept => dept.name.toLowerCase() === name.toLowerCase()
          )
          setSelectedDept(match || { name, noData: true })
          setExpanded({})

          // fetch host listings for this departments region
          if (match?.regionId) {
            const regionName = regions.find(r => r.id === match.regionId)?.name
            if (regionName) {
              fetch(`http://localhost:3000/api/listings?region=${regionName}`)
                .then(r => r.json())
                .then(data => setListings(data))
                .catch(err => console.error('Failed to load listings', err))
            }
          }
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

      {/* map hint */}
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        🟢 Click any green department to explore it. Grey departments have limited data from API-Colombia -- more coming soon!
      </p>

      {/* map */}
      <div className="map-container">
        <svg ref={svgRef} />
        {hoveredDept && <p className="map-tooltip">📍 {hoveredDept}</p>}
      </div>

      {/* detail panel -- shows when you click a department */}
      {selectedDept ? (
        <div className="dept-panel">
          <button className="close-btn" onClick={() => {
            setSelectedDept(null)
            setListings([])
            setExpanded({})
          }}>✕ Close</button>

          <h2>{selectedDept.name}</h2>

          {/* no data message for grey departments */}
          {selectedDept.noData ? (
            <p>No data available for this department yet from API-Colombia.</p>
          ) : (
            <>
              {/* basic department info */}
              <p><strong>Region:</strong> {deptRegion}</p>
              <p><strong>Capital:</strong> {selectedDept.cityCapital?.name || '--'}</p>
              <p><strong>Population:</strong> {selectedDept.population?.toLocaleString() || '--'}</p>
              <p><strong>Surface:</strong> {selectedDept.surface?.toLocaleString()} km²</p>
              <p><strong>Municipalities:</strong> {selectedDept.municipalities}</p>

              {/* tourist attractions -- name only with learn more toggle */}
              {deptTouristic.length > 0 && (
                <div>
                  <h3>🎭 Tourist Attractions</h3>
                  {deptTouristic.map(t => (
                    <div key={t.id} className="detail-item">
                      <strong>{t.name}</strong>
                      {t.description && (
                        <button
                          className="learn-more-btn"
                          onClick={() => toggleExpand(`touristic-${t.id}`)}
                        >
                          {expanded[`touristic-${t.id}`] ? 'Show less' : 'Learn more'}
                        </button>
                      )}
                      {/* description only shows if expanded */}
                      {expanded[`touristic-${t.id}`] && (
                        <p className="detail-desc">{t.description}</p>
                      )}
                      {t.images?.[0] && (
                        <img
                          src={t.images[0]}
                          alt={t.name}
                          className="detail-img"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* typical dishes -- name and ingredients only with learn more */}
              {deptDishes.length > 0 && (
                <div>
                  <h3>🍽️ Typical Dishes</h3>
                  {deptDishes.map(d => (
                    <div key={d.id} className="detail-item">
                      <strong>{d.name}</strong>
                      {d.ingredients && (
                        <button
                          className="learn-more-btn"
                          onClick={() => toggleExpand(`dish-${d.id}`)}
                        >
                          {expanded[`dish-${d.id}`] ? 'Show less' : 'Learn more'}
                        </button>
                      )}
                      {expanded[`dish-${d.id}`] && (
                        <p className="detail-desc">Ingredients: {d.ingredients}</p>
                      )}
                      {d.imageUrl && (
                        <img
                          src={d.imageUrl}
                          alt={d.name}
                          className="detail-img"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* festivals -- name only with learn more */}
              {deptFestivals.length > 0 && (
                <div>
                  <h3>🎉 Festivals & Fairs</h3>
                  {deptFestivals.map(f => (
                    <div key={f.id} className="detail-item">
                      <strong>{f.name}</strong>
                      {f.description && (
                        <button
                          className="learn-more-btn"
                          onClick={() => toggleExpand(`festival-${f.id}`)}
                        >
                          {expanded[`festival-${f.id}`] ? 'Show less' : 'Learn more'}
                        </button>
                      )}
                      {expanded[`festival-${f.id}`] && (
                        <p className="detail-desc">{f.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* cultural heritage -- name only with learn more */}
              {deptHeritage.length > 0 && (
                <div>
                  <h3>🏛️ Cultural Heritage</h3>
                  {deptHeritage.map(h => (
                    <div key={h.id} className="detail-item">
                      <strong>{h.name}</strong>
                      {h.description && (
                        <button
                          className="learn-more-btn"
                          onClick={() => toggleExpand(`heritage-${h.id}`)}
                        >
                          {expanded[`heritage-${h.id}`] ? 'Show less' : 'Learn more'}
                        </button>
                      )}
                      {expanded[`heritage-${h.id}`] && (
                        <p className="detail-desc">{h.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* airports -- always show full info since its short */}
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

              {/* host listings for this region */}
              <div>
                <h3>🏡 Local Experiences</h3>
                {listings.length > 0 ? (
                  <>
                    <p className="detail-desc">Host offered experiences in the {deptRegion} region</p>
                    {listings.map(l => (
                      <div key={l.id} className="detail-item">
                        <strong>{l.title}</strong>
                        <p className="detail-desc">💰 {l.price} | ⏱️ {l.duration}</p>
                        <button
                          className="learn-more-btn"
                          onClick={() => toggleExpand(`listing-${l.id}`)}
                        >
                          {expanded[`listing-${l.id}`] ? 'Show less' : 'Learn more'}
                        </button>
                        {expanded[`listing-${l.id}`] && (
                          <>
                            <p className="detail-desc">{l.description}</p>
                            <p className="detail-desc">📞 {l.contact}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="detail-desc">No host listings yet for the {deptRegion} region.</p>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="dept-panel">
          <h2>Click a department on the map</h2>
          <p>Select any department to see its region, capital, population, tourist attractions, typical dishes, festivals, cultural heritage, airports, and local host experiences.</p>
        </div>
      )}

    </main>
  )
}

export default Explore