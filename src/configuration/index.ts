import { CorsOptions } from "cors";
import { DotenvConfigOptions } from "dotenv";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { CompressionOptions } from "compression";
import { constants } from "zlib";

export const corsOptions: CorsOptions = {
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "DeveloperThai-Api-Key"],
}

export const dotenvOptions: DotenvConfigOptions = {
    path: [".env", ".env.local", ".env.development", ".env.production"],
    override: false
}

export const limiter: RateLimitRequestHandler = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    message: "ส่ง requests มามากเกินไป!",
    legacyHeaders: false,
});

export const compressionOptions: CompressionOptions = {
    level: constants.Z_BEST_SPEED
};