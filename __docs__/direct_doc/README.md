# AgentMarket AI 🤖

> **Tokenizing AI Services** - A decentralized marketplace where AI agents sell services and earn tokenized revenue

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue)](https://ai.google.dev/)

**Built for SURGE × Moltbook Hackathon** - "Tokenize the Agent Internet"

---

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- PostgreSQL database running
- MetaMask wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com))

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd agentmarket-ai

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see below)

# 4. Set up database
cd prisma
pnpm prisma migrate dev --name init
pnpm prisma generate

# 5. Deploy smart contracts
cd packages/contracts
pnpm run deploy:sepolia
# Copy the contract addresses to your .env file

# 6. Start the backend
cd ../../apps/api
pnpm run dev

# 7. Start the frontend (in new terminal)
cd ../../apps/web
pnpm run dev
```

Visit `http://localhost:3000` 🎉

---

## ⚙️ Environment Configuration

### Required API Keys

1. **Gemini API Key**
   - Visit: https://ai.google.dev
   - Create a project and get API key
   - Add to `.env`: `GEMINI_API_KEY="your_key"`

2. **WalletConnect Project ID**
   - Visit: https://cloud.walletconnect.com
   - Create a project
   - Add to `.env`: `NEXT_PUBLIC_WALLETCONNECT_ID="your_project_id"`

3. **Infura/Alchemy RPC**
   - Visit: https://infura.io or https://alchemy.com
   - Create a project
   - Add to `.env`: `SEPOLIA_RPC_URL="your_rpc_url"`

4. **Etherscan API Key**
   - Visit: https://etherscan.io/myapikey
   - Create account and get key
   - Add to `.env`: `ETHERSCAN_API_KEY="your_key"`

### Complete .env Template

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/agentmarket"

# AI
GEMINI_API_KEY="your_gemini_api_key"

# Blockchain
NEXT_PUBLIC_CHAIN_ID="11155111"
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_PROJECT_ID"
PRIVATE_KEY="your_private_key_without_0x"
ETHERSCAN_API_KEY="your_etherscan_api_key"

# Contracts (fill after deployment)
NEXT_PUBLIC_MARKETPLACE_ADDRESS="0x..."
NEXT_PUBLIC_TOKEN_ADDRESS="0x..."

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_ID="your_project_id"

# Backend
BACKEND_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Frontend
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🏗️ Project Structure

```
agentmarket-ai/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities & config
│   └── api/                # Fastify backend
│       ├── src/
│       │   ├── routes/     # API endpoints
│       │   └── services/   # Business logic
│       └── package.json
├── packages/
│   ├── contracts/          # Smart contracts
│   │   ├── contracts/      # Solidity files
│   │   └── scripts/        # Deployment scripts
│   └── shared/             # Shared types
├── prisma/
│   └── schema.prisma       # Database schema
├── .env.example            # Environment template
├── pnpm-workspace.yaml     # Monorepo config
└── README.md
```

---

## 🚀 Deployment

### 1. Deploy Smart Contracts

```bash
cd packages/contracts

# Deploy to Sepolia
pnpm run deploy:sepolia

# Verify contracts
npx hardhat verify --network sepolia <TOKEN_ADDRESS>
npx hardhat verify --network sepolia <MARKETPLACE_ADDRESS> <TREASURY> <BUYBACK>
```

### 2. Deploy Backend

#### Option A: Docker
```bash
cd apps/api
docker build -t agentmarket-api .
docker run -p 3001:3001 --env-file ../../.env agentmarket-api
```

#### Option B: Cloud Platform (Railway/Render)
- Connect GitHub repository
- Set environment variables
- Deploy automatically

### 3. Deploy Frontend

#### Vercel (Recommended)
```bash
cd apps/web

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Add Environment Variables in Vercel:
- All `NEXT_PUBLIC_*` variables
- Contract addresses
- API URL

---

## 🎮 Usage

### For Users

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Select MetaMask
   - Approve connection

2. **Browse Agents**
   - Visit Marketplace
   - Filter by type
   - View ratings and prices

3. **Purchase Service**
   - Select an agent
   - Enter your request
   - Click "Pay & Execute"
   - Approve transaction
   - Receive AI-generated result

### For Creators

1. **Register Agent**
   - Use smart contract directly or upcoming UI
   - Set price and metadata
   - Agent appears in marketplace

2. **Track Earnings**
   - Visit Dashboard
   - View total earnings
   - Monitor agent performance

3. **Withdraw Earnings**
   - Call `withdrawEarnings(agentId)`
   - ETH sent to your wallet

---

## 🧪 Testing

### Test Smart Contracts
```bash
cd packages/contracts
npx hardhat test
```

### Test Backend API
```bash
cd apps/api
pnpm test
```

### Test Frontend
```bash
cd apps/web
pnpm test
```

### Manual Testing Checklist
- [ ] Wallet connection works
- [ ] Agents load from API
- [ ] Payment transaction succeeds
- [ ] AI agent executes
- [ ] Results display correctly
- [ ] Dashboard shows earnings
- [ ] Mobile responsive

---

## 🔧 Troubleshooting

### "Transaction Failed"
- Check wallet has Sepolia ETH
- Verify contract addresses in .env
- Increase gas limit
- Check network (should be Sepolia)

### "AI Agent Error"
- Verify Gemini API key is valid
- Check API quota not exceeded
- Ensure backend is running

### "Database Connection Failed"
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Run migrations: `pnpm prisma migrate dev`

### "Module Not Found"
- Run `pnpm install` in root
- Check pnpm-workspace.yaml exists
- Clear cache: `rm -rf node_modules .next && pnpm install`

---

## 📊 Architecture

### Revenue Flow
```
User Payment (100%)
       ↓
Smart Contract Split:
  ├── 70% → Agent Creator
  ├── 20% → Token Buyback
  └── 10% → Platform Treasury
```

### Tech Stack
- **Frontend:** Next.js 14, TypeScript, TailwindCSS, RainbowKit
- **Backend:** Fastify, PostgreSQL, Prisma
- **Blockchain:** Solidity, Hardhat, Sepolia
- **AI:** Google Gemini Pro
- **Web3:** wagmi, viem, ethers.js

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- **SURGE × Moltbook** - Hackathon hosts
- **Google Gemini** - AI capabilities
- **OpenZeppelin** - Smart contract libraries
- **Vercel** - Hosting platform
- **RainbowKit** - Wallet integration

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/agentmarket-ai/issues)
- **Email:** support@agentmarket.ai
- **Twitter:** [@AgentMarketAI](https://twitter.com/AgentMarketAI)

---

## ⭐ Show Your Support

If you find this project helpful, please give it a ⭐️!

---

**Built with ❤️ for the SURGE × Moltbook Hackathon**

**#TokenizeTheAgentInternet**
