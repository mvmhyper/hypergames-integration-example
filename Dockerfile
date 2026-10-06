FROM chiefoleka/node:24.09-slim AS base
WORKDIR /app

FROM base AS development
ENV NODE_ENV=development PORT=3000
COPY package*.json ./
RUN npm install
COPY tsconfig.json nodemon.json ./
COPY src ./src
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS builder
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM chiefoleka/node:24.09-slim AS runner
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "./dist"]
