const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('@elastic/elasticsearch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Elasticsearch client
const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const health = await client.cluster.health();
    res.json({
      status: 'ok',
      elasticsearch: {
        status: health.status,
        cluster_name: health.cluster_name,
        number_of_nodes: health.number_of_nodes
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to Elasticsearch',
      error: error.message
    });
  }
});

// Search endpoint
app.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      status: 'error',
      message: 'Query parameter "q" is required'
    });
  }

  try {
    const result = await client.search({
      index: 'movies',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['title', 'description'],
            fuzziness: 'AUTO'
          }
        }
      }
    });

    const hits = result.hits.hits.map(hit => ({
      id: hit._id,
      score: hit._score,
      ...hit._source
    }));

    res.json({
      status: 'ok',
      total: result.hits.total.value,
      results: hits
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Search failed',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Elasticsearch Search Engine API',
    endpoints: {
      health: '/health - Check Elasticsearch connection',
      search: '/search?q=query - Search movies by title or description'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Elasticsearch URL: ${process.env.ELASTICSEARCH_URL || 'http://localhost:9200'}`);
});
