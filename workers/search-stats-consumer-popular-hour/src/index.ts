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

interface PopularHourResult {
  hour: number;
  period: 'AM' | 'PM';
  count: number;
  percentage: string;
  timestamp: string;
}

// Redis configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

// Kafka configuration
const kafka = new Kafka({
  clientId: 'search-stats-consumer-popular-hour',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

// Create consumer instance
const consumer = kafka.consumer({ 
  groupId: 'search-stats-popular-hour-group',
  sessionTimeout: 30000,
  heartbeatInterval: 10000,
  maxBytesPerPartition: 1048576, // 1MB
  maxBytes: 10485760, // 10MB
  maxWaitTimeInMs: 5000,
  rebalanceTimeout: 60000,
  readUncommitted: false
});

// Process a single message
async function processMessage(value: SearchStats): Promise<void> {
  // Extract hour and period from timestamp
  const date = new Date(value.timestamp);
  const hour = date.getHours();
  const period = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour % 12 || 12; // Convert to 12-hour format
  
  // Create a unique key for the hour and period
  const hourKey = `${hour12}${period}`;
  
  // Increment the count for this hour in a Redis hash
  await redis.hincrby('stats:hourly:counts', hourKey, 1);
  
  console.log(`Processed search at ${hourKey}`);
}

// Compute and store the most popular hour
async function computeAndStorePopularHour(): Promise<void> {
  // Get all hourly counts from Redis hash
  const counts = await redis.hgetall('stats:hourly:counts');
  
  // Calculate total count
  const totalSearches = Object.values(counts)
    .map(v => parseInt(v as string))
    .reduce((sum, v) => sum + v, 0);
  
  if (totalSearches === 0) {
    console.log('No searches found');
    return;
  }

  // Find the most popular hour
  const popularHour = Object.entries(counts)
    .sort((a, b) => parseInt(b[1] as string) - parseInt(a[1] as string))[0];

  // Extract hour and period from the key
  const hourKey = popularHour[0];
  const hour = parseInt(hourKey.replace(/[AP]M$/, ''));
  const period = hourKey.endsWith('AM') ? 'AM' : 'PM';

  // Store result in Redis
  const result: PopularHourResult = {
    hour,
    period,
    count: parseInt(popularHour[1] as string),
    percentage: ((parseInt(popularHour[1] as string) / totalSearches) * 100).toFixed(2) + '%',
    timestamp: new Date().toISOString()
  };
  
  await redis.set('stats:popular-hour', JSON.stringify(result));
  console.log('Computed and stored most popular hour:', result);
}

// Clear state
async function clearState(): Promise<void> {
  await redis.del('stats:hourly:counts');
  await redis.del('stats:popular-hour');
  console.log('Cleared state for hourly statistics');
}

// Handle BOF message
async function handleBOF(partition: number): Promise<void> {
  console.log(`BOF received for partition ${partition}`);
  // Clear previous state
  await clearState();
}

// Handle EOF message
async function handleEOF(partition: number): Promise<void> {
  console.log(`EOF received for partition ${partition}`);
  await computeAndStorePopularHour();
}

// Handle data message
async function handleDataMessage(value: string): Promise<void> {
  const parsed: SearchStats = JSON.parse(value);
  await processMessage(parsed);
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
      partitionsConsumedConcurrently: 2,
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
            await handleBOF(partition);
          } else if (key === 'EOF') {
            await handleEOF(partition);
          } else {
            await handleDataMessage(value);
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