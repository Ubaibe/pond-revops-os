'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Building2, User, Mail, Phone, DollarSign, Target, Calendar, Clock, AlertCircle, CheckCircle, MinusCircle, TrendingUp, FileText, MessageSquare, Linkedin, Phone as PhoneIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatRelativeTime, formatDate } from '@/lib/utils';

interface DealWithRelations {
  id: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
  expectedClose: Date | string | null;
  metadata: string | null;
  client: { name: string; id: string } | null;
  company: { name: string } | null;
  contact: { firstName: string; lastName: string; email: string | null; phone: string | null; title: string | null } | null;
  activities: Array<{
    id: string;
    type: string;
    subject: string | null;
    body: string | null;
    metadata: string | null;
    createdAt: Date | string;
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
    createdAt: Date | string;
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
  createdAt: Date | string;
  intelligence: {
    type?: string;
    source?: string;
    summary?: string;
    painPoints?: string[];
    actionItems?: string[];
    nextStep?: string;
    sentiment?: 'positive' | 'neutral' | 'concerned';
    topics?: string[];
  };
}

interface DealDetailClientProps {
  deal: DealWithRelations;
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

const getSentimentColor = (sentiment: string): string => {
  const colors: Record<string, string> = {
    positive: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    neutral: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    concerned: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[sentiment] || colors.neutral;
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

export function DealDetailClient({ deal, meetingsWithIntelligence }: DealDetailClientProps) {
  const isOpen = deal.stage !== 'WON' && deal.stage !== 'LOST';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/pipeline">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{deal.name}</h1>
              <p className="text-muted-foreground mt-1">{deal.client?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={getDealStageColor(deal.stage) + ' px-3 py-1 text-sm'}>
              {deal.stage}
            </Badge>
            {isOpen && (
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {deal.probability}% probability
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Deal Value</p>
                      <p className="text-2xl font-bold">{formatCurrency(deal.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Probability</p>
                      <p className="text-2xl font-bold">{deal.probability}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Weighted Value</p>
                      <p className="text-2xl font-bold">{formatCurrency(deal.value * (deal.probability / 100))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Close</p>
                      <p className="text-lg font-medium">
                        {deal.expectedClose ? formatDate(deal.expectedClose) : '—'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Relationships</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="font-medium">{deal.client?.name || '—'}</p>
                      </div>
                    </div>
                    {deal.company && (
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Company</p>
                          <p className="font-medium">{deal.company.name}</p>
                        </div>
                      </div>
                    )}
                    {deal.contact && (
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Primary Contact</p>
                          <p className="font-medium">{deal.contact.firstName} {deal.contact.lastName}</p>
                          <p className="text-sm text-muted-foreground">{deal.contact.title || '—'}</p>
                        </div>
                      </div>
                    )}
                    {deal.contact?.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{deal.contact.email}</p>
                        </div>
                      </div>
                    )}
                    {deal.contact?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{deal.contact.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {deal.metadata && (
              <Card>
                <CardHeader>
                  <CardTitle>Deal Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm text-muted-foreground p-4 bg-muted rounded overflow-x-auto">
                    {deal.metadata}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {deal.activities.length > 0 ? (
                  <div className="divide-y">
                    {deal.activities.map((activity) => {
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
                            <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(activity.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">No activity recorded for this deal</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            {meetingsWithIntelligence.length > 0 ? (
              meetingsWithIntelligence.map((meeting) => {
                const intel = meeting.intelligence;
                const hasIntel = intel.summary || intel.painPoints?.length || intel.actionItems?.length || intel.nextStep || intel.topics?.length;

                return (
                  <Card key={meeting.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{meeting.title}</p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                              <span>{meeting.intelligence.type || 'Meeting'}</span>
                              <span>•</span>
                              <span>{formatDate(meeting.startTime)} at {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span>•</span>
                              <span>{meeting.platform}</span>
                              {meeting.intelligence.source && (
                                <>
                                  <span>•</span>
                                  <span className="px-2 py-0.5 bg-muted rounded text-xs">{meeting.intelligence.source}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {intel.sentiment && (
                          <Badge variant="outline" className={getSentimentColor(intel.sentiment) + ' px-2 py-1 text-xs'}>
                            {intel.sentiment.charAt(0).toUpperCase() + intel.sentiment.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {intel.summary && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Summary</h4>
                          <p className="text-base leading-relaxed">{intel.summary}</p>
                        </div>
                      )}

                      {intel.painPoints && intel.painPoints.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            Pain Points
                          </h4>
                          <ul className="space-y-2">
                            {intel.painPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {intel.actionItems && intel.actionItems.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            Action Items
                          </h4>
                          <ul className="space-y-2">
                            {intel.actionItems.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {intel.nextStep && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                          <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                            <ChevronRight className="h-4 w-4" />
                            Next Step
                          </h4>
                          <p className="text-base font-medium">{intel.nextStep}</p>
                        </div>
                      )}

                      {intel.topics && intel.topics.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Topics</h4>
                          <div className="flex flex-wrap gap-2">
                            {intel.topics.map((topic, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {!hasIntel && (
                        <div className="text-center text-muted-foreground py-8">
                          No intelligence data available for this meeting.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No meetings recorded for this deal.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}