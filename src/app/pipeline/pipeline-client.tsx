'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, MoreHorizontal, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { DEAL_STAGES } from '@/data/types';

const stages = DEAL_STAGES.filter(s => s.value !== 'WON' && s.value !== 'LOST');

interface DealWithRelations {
  id: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
  expectedClose: Date | string | null;
  client: { name: string } | null;
  company: { name: string } | null;
  contact: { firstName: string; lastName: string } | null;
}

interface StageConfig {
  value: string;
  label: string;
  order: number;
}

interface PipelineClientProps {
  initialDeals: DealWithRelations[];
  stages: StageConfig[];
}

const getDealStageColor = (stage: string): string => {
  const colors: Record<string, string> = {
    LEAD: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    QUALIFIED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    DISCOVERY: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    PROPOSAL: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    NEGOTIATION: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    WON: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    LOST: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[stage] || colors.LEAD;
};

export function PipelineClient({ initialDeals, stages }: PipelineClientProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
            <p className="text-muted-foreground mt-1">Manage deals across all stages</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageDeals = initialDeals.filter(d => d.stage === stage.value);
            const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            const weightedValue = stageDeals.reduce((sum, d) => sum + d.value * (d.probability / 100), 0);

            return (
              <Card key={stage.value} className="w-80 flex-shrink-0 flex flex-col" style={{ minHeight: '500px' }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={getDealStageColor(stage.value) + ' px-2 py-0.5 rounded text-xs font-medium'}>
                        {stage.label}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {stageDeals.length}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(weightedValue)}</p>
                      <p className="text-xs text-muted-foreground">Weighted</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <div className="space-y-2 p-2 max-h-[400px] overflow-y-auto">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <Link href={`/deals/${deal.id}`} className="block">
                          <p className="font-medium truncate hover:text-primary transition-colors">{deal.name}</p>
                        </Link>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">
                            {deal.company?.name || '—'}
                          </span>
                          <span className="text-sm font-medium">{formatCurrency(deal.value)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline" className="text-xs">
                            {deal.probability}%
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full text-xs py-1.5" style={{ marginTop: '0.5rem' }}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add Deal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}