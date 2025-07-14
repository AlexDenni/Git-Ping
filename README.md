# Git Ping - GitHub Action Tracker

## 🎯 Overview

Git Ping is a real-time GitHub Action Tracker that monitors repository events (PUSH, PULL_REQUEST, MERGE) via webhooks, stores them in MongoDB Atlas, and displays them on a beautiful React frontend with 15-second polling.

## 🏗️ Architecture

```
GitHub Repository
       ↓ (Webhook)
Flask Backend (Python)
       ↓ (Store Events)
MongoDB Atlas
       ↑ (Fetch Events)
React Frontend (Custom CSS)
```

## 🚀 Features

- **Real-time Monitoring**: Receives GitHub webhook events instantly
- **Beautiful UI**: Custom CSS design with gradient backgrounds and smooth animations
- **Auto-refresh**: Polls backend every 15 seconds for new events
- **Event Types**: Supports PUSH, PULL_REQUEST, and MERGE events
- **Responsive Design**: Works on desktop and mobile devices
- **MongoDB Atlas**: Cloud database storage with proper schema
- **RESTful API**: Clean API endpoints for webhook and data retrieval

## 📋 Prerequisites

- Python 3.11+
- Node.js 20+
- MongoDB Atlas account
- GitHub repository for webhook setup

## 🛠️ Installation & Setup

### 1. Clone the Project

```bash
# The project structure:
git-ping/
├── backend/           # Flask API server
│   ├── src/
│   │   ├── main.py           # Main Flask application
│   │   ├── database.py       # MongoDB connection
│   │   ├── models/
│   │   │   └── github_event.py  # Event data model
│   │   ├── routes/
│   │   │   ├── api.py        # API endpoints
│   │   │   └── webhook.py    # Webhook receiver
│   │   └── static/           # Frontend build files
│   ├── .env                  # Environment variables
│   ├── .env.example         # Environment template
│   ├── requirements.txt     # Python dependencies
│   └── venv/               # Virtual environment
├── frontend/          # React application
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   └── App.css          # Custom CSS styles
│   ├── dist/               # Production build
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Build configuration
└── README.md          # This file
```

### 2. Backend Setup

```bash
cd git-ping/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
```

### 3. Environment Configuration

Edit `backend/.env`:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gitping?retryWrites=true&w=majority
DATABASE_NAME=gitping

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
PORT=5000
```

### 4. Frontend Setup

```bash
cd git-ping/frontend

# Install dependencies
pnpm install  # or npm install

# For development
pnpm run dev --host

# For production build
pnpm run build
```

### 5. Production Deployment

```bash
# Build frontend
cd frontend && pnpm run build

# Copy frontend build to Flask static directory
cp -r dist/* ../backend/src/static/

# Run Flask server
cd ../backend
source venv/bin/activate
python src/main.py
```

## 🔧 MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster

2. **Configure Database Access**
   - Create a database user with read/write permissions
   - Add your IP address to the IP Access List (or use 0.0.0.0/0 for development)

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

4. **Database Schema**
   The application automatically creates the following collection:
   ```javascript
   // Collection: github_events
   {
     _id: ObjectId,           // Auto-generated
     request_id: String,      // Git commit hash or PR ID
     author: String,          // GitHub username
     action: String,          // "PUSH", "PULL_REQUEST", "MERGE"
     from_branch: String,     // Source branch (nullable)
     to_branch: String,       // Target branch
     timestamp: String        // ISO datetime
   }
   ```

## 🪝 GitHub Webhook Setup

1. **Go to Repository Settings**
   - Navigate to your GitHub repository
   - Go to Settings → Webhooks → Add webhook

2. **Configure Webhook**
   ```
   Payload URL: https://your-domain.com/api/webhook
   Content type: application/json
   Secret: (optional, for security)
   Events: 
   ✅ Pushes
   ✅ Pull requests
   ```

3. **Test Webhook**
   - Make a commit or create a pull request
   - Check the webhook delivery in GitHub settings
   - Verify events appear in Git Ping interface

## 🎨 Frontend Features

### Custom CSS Design
- **Gradient Background**: Beautiful purple gradient backdrop
- **Glass Morphism**: Translucent containers with backdrop blur
- **Smooth Animations**: Hover effects and loading states
- **Responsive Layout**: Mobile-first design approach
- **Color-coded Events**: Different colors for PUSH, PULL_REQUEST, MERGE

### Event Display Format
- **PUSH**: `"author" pushed to "branch" on timestamp`
- **PULL_REQUEST**: `"author" submitted a pull request from "source" to "target" on timestamp`
- **MERGE**: `"author" merged branch "source" to "target" on timestamp`

### Real-time Updates
- Polls backend every 15 seconds
- Shows connection status with colored indicators
- Manual refresh button available
- Sample data button for testing

## 🔌 API Endpoints

### Webhook Endpoints
```http
POST /api/webhook
# Receives GitHub webhook events

POST /api/webhook/test
# Test endpoint for manual event creation
```

### Data Endpoints
```http
GET /api/events
# Returns latest events with formatting

GET /api/events/{id}
# Returns specific event by ID

POST /api/events/sample
# Creates sample events for testing

GET /api/health
# Health check endpoint
```

## 🚦 Testing

### Local Testing
```bash
# Terminal 1: Start backend
cd backend && source venv/bin/activate && python src/main.py

# Terminal 2: Start frontend (development)
cd frontend && pnpm run dev --host

# Access: http://localhost:5173
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Create sample events
curl -X POST http://localhost:5000/api/events/sample

# Get events
curl http://localhost:5000/api/events
```

### Webhook Testing
Use tools like [ngrok](https://ngrok.com/) to expose your local server:
```bash
ngrok http 5000
# Use the ngrok URL as your webhook URL in GitHub
```

## 🚀 Deployment Options

### Option 1: Heroku
```bash
# Add Procfile
echo "web: python src/main.py" > Procfile

# Deploy
git add .
git commit -m "Deploy Git Ping"
git push heroku main
```

### Option 2: Railway
```bash
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python src/main.py"
  }
}
```

### Option 3: DigitalOcean App Platform
Use the provided `backend` directory as your app source.

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Webhook Secrets**: Use GitHub webhook secrets for verification
3. **CORS**: Configure CORS properly for production
4. **Database Access**: Restrict MongoDB Atlas IP access
5. **HTTPS**: Always use HTTPS in production

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```
   Solution: Check connection string, IP whitelist, and credentials
   ```

2. **Webhook Not Receiving Events**
   ```
   Solution: Verify webhook URL, check GitHub delivery logs
   ```

3. **Frontend Not Loading**
   ```
   Solution: Ensure frontend is built and copied to static directory
   ```

4. **CORS Errors**
   ```
   Solution: Check Flask CORS configuration
   ```

### Debug Mode
Enable debug logging by setting `FLASK_ENV=development` in `.env`.

## 📊 Monitoring

### Health Checks
- Backend: `GET /api/health`
- Database: Connection status in logs
- Frontend: Status indicator in UI

### Logs
- Flask logs show all API requests
- MongoDB connection status
- Webhook event processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review GitHub webhook delivery logs
3. Check MongoDB Atlas connection
4. Verify environment variables

---

**Built with ❤️ using Flask, React, and MongoDB Atlas**

