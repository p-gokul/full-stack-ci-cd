FROM node:22.12.0 AS builder 

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:22.12.0 AS runner

COPY --from=builder ./dist ./dist
COPY --from=builder ./package*.json ./package*.json
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /prisma ./prisma


EXPOSE 5000

CMD ["node","dist/index.js"]

