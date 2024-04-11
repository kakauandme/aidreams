// TODO: Add versioning to environment variables
const version = 1

function removeSpecialCharacters(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_')
}

function getWeatherKey(data) {
  return removeSpecialCharacters(
    `weather_v${version}_${data.location.city}_${data.location.country}.v${version}`
  )
}

function getImageKey(data) {
  return removeSpecialCharacters(
    `image_${data.location.city}_${data.location.country}_${data.weather.description}_${data.date_and_time.season}_${data.date_and_time.time_of_day}.v${version}`
  )
}

export { getWeatherKey, getImageKey }