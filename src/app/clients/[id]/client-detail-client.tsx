'use client';

import * as React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Building2, User, Mail, Phone, DollarSign, Target, Calendar, Clock, AlertCircle, CheckCircle, MinusCircle, TrendingUp, FileText, MessageSquare, Linkedin, Phone as PhoneIcon, ChevronRight, Users, Handshake, Activity, Briefcase, GitBranch, BarChart3 } from 'lucide-react';
import { formatCurrency, formatRelativeTime, formatDate, cn } from '@/lib/utils';
import { parseMeetingMetadata, MeetingMetadata, getSentimentColor } from '@/lib/meeting-utils';

interface ClientWithRelations {
  id: string;
  name: string;
  domain: string | null;
  logo: string | null;
  status: string;
  metadata: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  companies: Array<{ id: string; name: string; domain: string | null; size: string | null; industry: string | null }>;
  contacts: Array<{ id: string; firstName: string; lastName: string; email: string | null; phone: string | null; title: string | null }>;
  deals: Array<{
    id: string;
    name: string;
    value: number;
    stage: string;
    probability: number;
    expectedClose: Date | string | null;
    company: { name: string } | null;
    contact: { firstName: string; lastName: string; email: string | null } | null;
  }>;
  meetings: Array<{
    id: string;
    title: string;
    startTime: Date | string;
    endTime: Date | string | null;
    platform: string | null;
    meetingUrl: string | null;
    recordingUrl: string | null;
    notes: string | null;
    metadata: string | null;
    deal: { id: string; name: string } | null;
    contact: { firstName: string; lastName: string } | null;
  }>;
  activities: Array<{
    id: string;
    type: string;
    subject: string | null;
    body: string | null;
    metadata: string | null;
    createdAt: Date | string;
    deal: { id: string; name: string } | null;
    contact: { firstName: string; lastName: string } | null;
  }>;
  prospects: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    title: string | null;
    company: string | null;
    source: string | null;
    status: string;
    score: number;
    companyRecord: { name: string } | null;
  }>;
}

interface MeetingWithIntelligence {
  id: string;
  title: string;
  startTime: Date | string;
  endTime: Date | string | null;
  platform: string | null;
  meetingUrl: string | null;
  recordingUrl: string | null;
  notes: string | null;
  metadata: string | null;
  deal: { id: string; name: string } | null;
  contact: { firstName: string; lastName: string } | null;
  intelligence: MeetingMetadata;
}

interface ClientDetailClientProps {
  client: ClientWithRelations;
  meetingsWithIntelligence: MeetingWithIntelligence[];
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

const getActivityTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
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
  return labels[type] || type;
};

const getActivityTypeIcon = (type: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    EMAIL_SENT: MessageSquare,
    EMAIL_OPENED: MessageSquare,
    EMAIL_REPLIED: MessageSquare,
    LINKEDIN_TASK: Linkedin,
    CALL: PhoneIcon,
    MEETING: Calendar,
    DEAL_CREATED: TrendingUp,
    STAGE_CHANGED: Target,
    NOTE: FileText,
  };
  return icons[type] || FileText;
};

const getProspectStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    NEW: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    CONTACTED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    QUALIFIED: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    CONVERTED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    UNQUALIFIED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[status] || colors.NEW;
};

