// TODO: Add versioning to environment variables
const version = 3

function removeSpecialCharacters(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

function getWeatherKey(data) {
  return removeSpecialCharacters(
    `weather-${data.location.country_code}-${data.location.city}-v${version}`
  )
}

function getKey(data) {
  return (
    removeSpecialCharacters(
      `${data.location.country_code}-${data.location.city}-${data.weather.description}-${data.date_and_time.season}-${data.date_and_time.time_of_day}-v${version}`
    ) + '.png'
  )
}

export { getWeatherKey, getKey }
