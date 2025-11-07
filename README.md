# 🚀 NestJS Kafka Microservices - Learning Project

> **Perfect for developers learning microservices architecture!** This project demonstrates a complete microservices setup using NestJS, Kafka, and Docker.

## 📚 What You'll Learn

This repository is designed for developers who want to understand:

- **Microservices Architecture** - How to build distributed systems
- **Event-Driven Communication** - Using Kafka as a message broker
- **NestJS Microservices** - Building scalable Node.js services
- **Docker & Docker Compose** - Containerizing microservices
- **Nx Monorepo** - Managing multiple services in one workspace
- **Service Communication Patterns** - Producer/Consumer, Request/Response

## 🏗️ Architecture Overview

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ HTTP POST
       ▼
┌──────────────────┐      emit("order_created")      ┌──────────────┐
│   API Gateway    │ ────────────────────────────────▶│    Kafka     │
│  (Port 3000)     │                                  │   Broker    │
│  [Producer]     │                                  └──────┬───────┘
└──────────────────┘                                         │
                                                             │ subscribe
                                                             ▼
                                    ┌─────────────────────────────────┐
                                    │   Order Microservice            │
                                    │   [Consumer + Producer]         │
                                    │   - Receives: order_created     │
                                    │   - Sends: process_payment      │
                                    └────────────┬────────────────────┘
                                                 │ emit("process_payment")
                                                 ▼
                                    ┌─────────────────────────────────┐
                                    │   Payment Microservice          │
                                    │   [Consumer]                    │
                                    │   - Receives: process_payment   │
                                    └─────────────────────────────────┘
```

## 🎯 Services

### 1. **API Gateway** (`apps/api-gateway`)
- **Type**: HTTP Server + Kafka Producer
- **Port**: 3000
- **Role**: Entry point for external requests
- **Responsibilities**:
  - Receives HTTP POST requests
  - Validates incoming data
  - Publishes events to Kafka topics

### 2. **Order Microservice** (`apps/order-microservice`)
- **Type**: Kafka Consumer + Producer
- **Role**: Order processing service
- **Responsibilities**:
  - Consumes `order_created` events
  - Processes orders
  - Publishes `process_payment` events

### 3. **Payment Microservice** (`apps/payment-microservice`)
- **Type**: Kafka Consumer
- **Role**: Payment processing service
- **Responsibilities**:
  - Consumes `process_payment` events
  - Processes payments
  - Returns payment status

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Message Broker**: [Apache Kafka](https://kafka.apache.org/) - Distributed event streaming
- **Monorepo**: [Nx](https://nx.dev/) - Smart, fast build system
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript
- **Package Manager**: npm/bun

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or bun

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/nestjs-kafka-microservices.git
cd nestjs-kafka-microservices
```

### Step 2: Start Kafka

```bash
cd kafka
docker-compose up -d
```

This starts:
- Zookeeper (Kafka dependency)
- Kafka Broker (Port 9092)
- Kafka UI (Port 8080) - Visual interface for monitoring

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start All Microservices

```bash
# Start all services simultaneously
npx nx run-many --target=serve --projects=api-gateway,order-microservice,payment-microservice

# Or start individually
npx nx serve api-gateway
npx nx serve order-microservice
npx nx serve payment-microservice
```

### Step 5: Test the Flow

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "order_created",
    "message": {
      "orderId": 123,
      "product": "MacBook Pro",
      "price": 2500
    }
  }'
```

## 📖 Key Concepts Explained

### Kafka Topics

Topics are like message queues. Each service subscribes to specific topics:

- `order_created` - When a new order is placed
- `process_payment` - When payment needs to be processed

### Producer vs Consumer

- **Producer**: Sends messages to Kafka topics (`emit()`)
- **Consumer**: Receives messages from Kafka topics (`@MessagePattern()`)

### Service Communication Flow

1. **API Gateway** receives HTTP request → produces `order_created` event
2. **Order Service** consumes `order_created` → processes order → produces `process_payment` event
3. **Payment Service** consumes `process_payment` → processes payment

## 🎓 Learning Path

### Beginner
1. Understand the basic architecture
2. Run the project locally
3. Send test requests and observe logs
4. Explore Kafka UI at `http://localhost:8080`

### Intermediate
1. Modify message payloads
2. Add new microservices
3. Create new Kafka topics
4. Implement error handling

### Advanced
1. Add database integration
2. Implement authentication/authorization
3. Add monitoring and logging (Grafana, Loki)
4. Deploy to Kubernetes
5. Set up CI/CD pipelines

## 📁 Project Structure

```
NESTJS-KAFKA-MICROSERVICE/
├── apps/
│   ├── api-gateway/          # HTTP API Gateway
│   ├── order-microservice/    # Order processing service
│   └── payment-microservice/  # Payment processing service
├── kafka/
│   └── docker-compose.yaml    # Kafka infrastructure
├── package.json
├── nx.json                    # Nx workspace configuration
└── README.md
```

## 🔍 Monitoring

### Kafka UI
Visit `http://localhost:8080` to:
- View all Kafka topics
- Monitor message flow
- Inspect message payloads
- Check consumer groups

### Service Logs
Each service logs:
- Connection status
- Received messages
- Processing steps
- Errors (if any)

## 🧪 Testing

```bash
# Run tests for a specific service
npx nx test api-gateway

# Run all tests
npx nx run-many --target=test --all
```

## 🐳 Docker Deployment

### Build Docker Images

```bash
# Build all services
npx nx build api-gateway
npx nx build order-microservice
npx nx build payment-microservice

# Create Docker images (Dockerfiles needed)
docker build -t api-gateway:latest .
```

### Docker Compose

```yaml
# Example docker-compose.yml
services:
  api-gateway:
    image: api-gateway:latest
    ports:
      - "3000:3000"
```

## 🤝 Contributing

This is a learning project! Feel free to:
- Fork the repository
- Add new microservices
- Improve documentation
- Share your learnings

## 📚 Resources

- [NestJS Microservices Documentation](https://docs.nestjs.com/microservices/basics)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Nx Documentation](https://nx.dev)
- [Docker Documentation](https://docs.docker.com/)

## 🐛 Troubleshooting

### Kafka Connection Issues
- Ensure Kafka is running: `docker ps | grep kafka`
- Check Kafka logs: `docker logs kafka`
- Verify port 9092 is accessible

### Service Not Starting
- Check if port 3000 is available
- Verify all dependencies are installed
- Check service logs for errors

### Messages Not Received
- Verify topics exist: `docker exec kafka kafka-topics.sh --list`
- Check consumer group status in Kafka UI
- Ensure services are subscribed to correct topics

## 📝 License

MIT License - Feel free to use this project for learning!

## 🙏 Acknowledgments

Built with:
- [NestJS](https://nestjs.com/)
- [Apache Kafka](https://kafka.apache.org/)
- [Nx](https://nx.dev/)

---

**Happy Learning! 🎉**

If you find this project helpful, please give it a ⭐ star!
