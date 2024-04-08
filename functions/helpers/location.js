import { getCountryName, getLocale, getUnits } from './countries'

export default function getLocation(cf) {
  //console.log(cf)

  const result = {
    city: cf.city,
    region: cf.region,
    country_code: cf.country,
    timezone: cf.timezone,
    latitude: cf.latitude,
    longitude: cf.longitude
  }

  result.country = getCountryName(result.country_code)
  result.locale = getLocale(result.country_code)
  result.units = getUnits(result.country_code)

  return result
}
