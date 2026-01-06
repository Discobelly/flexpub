# FlexPub - Find Your Co-Author

A research collaboration platform connecting medical students, residents, and undergraduates for meaningful academic partnerships.

## ✨ Features

- **Privacy-First Matching** - Partial profiles until mutual match
- **Smart Filtering** - By specialty, institution tier, publications, and more
- **Mission-Driven Pricing** - 3 free matches/month, $5 for additional, $19/month unlimited
- **Verified Profiles** - Build trust with credential verification

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📚 Full Setup Guide

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete instructions on:
- Deploying to production (Vercel, Netlify, AWS)
- Setting up database (Supabase)
- Payment integration (Stripe)
- Adding authentication
- And much more!

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **Hosting:** Vercel/Netlify

## 📝 Project Structure

```
flexpub/
├── src/
│   ├── components/
│   │   └── FlexPub.jsx       # Main application component
│   ├── lib/
│   │   └── supabase.js       # Database client (to be added)
│   ├── App.jsx               # Root component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── package.json              # Dependencies
└── vite.config.js           # Vite configuration
```

## 🚢 Deployment

**Fastest path to production:**

1. Push to GitHub
2. Connect to Vercel (free)
3. Deploy in 2 minutes!

See SETUP_GUIDE.md for detailed instructions.

## 💰 Pricing Model

- **Free:** 3 matches/month
- **Pay-per-match:** $5/additional match
- **Premium:** $19/month for unlimited matches + features

## 📄 License

MIT License - feel free to use for your own projects!

## 🤝 Contributing

This is a prototype. To make it production-ready, you'll need to:
1. Add real database (see SETUP_GUIDE.md)
2. Implement authentication
3. Add payment processing
4. Set up email notifications
5. Add comprehensive testing

---

Built with ❤️ for the next generation of medical researchers
