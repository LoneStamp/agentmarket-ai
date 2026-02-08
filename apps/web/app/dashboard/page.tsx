'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { DollarSign, TrendingUp, Users, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      loadStats();
    }
  }, [address]);

  async function loadStats() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/earnings/${address}`);
      const data = await response.json();
      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
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
            <h1 className="text-xl font-bold">Creator Dashboard</h1>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">Your Earnings</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: DollarSign, label: 'Total Earnings', value: `${stats?.totalEarnings || 0} ETH`, color: 'text-green-600' },
            { icon: Users, label: 'Active Agents', value: stats?.agentCount || 0, color: 'text-blue-600' },
            { icon: TrendingUp, label: 'Total Sales', value: stats?.agents?.reduce((sum: number, a: any) => sum + a.totalSales, 0) || 0, color: 'text-purple-600' },
            { icon: Activity, label: 'Avg Rating', value: stats?.agents?.reduce((sum: number, a: any) => sum + Number(a.rating), 0) / (stats?.agentCount || 1) || 0, color: 'text-yellow-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
              <stat.icon className={`h-8 w-8 ${stat.color} mb-3`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-bold mb-4">Your Agents</h3>
          {loading ? (
            <p>Loading...</p>
          ) : stats?.agents?.length > 0 ? (
            <div className="space-y-4">
              {stats.agents.map((agent: any) => (
                <div key={agent.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{agent.name}</div>
                    <div className="text-sm text-gray-600">{agent.totalSales} sales</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{Number(agent.earnings).toFixed(4)} ETH</div>
                    <div className="text-sm text-gray-600">Rating: {Number(agent.rating).toFixed(1)}/100</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No agents registered yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
