# Git Ping - Quick Deployment Guide

## 🚀 Quick Start (5 minutes)

### 1. Prepare for Deployment
```bash
# Build the frontend
cd frontend
pnpm run build

# Copy to Flask static directory
cd ..
cp -r frontend/dist/* backend/src/static/

# Update requirements
cd backend
source venv/bin/activate
pip freeze > requirements.txt
```

### 2. Environment Setup
Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
DATABASE_NAME=gitping
SECRET_KEY=your-secret-key-here
PORT=5000
```

### 3. Deploy to Heroku
```bash
cd backend

# Create Procfile
echo "web: python src/main.py" > Procfile

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create Heroku app
heroku create your-git-ping-app

# Set environment variables
heroku config:set MONGODB_URI="your_connection_string"
heroku config:set DATABASE_NAME="gitping"
heroku config:set SECRET_KEY="your-secret-key"

# Deploy
git push heroku main
```

### 4. Configure GitHub Webhook
1. Go to your GitHub repository
2. Settings → Webhooks → Add webhook
3. Payload URL: `https://your-git-ping-app.herokuapp.com/api/webhook`
4. Content type: `application/json`
5. Events: Select "Pushes" and "Pull requests"
6. Save webhook

### 5. Test Your Deployment
1. Visit: `https://your-git-ping-app.herokuapp.com`
2. Click "Sample Data" to test the interface
3. Make a commit to your repository
4. Watch events appear in real-time!

## 🔧 Alternative Deployment Options

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### DigitalOcean App Platform
1. Connect your GitHub repository
2. Select the `backend` folder as source
3. Set environment variables in the dashboard
4. Deploy!

### Manual Server Deployment
```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip nginx

# Setup application
git clone your-repo
cd git-ping/backend
pip3 install -r requirements.txt

# Configure nginx (optional)
# Setup systemd service (optional)

# Run application
python3 src/main.py
```

## 🎯 Post-Deployment Checklist

- [ ] Application loads at deployed URL
- [ ] MongoDB Atlas connection working
- [ ] GitHub webhook configured and tested
- [ ] Sample data button works
- [ ] Real-time polling active (15-second intervals)
- [ ] Events display correctly formatted
- [ ] Mobile responsive design verified

## 🔍 Monitoring Your Deployment

### Health Check
Visit: `https://your-domain.com/api/health`

### Test Webhook
Visit: `https://your-domain.com/api/events`

### GitHub Webhook Logs
Check GitHub repository → Settings → Webhooks → Recent Deliveries

---

**Your Git Ping deployment is ready! 🎉**

