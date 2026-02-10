# 🚀 Deployment Checklist

## Pre-Deployment

### Environment Setup
- [ ] All API keys obtained and tested
- [ ] `.env` file configured completely
- [ ] Database connection verified
- [ ] Smart contracts compiled successfully
- [ ] Local testing completed

### Code Quality
- [ ] All TypeScript errors fixed
- [ ] Linting passes (`pnpm run lint`)
- [ ] Tests passing (`pnpm test`)
- [ ] Build succeeds (`pnpm run build`)
- [ ] No console errors in browser

---

## Smart Contract Deployment

### Sepolia Testnet
- [ ] Wallet has Sepolia ETH for gas
- [ ] Deploy AgentToken contract
- [ ] Deploy AgentMarketplace contract
- [ ] Verify contracts on Etherscan
- [ ] Test basic contract functions
- [ ] Update .env with contract addresses

### Verification
```bash
cd packages/contracts
pnpm run deploy:sepolia

# Verify
npx hardhat verify --network sepolia <TOKEN_ADDRESS>
npx hardhat verify --network sepolia <MARKETPLACE_ADDRESS> <TREASURY> <BUYBACK>
```

- [ ] Contracts verified on Sepolia Etherscan
- [ ] Contract addresses saved
- [ ] Test transactions successful

---

## Backend Deployment

### Option 1: Railway

1. **Setup**
   - [ ] Create Railway account
   - [ ] Connect GitHub repository
   - [ ] Create new project

2. **Configuration**
   - [ ] Add PostgreSQL plugin
   - [ ] Set all environment variables
   - [ ] Configure build command: `cd apps/api && pnpm install && pnpm run build`
   - [ ] Configure start command: `cd apps/api && pnpm start`

3. **Deploy**
   - [ ] Push to GitHub
   - [ ] Verify deployment success
   - [ ] Test API endpoints
   - [ ] Check logs for errors

### Option 2: Render

1. **Setup**
   - [ ] Create Render account
   - [ ] Connect repository
   - [ ] Create Web Service

2. **Configuration**
   - [ ] Set build command
   - [ ] Set start command
   - [ ] Add environment variables
   - [ ] Add PostgreSQL database

3. **Deploy**
   - [ ] Deploy service
   - [ ] Verify health check
   - [ ] Test API

### Option 3: Docker

```bash
# Build image
docker build -t agentmarket-api apps/api/

# Run container
docker run -d \
  -p 3001:3001 \
  --env-file .env \
  --name agentmarket-api \
  agentmarket-api
```

- [ ] Docker image built
- [ ] Container running
- [ ] API accessible
- [ ] Logs clean

---

## Frontend Deployment

### Vercel (Recommended)

1. **Setup**
   - [ ] Create Vercel account
   - [ ] Install Vercel CLI: `npm i -g vercel`
   - [ ] Login: `vercel login`

2. **Configuration**
   ```bash
   cd apps/web
   vercel
   ```

   - [ ] Project linked
   - [ ] Environment variables added:
     - `NEXT_PUBLIC_API_URL`
     - `NEXT_PUBLIC_MARKETPLACE_ADDRESS`
     - `NEXT_PUBLIC_TOKEN_ADDRESS`
     - `NEXT_PUBLIC_CHAIN_ID`
     - `NEXT_PUBLIC_WALLETCONNECT_ID`

3. **Deploy**
   ```bash
   vercel --prod
   ```

   - [ ] Deployment successful
   - [ ] Custom domain configured (optional)
   - [ ] SSL certificate active
   - [ ] All pages load correctly

### Netlify (Alternative)

1. **Setup**
   - [ ] Create Netlify account
   - [ ] Connect repository
   - [ ] Configure build settings

2. **Configuration**
   - Build command: `cd apps/web && pnpm run build`
   - Publish directory: `apps/web/.next`
   - [ ] Environment variables added

3. **Deploy**
   - [ ] Site deployed
   - [ ] DNS configured
   - [ ] HTTPS enabled

---

## Database Deployment

### Supabase (Recommended)

1. **Setup**
   - [ ] Create Supabase account
   - [ ] Create new project
   - [ ] Wait for database provisioning

2. **Configuration**
   - [ ] Copy connection string
   - [ ] Update DATABASE_URL in .env
   - [ ] Run migrations:
     ```bash
     DATABASE_URL="postgresql://..." pnpm prisma migrate deploy
     ```

3. **Verification**
   - [ ] Tables created
   - [ ] Backend connects successfully
   - [ ] Queries work

### Railway PostgreSQL

