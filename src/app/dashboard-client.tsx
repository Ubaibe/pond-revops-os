'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  GitBranch,
  Target,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Building2,
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface Stats {
  activeClients: number;
  openDeals: number;
  pipelineValue: number;
  wonRevenue: number;
  meetings: number;
  prospects: number;
}

interface DealWithRelations {
  id: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
  updatedAt: Date | string;
  client: { name: string };
  company: { name: string } | null;
  contact: { firstName: string; lastName: string } | null;
}

interface MeetingWithRelations {
  id: string;
  title: string;
  startTime: Date | string;
  endTime: Date | string | null;
  platform: string | null;
  client: { name: string };
  deal: { name: string } | null;
}

interface ActivityWithRelations {
  id: string;
  type: string;
  subject: string | null;
  body: string | null;
  createdAt: Date | string;
  client: { name: string };
  deal: { name: string } | null;
  contact: { firstName: string; lastName: string } | null;
}

interface PipelineStage {
  stage: string;
  totalValue: number;
  count: number;
}

interface ClientBreakdown {
  name: string;
  pipelineValue: number;
  openDealsCount: number;
  wonRevenue: number;
}

interface DashboardClientProps {
  stats: Stats;
  recentDeals: DealWithRelations[];
  upcomingMeetings: MeetingWithRelations[];
  recentActivities: ActivityWithRelations[];
  pipelineByStage: PipelineStage[];
  clientBreakdown: ClientBreakdown[];
}

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  EMAIL_SENT: 'Email Sent',
  EMAIL_OPENED: 'Email Opened',
  EMAIL_REPLIED: 'Email Replied',
  LINKEDIN_TASK: 'LinkedIn Task',
  CALL: 'Call',
  MEETING: 'Meeting',
  DEAL_CREATED: 'Deal Created',
  STAGE_CHANGED: 'Stage Changed',
  NOTE: 'Note',
};

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  EMAIL_SENT: () => <span className="h-4 w-4">📧</span>,
  EMAIL_OPENED: () => <span className="h-4 w-4">📬</span>,
  EMAIL_REPLIED: () => <span className="h-4 w-4">↩️</span>,
  LINKEDIN_TASK: () => <span className="h-4 w-4">💼</span>,
  CALL: () => <span className="h-4 w-4">📞</span>,
  MEETING: () => <span className="h-4 w-4">📅</span>,
  DEAL_CREATED: () => <span className="h-4 w-4">➕</span>,
  STAGE_CHANGED: () => <span className="h-4 w-4">🔄</span>,
  NOTE: () => <span className="h-4 w-4">📝</span>,
};

export function DashboardClient({
  stats,
  recentDeals,
  upcomingMeetings,
  recentActivities,
  pipelineByStage,
  clientBreakdown,
}: DashboardClientProps) {
  const statCards = [
    {
      label: 'Active Clients',
      value: stats.activeClients,
      icon: Users,
      change: '+2 this month',
      changeType: 'positive' as const,
    },
    {
      label: 'Open Deals',
      value: stats.openDeals,
      icon: GitBranch,
      change: '+5 this quarter',
      changeType: 'positive' as const,
    },
    {
      label: 'Weighted Pipeline',
      value: formatCurrency(stats.pipelineValue),
      icon: DollarSign,
      change: '+12% vs last quarter',
      changeType: 'positive' as const,
    },
    {
      label: 'Won Revenue',
      value: formatCurrency(stats.wonRevenue),
      icon: TrendingUp,
      change: '+8% vs last quarter',
      changeType: 'positive' as const,
    },
    {
      label: 'Meetings',
      value: stats.meetings,
      icon: Calendar,
      change: '+3 this week',
      changeType: 'positive' as const,
    },
    {
      label: 'Active Prospects',
      value: stats.prospects,
      icon: Target,
      change: '+18 this week',
      changeType: 'positive' as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Revenue operations command center overview</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deal Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentDeals.length > 0 ? (
                  recentDeals.map((deal) => (
                    <div key={deal.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{deal.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {deal.client?.name} • {deal.company?.name || 'No Company'} • {formatRelativeTime(deal.updatedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {deal.stage}
                        </Badge>
                        <span className="text-sm font-medium text-right">
                          {formatCurrency(deal.value * (deal.probability / 100))}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No open deals</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{meeting.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {meeting.client?.name} • {meeting.deal?.name || 'No Deal'} •{' '}
                            {new Date(meeting.startTime).toLocaleDateString()} at{' '}
                            {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {meeting.platform || 'TBD'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No upcoming meetings</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => {
                    const ActivityIcon = ACTIVITY_ICONS[activity.type] || (() => <span className="h-4 w-4">📋</span>);
                    const typeLabel = ACTIVITY_TYPE_LABELS[activity.type] || activity.type;
                    
                    return (
                      <div key={activity.id} className="p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ActivityIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{activity.subject || typeLabel}</p>
                          {activity.body && <p className="text-sm text-muted-foreground truncate">{activity.body}</p>}
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.client?.name}
                            {activity.deal && ` • ${activity.deal.name}`}
                            {activity.contact && ` • ${activity.contact.firstName} ${activity.contact.lastName}`}
                            {' '}• {formatRelativeTime(activity.createdAt)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {typeLabel}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No recent activity</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pipelineByStage.map(({ stage, totalValue, count }) => (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{stage}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(totalValue)}</p>
                      <p className="text-xs text-muted-foreground">{count} deals</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientBreakdown.map((client) => (
                <div key={client.name} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.openDealsCount} open deals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(client.pipelineValue)} pipeline</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(client.wonRevenue)} won</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GitBranch className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Create New Deal</p>
                    <p className="text-sm text-muted-foreground">Add a deal to the pipeline</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">Add Prospect</p>
                    <p className="text-sm text-muted-foreground">Enrich and add new prospects</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">Schedule Meeting</p>
                    <p className="text-sm text-muted-foreground">Book a meeting with a contact</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">New Client</p>
                    <p className="text-sm text-muted-foreground">Onboard a new client account</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}