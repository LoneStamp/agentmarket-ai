# Implementation Guide

## 🚀 Setup & Installation

### Initial Setup

```bash
# Create Next.js app
pnpm create next-app agent-marketplace

# Navigate to project
cd agent-marketplace

# Install dependencies
pnpm install ethers wagmi viem @rainbow-me/rainbowkit
pnpm install @google/generative-ai
pnpm install tailwindcss shadcn
pnpm install fastify @fastify/cors
pnpm install prisma @prisma/client
pnpm install hardhat @nomicfoundation/hardhat-toolbox
```

---

## 📜 Smart Contracts

### AgentMarketplace.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentMarketplace {
    
    struct Agent {
        address owner;
        string metadata;
        uint256 price;
        uint256 earnings;
        bool active;
    }
    
    uint256 public agentCount;
    mapping(uint256 => Agent) public agents;
    
    event AgentRegistered(uint256 indexed id, address indexed owner, uint256 price);
    event AgentPurchased(uint256 indexed id, address indexed buyer, uint256 amount);
    event EarningsWithdrawn(address indexed owner, uint256 amount);
    
    // Register new agent
    function registerAgent(string calldata metadata, uint256 price) external {
        agents[agentCount] = Agent({
            owner: msg.sender,
            metadata: metadata,
            price: price,
            earnings: 0,
            active: true
        });
        
        emit AgentRegistered(agentCount, msg.sender, price);
        agentCount++;
    }
    
    // Pay agent for service
    function payAgent(uint256 id) external payable {
        Agent storage agent = agents[id];
        
        require(agent.active, "Agent not active");
        require(msg.value >= agent.price, "Insufficient payment");
        
        // Split payment: 70% creator, 20% buyback, 10% treasury
        uint256 creatorShare = (msg.value * 70) / 100;
        uint256 buybackShare = (msg.value * 20) / 100;
        uint256 treasuryShare = msg.value - creatorShare - buybackShare;
        
        agent.earnings += creatorShare;
        
        emit AgentPurchased(id, msg.sender, msg.value);
    }
    
    // Withdraw earnings
    function withdrawEarnings(uint256 id) external {
        Agent storage agent = agents[id];
        require(agent.owner == msg.sender, "Not owner");
        
        uint256 amount = agent.earnings;
        require(amount > 0, "No earnings");
        
        agent.earnings = 0;
        payable(msg.sender).transfer(amount);
        
        emit EarningsWithdrawn(msg.sender, amount);
    }
    
    // Toggle agent active status
    function toggleAgent(uint256 id) external {
        require(agents[id].owner == msg.sender, "Not owner");
        agents[id].active = !agents[id].active;
    }
}
```

### AgentToken.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentToken is ERC20, Ownable {
    
    uint256 public constant TOTAL_SUPPLY = 1_000_000 * 10**18;
    
    constructor() ERC20("AgentToken", "AGENT") Ownable(msg.sender) {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
    
    // Burn tokens (for buyback mechanism)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
```

### Hardhat Config

**hardhat.config.ts**
```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
    baseGoerli: {
      url: process.env.BASE_GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
```

### Deployment Script

**scripts/deploy.ts**
```typescript
import { ethers } from "hardhat";

async function main() {
  // Deploy AgentToken
  const AgentToken = await ethers.getContractFactory("AgentToken");
  const token = await AgentToken.deploy();
  await token.waitForDeployment();
  console.log(`AgentToken deployed to: ${await token.getAddress()}`);
  
  // Deploy AgentMarketplace
  const AgentMarketplace = await ethers.getContractFactory("AgentMarketplace");
  const marketplace = await AgentMarketplace.deploy();
  await marketplace.waitForDeployment();
  console.log(`AgentMarketplace deployed to: ${await marketplace.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

---

## 🗄️ Backend Implementation

### Database Schema

**prisma/schema.prisma**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Agent {
  id          String   @id @default(cuid())
  contractId  Int      @unique
  owner       String
  name        String
  description String
  agentType   String   // code, seo, content, data
  price       Decimal
  earnings    Decimal  @default(0)
  active      Boolean  @default(true)
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  transactions Transaction[]
  
  @@index([owner])
  @@index([agentType])
}

model Transaction {
  id        String   @id @default(cuid())
  agentId   String
  buyer     String
  amount    Decimal
  txHash    String   @unique
  status    String   // pending, completed, failed
  result    Json?
  timestamp DateTime @default(now())
  
  agent Agent @relation(fields: [agentId], references: [id])
  
  @@index([buyer])
  @@index([txHash])
}

model User {
  id        String   @id @default(cuid())
  address   String   @unique
  username  String?
  email     String?
  createdAt DateTime @default(now())
  
  @@index([address])
}
```

### API Server

**backend/server.ts**
```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Enable CORS
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
});

