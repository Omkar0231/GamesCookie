# 📋 Production Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Server Setup
- [ ] Server with Docker installed
- [ ] Docker Compose v2.0+ installed
- [ ] Minimum 2GB RAM, 2 CPU cores
- [ ] 20GB+ disk space
- [ ] Ports 80, 443 open in firewall
- [ ] SSH access configured

### Domain Configuration
- [ ] Domain purchased
- [ ] DNS A record points to server IP
- [ ] www subdomain configured (optional)
- [ ] DNS propagation complete (check: `dig your-domain.com`)

### Environment Configuration
- [ ] `.env` file created from `.env.example`
- [ ] Database credentials set
- [ ] Strong password for DB_PASSWORD (12+ characters)
- [ ] JWT_SECRET generated: `openssl rand -base64 32`
- [ ] SMTP credentials configured
- [ ] SMTP_EMAIL set correctly
- [ ] DOMAIN set to your domain
- [ ] ADMIN_EMAIL set for SSL notifications
- [ ] ALLOWED_ORIGINS updated with your domains
- [ ] MEMCACHED_HOST configured (if using)

## Deployment Steps

### Initial Setup
- [ ] Clone repository to server
- [ ] Run `./scripts/setup.sh`
- [ ] Verify all files created
- [ ] No errors in setup output

### Configuration Review
- [ ] `.env` file reviewed and updated
- [ ] No default passwords remain
- [ ] All required variables have values
- [ ] Database name matches your needs

### Deploy
- [ ] Run `./scripts/deploy-production.sh`
- [ ] SSL certificate obtained successfully
- [ ] All containers started
- [ ] Health checks passing

## Post-Deployment

### Verification
- [ ] Visit http://your-domain.com (should redirect to HTTPS)
- [ ] Visit https://your-domain.com (should work)
- [ ] API endpoints responding: `curl https://your-domain.com/api/`
- [ ] No SSL warnings in browser
- [ ] Check SSL rating: https://www.ssllabs.com/ssltest/
- [ ] Verify health: `./scripts/health-check.sh`

### Monitoring
- [ ] Check logs: `docker-compose logs -f`
- [ ] No errors in application logs
- [ ] Database connected successfully
- [ ] Nginx logs show traffic
- [ ] SSL auto-renewal configured

### Testing
- [ ] Test user registration
- [ ] Test login functionality
- [ ] Test file upload
- [ ] Test API endpoints
- [ ] Test email sending (if configured)
- [ ] Test from allowed origins

### Security
- [ ] `.env` file has restricted permissions: `chmod 600 .env`
- [ ] Root login disabled on server
- [ ] SSH key authentication only
- [ ] Firewall configured (UFW/iptables)
- [ ] Only necessary ports open
- [ ] Database not exposed externally
- [ ] Regular updates scheduled

### Backup
- [ ] Database backup script tested
- [ ] Backup storage location set
- [ ] Automated backup schedule configured
- [ ] Backup restoration tested
- [ ] SSL certificates backed up
- [ ] `.env` file backed up securely

## Maintenance Schedule

### Daily
- [ ] Monitor application logs
- [ ] Check disk space
- [ ] Verify SSL certificate status

### Weekly
- [ ] Review Nginx access logs
- [ ] Check for application updates
- [ ] Database optimization
- [ ] Test backup restoration

### Monthly
- [ ] Security updates
- [ ] Review and rotate logs
- [ ] Performance optimization
- [ ] SSL certificate check

## Emergency Contacts

```
Server Provider: ___________________
Domain Registrar: __________________
SSL Support: certbot@letsencrypt.org
Database Admin: ____________________
DevOps Lead: _______________________
```

## Quick Commands Reference

```bash
# Check status
docker-compose ps
./scripts/health-check.sh

# View logs
docker-compose logs -f app

# Restart
docker-compose restart

# Stop
docker-compose down

# Backup database
docker-compose exec db mysqladump -u root -p gamescookie > backup.sql

# Update application
git pull
docker-compose up -d --build
```

## Rollback Plan

If deployment fails:

1. Stop services:
   ```bash
   docker-compose down
   ```

2. Restore previous `.env`:
   ```bash
   cp .env.backup .env
   ```

3. Restore database:
   ```bash
   docker-compose exec -T db mysql -u root -p gamescookie < backup.sql
   ```

4. Restart services:
   ```bash
   docker-compose up -d
   ```

## Success Criteria

Deployment is successful when:
- ✅ All containers running and healthy
- ✅ HTTPS working without warnings
- ✅ API endpoints responding correctly
- ✅ Database queries working
- ✅ No errors in logs
- ✅ File uploads working
- ✅ Email sending functional (if configured)
- ✅ Health checks passing

---

**Date Deployed**: _______________
**Deployed By**: _________________
**Version**: ____________________

---

## Notes

```
Add any deployment-specific notes here:




```

---

**✅ All checks complete? You're ready for production! 🚀**
