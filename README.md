# AgentMarket AI

> Tokenizing AI Services — A decentralized marketplace where AI agents sell services and earn revenue

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue)](https://ai.google.dev/)

**Built for SURGE × Moltbook Hackathon — "Tokenize the Agent Internet"**

---

## 🎯 Overview

AgentMarket AI is a decentralized platform that enables AI agents to sell digital services and earn tokenized revenue. It combines Web3 tokenomics with AI-powered automation to create a sustainable creator economy.

**Key Features:**
- 🤖 **AI Agent Marketplace** — Browse and purchase AI services
- 💰 **Transparent Payments** — Smart contract-based revenue distribution
- 🪙 **Token Economics** — AGENT token with buyback mechanism
- 📊 **Creator Dashboard** — Real-time earnings and analytics
- 🔗 **Web3 Integration** — Wallet-based authentication and payments

---

## ✨ Features

### For Users
- Connect wallet and browse AI agents
- Purchase services with ETH or AGENT tokens
- Get instant AI-powered results
- Transparent pricing and quality ratings

### For Creators
- Deploy and monetize custom AI agents
- Earn 70% of every transaction
- Withdraw earnings anytime
- Track performance analytics

### For Token Holders
- Stake tokens to earn platform fees
- Participate in governance
- Benefit from token buyback mechanism
- Early adopter advantages

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS, shadcn/ui |
| **Backend** | Fastify, PostgreSQL, Prisma ORM |
| **Blockchain** | Solidity, Hardhat, OpenZeppelin |
| **AI** | Google Gemini API |
| **Web3** | wagmi, RainbowKit, ethers.js, viem |
| **Deployment** | Vercel (Frontend), Docker (Backend), Sepolia (Contracts) |

---

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ Next.js + Web3 UI
└──────┬──────┘
       │
┌──────▼──────┐
│   Backend   │ API + AI Router
└──────┬──────┘
       │
┌──────▼──────┐
│  Contracts  │ Revenue Logic
└──────┬──────┘
       │
┌──────▼──────┐
│ Blockchain  │ Sepolia Testnet
└──────┬──────┘
       │
┌──────▼──────┐
│  AI Agents  │ Gemini API
└─────────────┘
```

---

## 💰 Tokenomics

### AGENT Token
- **Type:** ERC20 Utility Token
- **Total Supply:** 1,000,000 AGENT
- **Network:** Sepolia (Testnet)

### Distribution
- 40% — Community & Users
- 25% — Agent Creator Rewards
- 15% — Platform Treasury
- 10% — Team
- 10% — Ecosystem & Liquidity

### Revenue Model
Every transaction is automatically split:
- **70%** → Agent Creator (instant payment)
- **20%** → Token Buyback (reduces supply, increases value)
- **10%** → Platform Treasury (development & operations)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database
- MetaMask or compatible wallet
- Gemini API key
- Sepolia testnet ETH

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/agentmarket-ai.git
cd agentmarket-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Set up database
pnpm prisma migrate dev

# Start development servers
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agentmarket"

# Gemini AI
GEMINI_API_KEY="your_gemini_api_key"

# Blockchain
NEXT_PUBLIC_CHAIN_ID="11155111"
RPC_URL="https://sepolia.infura.io/v3/YOUR_KEY"
PRIVATE_KEY="your_deployer_private_key"

# Frontend
NEXT_PUBLIC_MARKETPLACE_ADDRESS="deployed_contract_address"
NEXT_PUBLIC_TOKEN_ADDRESS="deployed_token_address"
NEXT_PUBLIC_WALLETCONNECT_ID="your_project_id"

# Backend
BACKEND_URL="http://localhost:3001"
```

---

## 📦 Project Structure

```
agentmarket-ai/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Fastify backend
├── packages/
│   ├── contracts/        # Smart contracts
│   ├── ai-agent/         # AI logic
│   └── shared/           # Shared types/utils
├── prisma/
│   └── schema.prisma     # Database schema
├── docs/                 # Documentation
└── README.md
```

---

## 🔗 Smart Contracts

### Deployed Addresses (Sepolia Testnet)
- **AgentMarketplace:** `0x...` (Add after deployment)
- **AgentToken:** `0x...` (Add after deployment)

### Contract Functions

**AgentMarketplace.sol:**
- `registerAgent()` — List new agent
- `payAgent()` — Purchase agent service
- `withdrawEarnings()` — Claim creator revenue
- `toggleAgent()` — Enable/disable agent

**AgentToken.sol:**
- Standard ERC20 functions
- `burn()` — Destroy tokens (buyback mechanism)

---

## 🤖 Available AI Agents

| Agent | Service | Use Case |
|-------|---------|----------|
| **Code Reviewer** | Code analysis | Security audit, best practices, optimization |
| **SEO Specialist** | Website audit | On-page SEO, technical issues, keywords |
| **Content Writer** | Content creation | Articles, blog posts, marketing copy |
| **Data Analyst** | Data analysis | Insights, trends, visualizations |

---

## 🎥 Demo

**Live Demo:** [Add URL after deployment]  
**Video Demo:** [Add YouTube link]  
**Pitch Deck:** [Add slides link]

---

## 🧪 Testing

```bash
# Test smart contracts
cd packages/contracts
npx hardhat test

# Test backend
cd apps/api
pnpm test

# Test frontend
cd apps/web
pnpm test
```

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Docker)
```bash
docker compose up -d
```

### Smart Contracts (Hardhat)
```bash
cd packages/contracts
npx hardhat run scripts/deploy.ts --network sepolia
npx hardhat verify --network sepolia DEPLOYED_ADDRESS
```

---

## 📝 Development Roadmap

### ✅ Phase 1 — MVP (Current)
- [x] Smart contract development
- [x] Basic marketplace UI
- [x] Gemini AI integration
- [x] Token payment system
- [x] Creator dashboard

### 🔄 Phase 2 — Enhancement (Next 3 Months)
- [ ] Mobile application
- [ ] Additional agent types
- [ ] Staking mechanism
- [ ] Governance implementation
- [ ] Advanced analytics

### 🚀 Phase 3 — Scale (6-12 Months)
- [ ] Cross-chain support
- [ ] Agent SDK for developers
- [ ] Enterprise features
- [ ] Mainnet deployment
- [ ] DAO formation

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **SURGE × Moltbook** — For hosting the hackathon
- **Google Gemini** — For AI capabilities
- **OpenZeppelin** — For smart contract libraries
- **Vercel** — For frontend hosting
- **Hardhat** — For smart contract development

---

## 👨‍💻 Author

**[Your Name]**
- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)
- Email: your.email@example.com

---

## 📧 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/agentmarket-ai/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/agentmarket-ai/discussions)
- **Email:** support@agentmarket.ai (if applicable)

---

## ⭐ Show Your Support

If you find this project interesting, please give it a ⭐️!

Built with ❤️ for the SURGE × Moltbook Hackathon

**#TokenizeTheAgentInternet**
