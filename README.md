# Elasticsearch Search Engine Demo

A complete demo project showcasing Elasticsearch as a search engine with a Node.js backend API, Kibana for visualization, and Docker Compose for easy deployment.

## 🏗️ Tech Stack

- **Database:** Elasticsearch 8.11.0
- **GUI:** Kibana 8.11.0 (for visualization and dev tools)
- **Backend:** Node.js with Express (API Gateway)
- **Infrastructure:** Docker & Docker Compose

## 📁 Project Structure

```
.
├── docker-compose.yml    # Docker Compose configuration
├── package.json          # Node.js dependencies
├── server.js            # Express API server
├── seed.js              # Data seeding script
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js (v16 or higher) and npm installed

### Step 1: Start Elasticsearch and Kibana

Run the Docker containers:

```bash
docker compose up -d
# Or if using older Docker versions:
# docker-compose up -d
```

This will start:
- **Elasticsearch** on `http://localhost:9200`
- **Kibana** on `http://localhost:5601`

Wait for the services to be healthy (approximately 30-60 seconds). You can check the status with:

```bash
docker compose ps
# Or: docker-compose ps
```

Or verify Elasticsearch is running:

```bash
curl http://localhost:9200
```

### Step 2: Install Node.js Dependencies

```bash
npm install
```

### Step 3: Seed the Database

Populate Elasticsearch with sample movies:

**Option 1: English movies (20 records)**
```bash
npm run seed
```

**Option 2: Thai movies (100 records)**
```bash
npm run seed:thai
```

You should see output confirming the data was inserted successfully.

### Step 4: Start the API Server

```bash
npm start
```

The server will start on `http://localhost:3000`.

## 📡 API Endpoints

### 1. Health Check

Check if Elasticsearch is connected:

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "elasticsearch": {
    "status": "green",
    "cluster_name": "docker-cluster",
    "number_of_nodes": 1
  }
}
```

### 2. Search Movies

Search for movies by title or description with fuzzy matching (typo tolerance):

```bash
curl "http://localhost:3000/search?q=inception"
```

**Response:**
```json
{
  "status": "ok",
  "total": 1,
  "results": [
    {
      "id": "...",
      "score": 2.5,
      "title": "Inception",
      "description": "A thief who steals corporate secrets...",
      "genre": "Sci-Fi"
    }
  ]
}
```

### More Example Searches

Search by genre:
```bash
curl "http://localhost:3000/search?q=crime"
```

Fuzzy search (with typo):
```bash
curl "http://localhost:3000/search?q=inceptoin"
```

Search by description keywords:
```bash
curl "http://localhost:3000/search?q=batman"
```

**For Thai data**, search in Thai:
```bash
curl "http://localhost:3000/search?q=ผี"        # Search for ghost/horror movies
curl "http://localhost:3000/search?q=รัก"       # Search for love/romance
curl "http://localhost:3000/search?q=ดราม่า"    # Search for drama genre
```

Search for multiple words:
```bash
curl "http://localhost:3000/search?q=space+journey"
```

## 🔍 Kibana Dev Tools

Access Kibana at `http://localhost:5601` to:
- Explore the data visually
- Run Elasticsearch queries directly
- Monitor cluster health

Example queries you can run in Kibana Dev Tools:

```
GET /movies/_search
{
  "query": {
    "match_all": {}
  }
}
```

## 🛠️ Development

### Stop the Services

```bash
docker compose down
# Or: docker-compose down
```

### View Logs

```bash
docker compose logs -f elasticsearch
docker compose logs -f kibana
# Or: docker-compose logs -f elasticsearch
# Or: docker-compose logs -f kibana
```

### Reseed the Database

To delete and recreate the index with fresh data:

```bash
npm run seed
```

## 📝 Features

- ✅ Multi-match search across title and description fields
- ✅ Fuzzy matching for typo tolerance
- ✅ RESTful API with Express
- ✅ Health check endpoint
- ✅ CORS enabled for frontend integration
- ✅ Single-node Elasticsearch (demo configuration)
- ✅ Security disabled for local development simplicity
- ✅ Memory-optimized (512MB heap size)

## ⚠️ Important Notes

- This is a **demo/development configuration**
- Security features are disabled (`xpack.security.enabled=false`)
- Not suitable for production use
- Memory is limited to 512MB for Elasticsearch to prevent high resource usage

## 📚 Sample Data

The repository includes two seed scripts:

**English Movies (`seed.js`)**: 20 popular movies with:
- **Title:** Movie name
- **Description:** Plot summary
- **Genre:** Movie category (Drama, Crime, Sci-Fi, etc.)

**Thai Movies (`seed-thai.js`)**: 100 Thai movies with:
- **Title (ชื่อเรื่อง):** Thai movie name
- **Description (เรื่องย่อ):** Thai plot summary
- **Genre (ประเภท):** Thai movie category (ดราม่า, สยองขวัญ, โรแมนติก, etc.)

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

MIT
