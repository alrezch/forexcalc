# 🚨 Troubleshooting Guide

## GitHub Actions Failures

### Issue: "Deploy to GitHub Pages: All jobs have failed"

**Cause**: The GitHub Actions workflow was trying to deploy using the `peaceiris/actions-gh-pages` action, which conflicts with our manual deployment using the `gh-pages` package.

**Solution**: ✅ **FIXED** - Updated workflow to only build and test, removing conflicting deployment step.

**Current Status**: 
- ✅ GitHub Actions will now only build and test
- ✅ Manual deployment using `npm run deploy` works correctly
- ✅ Your app is live at: https://alrezch.github.io/forexcalc

## 🔧 Manual Deployment Process

### Deploy to GitHub Pages
```bash
npm run deploy
```

This command:
1. Runs `npm run build` (creates production build)
2. Deploys to `gh-pages` branch
3. Updates your live site

### Check Deployment Status
```bash
# Check if gh-pages branch exists
git branch -a

# Check remote branches
git remote -v
```

## 🌐 GitHub Pages Configuration

### Verify Settings
1. Go to your repository: https://github.com/alrezch/forexcalc
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** section
4. Source should be: **"Deploy from a branch"**
5. Branch should be: **"gh-pages"**

### If Pages Not Working
1. Wait 5-10 minutes after deployment
2. Check if `gh-pages` branch exists
3. Verify the branch contains your built files
4. Clear browser cache

## 🚀 Build Issues

### Build Fails Locally
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Build Fails on GitHub Actions
1. Check the Actions tab in your repository
2. Look for specific error messages
3. Verify all dependencies are in package.json
4. Check Node.js version compatibility

## 📱 App Not Loading

### Common Issues
1. **Wrong URL**: Make sure you're using: https://alrezch.github.io/forexcalc
2. **Deployment in Progress**: Wait a few minutes after pushing changes
3. **Browser Cache**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)
4. **API Issues**: Check browser console for errors

### Check Console Errors
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for any error messages
4. Check Network tab for failed API calls

## 🔄 Update Process

### Making Changes
```bash
# 1. Make your changes
# 2. Test locally
npm start

# 3. Build to test production build
npm run build

# 4. Commit and push
git add .
git commit -m "Your update message"
git push origin main

# 5. Deploy to GitHub Pages
npm run deploy
```

### Automatic vs Manual Deployment
- **GitHub Actions**: Builds and tests on every push (✅ Working)
- **Manual Deployment**: Deploys to GitHub Pages (✅ Working)
- **No Conflicts**: Both systems work independently

## 📊 Status Check

### ✅ What's Working
- Local development server
- Production build process
- Manual deployment to GitHub Pages
- GitHub Actions build and test
- Your app is live at: https://alrezch.github.io/forexcalc

### 🔍 What to Monitor
- GitHub Actions build status
- Manual deployment success
- GitHub Pages availability
- API functionality in production

## 🆘 Still Having Issues?

### Check These First
1. **Repository Settings**: Pages configuration
2. **Branch Protection**: Make sure main branch isn't protected from pushes
3. **GitHub Status**: Check if GitHub is having issues
4. **Local Build**: Verify `npm run build` works locally

### Get Help
1. Check GitHub Actions logs for specific errors
2. Look at browser console for client-side errors
3. Verify all files are pushed to GitHub
4. Check if gh-pages branch exists and has content

## 🎯 Quick Fixes

### Reset Everything
```bash
# Clear local changes
git reset --hard HEAD
git clean -fd

# Pull latest from GitHub
git pull origin main

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Test build
npm run build

# Deploy again
npm run deploy
```

### Force Deploy
```bash
# Force push to gh-pages (use with caution)
npm run deploy -- --force
```

Your Forex Calculator should now work perfectly! 🚀
