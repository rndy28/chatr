# Stage 1 - Build the base
FROM node:16-alpine AS base
WORKDIR /app
COPY src ./src
COPY package*.json ./
COPY tsconfig*.json ./
RUN yarn

# Stage 2 - Build the app
FROM base AS build
WORKDIR /app
RUN yarn build

# Stage 3 - Production
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --production
COPY --from=build /app/build ./

CMD ["node", "main.js"]