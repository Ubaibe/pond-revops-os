'use client';

import * as React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, User, Mail, Phone, Target, Calendar, Clock, TrendingUp, FileText, Linkedin, Phone as PhoneIcon, ChevronRight, BarChart3 } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { parseMeetingMetadata } from '@/lib/meeting-utils';

interface ProspectDetail {
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
  metadata: string | null;
  clientId: string;
  client: { name: string; id: string } | null;
  campaign: { id: string; name: string; type: string; status: string } | null;
  companyRecord: { id: string; name: string; domain: string | null; industry: string | null } | null;
  convertedDeal: { id: string; name: string; value: number; stage: string } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ActivityWithRelations {
  id: string;
  type: string;
  subject: string | null;
  body: string | null;
  metadata: string | null;
  createdAt: Date | string;
  deal: { id: string; name: string; value: number; stage: string } | null;
  meeting: { id: string; title: string; metadata: string | null } | null;
  contact: { id: string; firstName: string; lastName: string; email: string | null } | null;
}

interface ProspectDetailClientProps {
  prospect: ProspectDetail;
  activities: ActivityWithRelations[];
  clientId?: string;
}

const getProspectStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    NEW: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    ENRICHED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    QUALIFIED: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    CONTACTED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    ENGAGED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    CONVERTED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    DISQUALIFIED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[status] || colors.NEW;
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
  const Icon = icons[type] || (() => <span className="h-4 w-4">📋</span>);
  return Icon;
};

export function ProspectDetailClient({ prospect, activities, clientId }: ProspectDetailClientProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-slate-400';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={clientId ? `/prospects?clientId=${clientId}` : '/prospects'}>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {prospect.firstName} {prospect.lastName}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <Badge variant="outline" className={getProspectStatusColor(prospect.status) + ' px-2 py-1 text-xs'}>
                  {prospect.status}
                </Badge>
                {prospect.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {prospect.email}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {prospect.convertedDeal && (
              <Link href={`/deals/${prospect.convertedDeal.id}`}>
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Deal
                </Button>
              </Link>
            )}
            <Link href="/prospects">
              <Button variant="ghost" className="gap-2">
                <Target className="h-4 w-4" />
                All Prospects
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Prospect Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(prospect.score)}`}>{prospect.score}/100</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="text-lg font-medium">{prospect.source || '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Activities</p>
              <p className="text-2xl font-bold">{activities.length}</p>
            </CardContent>
          </Card>
          {prospect.convertedDeal && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Converted Deal Value</p>
                <p className="text-2xl font-bold">{prospect.convertedDeal.value > 0 ? `$${prospect.convertedDeal.value.toLocaleString()}` : '—'}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Prospect Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-medium">{prospect.title || '—'}</p>
                  </div>
                </div>
                {prospect.company && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{prospect.company}</p>
                    </div>
                  </div>
                )}
                {prospect.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{prospect.phone}</p>
                    </div>
                  </div>
                )}
                {prospect.linkedin && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">LinkedIn</p>
                      <p className="font-medium">{prospect.linkedin}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(prospect.createdAt)}</p>
                  </div>
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
                    <p className="font-medium">
                      {prospect.client ? (
                        <Link href={`/clients/${prospect.client.id}`} className="hover:underline">
                          {prospect.client.name}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </p>
                  </div>
                </div>
                {prospect.campaign && (
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Campaign</p>
                      <p className="font-medium">{prospect.campaign.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {prospect.campaign.type} • {prospect.campaign.status}
                      </p>
                    </div>
                  </div>
                )}
                {prospect.companyRecord && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company Record</p>
                      <p className="font-medium">{prospect.companyRecord.name}</p>
                      {prospect.companyRecord.industry && (
                        <p className="text-xs text-muted-foreground">{prospect.companyRecord.industry}</p>
                      )}
                    </div>
                  </div>
                )}
                {prospect.convertedDeal && (
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Converted Deal</p>
                      <Link href={`/deals/${prospect.convertedDeal.id}`} className="font-medium hover:underline">
                        {prospect.convertedDeal.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {prospect.convertedDeal.stage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline ({activities.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {activities.length > 0 ? (
              <div className="divide-y">
                {activities.map((activity) => {
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
                            <Link href={`/deals/${activity.deal.id}`} className="hover:underline">
                              Deal: {activity.deal.name}
                            </Link>
                          )}
                          {activity.meeting && (
                            <Link href={`/meetings?clientId=${prospect.clientId}`} className="hover:underline">
                              Meeting: {activity.meeting.title}
                            </Link>
                          )}
                          {activity.contact && (
                            <span>Contact: {activity.contact.firstName} {activity.contact.lastName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No activities recorded for this prospect
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
