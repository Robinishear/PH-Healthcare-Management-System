/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, RedisClientType } from "redis";
import { envVars } from "../config/env";

class RedisService {
    private client: RedisClientType | null = null;
    private isConnected: boolean = false;

    async connect(): Promise<void> {
        try {
            const redisUrl = envVars.REDIS_URL;

            this.client = createClient({ url: redisUrl });

            // Handle connection events
            this.client.on("error", (err) => {
                console.error("Redis Client Error: ", err);
                this.isConnected = false;
            });

            //   Connect event fires when the client successfully connects to the Redis server
            this.client.on("connect", () => {
                console.log("Redis Client Connected");
                this.isConnected = true;
            });

            //   Ready event fires when the client is ready to receive commands
            this.client.on("ready", () => {
                console.log("Redis Client Ready");
                this.isConnected = true;
            })

            //   End event fires when the client is disconnected
            this.client.on("end", () => {
                console.log("Redis Client Disconnected");
                this.isConnected = false;
            })

            //   Reconnect event fires when the client tries to reconnect to the Redis server
            this.client.on("reconnecting", () => {
                console.log("Redis Client Reconnecting");
            })



            await this.client.connect();
        } catch (error) {
            console.log(error);
            this.isConnected = false;
        }
    }

    //   Helper method to ensure Redis client is connected
    private ensureConnection(): RedisClientType {
        if (!this.client) {
            throw new Error("Redis client not initialized. Call connect() first.");
        }

        if (!this.isConnected) {
            throw new Error("Redis client not connected.");
        }


        return this.client;
    }

    //  Method to set a key-value pair in Redis with optional TTL
    async get(key: string): Promise<string | null> {
        try {
            const client = this.ensureConnection();
            return await client.get(key);
        } catch (error) {
            console.error("Redis GET error: ", error);
            return null;
        }
    }

    //  Method to get a value by key from Redis
    async set(
        key: string,
        value: any,
        ttlInSeconds: number
    ): Promise<void> {
        try {
            const client = this.ensureConnection();

            const stringValue =
                typeof value === "string" ? value : JSON.stringify(value);

            await client.set(key, stringValue, { EX: ttlInSeconds });
        } catch (err) {
            console.error("Redis SET error: ", err);
        }
    }

    //  Method to update a key in Redis with optional TTL
    async update(
        key: string,
        value: any,
        ttlInSeconds: number
    ): Promise<void> {
        await this.set(key, value, ttlInSeconds);
    }

    //* Method to delete a key from Redis
    async delete(key: string): Promise<void> {
        try {
            const client = this.ensureConnection();
            await client.del(key);
        } catch (error) {
            console.log("Redis DELETE error: ", error);
        }
    }

    //  Method to check if Redis is available
    async isAvailable(): Promise<boolean> {
        try {
            const client = this.ensureConnection();
            await client.ping();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    //  Method to disconnect Redis
    async disconnect(): Promise<void> {
        if (this.client && this.isConnected) {
            await this.client.quit();
            this.isConnected = false;
        }
    }
}

export const redisService = new RedisService();