1. **Setup**
   - [ ] Add PostgreSQL plugin in Railway
   - [ ] Copy connection string

2. **Configuration**
   - [ ] Update DATABASE_URL
   - [ ] Run migrations

3. **Verification**
   - [ ] Connection successful
   - [ ] Data persists

---

## Post-Deployment Testing

### Smart Contracts
- [ ] Can register new agent
- [ ] Can purchase agent service
- [ ] Revenue split works correctly
- [ ] Withdrawal functions work
- [ ] Events emit properly

### Backend API
- [ ] Health endpoint responds
- [ ] All agent routes work
- [ ] AI integration functional
- [ ] Database queries succeed
- [ ] Error handling works

### Frontend
- [ ] Wallet connection works
- [ ] Marketplace loads agents
- [ ] Can execute agents
- [ ] Transactions succeed
- [ ] Dashboard shows data
- [ ] Mobile responsive
- [ ] No console errors

### Integration
- [ ] End-to-end user flow works
- [ ] Payment → AI execution → Result
- [ ] Earnings update correctly
- [ ] All features functional

---

## Security Checklist

### Smart Contracts
- [ ] No reentrancy vulnerabilities
- [ ] Access controls implemented
- [ ] Input validation present
- [ ] Gas optimizations applied
- [ ] Pausable if needed

### Backend
- [ ] Environment variables secured
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] SQL injection prevention
- [ ] API key validation

### Frontend
- [ ] No sensitive data in code
- [ ] XSS prevention
- [ ] HTTPS enforced
- [ ] Wallet security best practices
- [ ] Error messages don't leak info

---

## Monitoring Setup

### Backend
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Log aggregation
- [ ] Uptime monitoring
- [ ] API analytics

### Frontend
- [ ] Analytics (Vercel Analytics)
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] User behavior tracking

### Blockchain
- [ ] Transaction monitoring
- [ ] Contract event tracking
- [ ] Gas usage tracking
- [ ] Error alerts

---

## Documentation

### Public Documentation
- [ ] README.md complete
- [ ] QUICKSTART.md created
- [ ] API documentation
- [ ] Smart contract docs
- [ ] User guides

### Internal Documentation
- [ ] Deployment process documented
- [ ] Environment variables listed
- [ ] Troubleshooting guide
- [ ] Runbook for issues

---

## Submission Checklist (Hackathon)

### Required Materials
- [ ] GitHub repository public
- [ ] Live demo URL working
- [ ] Demo video recorded (2-4 min)
- [ ] Pitch deck created (10 slides)
- [ ] Cover image designed

### LabLab.ai Submission
- [ ] Project submitted on platform
- [ ] All links verified
- [ ] Description complete
- [ ] Tags added
- [ ] Category selected

### Social Media
- [ ] Video posted on X/Twitter
- [ ] Tagged @lablabai and @Surgexyz_
- [ ] Included demo link
- [ ] Included submission link
- [ ] Added to submission form

### Final Checks
- [ ] All features work
- [ ] No critical bugs
- [ ] Professional presentation
- [ ] Clear value proposition
- [ ] Meets hackathon requirements

---

## Rollback Plan

### If Deployment Fails

**Smart Contracts:**
- Keep old contract addresses
- Don't update .env until verified
- Test thoroughly on testnet first

**Backend:**
- Keep previous deployment active
- Use blue-green deployment
- Can rollback via platform

**Frontend:**
- Vercel keeps previous deployments
- Can rollback instantly
- Test on preview URLs first

**Database:**
- Have migration rollback scripts
- Backup before major changes
- Test migrations on staging first

---

## Success Metrics

### Technical
- [ ] Uptime > 99%
- [ ] API response time < 500ms
- [ ] Zero critical errors
- [ ] All tests passing

### Business
- [ ] Demo video views
- [ ] GitHub stars
- [ ] Social media engagement
- [ ] User feedback

---

## Post-Launch

### Week 1
- [ ] Monitor for bugs
- [ ] Gather user feedback
- [ ] Fix critical issues
- [ ] Update documentation

### Week 2-4
- [ ] Add requested features
- [ ] Performance optimizations
- [ ] Security audit
- [ ] Community building

---

## 🎉 Deployment Complete!

Once all items are checked:

1. **Announce Launch**
   - Social media posts
   - Community updates
   - Demo showcases

2. **Monitor & Support**
   - Watch error logs
   - Respond to issues
   - Gather feedback

3. **Iterate**
   - Plan improvements
   - Add features
   - Scale as needed

---

Built for SURGE × Moltbook Hackathon
