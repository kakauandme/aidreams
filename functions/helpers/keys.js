// TODO: Add versioning to environment variables
const version = 3

// TODO: remove special characters from string and replace whitespace with underscore
function removeSpecialCharacters(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_')
}

function toCapital(str) {
  if (!str) {
    return ''
  }
  return (str[0].toUpperCase() + str.slice(1)).replace(/_/g, ' ')
}

function getWeatherKey(data) {
  return removeSpecialCharacters(
    `weather_${data.location.city}_${data.location.country_code}_v${version}`
  )
}
function getKey(data) {
  return (
    removeSpecialCharacters(
      `${data.location.city}_${data.location.country_code}_${data.weather.description}_${data.date_and_time.season}_${data.date_and_time.time_of_day}_v${version}`
    ) + '.png'
  )
}

function getLocationKey(data) {
  return removeSpecialCharacters(`location_${city}_${country_code}_v${version}`)
}

function getSlug(data) {
  return `/${data.location.country_code}/${removeSpecialCharacters(data.location.city)}`
}

export { getWeatherKey, getLocationKey, getKey, getSlug, toCapital }
