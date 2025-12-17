# AlphaLinkup React Frontend - Production Deployment Guide

## Server Details
- **IP Address**: `52.66.224.22`
- **SSH Command**: 
  ```bash
  ssh -i "alpha_prod.pem" ubuntu@ec2-52-66-224-22.ap-south-1.compute.amazonaws.com
  ```
- **Server**: Ubuntu 24.04.3 LTS
- **Node.js & MySQL**: Already installed

---

## Quick Deployment Steps

### 1. Connect to Server
```bash
chmod 400 alpha_prod.pem
ssh -i "alpha_prod.pem" ubuntu@ec2-52-66-224-22.ap-south-1.compute.amazonaws.com
```

### 2. Navigate to Project
```bash
cd /home/ubuntu/AlphaLinkup_React_FrontEnd
```

### 3. Run Deployment Script
```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

**OR Manual Steps:**

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Copy production env (if .env.production exists)
cp .env.production .env

# Build for production
npm run build
```

---

## Environment Configuration

### Update `.env` file on server:
```bash
nano /home/ubuntu/AlphaLinkup_React_FrontEnd/.env
```

**Production `.env` content:**
```env
REACT_APP_API_BASE_URL=http://52.66.224.22:3000
```

**OR if backend is on different domain:**
```env
REACT_APP_API_BASE_URL=https://api.alphalinkup.com
```

---

## Serving the Application

### Option 1: Using `serve` package (Simple)
```bash
npm install -g serve
serve -s build -l 80
```

### Option 2: Using PM2 (Recommended for production)
```bash
npm install -g pm2
pm2 serve build 80 --spa --name alphalinkup-frontend
pm2 save
pm2 startup
```

### Option 3: Using Nginx (Best for production)

1. Install Nginx:
```bash
sudo apt update
sudo apt install nginx -y
```

2. Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/alphalinkup
```

3. Add this configuration:
```nginx
server {
    listen 80;
    server_name 52.66.224.22;  # or your domain name

    root /home/ubuntu/AlphaLinkup_React_FrontEnd/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/alphalinkup /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Database Setup

1. Connect to MySQL:
```bash
sudo mysql -u root -p
```

2. Create database:
```sql
CREATE DATABASE alphalinkup_db;
CREATE USER 'alphalinkup_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON alphalinkup_db.* TO 'alphalinkup_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. Update backend `.env` with database credentials (if backend is on same server)

---

## Updating the Application

To update the app with latest changes:

```bash
cd /home/ubuntu/AlphaLinkup_React_FrontEnd
./deploy.sh
```

Or manually:
```bash
git pull origin main
npm install
npm run build
# Restart your server (PM2: pm2 restart alphalinkup-frontend)
```

---

## Troubleshooting

### Build fails
- Check Node.js version: `node -v` (should be 16+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Port 80 already in use
- Check what's using it: `sudo lsof -i :80`
- Use different port or stop conflicting service

### API not connecting
- Verify backend is running: `curl http://52.66.224.22:3000`
- Check `.env` file has correct API URL
- Check firewall: `sudo ufw status`

---

## Security Checklist

- [ ] Update `.env` with production API URL
- [ ] Set secure database password
- [ ] Configure firewall (allow ports 80, 443, 3000)
- [ ] Enable HTTPS with SSL certificate (Let's Encrypt)
- [ ] Set up regular backups
- [ ] Configure PM2 or systemd for auto-restart

---

## Notes

- Backend API should be running on port 3000 (or update `.env` accordingly)
- React app will be served from `build` folder after `npm run build`
- For domain setup, update Nginx `server_name` and DNS records

<!-- Auto-deploy note: any push to main will trigger GitHub Actions deploy pipeline. -->