// Agent prompts
const AGENT_PROMPTS = {
  code: `You are an expert code reviewer. Analyze the provided code for:
- Code quality and best practices
- Security vulnerabilities
- Performance issues
- Maintainability concerns
Provide actionable recommendations.`,
  
  seo: `You are an SEO specialist. Audit the website and provide:
- On-page SEO analysis
- Technical SEO issues
- Keyword recommendations
- Content optimization tips`,
  
  content: `You are a professional content writer. Create:
- Engaging, well-researched content
- SEO-optimized text
- Clear structure with headings
- Compelling call-to-actions`,
  
  data: `You are a data analyst. Analyze the data and provide:
- Key insights and trends
- Statistical analysis
- Visualizations recommendations
- Actionable conclusions`,
};

// Run AI Agent
fastify.post('/api/agent/run', async (request, reply) => {
  const { agentType, prompt, agentId } = request.body as {
    agentType: string;
    prompt: string;
    agentId: string;
  };
  
  try {
    // Get agent prompt
    const systemPrompt = AGENT_PROMPTS[agentType as keyof typeof AGENT_PROMPTS];
    
    // Run Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent([systemPrompt, prompt]);
    const response = result.response.text();
    
    return {
      success: true,
      result: response,
      agentType,
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Failed to execute agent',
    });
  }
});

// Get agent details
fastify.get('/api/agent/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  
  const agent = await prisma.agent.findUnique({
    where: { id },
  });
  
  if (!agent) {
    return reply.status(404).send({ error: 'Agent not found' });
  }
  
  return agent;
});

// Get creator earnings
fastify.get('/api/earnings/:address', async (request, reply) => {
  const { address } = request.params as { address: string };
  
  const agents = await prisma.agent.findMany({
    where: { owner: address.toLowerCase() },
  });
  
  const totalEarnings = agents.reduce(
    (sum, agent) => sum + Number(agent.earnings),
    0
  );
  
  return {
    address,
    totalEarnings,
    agentCount: agents.length,
    agents,
  };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

---

## 🖥️ Frontend Implementation

### Wallet Configuration

**app/providers.tsx**
```typescript
'use client';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'AgentMarket AI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
  chains: [sepolia],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Marketplace Component

**components/marketplace.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;

export function Marketplace() {
  const [agents, setAgents] = useState([]);
  
  // Read agent count
  const { data: agentCount } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: marketplaceABI,
    functionName: 'agentCount',
  });
  
  // Write contract
  const { writeContract } = useWriteContract();
  
  const handleBuyAgent = async (agentId: number, price: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: marketplaceABI,
      functionName: 'payAgent',
      args: [agentId],
      value: parseEther(price),
    });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard 
          key={agent.id} 
          agent={agent}
          onBuy={handleBuyAgent}
        />
      ))}
    </div>
  );
}
```

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

```bash
# Deploy to Vercel
vercel --prod

# Or connect GitHub repo for auto-deploy
```

### Backend Deployment (Docker)

**docker-compose.yml**
```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=agentmarket
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Deploy
docker compose up -d
```

### Smart Contract Deployment

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia DEPLOYED_ADDRESS
```

---

## ✅ Testing Checklist

### Smart Contracts
- [ ] Register agent
- [ ] Pay agent
- [ ] Withdraw earnings
- [ ] Token transfer
- [ ] Edge cases

### Backend
- [ ] API endpoints respond
- [ ] Database operations
- [ ] Gemini integration
- [ ] Error handling

### Frontend
- [ ] Wallet connection
- [ ] Agent display
- [ ] Payment flow
- [ ] Responsive design

### Integration
- [ ] End-to-end user flow
- [ ] Contract interactions
- [ ] API communication
- [ ] Real testnet testing
