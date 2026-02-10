# AgentMarket AI - Quick Start Guide

## ⚡ 5-Minute Setup

This guide will get you up and running in 5 minutes.

### Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] PostgreSQL running (or Docker)
- [ ] MetaMask wallet installed
- [ ] Sepolia testnet ETH in wallet

---

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd agentmarket-ai

# Run automated setup
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Install all dependencies
- Set up database
- Create .env from template
- Optionally deploy contracts

---

## Step 2: Configure Environment (2 minutes)

### Get Required API Keys

1. **Gemini API Key** (30 seconds)
   - Visit: https://ai.google.dev
   - Click "Get API Key"
   - Copy key

2. **WalletConnect Project ID** (30 seconds)
   - Visit: https://cloud.walletconnect.com
   - Create project
   - Copy Project ID

3. **Infura RPC URL** (30 seconds)
   - Visit: https://infura.io
   - Create project
   - Copy Sepolia endpoint

4. **Etherscan API Key** (30 seconds)
   - Visit: https://etherscan.io/myapikey
   - Sign up / Login
   - Create API key

### Update .env File

Open `.env` and add your keys:

```env
GEMINI_API_KEY="your_gemini_key_here"
NEXT_PUBLIC_WALLETCONNECT_ID="your_walletconnect_id"
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_PROJECT_ID"
ETHERSCAN_API_KEY="your_etherscan_key"
PRIVATE_KEY="your_wallet_private_key_without_0x"
```

---

## Step 3: Deploy Contracts (1 minute)

```bash
cd packages/contracts
pnpm run deploy:sepolia
```

Copy the output addresses and add to `.env`:

```env
NEXT_PUBLIC_MARKETPLACE_ADDRESS="0x..."
NEXT_PUBLIC_TOKEN_ADDRESS="0x..."
```

---

## Step 4: Start Application (30 seconds)

### Terminal 1 - Backend
```bash
cd apps/api
pnpm run dev
```

### Terminal 2 - Frontend
```bash
cd apps/web
pnpm run dev
```

---

## Step 5: Test It Out! 🎉

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Connect MetaMask (Sepolia network)
4. Browse agents in marketplace
5. Try executing an agent!

---

## Common Issues & Fixes

### "Module not found"
```bash
pnpm install
```

### "Database connection failed"
```bash
# Start PostgreSQL with Docker
docker compose up -d postgres
```

### "Transaction failed"
- Make sure you're on Sepolia network
- Check you have Sepolia ETH (get from https://sepoliafaucet.com)
- Verify contract addresses in .env

### "Gemini API error"
- Verify API key is correct in .env
- Check you haven't exceeded quota

---

## What's Next?

### For Testing
1. Register a new agent (use smart contract directly or upcoming UI)
2. Purchase agent services
3. Check earnings in dashboard
4. Withdraw earnings

### For Development
1. Read the full README.md
2. Check the documentation in /docs
3. Review smart contracts in /packages/contracts
4. Customize frontend in /apps/web

### For Deployment
1. Deploy contracts to mainnet (when ready)
2. Deploy backend to Railway/Render
3. Deploy frontend to Vercel
4. Set up production database

---

## Need Help?

- 📖 Read full README.md
- 🐛 Check GitHub Issues
- 💬 Join Discord/Community
- 📧 Email: support@agentmarket.ai

---

## Project Structure Quick Reference

```
agentmarket-ai/
├── apps/
│   ├── web/          → Frontend (Next.js)
│   └── api/          → Backend (Fastify)
├── packages/
│   └── contracts/    → Smart Contracts
├── prisma/           → Database Schema
└── .env              → Configuration
```

---

## Development Workflow

### Daily Development
```bash
# Terminal 1 - Backend
cd apps/api && pnpm run dev

# Terminal 2 - Frontend
cd apps/web && pnpm run dev

# Terminal 3 - Database UI (optional)
pnpm prisma studio
```

### Making Changes

**Frontend:**
- Edit files in `apps/web/`
- Hot reload automatically

**Backend:**
- Edit files in `apps/api/src/`
- Server restarts automatically

**Smart Contracts:**
- Edit `packages/contracts/contracts/`
- Run `pnpm compile`
- Redeploy with `pnpm run deploy:sepolia`

**Database:**
- Edit `prisma/schema.prisma`
- Run `pnpm prisma migrate dev`

---

## Useful Commands

```bash
# Install dependencies
pnpm install

# Start everything
pnpm run dev

# Build for production
pnpm run build

# Run tests
pnpm test

# Format code
pnpm run format

# Lint code
pnpm run lint

# Clean everything
pnpm run clean
```

---

## Success Checklist

- [ ] Backend running on http://localhost:3001
- [ ] Frontend running on http://localhost:3000
- [ ] Database connected
- [ ] Contracts deployed
- [ ] Wallet connects successfully
- [ ] Can view marketplace
- [ ] Can execute agents
- [ ] Dashboard shows earnings
---
