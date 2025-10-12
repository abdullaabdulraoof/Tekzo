const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

redis.set("hello", "world");
redis.get("hello").then(console.log); // should print "world"