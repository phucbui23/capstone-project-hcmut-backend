FROM docker.io/library/node:20 AS base
WORKDIR /app

FROM base AS builder
COPY package*.json .
COPY prisma/ prisma/
RUN npm install
COPY . .
RUN npm run build

FROM base AS runner
COPY --chown=node:node src/ src/
COPY --chown=node:node .env .
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/package*.json /app/tsconfig*.json ./

USER node
EXPOSE 3000
CMD [ "npm", "run", "start:migrate:dev" ]