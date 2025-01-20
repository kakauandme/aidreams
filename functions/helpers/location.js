import { getCountryName, getLocale, getUnits } from './countries'

async function getLocationFromCity(city, country_code, api_key) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country_code}&limit=1&appid=${api_key}`
    )
    const data = await response.json()

    if (data && data.length > 0) {
      return {
        latitude: data[0].lat,
        longitude: data[0].lon,
        city: data[0].name,
        country_code: data[0].country,
        region: data[0].state || ''
      }
    }
  } catch (e) {
    console.error('Error fetching location:', e)
  }
  return null
}

export default async function getLocation(cf, city = '', country_code = '', api_key = '') {
  let result = null

  // If city and country are provided, use them to get coordinates
  if (city && country_code) {
    const location = await getLocationFromCity(city, country_code, api_key)
    if (location) {
      result = location
      result.timezone = ''
    }
  }

  // if not result, use Cloudflare headers
  if (!result){
    result = {
      city: cf.city || '',
      region: cf.region || '',
      country_code: cf.country || '',
      latitude: cf.latitude || '',
      longitude: cf.longitude || '',
      timezone: cf.timezone || ''
    }
  }

  // if no result, use default location
  if (result.city === '' && result.region === '' && result.country_code === '') {
    result.city = 'Los Angeles'
    result.region = 'California'
    result.country_code = 'US'
    result.timezone = 'America/Los_Angeles'

    result.latitude = 34.0522
    result.longitude = -118.2437
  }
  result.country = getCountryName(result.country_code)
  result.locale = getLocale(result.country_code)
  result.units = getUnits(result.country_code)

  return result
}
