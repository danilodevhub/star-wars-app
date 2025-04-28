import { createClient } from 'redis';

// Types
export interface SearchStats {
  query: string;
  searchType: string;
  timestamp: number;
  responseTime: number;
}

// Redis Client Singleton
let redisClient: ReturnType<typeof createClient> | null = null;

const getRedisClient = () => {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis connection failed after 10 retries');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });
  }
  return redisClient;
};

// Health Check
// TODO: Remove this function
export const checkRedisHealth = async () => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    await client.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};

// Key Operations
export const getKeys = async (pattern: string = '*') => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    return await client.keys(pattern);
  } catch (error) {
    console.error('Error getting keys:', error);
    return [];
  }
};

export const getKeyValue = async (key: string) => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    return await client.get(key);
  } catch (error) {
    console.error('Error getting key value:', error);
    return null;
  }
};

export const getHashKey = async (key: string) => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    return await client.hGetAll(key);
  } catch (error) {
    console.error('Error getting hash key:', error);
    return null;
  }
};

// Search Stats Operations
export const storeSearchStats = async (stats: SearchStats) => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    const key = `search:${stats.timestamp}`;
    await client.hSet(key, {
      query: stats.query,
      searchType: stats.searchType,
      responseTime: stats.responseTime.toString(),
      timestamp: stats.timestamp.toString()
    });
    await client.expire(key, 30 * 24 * 60 * 60); // 30 days expiration
  } catch (error) {
    console.error('Error storing search stats:', error);
  }
};

export const getTopQueries = async (limit: number = 5) => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    const topQueries = await client.zRangeWithScores('search:queries', 0, limit - 1, { REV: true });
    return topQueries;
  } catch (error) {
    console.error('Error getting top queries:', error);
    return [];
  }
};

export const getAverageResponseTime = async () => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    const responseTimes = await client.zRange('search:response_times', 0, -1);
    if (responseTimes.length === 0) return 0;
    
    const times = await Promise.all(
      responseTimes.map(async (key) => {
        const stats = await client.hGet(key, 'responseTime');
        return parseFloat(stats || '0');
      })
    );
    
    const average = times.reduce((a, b) => a + b, 0) / times.length;
    return average;
  } catch (error) {
    console.error('Error getting average response time:', error);
    return 0;
  }
};

export const getPopularHours = async (limit: number = 24) => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    const hourlyStats = await client.zRangeWithScores('search:hourly', 0, limit - 1, { REV: true });
    return hourlyStats;
  } catch (error) {
    console.error('Error getting popular hours:', error);
    return [];
  }
};

// Get a specific key from Redis
export const getKey = async (key: string) => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    return await client.get(key);
  } catch (error) {
    console.error('Error getting key:', error);
    return null;
  }
};

// Get a specific field from a hash key
export const getHashField = async (key: string, field: string) => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    return await client.hGet(key, field);
  } catch (error) {
    console.error('Error getting hash field:', error);
    return null;
  }
};

// Get all fields from a hash key
export const getAllHashFields = async (key: string) => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    return await client.hGetAll(key);
  } catch (error) {
    console.error('Error getting all hash fields:', error);
    return null;
  }
};

// Get top queries by search type
export const getTopQueriesBySearchType = async (searchType: string) => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    
    const key = `stats:${searchType}:top-queries`;
    const data = await client.get(key);
    
    if (!data) {
      return null;
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting top queries by search type:', error);
    return null;
  }
};

// Get popular hour statistics
export const getPopularHourStats = async () => {
  try {
    const client = getRedisClient();
    if (!client.isOpen) {
      await client.connect();
    }
    
    const key = 'stats:popular-hour';
    const data = await client.get(key);
    
    if (!data) {
      return null;
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting popular hour stats:', error);
    return null;
  }
}; 