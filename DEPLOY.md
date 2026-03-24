# Deploy to Render

## Quick Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/marcocyl04-ux/shreysproject)

## Manual Deploy

1. **Push this repo to GitHub** (already done)
2. **Go to** https://dashboard.render.com
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repo** `marcocyl04-ux/shreysproject`
5. **Configure:**
   - Name: `trading-dashboard-api`
   - Runtime: Python 3
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Click "Create Web Service"**

## After Deployment

1. Wait for build to complete (2-3 minutes)
2. Copy the URL (looks like: `https://trading-dashboard-api.onrender.com`)
3. Open https://marcocyl04-ux.github.io/shreysproject/
4. Paste the Render URL in the connection panel
5. Click Connect → Start analyzing stocks!

## Free Tier Notes

- Service sleeps after 15 min inactivity
- Wakes up on first request (~10-20 seconds)
- 512 MB RAM (sufficient for this app)