# Decentralized Energy Forecasting Platform - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Next.js    │  │   React.js   │  │  Tailwind    │         │
│  │   (SSR/SSG)  │  │  Components  │  │     CSS      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│           │                 │                 │                 │
│           └─────────────────┴─────────────────┘                 │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Web3.js/Ethers  │
                    │   MetaMask API    │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                         API Layer                               │
│                   ┌─────────┴─────────┐                         │
│                   │     FastAPI       │                         │
│                   │   (Python 3.11)   │                         │
│                   └─────────┬─────────┘                         │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐              │
│         │                   │                   │              │
│  ┌──────▼──────┐   ┌────────▼────────┐  ┌──────▼──────┐      │
│  │  WebSocket  │   │   REST API      │  │  Blockchain │      │
│  │   Server    │   │   Endpoints     │  │   Service   │      │
│  └─────────────┘   └─────────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌─────────▼─────────┐  ┌───────▼────────┐
│  LSTM Model    │  │  Spark Streaming  │  │   Blockchain   │
│   (TensorFlow) │  │   (PySpark 3.5)   │  │   (Ethereum)   │
│                │  │                   │  │                │
│  - Training    │  │  - Kafka Input    │  │  - Smart       │
│  - Inference   │  │  - Real-time      │  │    Contracts   │
│  - Evaluation  │  │    Processing     │  │  - Web3        │
└────────────────┘  └───────────────────┘  └────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                        Data Layer                               │
│         ┌────────────────────┼────────────────────┐            │
│         │                    │                    │            │
│  ┌──────▼──────┐   ┌─────────▼────────┐  ┌───────▼────────┐  │
│  │  MongoDB    │   │   PostgreSQL     │  │     Redis      │  │
│  │             │   │                  │  │                │  │
│  │ - NoSQL     │   │ - Time Series    │  │ - Caching      │  │
│  │ - Logs      │   │ - Metrics        │  │ - Sessions     │  │
│  │ - Analytics │   │ - Predictions    │  │ - Queue        │  │
│  └─────────────┘   └──────────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend (Next.js + React + Tailwind)

**Technologies:**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Framer Motion (animations)
- Recharts (data visualization)
- Ethers.js (Web3 integration)

**Key Features:**
- Server-side rendering (SSR)
- Real-time dashboard updates
- WebSocket connections for live data
- MetaMask wallet integration
- Responsive design
- Interactive charts and graphs

**Pages:**
- `/` - Landing page with feature overview
- `/dashboard` - Main analytics dashboard
- Real-time prediction charts
- Blockchain transaction viewer
- Wallet management

### 2. Backend API (FastAPI)

**Technologies:**
- FastAPI (Python 3.11)
- Uvicorn (ASGI server)
- Pydantic (data validation)
- WebSockets

**Endpoints:**
- `GET /api/predictions` - Get energy forecasts
- `GET /api/metrics` - System metrics
- `GET /api/blockchain/status` - Blockchain status
- `POST /api/blockchain/store` - Store prediction on-chain
- `WS /ws/stream` - Real-time data stream
- `GET /health` - Health check

### 3. ML Model (LSTM)

**Architecture:**
```
Input Layer (24 timesteps)
    ↓
LSTM Layer (128 units) + Dropout (0.2)
    ↓
LSTM Layer (64 units) + Dropout (0.2)
    ↓
LSTM Layer (32 units) + Dropout (0.2)
    ↓
Dense Layer (16 units, ReLU)
    ↓
Output Layer (1 unit)
```

**Features:**
- Time series forecasting
- 24-hour prediction window
- 94.2% accuracy (demo)
- Model versioning
- Training pipeline
- Real-time inference

### 4. Spark Streaming

**Architecture:**
```
Data Sources (Kafka/Socket)
    ↓
Spark Structured Streaming
    ↓
Transformations (Aggregations, Windows)
    ↓
Sink (Database/Console/Memory)
```

**Features:**
- Real-time data ingestion
- 5-minute windowing
- Anomaly detection
- Aggregation functions
- Scalable processing

### 5. Blockchain (Ethereum)

**Smart Contract:**
- Solidity 0.8.20
- Prediction storage
- Reward distribution
- Model accuracy tracking
- Event emission

**Contract Methods:**
- `storePrediction()` - Store forecast
- `getLatestPrediction()` - Retrieve latest
- `getDailyPredictions()` - Get daily data
- `distributeReward()` - Reward predictors
- `updateModelAccuracy()` - Update metrics

### 6. Databases

**MongoDB:**
- Document storage
- Prediction logs
- Analytics data
- Flexible schema

**PostgreSQL:**
- Relational data
- Time series metrics
- Structured predictions
- ACID compliance

**Redis:**
- Caching layer
- Session management
- Real-time queue
- Pub/Sub messaging

## Data Flow

### Prediction Pipeline

```
1. Energy Data → Spark Streaming
2. Spark Streaming → Data Preprocessing
3. Preprocessed Data → LSTM Model
4. LSTM Model → Predictions
5. Predictions → FastAPI
6. FastAPI → Frontend (WebSocket)
7. FastAPI → MongoDB/PostgreSQL
8. Predictions → Blockchain (Smart Contract)
```

### Real-Time Stream

```
Sensors/Grid → Kafka → Spark Streaming → Aggregation →
WebSocket → Frontend Dashboard
```

### Blockchain Integration

```
Prediction Generated → FastAPI → Web3 Service →
Ethereum Network → Smart Contract → Event Emission →
Frontend Update
```

## Deployment Architecture

### Docker Compose (Development)

```yaml
Services:
  - backend (FastAPI)
  - mongodb
  - postgres
  - redis
  - spark-master
  - spark-worker
```

### Kubernetes (Production)

```
Namespace: energy-forecast
├── Deployments
│   ├── api-deployment (3 replicas)
│   ├── frontend-deployment (3 replicas)
├── StatefulSets
│   ├── mongodb
│   ├── postgres
├── Services
│   ├── api-service (LoadBalancer)
│   ├── mongodb-service
│   ├── postgres-service
└── Ingress
    └── HTTPS with TLS
```

### CI/CD Pipeline

```
GitHub Push → GitHub Actions →
  ├── Build Docker Images
  ├── Run Tests
  ├── Push to Registry
  ├── Update K8s Manifests
  └── Deploy to Cluster
```

## Scalability

**Horizontal Scaling:**
- FastAPI: 3+ replicas
- Spark Workers: Auto-scaling
- Database: Read replicas

**Vertical Scaling:**
- LSTM Model: GPU acceleration
- Spark: Memory optimization

**Caching Strategy:**
- Redis for API responses
- Browser caching for static assets
- CDN for global distribution

## Security

**Authentication:**
- Web3 wallet signatures
- JWT tokens
- API key management

**Data Protection:**
- HTTPS/TLS encryption
- Database encryption at rest
- Secure environment variables

**Smart Contract:**
- Audited Solidity code
- Access control modifiers
- Event logging for transparency

## Monitoring

**Metrics:**
- API response times
- Model accuracy
- Blockchain gas costs
- Database performance

**Logging:**
- Structured JSON logs
- Error tracking
- Request tracing

**Alerting:**
- Performance degradation
- Model drift detection
- System failures

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| ML Model | TensorFlow, Keras, LSTM |
| Streaming | Apache Spark, PySpark |
| Blockchain | Ethereum, Solidity, Web3.js |
| Databases | MongoDB, PostgreSQL, Redis |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes |
| Deployment | Vercel (Frontend), K8s (Backend) |
