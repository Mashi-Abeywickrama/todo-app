# Todo App - Docker Setup Guide

A full-stack Todo application with MySQL, Node.js backend, and React frontend, fully containerized with Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- [Node.js](https://nodejs.org/) (v18 or higher) installed locally
- Git (optional, for cloning)

## Project Structure

```
todo-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── wait-for-db.sh
│   ├── .env
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
```

## 🚀 Quick Start

### 1. Clone the repository (if applicable)

```bash
git clone https://github.com/Mashi-Abeywickrama/todo-app.git
cd todo-app
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Set up environment variables

Create `backend/.env` file:

```env
DATABASE_URL="mysql://root:@localhost:3307/todoapp"
```

### 4. Generate Prisma migrations

**Important:** This step must be done BEFORE building Docker containers.

```bash
# Start only the database container
docker-compose up db -d

# Wait a few seconds for MySQL to initialize, then create migrations
cd backend
npx prisma migrate dev --name init

# Stop the database
docker-compose down -v
```

This creates the migration files in `backend/prisma/migrations/` which Docker will use.

### 5. Build and run all containers

```bash
# Build all containers (from root directory)
docker-compose build --no-cache

# Start all services
docker-compose up
```

### 6. Access the application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **MySQL Database:** localhost:3307

## 🔧 Development Workflow

### Making schema changes

1. Update `backend/prisma/schema.prisma`
2. Create a new migration:
   ```bash
   cd backend
   npx prisma migrate dev --name describe_your_change
   ```
3. Rebuild and restart backend:
   ```bash
   docker-compose build backend
   docker-compose up -d backend
   ```

### Rebuilding containers

```bash
# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild all services
docker-compose build --no-cache
```

### Viewing logs

```bash
# All services
docker-compose logs -f

# Specific service
docker logs todo-backend
docker logs todo-frontend
docker logs todo-db
```

### Accessing the database

```bash
# MySQL CLI
docker-compose exec db mysql -u root todoapp

# Show all tables
docker-compose exec db mysql -u root todoapp -e "SHOW TABLES;"
```

## 🛠️ Troubleshooting

### Tables not created (only `_prisma_migrations` exists)

**Problem:** Migration files weren't created before building Docker.

**Solution:**
```bash
docker-compose down -v
cd backend
docker-compose up db -d
npx prisma migrate dev --name init
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Port already in use

**Problem:** Ports 3000, 3001, or 3307 are occupied.

**Solution:** 
- Stop other services using these ports, OR
- Change ports in `docker-compose.yml`:
  ```yaml
  ports:
    - "3002:3001"  # Change 3001 to 3002
  ```

### Backend shows 500 errors

**Problem:** Database connection or missing tables.

**Solution:**
```bash
# Check backend logs
docker logs todo-backend

# Verify database tables
docker-compose exec db mysql -u root todoapp -e "SHOW TABLES;"
```

### "Drift detected" error

**Problem:** Local database has tables that don't match migration history.

**Solution:**
```bash
# Clean slate approach
docker-compose down -v
cd backend
rm -rf prisma/migrations  # or delete folder manually on Windows
npx prisma migrate dev --name init
docker-compose build --no-cache
docker-compose up
```

## 🧹 Cleanup

### Stop containers (keep data)

```bash
docker-compose down
```

### Stop containers and remove data

```bash
docker-compose down -v
```

### Remove everything (containers, volumes, images)

```bash
docker-compose down -v --rmi all
```

## 📝 Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://root:@localhost:3307/todoapp` |
| `NODE_ENV` | Environment mode | `production` |

### Database

| Variable | Description | Default |
|----------|-------------|---------|
| `MYSQL_DATABASE` | Database name | `todoapp` |
| `MYSQL_USER` | Database user | `todo_user` |
| `MYSQL_PASSWORD` | Database password | `todo_pass` |
| `MYSQL_ALLOW_EMPTY_PASSWORD` | Allow root without password | `yes` |

## 🐳 Docker Services

### Database (MySQL 8)
- **Container:** `todo-db`
- **Port:** 3307:3306
- **Volume:** `db_data`

### Backend (Node.js)
- **Container:** `todo-backend`
- **Port:** 3001:3001
- **Depends on:** db

### Frontend (React + Nginx)
- **Container:** `todo-frontend`
- **Port:** 3000:80
- **Depends on:** backend

## 📚 Useful Commands

```bash
# View running containers
docker ps

# Stop specific container
docker stop todo-backend

# Restart specific container
docker restart todo-backend

# Execute command in container
docker exec -it todo-backend sh

# View container resource usage
docker stats

# Remove unused Docker resources
docker system prune -a
```

## 🎯 Production Deployment

For production, update:

1. Set strong passwords in environment variables
2. Use Docker secrets for sensitive data
3. Set `NODE_ENV=production`
4. Configure proper CORS settings
5. Set up reverse proxy (nginx/traefik)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Create migrations if schema changed
5. Test thoroughly
6. Submit a pull request

---