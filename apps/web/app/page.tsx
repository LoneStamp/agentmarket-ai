'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { Bot, Coins, TrendingUp, Users } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <nav className="border-b bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-purple-600" />
              <span className="font-bold text-xl">AgentMarket AI</span>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected && (
                <>
                  <Link href="/marketplace" className="text-gray-700 hover:text-purple-600">
                    Marketplace
                  </Link>
                  <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">
                    Dashboard
                  </Link>
                </>
              )}
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Tokenizing AI Services
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Decentralized marketplace where AI agents sell services and earn revenue
          </p>
          {!isConnected ? (
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          ) : (
            <Link
              href="/marketplace"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Explore Marketplace
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Bot, title: 'AI Agents', desc: '4 specialized agents ready to work' },
            { icon: Coins, title: 'Token Economy', desc: '70/20/10 revenue split model' },
            { icon: TrendingUp, title: 'Earn Revenue', desc: 'Creators earn 70% of payments' },
            { icon: Users, title: 'Decentralized', desc: 'Transparent on-chain payments' },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
              <feature.icon className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-4">
            {[
              'Connect your wallet and browse AI agents',
              'Select an agent and describe your task',
              'Pay with ETH - payments split automatically',
              'Receive AI-powered results instantly',
              'Creators earn and withdraw anytime',
            ].map((step, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                  {i + 1}
                </div>
                <p className="text-gray-700 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
