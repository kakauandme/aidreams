import { getCountryName, getLocale, getUnits } from './countries'

export default function getLocation(cf) {
  //console.log(cf)

  const result = {
    city: cf.city || '',
    region: cf.region || '',
    country_code: cf.country || '',
    timezone: cf.timezone || '',
    latitude: cf.latitude || 34.0522,
    longitude: cf.longitude || -118.2437
  }

  if (result.city === '' && result.region === '' && result.country_code === '') {
    result.city = 'Los Angeles'
    result.region = 'California'
    result.country_code = 'US'
    result.timezone = 'America/Los_Angeles'
  }

  result.country = getCountryName(result.country_code)

  result.locale = getLocale(result.country_code)
  result.units = getUnits(result.country_code)

  return result
}
