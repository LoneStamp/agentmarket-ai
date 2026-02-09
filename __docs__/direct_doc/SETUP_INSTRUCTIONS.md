# 🎯 COMPLETE SETUP INSTRUCTIONS

## 📋 What You Have

A **production-ready, fully functional** AgentMarket AI platform with:

- ✅ Complete Frontend (Next.js + TypeScript + Web3)
- ✅ Complete Backend (Fastify + Prisma + PostgreSQL)
- ✅ Smart Contracts (Solidity + Hardhat)
- ✅ AI Integration (Google Gemini)
- ✅ Database Schema (Prisma)
- ✅ Deployment Ready
- ✅ Comprehensive Documentation

**Everything works out of the box!** You only need to configure your `.env` file.

---

## 🚀 QUICK START (3 Commands)

```bash
# 1. Configure .env (copy from .env.example and add your keys)
cp .env.example .env && nano .env

# 2. Run automated setup
chmod +x setup.sh && ./setup.sh

# 3. Start everything
# Terminal 1:
cd apps/api && pnpm run dev

# Terminal 2:
cd apps/web && pnpm run dev
```

**That's it!** Visit http://localhost:3000

---

## 🔑 API Keys You Need

### 1. Gemini API Key
- **Where:** https://ai.google.dev
- **Steps:** 
  1. Click "Get API Key"
  2. Create new project
  3. Generate key
- **Add to .env:** `GEMINI_API_KEY="your_key"`

### 2. WalletConnect Project ID
- **Where:** https://cloud.walletconnect.com
- **Steps:**
  1. Create account
  2. Create new project
  3. Copy Project ID
- **Add to .env:** `NEXT_PUBLIC_WALLETCONNECT_ID="your_id"`

### 3. Sepolia RPC URL
- **Where:** https://infura.io or https://alchemy.com
- **Steps:**
  1. Create account
  2. Create new project
  3. Copy Sepolia endpoint
- **Add to .env:** `SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_ID"`

### 4. Etherscan API Key
- **Where:** https://etherscan.io/myapikey
- **Steps:**
  1. Create account
  2. Generate API key
  3. Copy key
- **Add to .env:** `ETHERSCAN_API_KEY="your_key"`

### 5. Wallet Private Key
- **Where:** MetaMask
- **Steps:**
  1. Open MetaMask
  2. Account Details → Export Private Key
  3. Copy (remove 0x prefix)
- **Add to .env:** `PRIVATE_KEY="your_key_without_0x"`

⚠️ **IMPORTANT:** Make sure wallet has Sepolia ETH for deployment. Get free Sepolia ETH from https://sepoliafaucet.com

---

## 📝 Complete .env Configuration

Your `.env` file should look like this:

```env
# ========================================
# Database (leave as-is for local dev)
# ========================================
DATABASE_URL="postgresql://postgres:password@localhost:5432/agentmarket"

# ========================================
# AI / Gemini (REQUIRED)
# ========================================
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# ========================================
# Blockchain (REQUIRED)
# ========================================
NEXT_PUBLIC_CHAIN_ID="11155111"
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"
PRIVATE_KEY="your_private_key_without_0x_prefix"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"

# ========================================
# WalletConnect (REQUIRED)
# ========================================
NEXT_PUBLIC_WALLETCONNECT_ID="YOUR_WALLETCONNECT_PROJECT_ID"

# ========================================
# URLs (leave as-is for local dev)
# ========================================
BACKEND_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ========================================
# Contract Addresses (fill AFTER deployment)
# ========================================
NEXT_PUBLIC_MARKETPLACE_ADDRESS=""
NEXT_PUBLIC_TOKEN_ADDRESS=""
```

---

## 🛠️ Step-by-Step Setup

### Step 1: Prerequisites

Install these if you don't have them:

```bash
# Node.js 18+ (check version)
node --version  # should be >= 18

# pnpm (install if needed)
npm install -g pnpm

# PostgreSQL (or use Docker)
docker --version  # for Docker option
```

### Step 2: Configure .env

```bash
# Copy template
cp .env.example .env

# Edit with your favorite editor
nano .env
# or
code .env
# or
vim .env
```

Add all the API keys from the section above.

### Step 3: Install Dependencies

```bash
# Run automated setup script
chmod +x setup.sh
./setup.sh
```

This script will:
- Check prerequisites
- Install all dependencies
- Set up database
- Run migrations
- Optionally deploy contracts

### Step 4: Deploy Smart Contracts

If you chose "no" during setup, deploy manually:

```bash
cd packages/contracts

# Deploy to Sepolia
pnpm run deploy:sepolia
```

**Output will look like:**
```
✅ AgentToken deployed to: 0x1234...
✅ AgentMarketplace deployed to: 0x5678...
```

**Copy these addresses** and add to `.env`:
```env
NEXT_PUBLIC_MARKETPLACE_ADDRESS="0x1234..."
NEXT_PUBLIC_TOKEN_ADDRESS="0x5678..."
```

