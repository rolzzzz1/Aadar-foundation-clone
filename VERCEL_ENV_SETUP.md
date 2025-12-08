# Vercel Environment Variables Setup

## Using Vercel CLI

Install Vercel CLI (if not already installed):

```bash
npm i -g vercel
```

Login to Vercel:

```bash
vercel login
```

Add environment variables:

```bash
# Add Instagram Access Token
vercel env add INSTAGRAM_ACCESS_TOKEN production
vercel env add INSTAGRAM_ACCESS_TOKEN preview
vercel env add INSTAGRAM_ACCESS_TOKEN development

# Add Instagram Account ID
vercel env add INSTAGRAM_ACCOUNT_ID production
vercel env add INSTAGRAM_ACCOUNT_ID preview
vercel env add INSTAGRAM_ACCOUNT_ID development

# Add React App variables (if needed)
vercel env add REACT_APP_MAYKI_VIDEO_URL production
vercel env add REACT_APP_NIRBHAY_VIDEO_URL production
```

Pull environment variables to local `.env.local`:

```bash
vercel env pull .env.local
```

## Important Notes

1. **Netlify Functions → Vercel Serverless Functions**:

   - Your Instagram posts function (`netlify/functions/instagram-posts.js`) needs to be converted to Vercel Serverless Functions
   - Create `api/instagram-posts.js` instead of `netlify/functions/instagram-posts.js`
   - Vercel functions use a different format than Netlify functions

2. **Environment Variable Prefixes**:

   - React app variables must start with `REACT_APP_` to be accessible in the browser
   - Server-side variables (like `INSTAGRAM_ACCESS_TOKEN`) don't need the prefix

3. **After Adding Variables**:
   - Redeploy your project for changes to take effect
   - Variables are encrypted and stored securely
