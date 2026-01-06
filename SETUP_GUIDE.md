# FlexPub - Complete Setup Guide

This guide will walk you through setting up FlexPub as a live website, from development to deployment.

## Table of Contents
1. [Quick Start (Local Development)](#quick-start-local-development)
2. [Deployment Options](#deployment-options)
3. [Database Setup](#database-setup)
4. [Payment Integration](#payment-integration)
5. [Production Checklist](#production-checklist)

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed ([download here](https://nodejs.org/))
- A code editor (VS Code recommended)
- Git installed

### Step 1: Create Your Project

```bash
# Create a new React app with Vite (fast, modern setup)
npm create vite@latest flexpub -- --template react

# Navigate into your project
cd flexpub

# Install dependencies
npm install

# Install Tailwind CSS (for styling)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Lucide React (for icons)
npm install lucide-react
```

### Step 2: Configure Tailwind CSS

Edit `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Edit `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 3: Add FlexPub Component

1. Copy `flexpub.jsx` to `src/components/FlexPub.jsx`
2. Update `src/App.jsx`:

```javascript
import FlexPub from './components/FlexPub'

function App() {
  return <FlexPub />
}

export default App
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest & Free)

**Best for:** Quick deployment, free hosting, automatic HTTPS

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial FlexPub setup"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"
   - Done! Your site is live at `your-project.vercel.app`

3. **Custom Domain (Optional):**
   - Buy domain at [Namecheap](https://namecheap.com) or [Google Domains](https://domains.google)
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain (e.g., flexpub.com)
   - Follow DNS configuration instructions

**Cost:** Free for personal projects, $20/month for team features

---

### Option 2: Netlify (Also Great & Free)

**Best for:** Similar to Vercel, slightly different features

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "Add new site" → "Import an existing project"
   - Choose your GitHub repo
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy"

**Cost:** Free for personal projects

---

### Option 3: AWS Amplify (More Control)

**Best for:** If you plan to scale significantly or need AWS ecosystem

1. Install AWS Amplify CLI:
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. Initialize Amplify:
   ```bash
   amplify init
   amplify add hosting
   amplify publish
   ```

**Cost:** Free tier available, scales with usage

---

## Database Setup

Your prototype currently uses mock data. For production, you need a real database.

### Recommended Stack: Supabase (PostgreSQL)

**Why Supabase:**
- Free tier (up to 500MB database)
- Real-time subscriptions
- Built-in authentication
- PostgreSQL (powerful & reliable)
- Great developer experience

### Setup Instructions:

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and API key

2. **Install Supabase Client:**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Create Database Schema:**

   In Supabase SQL Editor, run:
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     full_name TEXT NOT NULL,
     display_name TEXT NOT NULL,
     level TEXT NOT NULL, -- 'Undergraduate', 'Medical Student', 'Resident'
     year TEXT NOT NULL,
     institution TEXT NOT NULL,
     institution_tier TEXT NOT NULL,
     region TEXT NOT NULL,
     specialty TEXT NOT NULL,
     publications INTEGER DEFAULT 0,
     verified BOOLEAN DEFAULT false,
     bio TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Research interests
   CREATE TABLE research_interests (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     interest TEXT NOT NULL
   );

   -- Skills
   CREATE TABLE skills (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     skill TEXT NOT NULL
   );

   -- Previous projects
   CREATE TABLE previous_projects (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     project_name TEXT NOT NULL
   );

   -- Matches
   CREATE TABLE matches (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
     receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
     status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
     created_at TIMESTAMP DEFAULT NOW(),
     UNIQUE(sender_id, receiver_id)
   );

   -- Payments
   CREATE TABLE payments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     match_id UUID REFERENCES matches(id),
     amount INTEGER NOT NULL, -- in cents
     status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
     stripe_payment_id TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- User subscription
   CREATE TABLE subscriptions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     tier TEXT DEFAULT 'free', -- 'free', 'premium'
     stripe_subscription_id TEXT,
     current_period_end TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **Connect to Supabase in Your App:**

   Create `src/lib/supabase.js`:
   ```javascript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = 'YOUR_SUPABASE_URL'
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

5. **Example: Fetch Profiles:**
   ```javascript
   import { supabase } from './lib/supabase'

   async function getProfiles() {
     const { data, error } = await supabase
       .from('users')
       .select(`
         *,
         research_interests(*),
         skills(*),
         previous_projects(*)
       `)
     
     if (error) console.error(error)
     return data
   }
   ```

---

## Payment Integration

### Stripe Setup (Recommended for Payment Processing)

1. **Create Stripe Account:**
   - Go to [stripe.com](https://stripe.com)
   - Create account
   - Get your API keys (test & live)

2. **Install Stripe:**
   ```bash
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

3. **Backend Setup (Required for Stripe):**
   
   You'll need a backend server for secure payment processing. Options:

   **Option A: Supabase Edge Functions (Serverless)**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Create edge function
   supabase functions new create-payment-intent
   ```

   **Option B: Express.js Backend**
   ```bash
   # In a new directory
   mkdir flexpub-backend
   cd flexpub-backend
   npm init -y
   npm install express stripe cors dotenv
   ```

   Example backend endpoint (`server.js`):
   ```javascript
   const express = require('express');
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   const app = express();

   app.use(express.json());

   app.post('/create-payment-intent', async (req, res) => {
     const { amount } = req.body;
     
     const paymentIntent = await stripe.paymentIntents.create({
       amount: amount, // in cents
       currency: 'usd',
     });

     res.json({ clientSecret: paymentIntent.client_secret });
   });

   app.listen(3000);
   ```

4. **Frontend Payment Component:**
   ```javascript
   import { loadStripe } from '@stripe/stripe-js';
   import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

   const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');

   function CheckoutForm() {
     const stripe = useStripe();
     const elements = useElements();

     const handleSubmit = async (e) => {
       e.preventDefault();
       
       const { error, paymentIntent } = await stripe.confirmCardPayment(
         clientSecret,
         {
           payment_method: {
             card: elements.getElement(CardElement),
           },
         }
       );

       if (error) {
         console.error(error);
       } else {
         // Payment successful!
       }
     };

     return (
       <form onSubmit={handleSubmit}>
         <CardElement />
         <button type="submit">Pay $5</button>
       </form>
     );
   }
   ```

---

## Production Checklist

### Before Launch:

- [ ] **Environment Variables**
  - Create `.env` file (never commit to git!)
  - Add to `.gitignore`
  - Set in Vercel/Netlify dashboard
  
  ```env
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_key
  VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
  ```

- [ ] **Authentication**
  - Implement Supabase Auth or Auth0
  - Add email verification
  - Set up password reset flow

- [ ] **Security**
  - Enable Row Level Security (RLS) in Supabase
  - Sanitize user inputs
  - Add rate limiting
  - HTTPS enabled (automatic with Vercel/Netlify)

- [ ] **Privacy & Legal**
  - Add Privacy Policy page
  - Add Terms of Service
  - GDPR compliance (if serving EU users)
  - Cookie consent banner

- [ ] **Features to Add**
  - Email notifications (use SendGrid or Resend)
  - User profile editing
  - Search functionality
  - Messaging system
  - Match history

- [ ] **Testing**
  - Test payment flow with Stripe test cards
  - Test on mobile devices
  - Browser compatibility (Chrome, Safari, Firefox)
  - Load testing for scalability

- [ ] **Analytics**
  - Add Google Analytics or Plausible
  - Track key metrics (signups, matches, conversions)

- [ ] **SEO**
  - Add meta tags
  - Create sitemap
  - Add robots.txt
  - OpenGraph images for social sharing

---

## Estimated Costs

### Minimal MVP (First 100 Users):
- **Domain:** $10-15/year
- **Hosting:** Free (Vercel/Netlify)
- **Database:** Free (Supabase free tier)
- **Payment Processing:** 2.9% + $0.30 per transaction (Stripe)
- **Total:** ~$15/year + transaction fees

### Growing Platform (1,000+ Users):
- **Hosting:** Free-$20/month (Vercel Pro if needed)
- **Database:** $25/month (Supabase Pro)
- **Email Service:** $10-20/month (SendGrid/Resend)
- **Total:** ~$55-65/month

### At Scale (10,000+ Users):
- **Hosting:** $20-100/month
- **Database:** $100-500/month
- **Email:** $50-100/month
- **Total:** $170-700/month

---

## Quick Start Summary

**Absolute fastest path to a live website:**

1. Push code to GitHub
2. Deploy to Vercel (free, takes 5 minutes)
3. Add Supabase database (free tier)
4. Add Stripe (test mode initially)
5. Buy domain and connect to Vercel

**Time to launch:** 2-4 hours for basic version
**Cost:** $10-15 for domain, everything else free initially

---

## Next Steps

1. **Week 1:** Get basic site live with mock data
2. **Week 2:** Add Supabase database and real user profiles
3. **Week 3:** Implement authentication
4. **Week 4:** Add payment processing
5. **Week 5:** Beta test with 10-20 medical students
6. **Week 6:** Refine based on feedback
7. **Week 7:** Public launch!

---

## Need Help?

- **React Questions:** [react.dev](https://react.dev)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Stripe Docs:** [stripe.com/docs](https://stripe.com/docs)
- **Deployment Issues:** Check Vercel/Netlify documentation
- **Community:** Join relevant Discord/Reddit communities

Good luck with FlexPub! 🚀
