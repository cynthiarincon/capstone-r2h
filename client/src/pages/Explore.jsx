import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

const COLOMBIA_GEO = 'https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/3aadedf47badbdac823b00dbe259f6bc6d9e1899/colombia.geo.json'

function Explore() {
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
  const [expanded, setExpanded] = useState({})
  const svgRef = useRef(null)

  const toggleExpand = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

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

  useEffect(() => {
    if (!svgRef.current) return

    const width = 800
    const height = 700

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto')

    const projection = d3.geoMercator()
      .center([-74, 5])
      .scale(1800)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    d3.json(COLOMBIA_GEO).then(geoData => {
      svg.selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', path)
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
        .on('mouseenter', function(event, d) {
          d3.select(this).attr('fill', '#f4c430')
          setHoveredDept(d.properties.NOMBRE_DPT)
        })
        .on('mouseleave', function(event, d) {
          const name = d.properties.NOMBRE_DPT
          const match = departments.find(
            dept => dept.name.toLowerCase() === name.toLowerCase()
          )
          d3.select(this).attr('fill', match ? '#1a5c38' : '#cccccc')
          setHoveredDept(null)
        })
        .on('click', function(event, d) {
          const name = d.properties.NOMBRE_DPT
          const match = departments.find(
            dept => dept.name.toLowerCase() === name.toLowerCase()
          )
          setSelectedDept(match || { name, noData: true })
          setExpanded({})

          if (match?.regionId) {
            const regionName = regions.find(r => r.id === match.regionId)?.name
            if (regionName) {
              fetch(`https://capstone-r2h.onrender.com/api/listings?region=${regionName}`)
                .then(r => r.json())
                .then(data => setListings(data))
                .catch(err => console.error('Failed to load listings', err))
            }
          }
        })
    })
  }, [departments])

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
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        🟢 Click any green department to explore it. Grey departments have limited data from API-Colombia -- more coming soon!
      </p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        ℹ️ Some content is provided in Spanish by API-Colombia. English translation coming soon.
      </p>

      <div className="map-container">
        <svg ref={svgRef} />
        {hoveredDept && <p className="map-tooltip">📍 {hoveredDept}</p>}
      </div>

      {selectedDept ? (
        <div className="dept-panel">
          <button className="close-btn" onClick={() => {
            setSelectedDept(null)
            setListings([])
            setExpanded({})
          }}>✕ Close</button>

          <h2>{selectedDept.name}</h2>

          {selectedDept.noData ? (
            <p>No data available for this department yet from API-Colombia.</p>
          ) : (
            <>
              <p><strong>Region:</strong> {deptRegion}</p>
              <p><strong>Capital:</strong> {selectedDept.cityCapital?.name || '--'}</p>
              <p><strong>Population:</strong> {selectedDept.population?.toLocaleString() || '--'}</p>
              <p><strong>Surface:</strong> {selectedDept.surface?.toLocaleString()} km²</p>
              <p><strong>Municipalities:</strong> {selectedDept.municipalities}</p>

              {deptTouristic.length > 0 && (
                <div>
                  <h3>🎭 Tourist Attractions</h3>
                  {deptTouristic.map(t => (
                    <div key={t.id} className="detail-item">
                      <strong>{t.name}</strong>
                      {t.description && (
                        <button className="learn-more-btn" onClick={() => toggleExpand(`touristic-${t.id}`)}>
                          {expanded[`touristic-${t.id}`] ? 'Show less' : 'Learn more'}
                        </button>
                      )}
                      {expanded[`touristic-${t.id}`] && (
                        <p className="detail-desc">{t.description}</p>
                      )}
                      {t.images?.[0] && (
                        <img src={t.images[0]} alt={t.name} className="detail-img" onError={(e) => e.target.style.display = 'none'} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {deptDishes.length > 0 && (
                <div>
                  <h3>🍽️ Typical Dishes</h3>
                  {deptDishes.map(d => (
                    <div key={d.id} className="detail-item">
                      <strong>{d.name}</strong>
                      {d.ingredients && (
                        <button className="learn-more-btn" onClick={() => toggleExpand(`dish-${d.id}`)}>
                          {expanded[`dish-${d.id}`] ? 'Show less' : 'Learn more'}
                        </button>
                      )}
                      {expanded[`dish-${d.id}`] && (
                        <p className="detail-desc">Ingredients: {d.ingredients}</p>
                      )}
                      {d.imageUrl && (
                        <img src={d.imageUrl} alt={d.name} className="detail-img" onError={(e) => e.target.style.display = 'none'} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {deptFestivals.length > 0 && (
                <div>
                  <h3>🎉 Festivals & Fairs</h3>
                  {deptFestivals.map(f => (
                    <div key={f.id} className="detail-item">
                      <strong>{f.name}</strong>
                      {f.description && (
                        <button className="learn-more-btn" onClick={() => toggleExpand(`festival-${f.id}`)}>
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

              {deptHeritage.length > 0 && (
                <div>
                  <h3>🏛️ Cultural Heritage</h3>
                  {deptHeritage.map(h => (
                    <div key={h.id} className="detail-item">
                      <strong>{h.name}</strong>
                      {h.description && (
                        <button className="learn-more-btn" onClick={() => toggleExpand(`heritage-${h.id}`)}>
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

              <div>
                <h3>🏡 Local Experiences</h3>
                {listings.length > 0 ? (
                  <>
                    <p className="detail-desc">Host offered experiences in the {deptRegion} region</p>
                    {listings.map(l => (
                      <div key={l.id} className="detail-item">
                        <strong>{l.title}</strong>
                        <p className="detail-desc">💰 {l.price} | ⏱️ {l.duration}</p>
                        <button className="learn-more-btn" onClick={() => toggleExpand(`listing-${l.id}`)}>
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