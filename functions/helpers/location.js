import {
  getCountryName,
  getLocale,
  getUnits,
  getCapital,
  getLatitude,
  getLongitude
} from './countries'

import { getLocationKey, toCapital } from './keys'

import { getLocationByCityAndCountryCode } from './openweathermap'

export default async function getLocation(city, country_code, cf, KV) {
  //console.log(cf)

  let result = {
    city: city || cf.city,
    country_code: country_code || cf.country || 'US'
  }
  // TODO: if city is not set but region is, get capital location by region using openweathermap
  // if city is not set and region is not ser , get capital location by country code
  if (!result.city) {
    result.city = getCapital(result.country_code)
    result.latitude = getLatitude(result.country_code)
    result.longitude = getLongitude(result.country_code)
    // otherwise set coordinates from cloudflare or set to DC
  } else {
    result.latitude = cf.latitude || 34.0522
    result.longitude = cf.longitude || -77.0369
  }

  const location_key = getLocationKey(result)

  const location_cache = await KV.get(location_key)

  if (location_cache) {
    result = JSON.parse(location_cache)
    return result
  }

  // TODO: add limitation to only cerain cities and countries
  // if (city && country_code) {
  //   result = getLocationByCityAndCountryCode(city, country_code, api_key)
  // }

  result.region = cf.region || 'District of Columbia'
  result.timezone = cf.timezone || 'America/New_York'

  result.country = getCountryName(result.country_code)
  result.locale = getLocale(result.country_code)
  result.units = getUnits(result.country_code)

  await KV.put(location_key, JSON.stringify(result))

  return result
}
// function getLocationByCountryCode(country_code, KV) {
//   let result = {
//     country_code: country_code
//   }
//   console.log(country_code)
//   // TODO: redirect to 404 if city not found
//   let [_city, _latitude, _longitude] = getCapitalAndCoordinates(country_code)

//   result.city = _city
//   result.latitude = _latitude
//   result.longitude = _longitude

//   result.country = getCountryName(result.country_code)
//   result.locale = getLocale(result.country_code)
//   result.units = getUnits(result.country_code)

//   const location_key = getLocationKey(result.city, result.country_code)
//   KV.put(location_key, JSON.stringify(result))
//   return result
// }
