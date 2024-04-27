const express = require('express');
const request = require('request');
const cors = require("cors");
const port = 5021;
const axios = require("axios");
const { getJson}  =  require("serpapi");
const util = require('util');
const app = express();

const { Client } = require("@elastic/elasticsearch");

const index = "event";

app.use(cors());

app.use(express.json());

const esClient = new Client({
	node: "http://localhost:9200/",
});


async function indexExist(indexName) {
	const indexExist = await esClient.indices.exists({ index: indexName });

	return indexExist;
}

// Endpoint to retrieve all events from the predefined index
app.get("/getAllEvents", async (req, res) => {
    try {
        // Check if the index exists
        const exists = await esClient.indices.exists({ index });
        if (!exists) {
            return res.json({ allEvents: [] }); // Index doesn't exist, return empty array
        }

        // Retrieve all documents from the index
        const { body } = await esClient.search({
            index,
            size: 10000,
        });

        const allEvents = body.hits.hits.map(hit => hit._source);
        res.json({ allEvents });
    } catch (error) {
        console.error("Error retrieving all events:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//Indexing using elastic search
app.post("/indexEvents", async (req, res) => {
    try {
        const { event } = req.body; 
        console.log(event);
        await esClient.index({
            index,
            document: event,
        });
        res.json({ status: 200, message: 'Event indexed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Define a function to check if the index exists
async function indexExist(indexName) {
    const indexExists = await esClient.indices.exists({ index: indexName });
    return indexExists;
}

// Define a function to retrieve all documents (events) from the index
async function getAllDocs(index) {
    try {
        const exists = await indexExist(index);
        if (!exists) {
            return [];
        }
        const res = await esClient.search({
            index,
            size: 10000, // Retrieve a maximum of 10000 documents
        });
        const allEvents = res.body.hits.hits.map(hit => hit._source);
        return allEvents;
    } catch (error) {
        console.error("Error retrieving events:", error);
        throw error;
    }
}



app.get("/search", async (req, res) => {
    try {
        const { title } = req.query;
        let result;

        if (title) {
            result = await esClient.search({
                index,
                body: {
                    query: {
                        match: {
                            name: title // Assuming 'name' is the field to search on
                        }
                    }
                }
            });
        } else {
            result = await esClient.search({
                index,
                body: {
                    query: {
                        match_all: {} // Match all documents
                    }
                }
            });
        }

        res.json(result.hits.hits.map((doc) => doc._source));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




app.get('/api', function(req, res) {
  const { latitude, longitude, q } = req.query;

  console.log("latitude, longitude, query: ");
  lat=41.8781;
  long=-87.6298;
  console.log(latitude, longitude, q);
  console.log(lat, long, q);
  console.log("\n");
  
  request(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=njuu99MidStatGmVALQgyGZBorQpnXAX&geoPoint=${lat},${long}&keyword="sports events"`, function (error, response, body) {
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
   const { eventType, latitude, longitude, postal, city, radius, unit , size} = req.query;
  try {
      const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
          params: {
              apikey: 'key',
              countryCode: 'US',
              sort: 'date,asc',
              includeTBA: 'yes',
              postal: postal,
              classificationName: eventType,
              latitude: latitude,
              longitude: longitude,
              radius: radius,
              unit: unit,
              city: city,
              size: size,
          }
      });
        console.log(response.data);

      res.json(response.data);
  } catch (error) {
      console.error('Error fetching places:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/ImageFromSerpAPI', async (req, res) => {
  const { query } = req.query;
  try {
      const response = await axios.get('https://serpapi.com/search', {
          params: {
              api_key: '4be963ddff0381b89ed90767cf3708977ca5c8351a1de6c000441b57fca939fc',
              engine: 'google_images',
              type: 'search',
              q: query,
              limit: 1 
          }
      });
      res.json(response.data);
  console.log(res);
  } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/serpAPI', async (req, res) => {
  const { latitude, longitude, q } = req.query;
  console.log(latitude, longitude, q);
  lat=41.8781;
  long=-87.6298;
  try {

    getJson({
        api_key: "4be963ddff0381b89ed90767cf3708977ca5c8351a1de6c000441b57fca939fc",
        engine: "google_maps",
        q: q,
        google_domain: "google.com",
        ll: `@${lat},${long},14z`,
        type: "search",
        hl: "en",
    }, (results) => {
        res.json(results);
        console.log(util.inspect(results, {depth: null, colors: true}));
    });
  } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getNearbyPlacesInfo', async (req, res) => {
  const { query } = req.query;
  try {
      const response = await axios.get('https://serpapi.com/search', {
          params: {
              api_key: 'key',
              engine: 'google',
              type: 'search',
              q: query,
              limit: 3 
          }
      });
      res.json(response.data);
  console.log(res);
  } catch (error) {
      console.error('Error fetching places info:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, function() {
  console.log(`Server listening at http://localhost:${port}`);
})