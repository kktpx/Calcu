type RateLimitCache = {
  [key: string]: {
    count: number;
    resetTime: number;
  };
};

const cache: RateLimitCache = {};

export function rateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  
  if (!cache[identifier]) {
    cache[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true };
  }
  
  const record = cache[identifier];
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { success: true };
  }
  
  if (record.count >= limit) {
    return { success: false };
  }
  
  record.count++;
  return { success: true };
}
