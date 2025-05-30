# Local PostgreSQL Setup Guide

## Step 1: Install PostgreSQL

### Windows (Recommended method):
```powershell
# Using Chocolatey (if you have it)
choco install postgresql

# Or download installer from:
# https://www.postgresql.org/download/windows/
```

### Alternative - Docker (if you have Docker Desktop):
```powershell
# Run PostgreSQL in Docker
docker run --name phorent-postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=phorent -p 5432:5432 -d postgres:15
```

## Step 2: Create Database

```powershell
# Connect to PostgreSQL (after installation)
psql -U postgres

# Create database
CREATE DATABASE phorent;

# Create user (optional)
CREATE USER phorent_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE phorent TO phorent_user;

# Exit
\q
```

## Step 3: Update Connection String

```bash
# For default postgres user:
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/phorent"

# For custom user:
DATABASE_URL="postgresql://phorent_user:yourpassword@localhost:5432/phorent"
```

## Benefits:
- ✅ Full control over database
- ✅ No internet dependency
- ✅ Great for development
- ✅ Same as production environment
