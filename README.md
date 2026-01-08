# GamesCookie Backend - Production Deployment Guide

Professional Node.js backend with Docker, Nginx, SSL auto-renewal, and zero-downtime deployment.

## 🚀 Features

- **Docker Containerization**: Multi-stage builds with security best practices
- **Nginx Reverse Proxy**: High-performance with rate limiting and caching
- **SSL Auto-Renewal**: Let's Encrypt certificates with automatic renewal
- **MySQL Database**: Containerized with persistent storage
- **Environment-Based Configuration**: No hardcoded values
- **Health Checks**: Automatic service monitoring
- **Easy Setup**: One-command deployment scripts

## 📋 Prerequisites

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)
- Domain name pointing to your server (for SSL)
- Open ports: 80 (HTTP), 443 (HTTPS), 3306 (MySQL - optional)

## 🛠️ Quick Start

### 1. Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Run the setup script
./scripts/setup.sh
```

This will:
- Create `.env` file from template
- Set up required directories
- Build Docker images

### 2. Configure Environment

Edit `.env` file with your settings:

```bash
nano .env
```

**Required configurations:**

```env
# Database
DB_HOST=db                          # Use 'db' for Docker, or external host
DB_USERNAME=your_db_user
DB_PASSWORD=your_strong_password
DB_DATABASE=gamescookie
DB_PORT=3306
DB_CONNECTION=mysql

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_EMAIL=noreply@gamescookie.com

# SSL & Domain
DOMAIN=gamescookie.com
ADMIN_EMAIL=admin@gamescookie.com

# Optional: Memcached
MEMCACHED_HOST=localhost:11211
```

### 3. Development Mode

For local development without SSL:

```bash
./scripts/dev.sh
```

Access at: `http://localhost:8081`

### 4. Production Deployment

For production with SSL certificates:

```bash
./scripts/deploy-production.sh
```

This will:
1. Validate configuration
2. Set up SSL certificates (if not exists)
3. Build and start all services
4. Verify health checks
5. Display service status

## 📁 Project Structure

```
backend/
├── app/                        # Application code
│   ├── index.js               # Express app setup
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── mail/                  # Email templates
│   └── validation/            # Input validation
├── docker/                    # Docker configurations
│   ├── nginx/                 # Nginx configs
│   │   ├── nginx.conf        # Main nginx config
│   │   └── conf.d/           # Site configs
│   ├── certbot/              # SSL certificates
│   └── mysql/                # Database init scripts
├── scripts/                   # Deployment scripts
│   ├── setup.sh              # Initial setup
│   ├── deploy-production.sh  # Production deploy
│   ├── setup-ssl.sh          # SSL certificate setup
│   └── dev.sh                # Development start
├── uploads/                   # File uploads (persistent)
├── server.js                  # Application entry point
├── Dockerfile                # Docker image definition
├── docker-compose.yml        # Service orchestration
├── .env.example              # Environment template
└── README.md                 # This file
```

## 🐳 Docker Services

### Application (app)
- **Port**: 8081
- **Health Check**: HTTP GET /
- **Volumes**: `./uploads:/app/uploads`

### Database (db)
- **Port**: 3306
- **Image**: MySQL 8.0
- **Volumes**: Persistent data storage

### Nginx (nginx)
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Features**: 
  - SSL/TLS termination
  - Rate limiting
  - Static file caching
  - Reverse proxy to app

### Certbot (certbot)
- **Purpose**: SSL certificate management
- **Auto-Renewal**: Every 12 hours

## 📝 Common Commands

### Service Management

```bash
# View all services
docker-compose ps

# View logs (all services)
docker-compose logs -f

# View app logs only
docker-compose logs -f app

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Database Access

```bash
# Access MySQL shell
docker-compose exec db mysql -u root -p

# Backup database
docker-compose exec db mysqldump -u root -p gamescookie > backup.sql

# Restore database
docker-compose exec -T db mysql -u root -p gamescookie < backup.sql
```

### SSL Certificate Management

```bash
# Manually renew certificates
docker-compose run --rm certbot renew

# View certificate info
docker-compose run --rm certbot certificates
```

### Application Updates

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d

# Or use the deploy script
./scripts/deploy-production.sh
```

## 🔒 Security Features

- **Non-root user**: Application runs as unprivileged user
- **Multi-stage builds**: Minimal attack surface
- **SSL/TLS**: Automatic HTTPS with strong cipher suites
- **Rate limiting**: API and upload endpoint protection
- **Security headers**: HSTS, X-Frame-Options, CSP, etc.
- **Environment variables**: No hardcoded secrets
- **Health checks**: Automatic service monitoring

## 🌐 Nginx Configuration

### Rate Limits
- **API endpoints**: 10 requests/second (burst: 20)
- **Upload endpoints**: 5 requests/second (burst: 5)

### SSL Configuration
- **Protocols**: TLSv1.2, TLSv1.3
- **HSTS**: Enabled (max-age: 2 years)
- **OCSP Stapling**: Enabled

### Caching
- **Static files**: 1 day cache
- **API responses**: No cache (dynamic)

## 🔍 Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs app
docker-compose logs db
```

### SSL certificate issues

```bash
# Check certificate status
docker-compose run --rm certbot certificates

# Force renewal
docker-compose run --rm certbot renew --force-renewal

# Re-run SSL setup
./scripts/setup-ssl.sh
```

### Database connection errors

```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Verify credentials in .env file
cat .env | grep DB_
```

### Port already in use

```bash
# Find what's using the port
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :8081

# Stop conflicting services
sudo systemctl stop nginx  # if system nginx is running
```

## 📊 Monitoring & Health Checks

### Application Health

```bash
# Check app health
curl http://localhost:8081/

# Check via nginx
curl https://your-domain.com/
```

### Service Status

```bash
# View Docker health status
docker-compose ps

# View detailed container info
docker inspect gamescookie-backend
```

## 🔄 Backup & Recovery

### Backup

```bash
# Backup database
docker-compose exec db mysqldump -u root -p${DB_PASSWORD} gamescookie > backup_$(date +%Y%m%d).sql

# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/

# Backup SSL certificates
tar -czf ssl_backup_$(date +%Y%m%d).tar.gz docker/certbot/
```

### Recovery

```bash
# Restore database
docker-compose exec -T db mysql -u root -p${DB_PASSWORD} gamescookie < backup_20240101.sql

# Restore uploads
tar -xzf uploads_backup_20240101.tar.gz

# Restore SSL certificates
tar -xzf ssl_backup_20240101.tar.gz
```

## 🚀 Performance Optimization

### Nginx Tuning

Edit `docker/nginx/nginx.conf`:
- Adjust `worker_processes` based on CPU cores
- Modify `worker_connections` for concurrent connections
- Tune caching settings

### Database Optimization

Create `docker/mysql/conf.d/custom.cnf`:

```ini
[mysqld]
max_connections = 200
innodb_buffer_pool_size = 1G
query_cache_size = 64M
```

### Application Scaling

For multiple instances:

```yaml
# In docker-compose.yml
services:
  app:
    deploy:
      replicas: 3
```

## 📧 Support

For issues or questions:
- Email: admin@gamescookie.com
- Check logs: `docker-compose logs -f`

## 📄 License

[Your License Here]

---

**Built with ❤️ for GamesCookie**
