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

3. Start the development server _(not recommended since it depends on Redis, see Docker deployment)_:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Docker Deployment

#### Development Environment

1. Build and run the development environment:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

The application will be available at [http://localhost:3000](http://localhost:3000)

#### Production Environment

You can set up the required environment variables in one of the following ways:

1. **Using .env.production file** (recommended):
   Create a `.env.production` file in the root directory with:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://host.docker.internal:3000
   SWAPI_BASE_URL=https://swapi.tech/api
   ```

2. **Using command line arguments**:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://host.docker.internal:3000 SWAPI_BASE_URL=https://swapi.tech/api docker-compose -f docker-compose.prod.yml up --build
   ```

3. **Using shell profile** (e.g., `.zprofile`, `.bash_profile`):
   Add these lines to your shell profile:
   ```bash
   export NEXT_PUBLIC_API_BASE_URL=http://host.docker.internal:3000
   export SWAPI_BASE_URL=https://swapi.tech/api
   ```
   Then source your profile or restart your terminal.

4. **Using Docker environment file**:
   Create a `docker.env` file and use it with:
   ```bash
   docker-compose --env-file docker.env up --build
   ```

After setting up the environment variables using any of the methods above, build and run the production environment:
```bash
docker-compose up --build

# for scaling one consumer per partition 
docker-compose up --build --scale search-stats-consumer-top-queries=2
```

The application will be available at [http://localhost:3000](http://localhost:3000)

2. Get Redis Records:

Useful for troubleshooting the statistics

```bash
# Get all keys
docker exec star-wars-app-redis-1 redis-cli KEYS "*"

# Get a specific key
docker exec star-wars-app-redis-1 redis-cli HGETALL "search:<<timestamp>>"

# Delete all keys 
docker exec star-wars-app-redis-1 redis-cli FLUSHDB
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Environment Configuration

The project uses environment variables for configuration. Create a `.env.local` file for local development or use the provided `.env.production` for production deployment.

## Issues

- [ ] List of films within person resource is not returning from SWAPI API

## Pending work

- [ ] Implement event-driven approach to compute statistics
- [ ] Implement the endpoint to return the statistics

## Future Improvements

- [ ] Add authentication system
- [ ] Implement caching for API responses
- [ ] Add unit and integration tests
- [ ] Implement pagination

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
