import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from 'dotenv';
import { agentRoutes } from './routes/agent.routes.js';
import { validateAIConnection } from './services/ai.service.js';
import prisma from './services/database.service.js';

// Load environment variables
config({ path: '../../.env' });

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

await fastify.register(helmet, {
  contentSecurityPolicy: false,
});

await fastify.register(rateLimit, {
  max: parseInt(process.env.API_RATE_LIMIT || '100'),
  timeWindow: '15 minutes',
});

// Health check
fastify.get('/health', async (request, reply) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check AI service
    const aiStatus = await validateAIConnection();
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        ai: aiStatus ? 'connected' : 'disconnected',
      },
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(503).send({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service check failed',
    });
  }
});

// Root endpoint
fastify.get('/', async () => {
  return {
    name: 'AgentMarket AI API',
    version: '1.0.0',
    status: 'running',
    documentation: '/docs',
    endpoints: {
      health: '/health',
      agents: '/api/agents',
      agent: '/api/agent/:id',
      run: '/api/agent/run',
      register: '/api/agent/register',
      earnings: '/api/earnings/:address',
      stats: '/api/stats',
    },
  };
});

// Register routes
await fastify.register(agentRoutes, { prefix: '/api' });

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  reply.status(error.statusCode || 500).send({
    success: false,
    error: error.message || 'Internal Server Error',
    statusCode: error.statusCode || 500,
  });
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    
    fastify.log.info(`
╔═══════════════════════════════════════════╗
║                                           ║
║     🚀 AgentMarket AI API Server         ║
║                                           ║
║     Status: Running                       ║
║     Port: ${port}                            ║
║     Environment: ${process.env.NODE_ENV || 'development'}              ║
║                                           ║
║     Endpoints:                            ║
║     - Health: http://localhost:${port}/health   ║
║     - API: http://localhost:${port}/api         ║
║                                           ║
╚═══════════════════════════════════════════╝
    `);
    
    // Validate services on startup
    const aiStatus = await validateAIConnection();
    if (!aiStatus) {
      fastify.log.warn('⚠️  Gemini AI service is not connected');
    } else {
      fastify.log.info('✅ Gemini AI service connected');
    }
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
