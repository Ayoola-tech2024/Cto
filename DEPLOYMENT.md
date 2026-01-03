# 🚀 Deployment Guide

This guide covers deploying Ideate to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
  - [Heroku](#heroku)
  - [Railway](#railway)
  - [AWS](#aws)
  - [DigitalOcean](#digitalocean)
  - [Vercel + Railway](#vercel--railway)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [SSL/TLS Configuration](#ssltls-configuration)
- [Monitoring](#monitoring)
- [Backup Strategy](#backup-strategy)

---

## Prerequisites

Before deploying:

- ✅ Code tested locally
- ✅ Database schema tested
- ✅ Environment variables documented
- ✅ Google Gemini API key obtained
- ✅ Git repository ready

## Environment Setup

### Production Environment Variables

Create production `.env` file with:

```env
# Server
NODE_ENV=production
PORT=5000

# Database (use managed PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Security (IMPORTANT: Use strong secrets)
JWT_SECRET=<generate-strong-random-secret>

# Google Gemini API
GEMINI_API_KEY=<your-gemini-api-key>

# CORS (Frontend URL)
FRONTEND_URL=https://your-frontend-domain.com
```

**Generate Strong JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Deployment Options

### Option 1: Heroku

**Best for:** Quick deployment, managed infrastructure

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   brew install heroku/brew/heroku  # macOS
   # or
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create ideate-backend-prod
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set GEMINI_API_KEY=your-key
   heroku config:set NODE_ENV=production
   ```

6. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

7. **Initialize Database**
   ```bash
   heroku run npm run db:init
   ```

8. **Check Status**
   ```bash
   heroku logs --tail
   heroku ps
   ```

#### Frontend Deployment (to Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure Frontend**
   ```bash
   cd frontend
   ```

   Create `.env.production`:
   ```env
   REACT_APP_API_URL=https://ideate-backend-prod.herokuapp.com/api
   REACT_APP_WS_URL=wss://ideate-backend-prod.herokuapp.com
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to project settings
   - Add environment variables
   - Redeploy

---

### Option 2: Railway

**Best for:** Modern deployment, great DX

#### Full Stack Deployment

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Add PostgreSQL**
   ```bash
   railway add --plugin postgresql
   ```

5. **Deploy Backend**
   ```bash
   cd backend
   railway up
   ```

6. **Set Environment Variables**
   ```bash
   railway variables set JWT_SECRET=your-secret
   railway variables set GEMINI_API_KEY=your-key
   ```

7. **Deploy Frontend**
   ```bash
   cd ../frontend
   railway up
   ```

8. **Link Services**
   - Configure environment variables to link backend/frontend
   - Set REACT_APP_API_URL to backend URL

---

### Option 3: AWS

**Best for:** Enterprise, full control

#### Architecture

```
Route 53 (DNS)
    ↓
CloudFront (CDN) → S3 (Frontend)
    ↓
ALB (Load Balancer)
    ↓
EC2 / ECS (Backend)
    ↓
RDS PostgreSQL
```

#### Backend on EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.small or larger
   - Security group: Allow 80, 443, 5000

2. **SSH into Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # PM2 (Process Manager)
   sudo npm install -g pm2

   # PostgreSQL client
   sudo apt-get install -y postgresql-client
   ```

4. **Clone Repository**
   ```bash
   git clone https://github.com/your-repo/ideate.git
   cd ideate/backend
   npm install --production
   ```

5. **Configure Environment**
   ```bash
   nano .env
   # Add production environment variables
   ```

6. **Start with PM2**
   ```bash
   pm2 start server.js --name ideate-backend
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt-get install -y nginx

   sudo nano /etc/nginx/sites-available/ideate
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # WebSocket support
       location /ws {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "Upgrade";
           proxy_set_header Host $host;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/ideate /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

#### Frontend on S3 + CloudFront

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://ideate-frontend
   aws s3 sync build/ s3://ideate-frontend
   ```

3. **Configure S3 for Static Hosting**
   - Enable static website hosting
   - Set index.html as index document
   - Make bucket public (or use CloudFront)

4. **Setup CloudFront**
   - Create distribution
   - Origin: S3 bucket
   - Enable HTTPS
   - Configure custom domain

5. **Update DNS (Route 53)**
   - Add CNAME for frontend
   - Point to CloudFront distribution

#### RDS PostgreSQL

1. **Create RDS Instance**
   - Engine: PostgreSQL 13+
   - Instance: db.t3.micro (or larger)
   - Multi-AZ: Optional
   - Storage: 20GB minimum

2. **Configure Security Group**
   - Allow inbound from EC2 security group
   - Port: 5432

3. **Initialize Database**
   ```bash
   psql -h your-rds-endpoint -U postgres
   CREATE DATABASE ideate;
   \q

   # Run init script
   cd backend
   DATABASE_URL=postgresql://... npm run db:init
   ```

---

### Option 4: DigitalOcean

**Best for:** Simplicity, good pricing

#### Using App Platform

1. **Create DigitalOcean Account**
   - Visit https://www.digitalocean.com

2. **Create App**
   - Go to App Platform
   - Connect GitHub repository
   - Select branch

3. **Configure Components**
   
   **Backend:**
   - Type: Web Service
   - Build Command: `cd backend && npm install`
   - Run Command: `node server.js`
   - Port: 5000

   **Frontend:**
   - Type: Static Site
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`

4. **Add Database**
   - Add PostgreSQL database
   - Link to backend service

5. **Set Environment Variables**
   - Add all required env vars
   - Link DATABASE_URL from database

6. **Deploy**
   - Click "Create Resources"
   - Wait for deployment

---

### Option 5: Vercel + Railway (Recommended for MVP)

**Best for:** Easy deployment, great performance

#### Backend on Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up

# Add PostgreSQL
railway add

# Set environment variables
railway variables
```

#### Frontend on Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

---

## Database Setup

### Managed PostgreSQL Options

1. **Heroku Postgres**
   - Mini: $5/month (10M rows)
   - Basic: $9/month (10M rows)
   - Standard: $50+/month

2. **Railway PostgreSQL**
   - Free tier: 512MB
   - Pro: $5/month+

3. **AWS RDS**
   - db.t3.micro: ~$15/month
   - Multi-AZ: Double cost

4. **DigitalOcean Managed**
   - Basic: $15/month (1GB RAM)

### Database Migration

```bash
# Export from local
pg_dump ideate > backup.sql

# Import to production
psql $DATABASE_URL < backup.sql

# Or use init script
DATABASE_URL=$PROD_DATABASE_URL npm run db:init
```

---

## Environment Variables

### Required Variables

**Backend:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=<strong-secret>
GEMINI_API_KEY=<your-key>
```

**Frontend:**
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_WS_URL=wss://api.yourdomain.com
```

### Security Best Practices

1. **Never commit `.env` files**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use strong secrets**
   ```bash
   # Generate JWT secret
   openssl rand -base64 64
   ```

3. **Rotate secrets regularly**
   - Every 90 days for production
   - After team member departure

4. **Use secret management**
   - AWS Secrets Manager
   - HashiCorp Vault
   - Platform-provided (Heroku Config Vars)

---

## SSL/TLS Configuration

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Platform SSL

Most platforms provide free SSL:
- ✅ Heroku: Automatic SSL
- ✅ Vercel: Automatic SSL
- ✅ Railway: Automatic SSL
- ✅ Netlify: Automatic SSL

---

## Monitoring

### Application Monitoring

**1. PM2 Monitoring** (if using PM2)
```bash
pm2 monit
pm2 logs
pm2 status
```

**2. Error Tracking**
- Sentry (recommended)
- Rollbar
- Bugsnag

Setup Sentry:
```bash
npm install @sentry/node @sentry/react

# Backend
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your-dsn" });

# Frontend
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "your-dsn" });
```

**3. Performance Monitoring**
- New Relic
- DataDog
- AppDynamics

### Database Monitoring

- Connection pool stats
- Query performance
- Slow query logs

```sql
-- PostgreSQL slow query log
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

### Uptime Monitoring

- UptimeRobot (free)
- Pingdom
- StatusCake

---

## Backup Strategy

### Database Backups

**Automated Backups:**

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://ideate-backups/
rm backup_$DATE.sql
```

**Setup Cron:**
```bash
crontab -e

# Daily at 2 AM
0 2 * * * /path/to/backup-script.sh
```

**Managed Backup:**
- Heroku: Automatic backups (paid plans)
- RDS: Automated backups (configurable)
- Railway: Manual backups

### Code Backups

- Git repository (primary)
- Mirror on another platform
- Regular releases/tags

---

## CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Post-Deployment Checklist

- [ ] SSL certificate installed and working
- [ ] Environment variables set correctly
- [ ] Database initialized and migrated
- [ ] Backend API responding
- [ ] Frontend loading correctly
- [ ] WebSocket connection working
- [ ] Authentication flow working
- [ ] Create test idea and enhance it
- [ ] Share idea with test user
- [ ] Generate public link and test
- [ ] Check error logs
- [ ] Setup monitoring
- [ ] Configure backups
- [ ] Document deployment process
- [ ] Setup alerts for downtime

---

## Troubleshooting

### Common Issues

**1. WebSocket Connection Fails**
- Check WSS protocol (not WS) for HTTPS
- Verify proxy configuration supports WebSockets
- Check firewall rules

**2. Database Connection Fails**
- Verify DATABASE_URL is correct
- Check SSL mode (add `?ssl=true` if needed)
- Verify network access/firewall

**3. CORS Errors**
- Add frontend URL to CORS whitelist
- Check protocol (http vs https)

**4. JWT Errors**
- Verify JWT_SECRET matches
- Check token expiration
- Validate token format

---

## Scaling Checklist

When you need to scale:

- [ ] Move WebSocket state to Redis
- [ ] Add load balancer
- [ ] Setup database read replicas
- [ ] Implement caching (Redis)
- [ ] Use CDN for static assets
- [ ] Optimize database queries
- [ ] Add database connection pooling
- [ ] Implement rate limiting
- [ ] Setup horizontal scaling (multiple instances)
- [ ] Monitor performance metrics

---

## Support

For deployment help:
- Check platform documentation
- Open GitHub issue
- Contact maintainers

---

**Happy Deploying! 🚀**
