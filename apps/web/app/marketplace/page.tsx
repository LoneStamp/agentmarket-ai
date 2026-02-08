'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { toast } from 'sonner';
import { Bot, Code, TrendingUp, FileText, BarChart3, Loader2, Star } from 'lucide-react';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from '@/lib/contracts';

const AGENT_TYPES = {
  code: { icon: Code, name: 'Code Reviewer', desc: 'AI-powered code analysis and security audit' },
  seo: { icon: TrendingUp, name: 'SEO Specialist', desc: 'Website optimization and keyword research' },
  content: { icon: FileText, name: 'Content Writer', desc: 'Professional content creation' },
  data: { icon: BarChart3, name: 'Data Analyst', desc: 'Data analysis and insights' },
};

export default function MarketplacePage() {
  const { isConnected, address } = useAccount();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [processing, setProcessing] = useState(false);

  const { data: agentCount } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'agentCount',
  });

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    loadAgents();
  }, [agentCount]);

  async function loadAgents() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agents`);
      const data = await response.json();
      if (data.success) {
        setAgents(data.agents);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(agent: any) {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setProcessing(true);

      // Call smart contract
      writeContract({
        address: MARKETPLACE_ADDRESS,
        abi: MARKETPLACE_ABI,
        functionName: 'payAgent',
        args: [BigInt(agent.contractId)],
        value: parseEther(agent.price.toString()),
      });

      toast.success('Payment initiated...');
      
      // Wait for confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call AI agent
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: agent.agentType,
          prompt,
          agentId: agent.id,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setAiResult(result.result);
        toast.success('Agent executed successfully!');
      } else {
        toast.error('Failed to execute agent');
      }
    } catch (error) {
      console.error(error);
      toast.error('Transaction failed');
    } finally {
      setProcessing(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Bot className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Access the AI agent marketplace</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">AgentMarket AI</h1>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">AI Agent Marketplace</h2>
          <p className="text-gray-600">Browse and purchase AI-powered services</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No agents available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const AgentIcon = AGENT_TYPES[agent.agentType as keyof typeof AGENT_TYPES]?.icon || Bot;
              return (
                <div key={agent.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <AgentIcon className="h-10 w-10 text-purple-600" />
                    {agent.active && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">{agent.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{agent.description}</p>
                  
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(Number(agent.rating) / 20)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({agent.ratingCount} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{Number(agent.price).toFixed(4)} ETH</div>
                      <div className="text-sm text-gray-600">{agent.totalSales} sales</div>
                    </div>
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Use Agent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedAgent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-2xl font-bold mb-4">{selectedAgent.name}</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Request</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Describe your ${selectedAgent.agentType} task...`}
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                  rows={4}
                />
              </div>

              {aiResult && (
                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Result:</h4>
                  <div className="whitespace-pre-wrap text-sm">{aiResult}</div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => handlePurchase(selectedAgent)}
                  disabled={!prompt || processing}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    `Pay ${Number(selectedAgent.price).toFixed(4)} ETH & Execute`
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedAgent(null);
                    setPrompt('');
                    setAiResult('');
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
