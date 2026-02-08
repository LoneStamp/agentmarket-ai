# System Architecture & Design

## 🏗️ High-Level Architecture

```
Frontend (Next.js + Web3 UI)
        ↓
Backend (API + AI Router)
        ↓
Smart Contracts (Revenue Logic)
        ↓
Blockchain (Testnet)
        ↓
AI Agents (Gemini)
```

---

## 📁 Project Structure

```
autonomous-agent-marketplace/
│
├── app/
│   ├── web/                # Next.js Frontend
│   └── api/                # Fastify Backend
│
├── packages/
│   ├── ai-agent/           # Gemini logic
│   ├── contracts/          # Smart contracts
│   └── shared/             # Types/utils
│
├── infra/
│   ├── docker/
│   └── deploy/
│
├── docs/
│   ├── pitch.md
│   ├── tokenomics.md
│   └── demo.md
│
├── .env.example
├── pnpm-workspace.yaml
├── docker-compose.yml
└── README.md
```

### Workspace Configuration

**pnpm-workspace.yaml**
```yaml
packages:
  - apps/*
  - packages/*
```

### Environment Template

**.env.example**
```
DATABASE_URL=
GEMINI_API_KEY=
RPC_URL=
PRIVATE_KEY=
NEXT_PUBLIC_CHAIN_ID=
```

---

## 🧠 AI Agent Types

| Agent Type | Purpose | Service |
|------------|---------|---------|
| **Code Agent** | Code review | Analyze code quality, security, best practices |
| **SEO Agent** | Site audit | SEO analysis, keyword research, optimization tips |
| **Content Agent** | Writing | Articles, blog posts, marketing copy |
| **Data Agent** | Analytics | Data analysis, visualization, insights |

---

## 🔗 Smart Contract Architecture

### Core Contracts

1. **AgentMarketplace.sol** — Main marketplace logic
2. **AgentToken.sol** — Utility token (AGENT/AGT)
3. **RevenueDistributor.sol** — Payment routing (optional enhancement)

### Key Functions

**Marketplace:**
- `registerAgent()` — List new agent
- `payAgent()` — Process payment
- `updateEarnings()` — Track revenue
- `deactivateAgent()` — Disable agent

**Token:**
- Standard ERC20 functions
- Buyback mechanism
- Staking rewards (optional)

---

## 🖥️ Frontend Architecture

### Core Pages

1. **Home/Marketplace** — Agent grid, search, filters
2. **Agent Detail** — Agent info, pricing, try demo
3. **Creator Dashboard** — Revenue, analytics, agent management
4. **Token Panel** — Balance, staking, rewards
5. **Wallet Connect** — Web3 authentication

### UI Components

```
+------------------------------------------------+
| Logo   Marketplace   Wallet   Earnings   AI   |
+------------------------------------------------+
|                                                |
| [ Agent Cards Grid ]                           |
|  --------------------------------------------  |
| | 🤖 Agent Name | Price | Rating | Buy |     | |
|  --------------------------------------------  |
|                                                |
+------------------------------------------------+
```

### Key Libraries
- **wagmi** — React hooks for Web3
- **RainbowKit** — Wallet connection
- **zustand** — State management
- **shadcn/ui** — UI components
- **recharts** — Data visualization

---

## ⚙️ Backend Architecture

### API Endpoints

```typescript
POST /agent/run          // Execute AI agent
POST /agent/register     // List new agent
GET  /agent/:id          // Get agent details
POST /payment/process    // Handle payment
GET  /earnings/:owner    // Get creator earnings
```

### Database Schema (Prisma)

```prisma
model Agent {
  id          String   @id @default(cuid())
  owner       String
  name        String
  description String
  price       Decimal
  earnings    Decimal  @default(0)
  active      Boolean  @default(true)
  metadata    Json
  createdAt   DateTime @default(now())
}

model Transaction {
  id        String   @id @default(cuid())
  agentId   String
  buyer     String
  amount    Decimal
  txHash    String
  timestamp DateTime @default(now())
}
```

---

## 🤖 AI Integration Flow

### Gemini Setup

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
```

### Agent Execution

```typescript
async function runAgent(prompt: string, agentType: string) {
  const systemPrompt = getAgentPrompt(agentType);
  const result = await model.generateContent([systemPrompt, prompt]);
  return result.response.text();
}
```

### Agent Prompt Templates

```typescript
const AGENT_PROMPTS = {
  code: "You are a code review expert. Analyze the code for...",
  seo: "You are an SEO specialist. Audit the website for...",
  content: "You are a professional writer. Create content about...",
  data: "You are a data analyst. Analyze this data and..."
};
```

---

## 🔄 Data Flow

### User Journey

```
1. User connects wallet
   ↓
2. Browse available agents
   ↓
3. Select agent + enter task
   ↓
4. Pay via smart contract
   ↓
5. Backend triggers AI agent
   ↓
6. Results returned to user
   ↓
7. Earnings updated on-chain
```

### Payment Flow

```
User Payment
     ↓
Smart Contract
     ↓
├── 70% → Agent Owner
├── 20% → Token Buyback
└── 10% → Platform Treasury
```

---

## 🔐 Security Considerations

### Smart Contracts
- Use OpenZeppelin libraries
- Implement reentrancy guards
- Add access controls
- Test on testnet thoroughly

### Backend
- Input validation
- Rate limiting
- API key protection
- SQL injection prevention

### Frontend
- Wallet security
- XSS prevention
- CORS configuration
- Environment variable protection

---

## 📊 Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

### Backend
- Database indexing
- API response caching
- Connection pooling
- Query optimization

### Blockchain
- Gas optimization
- Batch transactions
- Event indexing
- Efficient data structures
