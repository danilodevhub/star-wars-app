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
    await producer.send({
      topic: 'computable-searches',
      messages: searchStats.map(stat => ({
        key: stat.searchType, // partition by searchType
        value: JSON.stringify(stat)
      }))
    });
    //last message for each partition that indicates the end of the records to be computed
    const searchTypes = [...new Set(searchStats.map(stat => stat.searchType))];
    const partitions = Array.from({length: searchTypes.length}, (_, i) => i);
    for (const partition of partitions) {
      await producer.send({
        topic: 'computable-searches',
        messages: [
          {
            key: 'EOF',
            value: JSON.stringify({ type: 'EOF' }),
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
//setInterval(collectAndPublishSearchStats, 5 * 60 * 1000);
setInterval(collectAndPublishSearchStats, 1 * 60 * 1000);

// Initial run
collectAndPublishSearchStats(); 