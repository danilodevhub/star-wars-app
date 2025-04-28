import { Kafka, Partitioners } from 'kafkajs';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

const kafka = new Kafka({
  clientId: 'search-stats-producer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

async function collectAndPublishSearchStats() {
  try {
    // Get all keys matching the pattern
    const keys = await redis.keys('search:*');
    
    if (keys.length === 0) {
      console.log('No search keys found');
      return;
    }

    // Get hash values for all keys
    const searchStats = await Promise.all(keys.map(async (key) => {
      const hashValues = await redis.hgetall(key);
      return {
          query: hashValues.query,
          searchType: hashValues.searchType,
          responseTime: parseInt(hashValues.responseTime),
          timestamp: parseInt(hashValues.timestamp)
        };
    }));

    // Publish to Kafka
    await producer.connect();
    const searchTypes = [...new Set(searchStats.map(stat => stat.searchType))];
    const searchTypeToPartition = new Map(searchTypes.map((type, index) => [type, index]));
    
    // Send BOF messages
    for (const [searchType, partition] of searchTypeToPartition) {
      console.log(`Sending BOF message for partition ${partition}, searchType: ${searchType}`);
      await producer.send({
        topic: 'computable-searches',
        messages: [
          {
            key: 'BOF',
            value: searchType,
            partition,
          },
        ],
      });
    }

    // Send data messages
    for (const stat of searchStats) {
      const partition = searchTypeToPartition.get(stat.searchType);
      if (partition === undefined) {
        console.warn(`Unknown searchType: ${stat.searchType}`);
        continue;
      }
      await producer.send({
        topic: 'computable-searches',
        messages: [
          {
            key: stat.searchType,
            value: JSON.stringify(stat),
            partition,
          },
        ],
      });
    }

    // Send EOF messages
    for (const [searchType, partition] of searchTypeToPartition) {
      console.log(`Sending EOF message for partition ${partition}, searchType: ${searchType}`);
      await producer.send({
        topic: 'computable-searches',
        messages: [
          {
            key: 'EOF',
            value: searchType,
            partition,
          },
        ],
      });
    }

    console.log(`Published ${searchStats.length} search stats to Kafka`);
  } catch (error) {
    console.error('Error collecting and publishing search stats:', error);
  } finally {
    await producer.disconnect();
  }
}

// Run every 5 minutes
setInterval(collectAndPublishSearchStats, 5 * 60 * 1000);
    
    // Initial run
collectAndPublishSearchStats(); 