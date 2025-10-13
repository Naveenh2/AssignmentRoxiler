# 🚀 Deployment Guide - Store Rating Platform

## Quick Deployment Options

### Option 1: Railway + Netlify (Recommended)

#### Backend Deployment (Railway)
1. **Go to**: [railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select your repository**
5. **Set Root Directory** to `backend`
6. **Add Environment Variables**:
   - `JWT_SECRET`: `your-super-secret-jwt-key-here-change-this-in-production`
   - `NODE_ENV`: `production`
7. **Deploy** - Railway will give you a URL like: `https://your-app.railway.app`

#### Frontend Deployment (Netlify)
1. **Go to**: [netlify.com](https://netlify.com)
2. **Sign up** with GitHub
3. **Click "New site from Git"**
4. **Select your repository**
5. **Set Build Command**: `npm run build`
6. **Set Publish Directory**: `build`
7. **Add Environment Variable**:
   - `REACT_APP_API_URL`: `https://your-backend-url.railway.app/api`
8. **Deploy**

### Option 2: Render (Alternative)

#### Backend Deployment
1. **Go to**: [render.com](https://render.com)
2. **Sign up** with GitHub
3. **Click "New +"** → **"Web Service"**
4. **Connect your repository**
5. **Configure**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Add Environment Variables**:
   - `JWT_SECRET`: `your-super-secret-jwt-key-here-change-this-in-production`
   - `NODE_ENV`: `production`

#### Frontend Deployment
1. **Click "New +"** → **"Static Site"**
2. **Connect your repository**
3. **Configure**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
4. **Add Environment Variable**:
   - `REACT_APP_API_URL`: `https://your-backend-url.onrender.com/api`

### Option 3: Vercel + Railway

#### Frontend on Vercel
1. **Go to**: [vercel.com](https://vercel.com)
2. **Import your repository**
3. **Set Root Directory** to `frontend`
4. **Add Environment Variable**:
   - `REACT_APP_API_URL`: `https://your-backend-url.railway.app/api`

## 🔧 Pre-Deployment Steps

### 1. Update Frontend API URL
After deploying your backend, update the frontend environment variable:

```bash
# In your frontend/.env.production file
REACT_APP_API_URL=https://your-actual-backend-url.com/api
```

### 2. Rebuild Frontend
```bash
cd frontend
npm run build
```

### 3. Test Locally with Production Build
```bash
cd frontend
npm install -g serve
serve -s build
```

## 📱 Share Your App

Once deployed, you'll get URLs like:
- **Frontend**: `https://your-app.netlify.app`
- **Backend API**: `https://your-app.railway.app`

Share the frontend URL with others!

## 🔑 Default Login Credentials
- **Email**: `admin@platform.com`
- **Password**: `Admin@123`

## 🆓 Free Tier Limits
- **Railway**: 500 hours/month
- **Netlify**: 100GB bandwidth/month
- **Render**: 750 hours/month
- **Vercel**: 100GB bandwidth/month

All platforms offer generous free tiers perfect for sharing your project!
