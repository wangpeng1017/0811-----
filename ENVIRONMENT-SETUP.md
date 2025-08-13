# Environment Variables Setup Guide

## 🔧 Critical Environment Variables

### For Vercel Production Deployment

#### 1. Base URL Configuration
```bash
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
```

**How to Set in Vercel:**
1. Go to Vercel Dashboard → Your Project → Settings
2. Click "Environment Variables"
3. Add new variable:
   - **Name**: `NEXT_PUBLIC_BASE_URL`
   - **Value**: `https://your-actual-domain.vercel.app`
   - **Environment**: ✓ Production ✓ Preview ✓ Development

#### 2. API Token (Already Set)
```bash
ZHIPU_API_TOKEN=c86f3e09702947fcb3b1d65b5c4d349a.KIQaMpAZlWdKrzsg
```

### For Local Development

Create `.env.local` file in project root:
```bash
# Base URL for local development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# API Token
ZHIPU_API_TOKEN=c86f3e09702947fcb3b1d65b5c4d349a.KIQaMpAZlWdKrzsg
```

## 🚀 Vercel Deployment Steps

### Step 1: Set Environment Variables
1. **Login to Vercel Dashboard**
   - Visit https://vercel.com
   - Go to your project

2. **Configure Environment Variables**
   ```
   Settings → Environment Variables → Add New
   
   Variable 1:
   Name: NEXT_PUBLIC_BASE_URL
   Value: https://your-app.vercel.app
   Environments: ✓ Production ✓ Preview ✓ Development
   
   Variable 2 (if not already set):
   Name: ZHIPU_API_TOKEN
   Value: c86f3e09702947fcb3b1d65b5c4d349a.KIQaMpAZlWdKrzsg
   Environments: ✓ Production ✓ Preview ✓ Development
   ```

### Step 2: Redeploy
1. **Trigger Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - OR push new commit to trigger automatic deployment

### Step 3: Verify Configuration
1. **Test Share Links**
   - Upload an image and get location recognition
   - Click share button
   - Verify generated URL uses production domain
   - Test link access from different device/browser

2. **Test Audio Functionality**
   - Click "播放景点介绍" button
   - Verify audio player appears without errors
   - Test play/pause functionality

## 🔍 Troubleshooting

### Share Links Still Show Localhost

**Problem**: Share URLs still show `http://localhost:3000`

**Solutions**:
1. **Check Environment Variable**
   ```bash
   # In Vercel Dashboard, verify:
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

2. **Clear Browser Cache**
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache and cookies

3. **Force Redeploy**
   ```bash
   # Push a small change to trigger redeploy
   git commit --allow-empty -m "trigger redeploy"
   git push origin main
   ```

### Audio Not Playing

**Problem**: Audio player shows but doesn't play

**Solutions**:
1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for audio-related errors

2. **Test Different Browsers**
   - Chrome/Edge: Should work normally
   - Safari: May need user interaction first
   - WeChat: May have audio restrictions

3. **Mobile Considerations**
   - iOS: Requires user interaction before audio
   - Android: Check audio permissions

### Environment Variable Not Working

**Problem**: `NEXT_PUBLIC_BASE_URL` not being read

**Solutions**:
1. **Verify Variable Name**
   - Must be exactly: `NEXT_PUBLIC_BASE_URL`
   - Case sensitive

2. **Check Environment Selection**
   - Ensure "Production" is checked in Vercel

3. **Restart Development Server**
   ```bash
   # For local development
   npm run dev
   ```

## 📱 Testing Checklist

### Desktop Testing
- [ ] Chrome: Audio plays, share links work
- [ ] Safari: Audio plays, share links work  
- [ ] Firefox: Audio plays, share links work
- [ ] Edge: Audio plays, share links work

### Mobile Testing
- [ ] iOS Safari: Audio plays after user interaction
- [ ] Android Chrome: Audio plays, share works
- [ ] WeChat Browser: Audio and share functional

### Share Link Testing
- [ ] Generated URLs use production domain
- [ ] Links accessible from external devices
- [ ] QR codes scan correctly
- [ ] Shared content displays properly

### Audio Testing
- [ ] "播放景点介绍" button works
- [ ] Audio player interface appears
- [ ] Play/pause controls functional
- [ ] Progress bar updates correctly
- [ ] Text highlighting synchronizes

## 🎯 Quick Fix Commands

### If Share Links Still Use Localhost:
```bash
# 1. Set environment variable in Vercel Dashboard
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app

# 2. Force redeploy
git commit --allow-empty -m "fix: update base URL for share links"
git push origin main
```

### If Audio Doesn't Work:
```bash
# Check if mock audio endpoint is accessible
curl https://your-app.vercel.app/api/mock-audio

# Should return audio file headers
```

## ✅ Success Indicators

### Share Functionality Working:
- Share URLs show production domain
- QR codes generate correctly
- Links accessible from external devices
- Shared content displays properly

### Audio Functionality Working:
- "播放景点介绍" button generates content
- Audio player interface appears
- Play/pause controls work
- Text highlighting follows audio
- No console errors

## 🚨 Emergency Fixes

### If Production is Broken:
1. **Rollback to Previous Deployment**
   - Vercel Dashboard → Deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Quick Environment Fix**
   ```bash
   # Set correct base URL immediately
   NEXT_PUBLIC_BASE_URL=https://$(vercel ls --scope=your-team | grep your-app | awk '{print $2}')
   ```

### If Audio Completely Fails:
1. **Disable Audio Feature Temporarily**
   - Comment out audio generation button
   - Deploy without audio until fixed

2. **Check Mock Audio Endpoint**
   - Verify `/api/mock-audio` returns valid audio
   - Test with curl or browser

---

## 📞 Support

If issues persist after following this guide:
1. Check browser console for specific error messages
2. Test on different devices/browsers
3. Verify all environment variables are set correctly
4. Ensure latest code is deployed to production

**Remember**: Environment variables require a redeploy to take effect!
