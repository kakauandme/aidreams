function getLocalTime(now, locale) {
  return now.toLocaleTimeString(locale, { timeStyle: 'short' })
}

function getLocalDate(now, locale) {
  return now.toLocaleDateString(locale, { dateStyle: 'long' })
}

function getTimeOfDay(now) {
  const hours = now.getHours()

  if (hours >= 0 && hours < 3) {
    return 'Late night'
  } else if (hours >= 3 && hours < 6) {
    return 'Early morning'
  } else if (hours >= 6 && hours < 9) {
    return 'Morning'
  } else if (hours >= 9 && hours < 12) {
    return 'Late morning'
  } else if (hours >= 12 && hours < 15) {
    return 'Early afternoon'
  } else if (hours >= 15 && hours < 18) {
    return 'Afternoon'
  } else if (hours >= 18 && hours < 21) {
    return 'Evening'
  } else if (hours >= 21 && hours < 24) {
    return 'Night'
  }
}

function getDayOfWeek(now) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayOfWeek = days[now.getDay()]
  return dayOfWeek
}

function getSeason(now, latitude, country_code) {
  const month = now.getMonth()

  let season

  if (month >= 2 && month <= 4) {
    season = 'Spring'
  } else if (month >= 5 && month <= 7) {
    season = 'Summer'
  } else if (month >= 8 && month <= 10) {
    season = 'Autumn'
  } else {
    season = 'Winter'
  }
  if (country_code === 'US' && season === 'Autumn') {
    return 'Fall'
  }

  // southern hemisphere
  if (latitude < 0) {
    switch (season) {
      case 'Spring':
        return 'Autumn'
      case 'Summer':
        return 'Winter'
      case 'Autumn':
        return 'Spring'
      case 'Winter':
        return 'Summer'
    }
  }

  return season
}
export default function getDateAndTime(timezone, locale, latitude) {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }))

  let result = {}
  result.full_date_and_time = now.toString()
  result.time = getLocalTime(now, locale)
  result.date = getLocalDate(now, locale)
  result.day_of_week = getDayOfWeek(now)
  result.time_of_day = getTimeOfDay(now)
  result.season = getSeason(now, latitude)

  return result
}
