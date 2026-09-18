'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Send, Clock, CheckCircle, XCircle, Loader2, Zap, Target, Mail, MessageSquare, Reply, Linkedin } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface Sequence {
  id: string;
  name: string;
  campaignId: string;
  client: string | null;
  type: string;
  status: string;
  steps: number;
  active: number;
  completed: number;
  replied: number;
}

interface ActivityFeedItem {
  id: string;
  type: string;
  prospect: string;
  subject: string;
  time: Date | string;
  status: string;
  client: string | null;
}

interface Metrics {
  totalProspects: number;
  prospectsInCampaigns: number;
  newProspects: number;
  contactedProspects: number;
  engagedProspects: number;
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  linkedInTasks: number;
}

interface CampaignWithRelations {
  id: string;
  name: string;
  type: string;
  status: string;
  metadata: string | null;
  client: { name: string } | null;
  prospects: Array<{ id: string }>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ProspectWithRelations {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  title: string | null;
  company: string | null;
  linkedin: string | null;
  source: string | null;
  status: string;
  score: number;
  client: { name: string } | null;
  campaign: { name: string } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ClientBasic {
  id: string;
  name: string;
}

interface OutboundClientProps {
  sequences: Sequence[];
  activityFeed: ActivityFeedItem[];
  metrics: Metrics;
  campaigns: CampaignWithRelations[];
  prospects: ProspectWithRelations[];
  clients: ClientBasic[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'EMAIL_SENT':
      return <Send className="h-5 w-5 text-blue-500" />;
    case 'EMAIL_OPENED':
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    case 'EMAIL_REPLIED':
      return <Zap className="h-5 w-5 text-amber-500" />;
    case 'LINKEDIN_TASK':
      return <Linkedin className="h-5 w-5 text-purple-500" />;
    case 'CALL':
      return <Clock className="h-5 w-5 text-orange-500" />;
    default:
      return <Target className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
  switch (status) {
    case 'REPLIED':
      return 'success';
    case 'OPENED':
      return 'default';
    case 'SENT':
      return 'secondary';
    case 'PENDING':
      return 'outline';
    case 'COMPLETED':
      return 'success';
    default:
      return 'outline';
  }
};

const getSequenceStatusVariant = (status: string): 'success' | 'secondary' => {
  return status === 'ACTIVE' ? 'success' : 'secondary';
};

export function OutboundClient({ sequences, activityFeed, metrics, campaigns, prospects, clients }: OutboundClientProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Outbound</h1>
            <p className="text-muted-foreground mt-1">Manage outbound sequences and campaigns</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Enroll Prospects
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prospects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.totalProspects}</div>
              <p className="text-xs text-muted-foreground">{metrics.prospectsInCampaigns} in campaigns</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Prospects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.newProspects}</div>
              <p className="text-xs text-muted-foreground">Awaiting outreach</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.contactedProspects}</div>
              <p className="text-xs text-muted-foreground">In outreach</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engaged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.engagedProspects}</div>
              <p className="text-xs text-muted-foreground">Positive response</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sequences" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sequences">Sequences</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="sequences">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sequences.map((seq) => (
                <Card key={seq.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{seq.name}</CardTitle>
                      <Badge variant={getSequenceStatusVariant(seq.status)}>
                        {seq.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{seq.steps}</p>
                        <p className="text-xs text-muted-foreground">Steps</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{seq.active}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{seq.completed}</p>
                        <p className="text-xs text-muted-foreground">Contacted</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-500">{seq.replied}</p>
                        <p className="text-xs text-muted-foreground">Engaged</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground flex-1 text-center">
                        Client: {seq.client || '—'} • Type: {seq.type}
                      </span>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Clock className="h-3 w-3 mr-1" />
                        View Steps
                      </Button>
                      <Button variant={seq.status === "ACTIVE" ? "outline" : "default"} size="sm" className="flex-1">
                        {seq.status === "ACTIVE" ? (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {sequences.length === 0 && (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No campaigns created yet. Create a campaign to start outbound sequences.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Outbound Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {activityFeed.length > 0 ? (
                    activityFeed.map((act) => (
                      <div key={act.id} className="p-4 flex items-center gap-4 hover:bg-muted/50">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          {getActivityIcon(act.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{act.prospect}</p>
                          <p className="text-sm text-muted-foreground">{act.subject}</p>
                        </div>
                        {act.client && (
                          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                            {act.client}
                          </span>
                        )}
                        <Badge
                          variant={getStatusBadgeVariant(act.status)}
                          className="text-xs"
                        >
                          {act.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground w-24 text-right">
                          {formatRelativeTime(act.time)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No outbound activity recorded yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prospects">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Prospects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.totalProspects}</div>
                  <p className="text-xs text-muted-foreground">{metrics.prospectsInCampaigns} in campaigns</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.emailsSent}</div>
                  <p className="text-xs text-muted-foreground">Outbound emails</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emails Opened</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.emailsOpened}</div>
                  <p className="text-xs text-muted-foreground">Open rate: {metrics.emailsSent > 0 ? Math.round((metrics.emailsOpened / metrics.emailsSent) * 100) : 0}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Replies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-500">{metrics.emailsReplied}</div>
                  <p className="text-xs text-muted-foreground">Reply rate: {metrics.emailsSent > 0 ? Math.round((metrics.emailsReplied / metrics.emailsSent) * 100) : 0}%</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prospect Funnel</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { label: 'New', count: metrics.newProspects, color: 'text-slate-400' },
                    { label: 'Enriched', count: prospects.filter(p => p.status === 'ENRICHED').length, color: 'text-blue-400' },
                    { label: 'Qualified', count: prospects.filter(p => p.status === 'QUALIFIED').length, color: 'text-indigo-400' },
                    { label: 'Contacted', count: metrics.contactedProspects, color: 'text-amber-400' },
                    { label: 'Engaged', count: metrics.engagedProspects, color: 'text-emerald-400' },
                    { label: 'Converted', count: prospects.filter(p => p.status === 'CONVERTED').length, color: 'text-purple-400' },
                  ].map((stage) => (
                    <div key={stage.label} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stage.label}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded" 
                            style={{ width: `${metrics.totalProspects > 0 ? (stage.count / metrics.totalProspects) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-right w-16" style={{ color: stage.color }}>
                          {stage.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Email Templates</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Template management coming soon. Templates are managed per campaign in the actual workflow.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}