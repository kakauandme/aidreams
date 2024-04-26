// TODO: Add versioning to environment variables
const version = 2

function removeSpecialCharacters(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_')
}

function getWeatherKey(data) {
  return removeSpecialCharacters(
    `weather_${data.location.city}_${data.location.region}_${data.location.country}_v${version}`
  )
}

function getImageKey(data) {
  return removeSpecialCharacters(
    `data_${data.location.city}_${data.location.region}_${data.location.country}_${data.weather.description}_${data.date_and_time.season}_${data.date_and_time.time_of_day}_v${version}`
  )
}

export { getWeatherKey, getImageKey }
