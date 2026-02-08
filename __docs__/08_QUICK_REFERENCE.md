# Quick Reference Guide

## ⚡ Essential Commands

### Project Setup
```bash
# Create project
pnpm create next-app agent-marketplace

# Install all dependencies
pnpm install ethers wagmi viem @rainbow-me/rainbowkit
pnpm install @google/generative-ai
pnpm install tailwindcss shadcn
pnpm install fastify @fastify/cors
pnpm install prisma @prisma/client
pnpm install hardhat @nomicfoundation/hardhat-toolbox
pnpm install @openzeppelin/contracts
```

### Development
```bash
# Frontend
cd apps/web
pnpm dev              # Runs on http://localhost:3000

# Backend
cd apps/api
pnpm dev              # Runs on http://localhost:3001

# Smart Contracts
cd packages/contracts
npx hardhat compile
npx hardhat test
npx hardhat node      # Local blockchain
```

### Database
```bash
# Initialize Prisma
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### Deployment
```bash
# Deploy contracts to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Verify contracts
npx hardhat verify --network sepolia DEPLOYED_ADDRESS

# Deploy frontend
vercel --prod

# Deploy backend
docker compose up -d
```

---

## 📋 Daily Task Checklist

### Day 7 (Today) — Setup
- [ ] Create GitHub repo
- [ ] Set up pnpm workspace
- [ ] Initialize all apps
- [ ] Configure environment
- [ ] Write initial docs

### Day 8 — Backend
- [ ] Database schema
- [ ] API endpoints
- [ ] Gemini integration
- [ ] Test API

### Day 9 — Backend Complete
- [ ] Error handling
- [ ] Authentication
- [ ] Agent logic
- [ ] Documentation

### Day 10 — Smart Contracts
- [ ] Write contracts
- [ ] Add tests
- [ ] Deploy testnet
- [ ] Verify contracts

### Day 11 — Contract Integration
- [ ] Frontend contract hooks
- [ ] Payment flow
- [ ] Earnings tracking
- [ ] Test on testnet

### Day 12 — AI Integration
- [ ] Agent prompts
- [ ] Response formatting
- [ ] Test all agents
- [ ] Optimize

### Day 13 — Frontend
- [ ] Wallet connection
- [ ] Marketplace UI
- [ ] Dashboard
- [ ] Polish

### Day 14 — Testing
- [ ] Bug fixes
- [ ] Mobile testing
- [ ] Performance
- [ ] Documentation

### Day 15 — Launch
- [ ] Record video
- [ ] Submit project
- [ ] Post on X
- [ ] Celebrate! 🎉

---

## 🎯 Critical URLs

### Development
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Blockchain: `http://localhost:8545`
- Database: `http://localhost:5555` (Prisma Studio)

### Testnet
- Sepolia RPC: `https://sepolia.infura.io/v3/YOUR_KEY`
- Etherscan: `https://sepolia.etherscan.io`
- Faucet: `https://sepoliafaucet.com`

### Tools
- Gemini: `https://ai.google.dev`
- Vercel: `https://vercel.com`
- WalletConnect: `https://cloud.walletconnect.com`

### Submission
- LabLab: `https://lablab.ai`
- Twitter: `https://twitter.com`

---

## 🔑 Environment Variables Quick Copy

```env
# Copy this to your .env file

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/agentmarket"

# AI
GEMINI_API_KEY=""

# Blockchain
NEXT_PUBLIC_CHAIN_ID="11155111"
SEPOLIA_RPC_URL=""
PRIVATE_KEY=""
ETHERSCAN_API_KEY=""

# Contracts (fill after deployment)
NEXT_PUBLIC_MARKETPLACE_ADDRESS=""
NEXT_PUBLIC_TOKEN_ADDRESS=""

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_ID=""

# Backend
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"
```

---

## 🚨 Common Issues & Fixes

### Issue: "Module not found"
```bash
# Solution
pnpm install
```

### Issue: "Database connection failed"
```bash
# Solution
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
docker compose up -d db
```

### Issue: "Transaction failed"
```bash
# Solutions
# 1. Check wallet has testnet ETH
# 2. Increase gas limit
# 3. Verify contract address
# 4. Check network (Sepolia)
```

### Issue: "Gemini API error"
```bash
# Solutions
# 1. Verify API key in .env
# 2. Check API quota
# 3. Verify model name: "gemini-pro"
```

### Issue: "Build failed"
```bash
# Solution
# Clear cache
rm -rf .next node_modules
pnpm install
pnpm build
```

