# 🎯 START HERE - AgentMarket AI

## ⚡ What You Need to Do (5 Steps)

### Step 1: Get API Keys (15 minutes)

Visit these websites and get your API keys:

1. **Gemini AI** - https://ai.google.dev
   - Click "Get API Key in Google AI Studio"
   - Create new API key
   - Copy it

2. **WalletConnect** - https://cloud.walletconnect.com
   - Sign up / Login
   - Create new project
   - Copy Project ID

3. **Infura** (or Alchemy) - https://infura.io
   - Create account
   - Create new project
   - Copy Sepolia RPC endpoint

4. **Etherscan** - https://etherscan.io/myapikey
   - Create account
   - Generate API key
   - Copy it

5. **Your Wallet Private Key**
   - Open MetaMask
   - Go to Account Details → Export Private Key
   - Enter password
   - Copy private key (remove 0x prefix)

---

### Step 2: Configure Environment (2 minutes)

1. Navigate to the project folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` in your editor

4. Fill in these values:
   ```env
   GEMINI_API_KEY="your_gemini_key_here"
   NEXT_PUBLIC_WALLETCONNECT_ID="your_project_id_here"
   SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_PROJECT_ID"
   ETHERSCAN_API_KEY="your_etherscan_key_here"
   PRIVATE_KEY="your_private_key_without_0x_here"
   ```

5. Save the file

---

### Step 3: Run Setup (5 minutes)

```bash
# Make setup script executable
chmod +x setup.sh

# Run automated setup
./setup.sh
```

This will:
- Install all dependencies
- Set up database
- Create necessary files

**When it asks about deploying contracts**, type "y" if you want to deploy now, or "n" to deploy later.

---

### Step 4: Deploy Smart Contracts (2 minutes)

If you didn't deploy in Step 3:

```bash
cd packages/contracts
pnpm run deploy:sepolia
```

**Important:** Copy the contract addresses from the output and add them to your `.env`:

```env
NEXT_PUBLIC_MARKETPLACE_ADDRESS="0x..."
NEXT_PUBLIC_TOKEN_ADDRESS="0x..."
```

---

### Step 5: Start the Application (1 minute)

Open **TWO** terminal windows:

**Terminal 1 - Backend:**
```bash
cd apps/api
pnpm run dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
pnpm run dev
```

**Visit:** http://localhost:3000

---

## ✅ Verification Checklist

Make sure everything works:

- [ ] Backend shows "Running on port 3001"
- [ ] Frontend shows "Ready on http://localhost:3000"
- [ ] No error messages in either terminal
- [ ] Can visit http://localhost:3000 in browser
- [ ] "Connect Wallet" button appears
- [ ] Can connect MetaMask
- [ ] Marketplace page loads

---

## 🚨 Common Issues

### "Module not found"
**Solution:** Run `pnpm install` in the root directory

### "Database connection failed"
**Solution:** 
```bash
# Start PostgreSQL with Docker
docker compose up -d postgres
```

### "Transaction failed"
**Solution:**
- Make sure you're on Sepolia network in MetaMask
- Get Sepolia ETH from https://sepoliafaucet.com
- Check contract addresses in .env

### "Gemini API error"
**Solution:**
- Verify API key is correct in .env
- Check you have quota remaining

---

## 📚 Next Steps

### For Development
1. Read **QUICKSTART.md** for detailed setup
2. Read **README.md** for full documentation
3. Check **PROJECT_SUMMARY.md** for complete overview

### For Deployment
1. Read **DEPLOYMENT.md**
2. Deploy to Vercel (frontend)
3. Deploy to Railway (backend)

### For Submission
1. Test everything locally
2. Deploy to production
3. Record demo video
4. Create pitch deck
5. Submit to LabLab.ai

---

## 🎯 Project Structure

```
agentmarket-ai/
├── apps/
│   ├── web/       ← Frontend (Next.js)
│   └── api/       ← Backend (Fastify)
├── packages/
│   └── contracts/ ← Smart Contracts
├── prisma/        ← Database
├── .env           ← YOUR CONFIG (create from .env.example)
└── setup.sh       ← Run this first!
```

---

## 🔑 Required for Submission

Before submitting to hackathon:

1. **Live Demo**
   - Deploy frontend (Vercel)
   - Deploy backend (Railway/Render)
   - Deploy contracts (Sepolia)

2. **Demo Video**
   - Record 2-4 minute demo
   - Upload to YouTube
   - Show all features working

3. **Pitch Deck**
   - Create 10-slide presentation
   - Problem, Solution, Demo, Business Model

4. **Social Media**
   - Post video on X/Twitter
   - Tag @lablabai and @Surgexyz_
   - Include demo link

5. **LabLab.ai**
   - Submit project
   - Add all links
   - Complete description

---

## 📞 Need Help?

1. **Read the docs:**
   - QUICKSTART.md
   - README.md
   - PROJECT_SUMMARY.md

2. **Check common issues** above

3. **Review error messages** carefully

4. **Test step by step** - don't skip ahead

---

## 🎉 You're Ready!

Once your `.env` is configured and you've run `./setup.sh`, you have a **fully functional AgentMarket AI platform**!

Everything is:
- ✅ Production-ready
- ✅ Fully typed (TypeScript)
- ✅ Documented
- ✅ Deployable
- ✅ Tested

**Just configure, setup, and run!**

---

## 🚀 Quick Command Reference

```bash
# First time setup
./setup.sh

# Deploy contracts
cd packages/contracts && pnpm run deploy:sepolia

# Start backend
cd apps/api && pnpm run dev

# Start frontend
cd apps/web && pnpm run dev

# Database UI
pnpm prisma studio

# Run tests
pnpm test

# Build everything
pnpm build
```

---

**Good luck with your submission! 🎊**

**Built for SURGE × Moltbook Hackathon**

**#TokenizeTheAgentInternet**
