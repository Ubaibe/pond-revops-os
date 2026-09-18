'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Filter, Calendar, Video, MoreHorizontal, ChevronLeft, ChevronRight, Building2, Target, Users, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { getSentimentColor } from '@/lib/meeting-utils';

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
  client: { name: string; id: string } | null;
  deal: { id: string; name: string } | null;
  contact: { firstName: string; lastName: string } | null;
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

interface MeetingsClientProps {
  initialMeetings: MeetingWithIntelligence[];
}

export function MeetingsClient({ initialMeetings }: MeetingsClientProps) {
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const [view, setView] = React.useState<'list' | 'week'>('list');

  const weekStart = new Date(currentWeek);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    return day;
  });

  const getMeetingsForDay = (day: Date) => {
    return initialMeetings.filter(m =>
      new Date(m.startTime).toDateString() === day.toDateString()
    );
  };

  const upcomingMeetings = initialMeetings
    .filter(m => new Date(m.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const pastMeetings = initialMeetings
    .filter(m => new Date(m.startTime) <= new Date())
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
            <p className="text-muted-foreground mt-1">Schedule and manage meetings</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setCurrentWeek(new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-4 text-sm font-medium">
              {weekStart.toLocaleDateString([], { month: 'short', day: 'numeric' })} - {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <Button variant="outline" onClick={() => setCurrentWeek(new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentWeek(new Date())}>
              Today
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {view === 'week' ? (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <Card key={day.toISOString()} className="min-h-[400px]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{day.toLocaleDateString([], { weekday: 'short' })}</p>
                      <p className="font-medium">{day.toLocaleDateString([], { day: 'numeric' })}</p>
                    </div>
                    {day.toDateString() === new Date().toDateString() && (
                      <Badge variant="default" className="text-xs">Today</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-2 space-y-2 max-h-[350px] overflow-y-auto">
                    {getMeetingsForDay(day).map((meeting) => (
                      <div key={meeting.id} className="p-2 border rounded bg-background hover:bg-muted/50">
                        <p className="text-xs font-medium truncate">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <Badge variant="outline" className="text-[10px] mt-1">{meeting.platform || 'TBD'}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Meetings ({upcomingMeetings.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Meeting</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Deal</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingMeetings.map((meeting) => (
                        <TableRow key={meeting.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{meeting.title}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                {meeting.intelligence.type && (
                                  <Badge variant="outline" className="text-xs">
                                    {meeting.intelligence.type}
                                  </Badge>
                                )}
                                {meeting.client && (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {meeting.client.name}
                                  </span>
                                )}
                                {meeting.contact && (
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {meeting.contact.firstName} {meeting.contact.lastName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(meeting.startTime)} at {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{meeting.platform || 'TBD'}</Badge>
                          </TableCell>
                          <TableCell>
                            {meeting.deal ? (
                              <Link href={`/deals/${meeting.deal.id}`} className="text-sm hover:text-primary transition-colors">
                                {meeting.deal.name}
                              </Link>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Past Meetings ({pastMeetings.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Meeting</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Recording</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastMeetings.slice(0, 10).map((meeting) => (
                        <TableRow key={meeting.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{meeting.title}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                {meeting.intelligence.type && (
                                  <Badge variant="outline" className="text-xs">
                                    {meeting.intelligence.type}
                                  </Badge>
                                )}
                                {meeting.intelligence.source && (
                                  <Badge variant="secondary" className="text-xs">
                                    {meeting.intelligence.source}
                                  </Badge>
                                )}
                                {meeting.intelligence.sentiment && (
                                  <Badge variant="outline" className={getSentimentColor(meeting.intelligence.sentiment) + ' text-xs'}>
                                    {meeting.intelligence.sentiment.charAt(0).toUpperCase() + meeting.intelligence.sentiment.slice(1)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatRelativeTime(meeting.startTime)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{meeting.platform || 'TBD'}</Badge>
                          </TableCell>
                          <TableCell>
                            {meeting.recordingUrl ? (
                              <Button variant="ghost" size="sm">
                                <Video className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">No recording</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}