#!/bin/bash

# AgentMarket AI - Automated Setup Script
# This script sets up the entire project automatically

set -e  # Exit on error

echo "╔═══════════════════════════════════════════╗"
echo "║                                           ║"
echo "║     🚀 AgentMarket AI Setup              ║"
echo "║                                           ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✅ pnpm found: $(pnpm --version)${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo -e "${BLUE}Creating .env from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env with your API keys before continuing${NC}"
    echo -e "${YELLOW}Required:${NC}"
    echo "  - GEMINI_API_KEY"
    echo "  - SEPOLIA_RPC_URL"
    echo "  - NEXT_PUBLIC_WALLETCONNECT_ID"
    echo "  - ETHERSCAN_API_KEY"
    echo ""
    read -p "Press Enter after you've configured .env file..."
fi

# Install dependencies
echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

# Set up database
echo ""
echo -e "${BLUE}🗄️  Setting up database...${NC}"

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL not detected. Starting with Docker...${NC}"
    if command -v docker &> /dev/null; then
        docker compose up -d postgres
        sleep 5  # Wait for PostgreSQL to be ready
    else
        echo -e "${RED}❌ PostgreSQL not running and Docker not found${NC}"
        echo "Please install PostgreSQL or Docker"
        exit 1
    fi
fi

# Run migrations
echo -e "${BLUE}Running database migrations...${NC}"
cd prisma
pnpm prisma migrate dev --name init
pnpm prisma generate
cd ..

echo -e "${GREEN}✅ Database setup complete${NC}"

# Deploy contracts (optional)
echo ""
read -p "Do you want to deploy smart contracts to Sepolia now? (y/N): " deploy_contracts

if [[ $deploy_contracts =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}📜 Deploying smart contracts...${NC}"
    cd packages/contracts
    
    if ! pnpm run deploy:sepolia; then
        echo -e "${YELLOW}⚠️  Contract deployment failed${NC}"
        echo "You can deploy later with: cd packages/contracts && pnpm run deploy:sepolia"
    else
        echo -e "${GREEN}✅ Contracts deployed${NC}"
        echo -e "${YELLOW}⚠️  Remember to update contract addresses in .env${NC}"
    fi
    cd ../..
else
    echo -e "${YELLOW}⚠️  Skipping contract deployment${NC}"
    echo "You can deploy later with: cd packages/contracts && pnpm run deploy:sepolia"
fi

# Success message
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                           ║${NC}"
echo -e "${GREEN}║     ✅ Setup Complete!                    ║${NC}"
echo -e "${GREEN}║                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🚀 To start the application:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd apps/api"
echo "  pnpm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd apps/web"
echo "  pnpm run dev"
echo ""
echo -e "${BLUE}Then visit: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}📚 Next steps:${NC}"
echo "  1. Edit .env with your API keys (if not done)"
echo "  2. Deploy contracts (if not done): cd packages/contracts && pnpm run deploy:sepolia"
echo "  3. Update .env with contract addresses"
echo "  4. Start backend: cd apps/api && pnpm run dev"
echo "  5. Start frontend: cd apps/web && pnpm run dev"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
