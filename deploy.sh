#!/bin/bash

# AlphaLinkup React Frontend - Production Deployment Script
# Run this script on the server after SSH connection

echo "🚀 Starting AlphaLinkup React Frontend Deployment..."

# Navigate to project directory
cd /home/ubuntu/AlphaLinkup_React_FrontEnd

# Pull latest changes from main branch
echo "📥 Pulling latest changes from main branch..."
git fetch origin
git reset --hard origin/main
git pull origin main

# Install/Update dependencies
echo "📦 Installing dependencies..."
npm install

# Copy production env file
if [ -f .env.production ]; then
    echo "📝 Using .env.production file..."
    cp .env.production .env
else
    echo "⚠️  .env.production not found. Using default .env..."
fi

# Build production version
echo "🔨 Building production version..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Build successful! Build folder created."
    echo "📊 Build size:"
    du -sh build
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Sync build to Nginx root
if [ -d "/var/www/alpha-frontend" ]; then
    echo "📦 Syncing build to Nginx root (/var/www/alpha-frontend)..."
    sudo cp -r build/* /var/www/alpha-frontend/
    sudo chown -R www-data:www-data /var/www/alpha-frontend/
    
    # Restart Nginx
    echo "🔄 Restarting Nginx..."
    sudo systemctl restart nginx
else
    echo "⚠️  /var/www/alpha-frontend not found. Nginx sync skipped."
    echo "📋 Next steps:"
    echo "1. If using nginx, point it to: /home/ubuntu/AlphaLinkup_React_FrontEnd/build"
    echo "2. Or use 'serve' package: npm install -g serve && serve -s build -l 80"
    echo "3. Or use PM2: pm2 serve build 80 --spa"
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
