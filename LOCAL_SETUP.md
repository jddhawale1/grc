# Local Development Setup - GRC Platform

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** - [Download](https://code.visualstudio.com/)

---

## Step 1: PostgreSQL Setup

### Windows
1. Download and run PostgreSQL installer
2. Set a password for `postgres` user (remember this!)
3. Keep port as `5432` (default)
4. Complete installation

### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### Verify PostgreSQL is running
```bash
psql --version
```

---

## Step 2: Create Database & User

Open PostgreSQL Command Line or pgAdmin and run:

```sql
-- Create database
CREATE DATABASE grc_platform;

-- Create database user
CREATE USER grc_user WITH PASSWORD 'grc_secure_password_123';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE grc_platform TO grc_user;

-- Connect to database and grant schema privileges
\c grc_platform
GRANT ALL ON SCHEMA public TO grc_user;
```

**Save these credentials - you'll need them for `.env` file**

---

## Step 3: Clone & Setup Project

```bash
# Clone repository
git clone https://github.com/jddhawale1/grc.git
cd grc

# Initialize git (if not cloned)
git init
git remote add origin https://github.com/jddhawale1/grc.git
```

---

## Step 4: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Edit `.backend/.env` file:

```
NODE_ENV=development
PORT=5000

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=grc_platform
DB_USER=grc_user
DB_PASSWORD=grc_secure_password_123

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# API Configuration
API_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Redis (Optional)
REDIS_URL=redis://localhost:6379
```

### Initialize Database

```bash
# Run migrations to create tables
npx sequelize-cli db:migrate

# Seed sample data (optional)
npx sequelize-cli db:seed:all
```

### Start Backend Server

```bash
# Development with hot-reload
npm run dev

# Or production build
npm run build
npm start
```

Backend will run on: **http://localhost:5000**

---

## Step 5: Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Edit `frontend/.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=30000
```

### Start Frontend Server

```bash
# Development mode
npm start

# Or build for production
npm run build
```

Frontend will run on: **http://localhost:3000**

---

## Step 6: VS Code Extensions (Recommended)

Install these extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
2. **Prettier - Code formatter** - esbenp.prettier-vscode
3. **ESLint** - dbaeumer.vscode-eslint
4. **Thunder Client** or **REST Client** - for API testing
5. **PostgreSQL** - ckolkman.vscode-postgres
6. **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss

---

## Step 7: Test the Setup

### Test Backend API

```bash
# Open new terminal, test API health
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "GRC Platform API is running",
  "timestamp": "2026-05-13T10:30:00Z"
}
```

### Test Frontend

Open browser: **http://localhost:3000**

Login with demo credentials:
- **Email:** admin@grc.local
- **Password:** password

---

## Step 8: VS Code Workspace Setup

Create `grc.code-workspace` file in project root:

```json
{
  "folders": [
    {
      "path": "backend",
      "name": "Backend"
    },
    {
      "path": "frontend",
      "name": "Frontend"
    }
  ],
  "settings": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "javascript.updateImportsOnFileMove.enabled": "always",
    "explorer.excludeGitIgnore": true
  }
}
```

Open workspace in VS Code:
```bash
code grc.code-workspace
```

---

## Common Issues & Fixes

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# macOS
brew services restart postgresql

# Linux
sudo service postgresql restart

# Windows
# Restart PostgreSQL service in Services app
```

### Port Already in Use

```bash
# Find process using port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Find process using port 3000 (frontend)
lsof -i :3000
kill -9 <PID>
```

### Database Migration Error

```bash
# Reset database (WARNING: Deletes all data)
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate

# Check database connection
psql -h localhost -U grc_user -d grc_platform
```

### Module Not Found Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Development Workflow

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm start
```

### Terminal 3: PostgreSQL Management (Optional)
```bash
psql -h localhost -U grc_user -d grc_platform
```

---

## Database Management Tools

### Option 1: pgAdmin (Web UI)
```bash
# Install pgAdmin (if not using Docker)
npm install -g pgadmin4
```

### Option 2: DBeaver (Desktop Client)
- Download: https://dbeaver.io/
- Connect to PostgreSQL with credentials

### Option 3: VS Code PostgreSQL Extension
- Install extension in VS Code
- Right-click database tree to run queries

---

## API Testing in VS Code

### Using Thunder Client (Recommended)
1. Install extension
2. Create collection "GRC Platform"
3. Add requests for each API endpoint

### Using REST Client Extension
Create `test.http` file:

```http
### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@grc.local",
  "password": "password"
}

### Get Assets
GET http://localhost:5000/api/assets
Authorization: Bearer YOUR_JWT_TOKEN

### Create Asset
POST http://localhost:5000/api/assets
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "name": "Production Database Server",
  "type": "Database Server",
  "dataClassification": "Critical",
  "internetExposure": "Internal",
  "businessOwner": "Database Team",
  "regulatoryRegion": "US"
}
```

Click "Send Request" to test APIs directly from VS Code!

---

## Next Steps

1. ✅ Verify both servers running on ports 3000 & 5000
2. ✅ Test login with demo credentials
3. ✅ Explore Asset Onboarding form
4. ✅ Create sample risks and assessments
5. ✅ Review executive dashboard

---

## Support & Debugging

For detailed logs, check:
- **Backend logs:** `backend/logs/` directory
- **Browser console:** F12 in your browser
- **Network tab:** Check API responses in DevTools

---

**Happy coding! 🚀**
