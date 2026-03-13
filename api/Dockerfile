FROM node:24-alpine3.23 AS base

FROM base AS build
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build

FROM base AS production
WORKDIR /app
RUN chown node:node /app
USER node
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev
COPY --from=build --chown=node:node /app/dist ./dist
CMD ["node", "dist/main.js"]
