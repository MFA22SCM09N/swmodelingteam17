const express = require('express');
const request = require('request');
const cors = require("cors");
const port = 5006;
const axios = require("axios");

const app = express();
app.use(cors());

app.get('/api', function(req, res) {
  const { latitude, longitude, q } = req.query;
  console.log("latitude, longitude, query: ");
  console.log(latitude, longitude, q);
  console.log("\n");
  
  request('https://app.ticketmaster.com/discovery/v2/events.json?apikey=njuu99MidStatGmVALQgyGZBorQpnXAX', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.json(body);
        // res.send(body);
        // console.log(body);
      } 
      else {
        // res.send(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });

});

app.get('/getPopularEvents', async (req, res) => {
  const { eventType, latitude, longitude, postal, city, radius, unit } = req.query;
  try {
      const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
          params: {
              apikey: 'njuu99MidStatGmVALQgyGZBorQpnXAX',
              countryCode: 'US',
               sort: 'date,asc',
               includeTBA: 'yes',
               postal: postal,
              classificationName: eventType,
              latitude: latitude,
              longitude: longitude,
              radius: radius,
              unit: unit,
              city: city
          }
      });
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching places:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(port, function() {
  console.log(`Server listening at http://localhost:${port}`);
})