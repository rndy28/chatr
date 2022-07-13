
declare module NodeJS {
    interface ProcessEnv {
        MONGO_URI: string;
        NODE_ENV: string;
        PORT: string;
        JWT_SECRET: string;
        CORS_ORIGIN: string;
    }
}