export function ClientDetailClient({ client, meetingsWithIntelligence }: ClientDetailClientProps) {
  const notLostDeals = client.deals.filter(d => d.stage !== 'LOST');
  const openDeals = client.deals.filter(d => d.stage !== 'WON' && d.stage !== 'LOST');
  const wonDeals = client.deals.filter(d => d.stage === 'WON');

  const pipelineValue = notLostDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipeline = notLostDeals.reduce((sum, d) => sum + d.value * (d.probability / 100), 0);
  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const openDealsCount = openDeals.length;

  const recentActivities = client.activities.slice(0, 10);
  const recentMeetings = meetingsWithIntelligence.slice(0, 10);
  const recentProspects = client.prospects.slice(0, 10);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/clients">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <Badge variant={client.status === 'ACTIVE' ? 'success' : 'secondary'}>{client.status}</Badge>
                {client.domain && <span>{client.domain}</span>}
              </div>
            </div>
          </div>
          <Link href={`/pipeline?clientId=${client.id}`}>
            <Button variant="outline" className="gap-2">
              <GitBranch className="h-4 w-4" />
              View Pipeline
            </Button>
          </Link>
          <Link href={`/reports?clientId=${client.id}`}>
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              View Reports
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pipeline Value</p>
              <p className="text-2xl font-bold">{formatCurrency(pipelineValue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Weighted Pipeline</p>
              <p className="text-2xl font-bold">{formatCurrency(weightedPipeline)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Won Revenue</p>
              <p className="text-2xl font-bold text-emerald-500">{formatCurrency(wonRevenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Open Deals</p>
              <p className="text-2xl font-bold">{openDealsCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Meetings</p>
              <p className="text-2xl font-bold">{client.meetings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Prospects</p>
              <p className="text-2xl font-bold">{client.prospects.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Activities</p>
              <p className="text-2xl font-bold">{client.activities.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Client Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Companies</p>
                        <p className="font-medium">{client.companies.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Contacts</p>
                        <p className="font-medium">{client.contacts.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Handshake className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Deals</p>
                        <p className="font-medium">{client.deals.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Activities</p>
                        <p className="font-medium">{client.activities.length}</p>
                      </div>
                    </div>
                  </div>
                  {client.metadata && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Metadata</h4>
                      <pre className="text-sm text-muted-foreground p-4 bg-muted rounded overflow-x-auto">
                        {client.metadata}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {recentActivities.length > 0 ? (
                    <div className="divide-y">
                      {recentActivities.map((activity) => {
                        const ActivityIcon = getActivityTypeIcon(activity.type);
                        const typeLabel = getActivityTypeLabel(activity.type);
                        return (
                          <div key={activity.id} className="p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <ActivityIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{activity.subject || typeLabel}</p>
                                <Badge variant="outline" className="text-xs">{typeLabel}</Badge>
                              </div>
                              {activity.body && <p className="text-sm text-muted-foreground mt-1">{activity.body}</p>}
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span>{formatRelativeTime(activity.createdAt)}</span>
                                {activity.deal && (
                                  <>
                                    <span>•</span>
                                    <Link href={`/deals/${activity.deal.id}`} className="hover:underline">
                                      {activity.deal.name}
                                    </Link>
                                  </>
                                )}
                                {activity.contact && (
                                  <>
                                    <span>•</span>
                                    <span>{activity.contact.firstName} {activity.contact.lastName}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">No activity recorded for this client</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deals" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Client Deals ({client.deals.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {client.deals.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deal</TableHead>
                        <TableHead className="hidden md:table-cell">Company</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">Value</TableHead>
                        <TableHead className="hidden lg:table-cell">Probability</TableHead>
                        <TableHead className="text-right hidden lg:table-cell">Expected Close</TableHead>
                        <TableHead>Stage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {client.deals.map((deal) => (
                        <TableRow key={deal.id}>
                          <TableCell>
                            <Link href={`/deals/${deal.id}`} className="font-medium hover:underline">
                              {deal.name}
                            </Link>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{deal.company?.name || '—'}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : '—'}
                          </TableCell>
                          <TableCell className="text-right font-medium hidden sm:table-cell">{formatCurrency(deal.value)}</TableCell>
                          <TableCell className="hidden lg:table-cell">{deal.probability}%</TableCell>
                          <TableCell className="text-right text-muted-foreground hidden lg:table-cell">
                            {deal.expectedClose ? formatDate(deal.expectedClose) : '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getDealStageColor(deal.stage) + ' px-2 py-1 text-xs'}>
                              {deal.stage}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">No deals for this client</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Meetings ({meetingsWithIntelligence.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {meetingsWithIntelligence.length > 0 ? (
                  <div className="divide-y">
                    {meetingsWithIntelligence.map((meeting) => {
                      const intel = meeting.intelligence;
                      const hasIntel = intel.summary || intel.painPoints?.length || intel.actionItems?.length || intel.nextStep || intel.topics?.length;
                      return (
                        <div key={meeting.id} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{meeting.title}</p>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                  <span>{intel.type || 'Meeting'}</span>
                                  <span>•</span>
                                  <span>{formatDate(meeting.startTime)}</span>
                                  {meeting.platform && (
                                    <>
                                      <span>•</span>
                                      <span>{meeting.platform}</span>
                                    </>
                                  )}
                                  {intel.source && (
                                    <>
                                      <span>•</span>
                                      <span className="px-2 py-0.5 bg-muted rounded text-xs">{intel.source}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {intel.sentiment && (
                                <Badge variant="outline" className={cn('px-2 py-1 text-xs', getSentimentColor(intel.sentiment))}>
                                  {intel.sentiment.charAt(0).toUpperCase() + intel.sentiment.slice(1)}
                                </Badge>
                              )}
                              {meeting.deal && (
                                <Link href={`/deals/${meeting.deal.id}`} className="text-sm font-medium text-primary hover:underline">
                                  {meeting.deal.name}
                                </Link>
                              )}
                            </div>
                          </div>
                          {hasIntel && (
                            <div className="mt-3 ml-13 space-y-3 border-l-2 border-muted pl-3">
                              {intel.summary && (
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Summary</h4>
                                  <p className="text-sm leading-relaxed">{intel.summary}</p>
                                </div>
                              )}
                              {intel.painPoints && intel.painPoints.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-red-500 mb-1 flex items-center gap-2">
                                    <AlertCircle className="h-3 w-3" />
                                    Pain Points
                                  </h4>
                                  <ul className="space-y-1 text-sm">
                                    {intel.painPoints.map((point, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {intel.actionItems && intel.actionItems.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-emerald-500 mb-1 flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3" />
                                    Action Items
                                  </h4>
                                  <ul className="space-y-1 text-sm">
                                    {intel.actionItems.map((item, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {intel.nextStep && (
                                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                  <h4 className="text-sm font-medium text-primary mb-1 flex items-center gap-2">
                                    <ChevronRight className="h-3 w-3" />
                                    Next Step
                                  </h4>
                                  <p className="text-sm font-medium">{intel.nextStep}</p>
                                </div>
                              )}
                              {intel.topics && intel.topics.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Topics</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {intel.topics.map((topic, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">No meetings recorded for this client</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prospects" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Prospects ({client.prospects.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {client.prospects.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prospect</TableHead>
                        <TableHead className="hidden md:table-cell">Company</TableHead>
                        <TableHead className="hidden md:table-cell">Title</TableHead>
                        <TableHead className="hidden lg:table-cell">Source</TableHead>
                        <TableHead className="hidden lg:table-cell">Status</TableHead>
                        <TableHead className="text-right hidden lg:table-cell">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {client.prospects.map((prospect) => (
                        <TableRow key={prospect.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{prospect.firstName} {prospect.lastName}</p>
                              <p className="text-sm text-muted-foreground">{prospect.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {prospect.companyRecord?.name || prospect.company || '—'}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{prospect.title || '—'}</TableCell>
                          <TableCell className="hidden lg:table-cell">{prospect.source || '—'}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className={getProspectStatusColor(prospect.status) + ' px-2 py-1 text-xs'}>
                              {prospect.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground hidden lg:table-cell">{prospect.score}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">No prospects for this client</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}