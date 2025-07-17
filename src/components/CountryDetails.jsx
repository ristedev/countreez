import React from 'react'

function CountryDetails({ country }) {
  if (!country) return null

  return (
    <div className="country-details">
      <h2>{country.name} ({country.countryCode})</h2>
      <img src={country.flag} alt={`${country.name} flag`} className="country-flag" />
      <ul>
        <li><strong>Capital:</strong> {country.capital}</li>
        <li><strong>Currencies:</strong> {country.currencies}</li>
        <li><strong>Languages:</strong> {country.languages}</li>
      </ul>
    </div>
  )
}

export default CountryDetails