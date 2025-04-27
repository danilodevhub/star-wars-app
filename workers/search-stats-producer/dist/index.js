"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
});
const kafka = new kafkajs_1.Kafka({
    clientId: 'search-stats-producer',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});
const producer = kafka.producer({
    createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner
});
async function collectAndPublishSearchStats() {
    try {
        // Get all keys matching the pattern
        const keys = await redis.keys('search:*');
        if (keys.length === 0) {
            console.log('No search keys found');
            return;
        }
        // Get values for all keys
        const values = await redis.mget(keys);
        console.log(values);
        
        // Create array of key-value pairs
        const searchStats = keys.map((key, index) => ({
            key,
            value: values[index],
            timestamp: new Date().toISOString()
        }));
        // Publish to Kafka
        await producer.connect();
        await producer.send({
            topic: 'computable-searches',
            messages: [
                {
                    value: JSON.stringify(searchStats)
                }
            ]
        });
        console.log(`Published ${searchStats.length} search stats to Kafka`);
    }
    catch (error) {
        console.error('Error collecting and publishing search stats:', error);
    }
    finally {
        await producer.disconnect();
    }
}
// Run every 5 minutes
// setInterval(collectAndPublishSearchStats, 5 * 60 * 1000);
setInterval(collectAndPublishSearchStats, 30 * 1000); // 30 seconds for testing TODO remove it

// Initial run
collectAndPublishSearchStats();
