# Star Wars App

A modern web application built with Next.js that provides information about the Star Wars universe. This project showcases the use of modern web technologies and best practices in web development.

## Features

- Modern, responsive UI built with React and Tailwind CSS
- Server-side rendering with Next.js
- Type-safe development with TypeScript
- Optimized performance with Turbopack
- Docker support for easy deployment
- Environment configuration for different deployment stages

## Technologies & Patterns

- **Frontend Framework**: Next.js 15.3.1 with React 19
- **Styling**: Tailwind CSS 4
- **Type Safety**: TypeScript
- **Build Tool**: Turbopack
- **Code Quality**: ESLint
- **Containerization**: Docker
- **Architecture**: Server-side rendering (SSR), Component-based architecture

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Docker and Docker Compose (for containerized deployment)
- npm or yarn package manager

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/danilodevhub/star-wars-app.git
cd star-wars-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. Build and run using Docker Compose:
```bash
docker-compose up --build
```

2. For production deployment:
```bash
docker-compose -f docker-compose.yml up --build
```

3. Get Redis Records:

Usefull for troubleshooting the statistics

```bash
# Get all keys
docker exec star-wars-app-redis-1 redis-cli KEYS "*"

# Get a specific key
docker exec star-wars-app-redis-1 redis-cli HGETALL "search:*"

# Get top queries
docker exec star-wars-app-redis-1 redis-cli ZRANGE search:queries 0 -1 WITHSCORES

# Get hourly stats
docker exec star-wars-app-redis-1 redis-cli ZRANGE search:hourly 0 -1 WITHSCORES
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Environment Configuration

The project uses environment variables for configuration. Create a `.env.local` file for local development or use the provided `.env.production` for production deployment.

## Pending work

- [ ] Implement event-driven approach to compute statistics
- [ ] Implement the endpoint to return the statistics

## Future Improvements

- [ ] Add authentication system
- [ ] Implement caching for API responses
- [ ] Add unit and integration tests
- [ ] Implement pagination
- [ ] It should be production ready (fix Redis issues for prod env)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
