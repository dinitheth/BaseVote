'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Rocket, Gem, Fuel, Blocks } from 'lucide-react';
import type { Stats } from '@/lib/types';

const statItems = [
  {
    key: 'totalTxs',
    title: 'Total Transactions',
    icon: Rocket,
    color: 'text-cyan-400',
  },
  {
    key: 'totalBlocks',
    title: 'Total Blocks',
    icon: Blocks,
    color: 'text-purple-400',
  },
  {
    key: 'avgGasPrice',
    title: 'Average Gas Price',
    icon: Fuel,
    color: 'text-amber-400',
  },
  {
    key: 'totalGasUsed',
    title: 'Total Gas Used',
    icon: Gem,
    color: 'text-emerald-400',
  },
];

export function StatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const apiUrls = {
            totalTxs: 'https://api.routescan.io/v2/network/mainnet/evm/8453/aggregations/txs/tot',
            totalBlocks: 'https://api.routescan.io/v2/network/mainnet/evm/8453/aggregations/blocks/tot',
            avgGasPrice: 'https://api.routescan.io/v2/network/mainnet/evm/8453/aggregations/avg-gas-price/tot',
            totalGasUsed: 'https://api.routescan.io/v2/network/mainnet/evm/8453/aggregations/gas-used/tot',
        };

        const responses = await Promise.all(Object.values(apiUrls).map(url => fetch(url)));
        const data = await Promise.all(responses.map(res => res.json()));

        setStats({
          totalTxs: data[0].total,
          totalBlocks: data[1].total,
          avgGasPrice: data[2].total,
          totalGasUsed: data[3].total,
        });

      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (typeof num !== 'number') return '0';
    if (num > 1e12) return `${(num / 1e12).toFixed(2)} T`;
    if (num > 1e9) return `${(num / 1e9).toFixed(2)} B`;
    if (num > 1e6) return `${(num / 1e6).toFixed(2)} M`;
    if (num > 1e3) return `${(num / 1e3).toFixed(2)} K`;
    return num.toLocaleString();
  }

  const formatGwei = (wei: string) => {
    const num = parseFloat(wei);
    if (isNaN(num)) return 'N/A';
    return `${(num / 1e9).toFixed(2)} Gwei`;
  }

  const statFormatters: { [key: string]: (value: any) => string } = {
    totalTxs: (val) => formatNumber(val),
    totalBlocks: (val) => formatNumber(val),
    avgGasPrice: (val) => formatGwei(val),
    totalGasUsed: (val) => formatNumber(val),
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.key} className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            <item.icon className={`h-5 w-5 ${item.color}`} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <div className="text-2xl font-bold font-headline text-primary">
                {stats ? statFormatters[item.key as keyof Stats](stats[item.key as keyof Stats]) : 'Error'}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
