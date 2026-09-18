'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, Filter, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StageData {
  name: string;
  value: number;
  count: number;
  fill: string;
}

interface ActivityData {
  type: string;
  label: string;
  count: number;
}

interface ClientData {
  name: string;
  openDeals: number;
  pipelineValue: number;
  weightedPipeline: number;
  wonRevenue: number;
  meetingsCount: number;
  prospectsCount: number;
  fill: string;
}

interface ReportsClientProps {
  totalPipeline: number;
  weightedPipeline: number;
  wonRevenue: number;
  openDealsCount: number;
  winRate: number;
  meetingsCount: number;
  prospectsCount: number;
  stageData: StageData[];
  activityData: ActivityData[];
  clientData: ClientData[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#6366f1', '#f59e0b', '#f97316', '#22c55e', '#ef4444'];

export function ReportsClient({
  totalPipeline,
  weightedPipeline,
  wonRevenue,
  openDealsCount,
  winRate,
  meetingsCount,
  prospectsCount,
  stageData,
  activityData,
  clientData,
}: ReportsClientProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-1">Revenue analytics and pipeline insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Last 6 months
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalPipeline)}</div>
              <p className="text-xs text-muted-foreground">All non-lost deals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weighted Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(weightedPipeline)}</div>
              <p className="text-xs text-muted-foreground">Value × Probability</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">{formatCurrency(wonRevenue)}</div>
              <p className="text-xs text-muted-foreground">{clientData.reduce((sum, c) => sum + (c.wonRevenue > 0 ? 1 : 0), 0)} clients with wins</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{winRate}%</div>
              <p className="text-xs text-muted-foreground">Won / Total Deals</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pipeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pipeline by Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stageData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} opacity={0.5} />
                        <YAxis dataKey="name" type="category" width={100} opacity={0.5} />
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), 'Pipeline Value']}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {stageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {stageData.map((stage) => (
                      <Badge key={stage.name} variant="outline" className="gap-1">
                        <span className="h-2 w-2 rounded" style={{ backgroundColor: stage.fill }} />
                        {stage.name}: {stage.count} deals
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deal Count by Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stageData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis type="number" opacity={0.5} />
                        <YAxis dataKey="name" type="category" width={100} opacity={0.5} />
                        <Tooltip
                          formatter={(value: number) => [value, 'Deals']}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {stageData.map((entry, index) => (
                            <Cell key={`cell-count-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pipeline by Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clientData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} opacity={0.5} />
                        <YAxis dataKey="name" type="category" width={120} opacity={0.5} />
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), 'Pipeline']}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        />
                        <Bar dataKey="pipelineValue" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Pipeline" />
                        <Bar dataKey="weightedPipeline" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Weighted" />
                        <Bar dataKey="wonRevenue" fill="#22c55e" radius={[0, 4, 4, 0]} name="Won" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Composition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={clientData.filter(c => c.wonRevenue > 0 || c.pipelineValue > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="wonRevenue"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {clientData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {activityData.map((metric, i) => (
                    <div key={metric.type} className="p-4 border rounded-lg text-center">
                      <div className="text-3xl font-bold" style={{ color: COLORS[i % COLORS.length] }}>
                        {metric.count}
                      </div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Client Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Client</th>
                        <th className="pb-3 font-medium text-right">Open Deals</th>
                        <th className="pb-3 font-medium text-right">Pipeline</th>
                        <th className="pb-3 font-medium text-right">Weighted Pipeline</th>
                        <th className="pb-3 font-medium text-right">Won Revenue</th>
                        <th className="pb-3 font-medium text-right">Meetings</th>
                        <th className="pb-3 font-medium text-right">Prospects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientData.map((client) => (
                        <tr key={client.name} className="border-b">
                          <td className="py-3 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded" style={{ backgroundColor: client.fill }} />
                              {client.name}
                            </div>
                          </td>
                          <td className="py-3 text-right">{client.openDeals}</td>
                          <td className="py-3 text-right">{formatCurrency(client.pipelineValue)}</td>
                          <td className="py-3 text-right">{formatCurrency(client.weightedPipeline)}</td>
                          <td className="py-3 text-right">{formatCurrency(client.wonRevenue)}</td>
                          <td className="py-3 text-right">{client.meetingsCount}</td>
                          <td className="py-3 text-right">{client.prospectsCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}