### Step 5: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd apps/api
pnpm run dev
```

You should see:
```
╔═══════════════════════════════════════════╗
║     🚀 AgentMarket AI API Server         ║
║     Status: Running                       ║
║     Port: 3001                            ║
╚═══════════════════════════════════════════╝
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
pnpm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
```

### Step 6: Test the Application

1. Open browser: http://localhost:3000
2. You should see the home page
3. Click "Connect Wallet"
4. Connect MetaMask
5. Go to Marketplace
6. Try executing an agent

---

## ✅ Verification Checklist

Make sure everything is working:

### Backend Health
- [ ] Backend running on port 3001
- [ ] Visit http://localhost:3001/health
- [ ] Should return: `{"status":"healthy"}`
- [ ] No error messages in terminal

### Frontend Health
- [ ] Frontend running on port 3000
- [ ] Visit http://localhost:3000
- [ ] Page loads without errors
- [ ] No console errors (F12 → Console)

### Wallet Connection
- [ ] "Connect Wallet" button visible
- [ ] Can click and see wallet options
- [ ] Can connect MetaMask
- [ ] Address shows in navbar

### Smart Contracts
- [ ] Contracts deployed to Sepolia
- [ ] Addresses in .env
- [ ] Can view on Sepolia Etherscan

### Database
- [ ] PostgreSQL running
- [ ] Migrations completed
- [ ] Can run `pnpm prisma studio`

---

## 🧪 Testing the Full Flow

### Test 1: Browse Marketplace
1. Navigate to /marketplace
2. Should see agent cards
3. Check for any error messages

### Test 2: Execute Agent
1. Click "Use Agent" on any agent
2. Enter a test prompt
3. Click "Pay & Execute"
4. Approve transaction in MetaMask
5. Wait for result

### Test 3: Check Dashboard
1. Navigate to /dashboard
2. Should see earnings
3. Check agent statistics

---

## 🚨 Troubleshooting

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### "PostgreSQL connection failed"
```bash
# Option 1: Start with Docker
docker compose up -d postgres

# Option 2: Install PostgreSQL locally
# macOS:
brew install postgresql
brew services start postgresql

# Ubuntu:
sudo apt-get install postgresql
sudo service postgresql start
```

### "Transaction failed"
- **Check:** You're on Sepolia network in MetaMask
- **Check:** You have Sepolia ETH (get from https://sepoliafaucet.com)
- **Check:** Contract addresses are correct in .env
- **Check:** Gas price settings in MetaMask

### "Gemini API error"
- **Check:** API key is correct
- **Check:** No extra spaces in .env
- **Check:** Quota not exceeded (check Google AI Studio)

### "Module not found"
```bash
# Clear and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### "Port already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

---

## 📦 What's Included

### Code Files
- ✅ 2 Smart Contracts (Token + Marketplace)
- ✅ 5 Frontend pages (Home, Marketplace, Dashboard, etc.)
- ✅ 1 Backend server with API routes
- ✅ 4 AI agent implementations
- ✅ Complete database schema
- ✅ Deployment scripts
- ✅ Docker configuration

### Documentation
- ✅ START_HERE.md (this file)
- ✅ README.md (main docs)
- ✅ QUICKSTART.md (5-min guide)
- ✅ DEPLOYMENT.md (production deployment)
- ✅ PROJECT_SUMMARY.md (complete overview)
- ✅ 8 detailed guides from your docs

### Configuration
- ✅ .env.example (template)
- ✅ package.json (all dependencies)
- ✅ tsconfig.json (TypeScript config)
- ✅ tailwind.config.js (styling)
- ✅ hardhat.config.ts (blockchain)
- ✅ docker-compose.yml (containers)

---

## 🎯 Ready for Submission

### Before Deploying
- [ ] All tests pass locally
- [ ] No console errors
- [ ] Full user flow works
- [ ] Smart contracts verified

### For Production Deployment
1. **Deploy Contracts** (already done if on Sepolia)
2. **Deploy Backend** → Railway or Render
3. **Deploy Frontend** → Vercel
4. **Deploy Database** → Supabase or Railway

See **DEPLOYMENT.md** for complete deployment guide.

### For Hackathon Submission
1. **Demo Video** (2-4 minutes)
   - Record screen showing full flow
   - Upload to YouTube
   
2. **Pitch Deck** (10 slides)
   - Problem → Solution → Demo → Business

3. **Social Media**
   - Post video on X/Twitter
   - Tag @lablabai and @Surgexyz_

4. **LabLab.ai**
   - Submit project
   - Add all links
   - Complete description

---

## 📚 Documentation Guide

- **START_HERE.md** ← You are here
- **QUICKSTART.md** ← 5-minute setup
- **README.md** ← Complete documentation
- **DEPLOYMENT.md** ← Production deployment
- **PROJECT_SUMMARY.md** ← Overview
- **setup.sh** ← Automated setup

---

## 🎊 You're All Set!

Your AgentMarket AI platform is:
- ✅ Complete
- ✅ Production-ready
- ✅ Fully functional
- ✅ Well-documented
- ✅ Easy to deploy

**Just configure your .env and run!**

---

## 📞 Need More Help?

1. Read QUICKSTART.md for fast setup
2. Read README.md for detailed info
3. Read DEPLOYMENT.md for deployment
4. Check troubleshooting section above
5. Review error messages carefully

---

**Good luck with your hackathon submission! 🚀**

**Built with ❤️ for SURGE × Moltbook Hackathon**

**#TokenizeTheAgentInternet**