---

## 💡 Code Snippets Library

### Connect Wallet
```typescript
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return <ConnectButton />;
}
```

### Read Contract
```typescript
import { useReadContract } from 'wagmi';

const { data } = useReadContract({
  address: MARKETPLACE_ADDRESS,
  abi: marketplaceABI,
  functionName: 'agentCount',
});
```

### Write Contract
```typescript
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

const { writeContract } = useWriteContract();

writeContract({
  address: MARKETPLACE_ADDRESS,
  abi: marketplaceABI,
  functionName: 'payAgent',
  args: [agentId],
  value: parseEther('0.01'),
});
```

### Call Gemini
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const result = await model.generateContent(prompt);
const text = result.response.text();
```

### Database Query
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Find many
const agents = await prisma.agent.findMany({
  where: { active: true },
});

// Create
const agent = await prisma.agent.create({
  data: {
    name: 'Code Reviewer',
    owner: address,
    price: 0.01,
  },
});
```

---

## 📊 Project Metrics to Track

### Technical
- [ ] Code coverage > 70%
- [ ] Build time < 30 seconds
- [ ] Page load < 2 seconds
- [ ] Zero console errors
- [ ] Mobile responsive

### Business
- [ ] 4 agent types working
- [ ] Payments functional
- [ ] Earnings tracking accurate
- [ ] Token mechanics clear
- [ ] Demo data realistic

### Presentation
- [ ] Video < 4 minutes
- [ ] All features shown
- [ ] Clear value prop
- [ ] Professional quality
- [ ] CTA included

---

## 🎯 Must-Have vs Nice-to-Have

### Must Have ✅
- Wallet connection
- Agent marketplace
- Payment processing
- AI execution
- Basic dashboard
- Working demo

### Nice to Have ⭐
- Token staking
- Advanced analytics
- Mobile app
- Multiple chains
- Governance UI
- Social features

**Focus on Must-Haves first!**

---

## 🔄 Git Workflow

```bash
# Start new feature
git checkout -b feature/marketplace

# Make changes
git add .
git commit -m "feat: add marketplace grid"

# Push
git push origin feature/marketplace

# Deploy
git checkout main
git merge feature/marketplace
git push origin main
```

---

## 📱 Social Media Templates

### Twitter Post
```
🚀 Just launched AgentMarket AI for @Surgexyz_ × @lablabai!

Decentralized AI marketplace with:
• 4 AI agent types
• Token payments
• 70/20/10 revenue split
• Built with @googlegemini

🔗 [URL]
📦 [GitHub]

#TokenizeTheAgentInternet
```

### LinkedIn Post
```
Excited to share my SURGE × Moltbook project!

AgentMarket AI combines Web3 + AI to create a sustainable creator economy.

Features:
✅ AI-powered services
✅ Smart contract payments
✅ Transparent tokenomics

Tech: Next.js, Solidity, Gemini

Demo: [URL]
```

---

## 🎓 Learning Resources

### Web3
- [Wagmi Docs](https://wagmi.sh)
- [RainbowKit Docs](https://rainbowkit.com)
- [Hardhat Tutorial](https://hardhat.org/tutorial)

### AI
- [Gemini Docs](https://ai.google.dev/docs)
- [LangChain Guide](https://langchain.com)

### Frontend
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)

### Backend
- [Fastify Docs](https://fastify.dev)
- [Prisma Guide](https://prisma.io/docs)

---

## ⏰ Time Management

### Daily Schedule
- **Morning (4h):** Deep work on new features
- **Afternoon (3h):** Integration & testing
- **Evening (2h):** Documentation & prep

### When Behind
1. Cut nice-to-have features
2. Simplify UI
3. Focus on core demo
4. Reuse templates

### When Ahead
1. Polish animations
2. Better documentation
3. Extra features
4. Marketing prep

---

## 🎯 Final Success Criteria

### Product ✅
- [ ] Works end-to-end
- [ ] No critical bugs
- [ ] Looks professional
- [ ] Loads fast

### Economics ✅
- [ ] Token model clear
- [ ] Revenue flow obvious
- [ ] Real use case
- [ ] Sustainable model

### Presentation ✅
- [ ] Clear demo video
- [ ] Strong pitch deck
- [ ] Good documentation
- [ ] Live deployment

### Submission ✅
- [ ] All forms complete
- [ ] Links verified
- [ ] Social posted
- [ ] On time

---

**Remember:** Ship early, ship often, ship working. 🚀
