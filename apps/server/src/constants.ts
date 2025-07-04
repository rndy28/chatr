export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
export const __prod__ = process.env.NODE_ENV === "production";
export const PORT = parseInt(process.env.PORT || "5000", 10);
export const HOST = process.env.HOST || "0.0.0.0";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
export const NEW_MESSAGE_CHANNEL = "chat:new-message";
export const UPDATE_MESSAGE_CHANNEL = "chat:update-message";
export const MESSAGES_CHANNEL = "chat:messages";
export const REQUEST_SELECTED_CONVERSATION = "chat:request-conversation";
export const CONVERSATION_CHANNEL = "chat:conversation";
export const ONLINE_USER_CHANNEL = "chat:online-user";
