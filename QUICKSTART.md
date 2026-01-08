# 🚀 GamesCookie Backend - Quick Start Guide

## Prerequisites

- Docker & Docker Compose installed
- Domain name (for production SSL)
- 10 minutes ⏱️

## 🏃 Quick Start (3 Steps)

### Step 1: Setup

```bash
./scripts/setup.sh
```

### Step 2: Configure

Edit `.env` file with your credentials:
```bash
nano .env
```

**Minimum required:**
- Database credentials
- JWT_SECRET
- SMTP settings (for emails)
- DOMAIN & ADMIN_EMAIL (for production)

### Step 3: Deploy

**For Development:**
```bash
./scripts/dev.sh
```
✅ Access at: http://localhost:8081

**For Production:**
```bash
./scripts/deploy-production.sh
```
✅ Access at: https://your-domain.com

---

## 📋 What Gets Configured

### ✅ Security
- SSL/TLS certificates (auto-renewal)
- Non-root Docker user
- Rate limiting
- Security headers (HSTS, CSP, etc.)

### ✅ Infrastructure
- Node.js application container
- MySQL 8.0 database
- Nginx reverse proxy
- Certbot for SSL

### ✅ Features
- Environment-based config
- Automatic health checks
- Log aggregation
- File upload support
- Email functionality

---

## 🔧 Common Tasks

### View Logs
```bash
docker-compose logs -f app
```

### Restart Services
```bash
docker-compose restart
```

### Access Database
```bash
docker-compose exec db mysql -u root -p
```

### Stop Everything
```bash
docker-compose down
```

---

## 📚 Full Documentation

See [README.md](README.md) for complete documentation.

---

## 🆘 Need Help?

**Issue**: Services won't start
```bash
docker-compose logs
```

**Issue**: SSL certificate fails
- Ensure your domain DNS points to this server
- Check ports 80 and 443 are open

**Issue**: Database connection error
- Verify DB credentials in .env
- Check if database is running: `docker-compose ps db`

---

## 📊 Service Ports

| Service | Port | Purpose |
|---------|------|---------|
| Application | 8081 | API Backend |
| Nginx | 80 | HTTP (redirects to HTTPS) |
| Nginx | 443 | HTTPS |
| MySQL | 3306 | Database |

---

**Ready to Deploy! 🎉**
