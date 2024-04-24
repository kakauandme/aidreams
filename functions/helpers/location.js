import { getCountryName, getLocale, getUnits } from './countries'

export default function getLocation(cf) {
  //console.log(cf)

  const result = {
    city: cf.city || 'Los Angeles',
    region: cf.region || 'California',
    country_code: cf.country || 'US',
    timezone: cf.timezone || 'America/Los_Angeles',
    latitude: cf.latitude || 34.0522,
    longitude: cf.longitude || -118.2437
  }

  result.country = getCountryName(result.country_code)
  result.locale = getLocale(result.country_code)
  result.units = getUnits(result.country_code)

  return result
}
