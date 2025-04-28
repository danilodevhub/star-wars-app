#!/bin/bash

# Default values
KAFKA_BROKER=${KAFKA_BROKER:-"kafka:29092"}
TOPIC_NAME=${TOPIC_NAME:-"computable-searches"}
PARTITIONS=${PARTITIONS:-2}
REPLICATION_FACTOR=${REPLICATION_FACTOR:-1}

echo "Waiting for Kafka to be ready..."
sleep 10

echo "Creating topic $TOPIC_NAME..."
kafka-topics --bootstrap-server $KAFKA_BROKER --create \
  --if-not-exists \
  --topic $TOPIC_NAME \
  --partitions $PARTITIONS \
  --replication-factor $REPLICATION_FACTOR \
  --config retention.ms=604800000 \
  --config cleanup.policy=delete \
  --config compression.type=gzip \
  --config min.insync.replicas=1 \
  --config unclean.leader.election.enable=false \
  --config max.message.bytes=1048576

echo "Topic configuration:"
kafka-topics --bootstrap-server $KAFKA_BROKER --describe --topic $TOPIC_NAME 