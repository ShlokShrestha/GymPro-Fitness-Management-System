import rateLimit, {
  RateLimitRequestHandler,
  Options,
} from "express-rate-limit";

export type RateLimiterOptions = {
  windowMs: Options["windowMs"];
  limit: Options["limit"];
  message?: string | Record<string, any>;
  keyGenerator?: Options["keyGenerator"];
  skip?: Options["skip"];
};

export const createRateLimiter = (
  options: RateLimiterOptions,
): RateLimitRequestHandler => {
  return rateLimit({
    windowMs: options.windowMs,
    limit: options.limit,
    keyGenerator: options.keyGenerator,
    skip: options.skip,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const body =
        typeof options.message === "string"
          ? {
              success: false,
              error: "RATE_LIMIT_EXCEEDED",
              message: options.message,
            }
          : (options.message ?? {
              success: false,
              error: "RATE_LIMIT_EXCEEDED",
              message: "Too many requests. Try again later.",
            });

      res.status(429).json(body);
    },
  });
};
