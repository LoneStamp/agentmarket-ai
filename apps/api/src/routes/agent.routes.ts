import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../services/database.service.js';
import { runAIAgent, AgentType } from '../services/ai.service.js';

const runAgentSchema = z.object({
  agentType: z.enum(['code', 'seo', 'content', 'data']),
  prompt: z.string().min(10).max(10000),
  agentId: z.string().optional(),
});

const createAgentSchema = z.object({
  contractId: z.number(),
  owner: z.string(),
  name: z.string(),
  description: z.string(),
  agentType: z.enum(['code', 'seo', 'content', 'data']),
  price: z.string(),
  metadata: z.record(z.any()).optional(),
});

const rateAgentSchema = z.object({
  rating: z.number().min(1).max(5),
});

export async function agentRoutes(fastify: FastifyInstance) {
  
  // Run AI Agent
  fastify.post('/agent/run', async (request, reply) => {
    try {
      const body = runAgentSchema.parse(request.body);
      
      const result = await runAIAgent(body.agentType as AgentType, body.prompt);
      
      // If agentId provided, save transaction
      if (body.agentId && result.success) {
        await prisma.transaction.create({
          data: {
            agentId: body.agentId,
            buyer: 'anonymous', // Will be replaced with actual wallet address
            amount: 0, // Will be updated from blockchain event
            txHash: 'pending',
            status: 'completed',
            prompt: body.prompt,
            response: result.result,
          },
        });
      }
      
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        });
      }
      
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to execute agent',
      });
    }
  });

  // Create/Register Agent in Database
  fastify.post('/agent/register', async (request, reply) => {
    try {
      const body = createAgentSchema.parse(request.body);
      
      const agent = await prisma.agent.create({
        data: {
          contractId: body.contractId,
          owner: body.owner.toLowerCase(),
          name: body.name,
          description: body.description,
          agentType: body.agentType,
          price: body.price,
          metadata: body.metadata || {},
        },
      });
      
      return {
        success: true,
        agent,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        });
      }
      
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to register agent',
      });
    }
  });

  // Get Agent by ID
  fastify.get('/agent/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    try {
      const agent = await prisma.agent.findUnique({
        where: { id },
        include: {
          transactions: {
            take: 10,
            orderBy: { timestamp: 'desc' },
          },
        },
      });
      
      if (!agent) {
        return reply.status(404).send({
          success: false,
          error: 'Agent not found',
        });
      }
      
      return agent;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch agent',
      });
    }
  });

  // Get All Active Agents
  fastify.get('/agents', async (request, reply) => {
    const { type, owner } = request.query as { type?: string; owner?: string };
    
    try {
      const agents = await prisma.agent.findMany({
        where: {
          active: true,
          ...(type && { agentType: type }),
          ...(owner && { owner: owner.toLowerCase() }),
        },
        orderBy: [
          { rating: 'desc' },
          { totalSales: 'desc' },
        ],
        take: 50,
      });
      
      return {
        success: true,
        agents,
        count: agents.length,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch agents',
      });
    }
  });

  // Get Creator Earnings
  fastify.get('/earnings/:address', async (request, reply) => {
    const { address } = request.params as { address: string };
    
    try {
      const agents = await prisma.agent.findMany({
        where: { owner: address.toLowerCase() },
      });
      
      const totalEarnings = agents.reduce(
        (sum, agent) => sum + Number(agent.earnings),
        0
      );
      
      return {
        success: true,
        address: address.toLowerCase(),
        totalEarnings,
        agentCount: agents.length,
        agents: agents.map(agent => ({
          id: agent.id,
          contractId: agent.contractId,
          name: agent.name,
          earnings: Number(agent.earnings),
          totalSales: agent.totalSales,
          rating: Number(agent.rating),
        })),
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch earnings',
      });
    }
  });

  // Rate Agent
  fastify.post('/agent/:id/rate', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    try {
      const body = rateAgentSchema.parse(request.body);
      
      const agent = await prisma.agent.findUnique({ where: { id } });
      
      if (!agent) {
        return reply.status(404).send({
          success: false,
          error: 'Agent not found',
        });
      }
      
      // Calculate new average rating
      const newRatingSum = Number(agent.rating) * agent.ratingCount + body.rating;
      const newRatingCount = agent.ratingCount + 1;
      const newRating = newRatingSum / newRatingCount;
      
      const updated = await prisma.agent.update({
        where: { id },
        data: {
          rating: newRating,
          ratingCount: newRatingCount,
        },
      });
      
      return {
        success: true,
        rating: Number(updated.rating),
        ratingCount: updated.ratingCount,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to rate agent',
      });
    }
  });

  // Get Agent Stats
  fastify.get('/stats', async (request, reply) => {
    try {
      const [totalAgents, totalUsers, transactions] = await Promise.all([
        prisma.agent.count(),
        prisma.user.count(),
        prisma.transaction.findMany({
          where: { status: 'completed' },
        }),
      ]);
      
      const totalVolume = transactions.reduce(
        (sum, tx) => sum + Number(tx.amount),
        0
      );
      
      return {
        success: true,
        stats: {
          totalAgents,
          totalUsers,
          totalTransactions: transactions.length,
          totalVolume,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch stats',
      });
    }
  });
}
