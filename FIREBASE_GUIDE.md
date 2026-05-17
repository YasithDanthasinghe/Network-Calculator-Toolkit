# Firebase Hosting & Google AdSense Deployment Guide

Follow these steps to launch your **Network Calculator Toolkit** to the world.

## 1. Firebase Hosting Setup

### Prerequisites
- Node.js installed
- A Google Account

### Steps
1. **Initialize Firebase**:
   Open your terminal in the project root:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```
   - Choose `Hosting: Configure files for Firebase Hosting`.
   - Select `Use an existing project` or `Create a new project`.
   - **CRITICAL**: Set public directory to `dist` (default is `public`, you MUST change it to `dist`).
   - Configure as a single-page app: `Yes`.
   - Set up automatic builds/deploys with GitHub: `Optional`.
   - **IMPORTANT**: If asked "File dist/index.html already exists. Overwrite?", say `No` (since we want to keep OUR build).

2. **Clean Default Files**:
   Ensure there is no `public` folder in your project root before deploying, or ensure your `firebase.json` points to `dist`.

3. **Build and Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

## 2. Enable Google AdSense

### Steps
1. **Sign Up**: Visit [Google AdSense](https://www.google.com/adsense/start/) and sign up with your domain.
2. **Retrieve Publisher ID**: Look for `ca-pub-XXXXXXXXXXXXXXXX` in your AdSense dashboard.
3. **Update code**: 
   - Open `/index.html`.
   - Replace the placeholder `ca-pub-XXXXXXXXXXXXXXXX` in the meta/script tags with your real ID.
   - Open `src/components/AdBanner.tsx` and ensure the `data-ad-client` matches.
4. **Site Verification**: In AdSense, follow the "Connect your site" steps. Usually, this involves adding a small code snippet (which we already have in `index.html`).
5. **Add Units**: 
   - Create a "Display Ad" unit in AdSense.
   - Note the `data-ad-slot` number.
   - Use the `<AdBanner slot="YOUR_SLOT_ID" />` component where you want ads to appear.

## 3. SEO Optimization Tips

- **Custom Domain**: Connect a custom domain (e.g., `netcalc.io`) in Firebase Console for better SEO.
- **Sitemap**: Create a `public/sitemap.xml` listing your tool paths.
- **Backlinks**: Share the tool on networking forums (Reddit r/networking, Cisco Learning Network) to build authority.
