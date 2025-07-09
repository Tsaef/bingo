# Bingo Backend

This is the backend API for the Bingo application built with Express.js and PostgreSQL.

## Setup Instructions

### 1. Install Dependencies
```bash
cd bingo-backend
npm install
```

### 2. Database Setup
Make sure you have PostgreSQL installed and running on your system.

Create a database for the application:
```sql
CREATE DATABASE bingo_db;
```

### 3. Environment Configuration
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bingo_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Run Database Migrations
```bash
npm run migrate
```

### 5. Start the Server
For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Endpoints

### POST /api/bingo/grids
Create a new bingo grid
- **Body**: `{ size: number, cells: BingoCell[] }`
- **Response**: `{ id: string, message: string }`

### GET /api/bingo/grids/:id
Get a bingo grid by ID
- **Response**: `{ id: string, size: number, cells: BingoCell[], createdAt: Date }`

### GET /api/bingo/grids/:id/exists
Check if a bingo grid exists
- **Response**: `{ exists: boolean }`

### GET /health
Health check endpoint
- **Response**: `{ status: string, timestamp: string }`

## Database Schema

### bingo_grids
- `id` (UUID, Primary Key)
- `size` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### bingo_cells
- `id` (UUID, Primary Key)
- `grid_id` (UUID, Foreign Key)
- `text` (TEXT)
- `position` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
