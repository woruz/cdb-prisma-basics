FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.7.5 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/server.js"]