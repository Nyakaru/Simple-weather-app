//Import the dependencies
const axios = require('axios')
const express = require('express')
const { DateTime } = require('luxon')
require('dotenv').config()

const darkSkyApiKey = process.env.DARK_SKY_API_KEY
const gcpKey = process.env.GCP_KEY

const darkSkyBaseUrl = `https://api.darksky.net/forecast`

const app = express()

app.get('/location/:place', (req, res) => {
  const gcpUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.place + '&key=' + gcpKey

  // Get the latitude and longitude of different locations from the Geocoding API
  axios
    .get(gcpUrl)
    .then(_res => {
      const latitude = _res.data.results[0].geometry.location.lat
      const longitude = _res.data.results[0].geometry.location.lng
      const city = _res.data.results[0].formatted_address
      const location = latitude + ',' + longitude
      const darkSkyUrl = `${darkSkyBaseUrl}/${darkSkyApiKey}/${location}`

      //Get the weather details of different locations from the Dark Sky API
      axios
        .get(darkSkyUrl)
        .then(_res => {
          const time = _res.data.currently.time
          const formattedTime = DateTime.fromSeconds(time)
            .setZone(_res.data.timezone)
            .toFormat('DDDD t')
          const temperature = _res.data.currently.temperature
          const currentSummary = _res.data.currently.summary
          const humidity = _res.data.currently.humidity
          const windSpeed = _res.data.currently.windSpeed
          const cloudCover = _res.data.currently.cloudCover
          const hourlySummary = _res.data.hourly.summary
          const dailySummary = _res.data.daily.summary
          
          //Return the response
          res.send(`It is ${temperature} Fahrenheit (°F) and ${currentSummary} on ${formattedTime} O'clock in ${city}
          <br> <br> Weather Summary: The humidity is ${humidity}, wind speed of ${windSpeed}, cloud cover of ${cloudCover}
          and it will be ${hourlySummary} and ${dailySummary}`)
        })
        .catch(err => {
          res.send(`Something went wrong ${err.message}`)
        })
    })
    .catch(err => {
      res.send(`Something went wrong ${err.message}`)
    })
})

app.listen(4500, () => {
 console.log("Server running on port 4500")
})

module.exports = app; //for testing
