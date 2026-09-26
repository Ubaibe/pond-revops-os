'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface ActivityWithRelations {
  id: string;
  type: string;
  subject: string | null;
  body: string | null;
  createdAt: Date | string;
  client: { name: string; id: string } | null;
  deal: { name: string; id: string } | null;
  contact: { firstName: string; lastName: string } | null;
}

interface ClientOption {
  id: string;
  name: string;
}

interface ActivitiesClientProps {
  activities: ActivityWithRelations[];
  selectedClient: ClientOption | null;
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

export function ActivitiesClient({ activities, selectedClient }: ActivitiesClientProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {selectedClient ? (
                <span className="flex items-center gap-2">
                  Activities
                  <span className="text-muted-foreground font-normal">/</span>
                  <span className="font-normal">{selectedClient.name}</span>
                </span>
              ) : (
                'Activities'
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {selectedClient ? `Activities for ${selectedClient.name}` : 'All recorded activities'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity Feed ({activities.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {activities.length > 0 ? (
                activities.map((activity) => {
                  const ActivityIcon = ACTIVITY_ICONS[activity.type] || (() => <span className="h-4 w-4">📋</span>);
                  const typeLabel = ACTIVITY_TYPE_LABELS[activity.type] || activity.type;

                  return (
                    <div key={activity.id} className="p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ActivityIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{activity.subject || typeLabel}</p>
                        {activity.body && <p className="text-sm text-muted-foreground truncate mt-1">{activity.body}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.client && (
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {activity.client.name}
                            </span>
                          )}
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
                <div className="p-8 text-center text-muted-foreground">No activities found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
