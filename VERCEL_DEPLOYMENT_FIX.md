# Fix Vercel Deployment Issues

## Problem: Deployments Not Being Reflected

If your Git pushes are not triggering Vercel deployments, follow these steps:

## Solution 1: Connect Repository to Vercel (Recommended)

### Via Vercel Dashboard:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New Project"** (or select your existing project)
3. **Import Git Repository**:
   - Click "Import Git Repository"
   - Select your GitHub account
   - Find and select `Aadar-foundation-clone`
   - Click "Import"

4. **Configure Project Settings**:
   - **Framework Preset**: Create React App (or leave as "Other")
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. **Environment Variables** (if needed):
   - Add any required environment variables
   - See `VERCEL_ENV_SETUP.md` for details

6. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

### Configure Branch Settings:

1. Go to **Project Settings** → **Git**
2. **Production Branch**: Set to `main`
3. **Preview Branches**: Enable for `development` and other branches
4. **Auto-deploy**: Make sure it's enabled

## Solution 2: Link Project via CLI

If you prefer using CLI:

```bash
# Login to Vercel (if not already logged in)
vercel login

# Link your project
vercel link

# Follow the prompts:
# - Select your Vercel account
# - Select or create a project
# - Link to existing project or create new one
```

## Solution 3: Manual Deployment via CLI

To manually trigger a deployment:

```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

## Solution 4: Check Vercel Project Settings

1. **Go to Vercel Dashboard** → Your Project → **Settings**
2. **Check "Git" Section**:
   - Verify repository is connected
   - Check if correct branch is set for production
   - Ensure "Auto-deploy" is enabled

3. **Check "Build & Development Settings"**:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
   - **Node.js Version**: 18.x or 20.x (recommended)

## Solution 5: Verify Webhook Configuration

1. Go to **GitHub Repository** → **Settings** → **Webhooks**
2. Check if Vercel webhook exists:
   - Should point to `api.vercel.com`
   - Should be active
3. If missing, Vercel will create it automatically when you connect the repo

## Solution 6: Force Redeploy

If deployments exist but aren't updating:

1. **Via Dashboard**:
   - Go to Vercel Dashboard → Your Project → **Deployments**
   - Click "..." on latest deployment
   - Select "Redeploy"
   - Check "Use existing Build Cache" (uncheck if you want fresh build)

2. **Via CLI**:
   ```bash
   vercel --prod --force
   ```

## Solution 7: Check Build Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Check **Build Logs** for errors
4. Common issues:
   - Build command failing
   - Missing environment variables
   - Node version mismatch
   - Dependency installation errors

## Verification Steps

After fixing the connection:

1. **Make a test commit**:
   ```bash
   git commit --allow-empty -m "Test deployment"
   git push origin main
   ```

2. **Check Vercel Dashboard**:
   - Should see a new deployment starting
   - Wait for it to complete (usually 2-5 minutes)

3. **Verify Deployment**:
   - Check the deployment URL
   - Verify your changes are live
   - Check build logs for any warnings

## Common Issues and Fixes

### Issue: "No deployments found"
- **Fix**: Repository not connected. Use Solution 1 or 2.

### Issue: "Build failed"
- **Fix**: Check build logs, verify build command and output directory.

### Issue: "Deployments not triggering"
- **Fix**: Check webhook configuration, verify branch settings.

### Issue: "Old version showing"
- **Fix**: Clear browser cache, check deployment status, force redeploy.

## Next Steps

After connecting:

1. ✅ Verify auto-deploy is working
2. ✅ Check that both `main` and `development` branches deploy
3. ✅ Monitor build logs for any issues
4. ✅ Set up custom domain (if needed)
5. ✅ Configure environment variables (if needed)

## Need More Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Check Build Logs**: Always check build logs first for specific errors

