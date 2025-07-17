import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [allCountries, setAllCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=cca2,name,capital,currencies,languages,flags')
      .then(res => res.json())
      .then(data => {
        const countries = data.map(c => ({
          name: c.name.common,
          countryCode: c.cca2,
          capital: Array.isArray(c.capital) ? c.capital.join(', ') : '',
          currencies: Object.values(c.currencies).map(cur => cur.name).join(', '),
          languages: Object.values(c.languages).join(', '),
          flag: c.flags.svg,
        }))
        setAllCountries(countries)
      })
  }, [])

  const filtered = allCountries.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5)

  React.useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchTerm])

  const onKeyDown = (e) => {
    if (filtered.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(i => (i + 1) % filtered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(i => (i <= 0 ? filtered.length - 1 : i - 1))
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (highlightedIndex >= 0) {
        e.preventDefault()
        selectCountry(filtered[highlightedIndex])
      }
    }
  }

  const selectCountry = (country) => {
    setSelectedCountry(country)
    setSearchTerm(country.name)
    setHighlightedIndex(-1)
  }

  return (
    <div className="app-container">
      <h1>Country Search</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a country name"
        className="search-input"
      />

      {searchTerm && searchTerm !== selectedCountry?.name && filtered.length > 0 && (
        <ul className="suggestions-list">
          {filtered.map((country, idx) => (
            <li
              key={country.countryCode}
              className={highlightedIndex === idx ? 'highlighted' : ''}
              onMouseDown={() => selectCountry(country)}
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}

      {selectedCountry && (
        <div className="country-details">
          <img
            src={selectedCountry.flag}
            alt={`${selectedCountry.name} flag`}
            className="country-flag"
          />
          <h2>{selectedCountry.name} ({selectedCountry.countryCode})</h2>
          <ul>
            <li><strong>Capital:</strong> {selectedCountry.capital}</li>
            <li><strong>Currencies:</strong> {selectedCountry.currencies}</li>
            <li><strong>Languages:</strong> {selectedCountry.languages}</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default App