import redis from 'redis';
import type { Result } from '~~/store/utils';
console.log('\x1b[36mℹ\x1b[0m', 'Cache plugin loaded!');

const redisClient = redis.createClient({
  database: 1,
});

redisClient.connect().then(() => {
  console.log('\x1b[36mℹ\x1b[0m', 'Redis connected');
});
export default defineNuxtPlugin(() => {
  // Provide cache for api calls
  return {
    provide: {
      async getCache<T>(route: string): Promise<Result<T> | null> {
        console.log('\x1b[36mℹ\x1b[0m', 'Getting cache for', route);
        const data = await redisClient.get(route);
        if (data) return { type: 'cache', status: 'success', result: JSON.parse(data) };
        return null;
      },
      setCache(route: string, data: any[]) {
        console.log('\x1b[36mℹ\x1b[0m', 'Setting cache for', route);
        for (const item of data) {
          delete item.content_markdown;
        }
        redisClient.set(route, JSON.stringify(data), {
          EX: 10 * 60, // 10 minutes
        });
      },
    },
  };
});
