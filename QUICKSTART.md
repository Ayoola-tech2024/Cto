# 🚀 Quick Start Guide

Get Ideate running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- PostgreSQL 12+ installed and running
- A Google Gemini API key (free)

## Step 1: Get Your Gemini API Key (30 seconds)

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

## Step 2: Set Up Database (1 minute)

```bash
# Create the database
createdb ideate

# Or if using psql:
psql -U postgres
CREATE DATABASE ideate;
\q
```

## Step 3: Configure (30 seconds)

```bash
# Edit backend/.env and add your Gemini API key
nano backend/.env

# Replace this line:
GEMINI_API_KEY=your-gemini-api-key-here

# With your actual key:
GEMINI_API_KEY=AIzaSyC...your-actual-key...
```

## Step 4: Install & Run (2 minutes)

```bash
# Install all dependencies
npm run install:all

# Initialize database
npm run db:init

# Start both backend and frontend
npm run dev
```

## Step 5: Use the App! (30 seconds)

1. Open http://localhost:3000
2. Click "Sign up" and create an account
3. Create your first idea
4. Click "✨ Enhance" to see AI magic!

## 🎉 You're Done!

Now you can:
- ✅ Create and manage ideas
- ✅ Enhance them with AI
- ✅ Share with other users
- ✅ Collaborate in real-time
- ✅ Generate public share links

## 🆘 Troubleshooting

**Database error?**
```bash
# Check if PostgreSQL is running
pg_isready
```

**Port already in use?**
```bash
# Change ports in backend/.env and frontend/.env
PORT=5001  # in backend/.env
REACT_APP_API_URL=http://localhost:5001/api  # in frontend/.env
```

**Can't connect to backend?**
- Make sure both servers are running
- Check terminal for error messages
- Restart with `npm run dev`

## 🐳 Docker Alternative

Prefer Docker? Even easier:

```bash
# Just run this:
docker-compose up
```

That's it! Everything will be set up automatically.

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Invite a friend to test real-time collaboration
- Check out the code to understand how it works
- Deploy to production when ready!

---

Need help? Check the full README or open an issue!
