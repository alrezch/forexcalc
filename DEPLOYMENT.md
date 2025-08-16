# Deployment Guide - Forex Calculator

This guide covers deploying the Forex Calculator Next.js application to various platforms.

## 🚀 Overview

The Forex Calculator is built with **Next.js 14** and can be deployed to multiple platforms. Unlike the previous React setup, Next.js provides built-in deployment optimizations and doesn't require the `gh-pages` package.

## 📋 Prerequisites

- **Node.js 18+** installed
- **Git** repository set up
- **API keys** configured for production
- **Environment variables** set up

## 🏗️ Build for Production

### 1. Local Build Test
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test production build locally
npm run start
```

### 2. Environment Configuration
Create a `.env.production` file for production settings:

```env
# API Configuration
ALPHA_VANTAGE_API_KEY=your_production_key
FIXER_API_KEY=your_production_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the platform created by the Next.js team and provides the best integration:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to your GitHub repository
   - Configure environment variables
   - Choose deployment settings

4. **Automatic deployments**
   - Every push to main branch triggers deployment
   - Preview deployments for pull requests

### Option 2: Netlify

1. **Build Command**
   ```bash
   npm run build
   ```

2. **Publish Directory**
   ```
   .next
   ```

3. **Environment Variables**
   - Set in Netlify dashboard
   - Include all API keys and configuration

### Option 3: Railway

1. **Connect Repository**
   - Link your GitHub repository
   - Railway will auto-detect Next.js

2. **Environment Variables**
   - Configure in Railway dashboard
   - Set `NODE_ENV=production`

3. **Deploy**
   - Automatic deployment on push
   - Custom domain support

### Option 4: DigitalOcean App Platform

1. **Create App**
   - Choose GitHub repository
   - Select Node.js environment

2. **Build Configuration**
   ```bash
   Build Command: npm run build
   Run Command: npm start
   ```

3. **Environment Variables**
   - Configure in App Platform dashboard

## 🔧 Production Configuration

### Next.js Configuration
Update `next.config.js` for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For containerized deployments
  images: {
    domains: ['yourdomain.com'],
  },
  // Enable compression
  compress: true,
  // Production optimizations
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig
```

### API Configuration
Ensure production APIs are configured in `src/config/api-config.ts`:

```typescript
export const API_CONFIG = {
  ALPHA_VANTAGE: {
    enabled: true,
    apiKey: process.env.ALPHA_VANTAGE_API_KEY || 'demo',
    // ... other config
  },
  // ... other APIs
}
```

### Performance Optimization
1. **Enable compression** in your hosting platform
2. **Configure CDN** for static assets
3. **Set appropriate cache headers**
4. **Enable HTTP/2** if supported

## 📱 Domain Configuration

### Custom Domain
1. **DNS Configuration**
   - Point domain to your hosting provider
   - Configure SSL certificates

2. **Next.js Configuration**
   ```javascript
   // next.config.js
   const nextConfig = {
     async redirects() {
       return [
         {
           source: '/',
           destination: '/calculator',
           permanent: true,
         },
       ]
     },
   }
   ```

### SSL/HTTPS
- **Vercel**: Automatic SSL
- **Netlify**: Automatic SSL
- **Other platforms**: Configure SSL certificates

## 🔍 Monitoring & Analytics

### Performance Monitoring
1. **Vercel Analytics** (if using Vercel)
2. **Google Analytics** integration
3. **Core Web Vitals** monitoring
4. **Error tracking** (Sentry, LogRocket)

### Health Checks
Create a health check endpoint:

```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  })
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   rm -rf .next
   rm -rf node_modules
   npm install
   npm run build
   ```

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match code
   - Verify API keys are valid

3. **API Integration**
   - Test APIs locally first
   - Check CORS configuration
   - Verify API rate limits

4. **Performance Issues**
   - Enable Next.js analytics
   - Check bundle size with `npm run build`
   - Optimize images and assets

### Debug Commands
```bash
# Check bundle size
npm run build

# Analyze bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# Check TypeScript
npm run type-check

# Run linting
npm run lint
```

## 📊 Post-Deployment

### Verification Checklist
- [ ] Application loads correctly
- [ ] All calculators function properly
- [ ] API integrations work
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] SSL certificate valid
- [ ] Error monitoring active

### Maintenance
1. **Regular updates** of dependencies
2. **Security patches** applied promptly
3. **Performance monitoring** ongoing
4. **Backup strategies** in place

## 🔄 Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run type-check
      - run: npm run lint
      # Add deployment step for your platform
```

## 📚 Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Next.js Guide](https://docs.netlify.com/frameworks/next-js/)
- [Railway Documentation](https://docs.railway.app/)

## 🎯 Best Practices

1. **Always test locally** before deploying
2. **Use environment variables** for configuration
3. **Monitor performance** after deployment
4. **Keep dependencies updated**
5. **Implement proper error handling**
6. **Use staging environments** for testing

---

**Happy Deploying! 🚀**
