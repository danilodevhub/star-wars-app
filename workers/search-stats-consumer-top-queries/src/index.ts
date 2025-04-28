import { Kafka, EachMessagePayload } from 'kafkajs';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Types
interface SearchStats {
  query: string;
  searchType: string;
  responseTime: number;
  timestamp: number;
}

interface TopQueriesResult {
  totalQueries: number;
  topFive: Array<{
    query: string;
    count: number;
    percentage: string;
  }>;
  timestamp: string;
  avgResponseTimeMs: number;
}

// Redis configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

// Kafka configuration
const kafka = new Kafka({
  clientId: 'search-stats-consumer-top-queries',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

// Create consumer instance
const consumer = kafka.consumer({ 
  groupId: 'search-stats-top-queries-group',
  sessionTimeout: 30000,
  heartbeatInterval: 10000,
  maxBytesPerPartition: 1048576, // 1MB
  maxBytes: 10485760, // 10MB
  maxWaitTimeInMs: 5000,
  // Ensure proper partition assignment
  rebalanceTimeout: 60000,
  readUncommitted: false
});

// Process a single message
async function processMessage(searchType: string, value: SearchStats): Promise<void> {
  // Sanitize query by converting to lowercase
  const sanitizedQuery = value.query.toLowerCase();
  
  // Increment the count for the sanitized query in a Redis hash
  await redis.hincrby(`stats:${searchType}:counts`, sanitizedQuery, 1);
  
  // Track response time
  await redis.hincrby(`stats:${searchType}:totalResponseTime`, sanitizedQuery, value.responseTime);
  
  console.log(`Processed query "${sanitizedQuery}" for searchType "${searchType}"`);
}

// Compute and store top five queries with percentages
async function computeAndStoreTopFive(searchType: string): Promise<void> {
  // Get all counts from Redis hash
  const counts = await redis.hgetall(`stats:${searchType}:counts`);
  const totalResponseTimes = await redis.hgetall(`stats:${searchType}:totalResponseTime`);
  
  // Calculate total count
  const totalQueries = Object.values(counts)
    .map(v => parseInt(v as string))
    .reduce((sum, v) => sum + v, 0);
  
  if (totalQueries === 0) {
    console.log(`No queries found for searchType "${searchType}"`);
    return;
  }

  // Calculate average response time
  const totalResponseTime = Object.values(totalResponseTimes)
    .map(v => parseInt(v as string))
    .reduce((sum, v) => sum + v, 0);
  const avgResponseTimeMs = Number((totalResponseTime / totalQueries).toFixed(2));

  // Sort and get top 5
  const topFive = Object.entries(counts)
    .sort((a, b) => parseInt(b[1] as string) - parseInt(a[1] as string))
    .slice(0, 5)
    .map(([query, count]) => ({
      query,
      count: parseInt(count as string),
      percentage: ((parseInt(count as string) / totalQueries) * 100).toFixed(2) + '%'
    }));

  // Store result in Redis
  const result: TopQueriesResult = {
    totalQueries,
    topFive,
    timestamp: new Date().toISOString(),
    avgResponseTimeMs
  };
  
  await redis.set(`stats:${searchType}:top-queries`, JSON.stringify(result));
  console.log(`Computed and stored top 5 queries for "${searchType}":`, result);
}

// Clear state for a specific searchType
async function clearState(searchType: string): Promise<void> {
  await redis.del(`stats:${searchType}:counts`);
  await redis.del(`stats:${searchType}:top-queries`);
  await redis.del(`stats:${searchType}:totalResponseTime`);
  console.log(`Cleared state for searchType "${searchType}"`);
}

// Handle BOF message
async function handleBOF(partition: number, searchType: string): Promise<void> {
  console.log(`BOF received for partition ${partition}, searchType: ${searchType}`);
  // Clear previous state for this searchType
  await clearState(searchType);
}

// Handle EOF message
async function handleEOF(partition: number, searchType: string): Promise<void> {
  console.log(`EOF received for partition ${partition}, searchType: ${searchType}`);
  await computeAndStoreTopFive(searchType);
}

// Handle data message
async function handleDataMessage(searchType: string, value: string): Promise<void> {
  const parsed: SearchStats = JSON.parse(value);
  await processMessage(searchType, parsed);
}

// Main consumer function
async function run(): Promise<void> {
  try {
    await consumer.connect();
    
    // Subscribe to all partitions explicitly
    await consumer.subscribe({ 
      topic: 'computable-searches', 
      fromBeginning: true
    });

    // Ensure we're assigned to all partitions
    const assignment = await consumer.describeGroup();
    console.log('Consumer group assignment:', assignment);

    console.log('Consumer connected and subscribed to topic computable-searches');

    await consumer.run({
      autoCommit: true,
      autoCommitInterval: 5000,
      autoCommitThreshold: 100,
      partitionsConsumedConcurrently: 2, // Process both partitions concurrently
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        const key = message.key?.toString();
        const value = message.value?.toString();

        if (!key || !value) {
          console.warn('Received message with missing key or value');
          return;
        }

        console.log(`Received message for partition ${partition}, key: ${key}, value: ${value}`);

        try {
          if (key === 'BOF') {
            await handleBOF(partition, value);
          } else if (key === 'EOF') {
            await handleEOF(partition, value);
          } else {
            await handleDataMessage(key, value);
          }
        } catch (error) {
          console.error(`Error processing message for partition ${partition}: ${error}`);
        }
      },
    });
  } catch (error) {
    console.error('Error in consumer:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await consumer.disconnect();
  await redis.quit();
  process.exit(0);
});

// Start the consumer
run().catch(console.error); 