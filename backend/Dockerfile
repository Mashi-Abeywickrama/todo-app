FROM node:20-alpine

WORKDIR /app

# Install dependencies and netcat
COPY package*.json ./
RUN npm install
RUN apk add --no-cache bash netcat-openbsd

# Copy backend source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose backend port
EXPOSE 3001

# Make wait script executable
RUN chmod +x wait-for-db.sh

# Start server (wait for DB and run migrations)
CMD ["sh", "-c", "./wait-for-db.sh db 3306 && npx prisma migrate deploy && npm run start"]