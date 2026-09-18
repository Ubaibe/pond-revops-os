import { prisma } from '@/lib/prisma';
import { ReportsClient } from './reports-client';
import { DEAL_STAGES } from '@/data/types';

export default async function ReportsPage() {
  const [deals, meetings, prospects, activities, clients] = await Promise.all([
    prisma.deal.findMany({
      include: { client: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.meeting.findMany(),
    prisma.prospect.findMany(),
    prisma.activity.findMany(),
    prisma.client.findMany({
      include: { deals: true, prospects: true, meetings: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const openDeals = deals.filter(d => d.stage !== 'WON' && d.stage !== 'LOST');
  const wonDeals = deals.filter(d => d.stage === 'WON');
  const notLostDeals = deals.filter(d => d.stage !== 'LOST');

  const totalPipeline = notLostDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipeline = notLostDeals.reduce((sum, d) => sum + d.value * (d.probability / 100), 0);
  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const openDealsCount = openDeals.length;
  const totalDealsCount = deals.length;
  const winRate = totalDealsCount > 0 ? Math.round((wonDeals.length / totalDealsCount) * 100) : 0;

  const stageData = DEAL_STAGES.map((stage, i) => {
    const stageDeals = deals.filter(d => d.stage === stage.value);
    return {
      name: stage.label,
      value: stageDeals.reduce((sum, d) => sum + d.value, 0),
      count: stageDeals.length,
      fill: ['#3b82f6', '#8b5cf6', '#6366f1', '#f59e0b', '#f97316', '#22c55e', '#ef4444'][i % 7],
    };
  });

  const activityData = [
    { type: 'EMAIL_SENT', label: 'Emails Sent', count: activities.filter(a => a.type === 'EMAIL_SENT').length },
    { type: 'EMAIL_OPENED', label: 'Emails Opened', count: activities.filter(a => a.type === 'EMAIL_OPENED').length },
    { type: 'EMAIL_REPLIED', label: 'Replies', count: activities.filter(a => a.type === 'EMAIL_REPLIED').length },
    { type: 'CALL', label: 'Calls Made', count: activities.filter(a => a.type === 'CALL').length },
    { type: 'MEETING', label: 'Meetings Booked', count: activities.filter(a => a.type === 'MEETING').length },
    { type: 'LINKEDIN_TASK', label: 'LinkedIn Tasks', count: activities.filter(a => a.type === 'LINKEDIN_TASK').length },
  ];

  const clientData = clients.map((client, i) => {
    const clientDeals = deals.filter(d => d.clientId === client.id);
    const clientOpenDeals = clientDeals.filter(d => d.stage !== 'WON' && d.stage !== 'LOST');
    const clientWonDeals = clientDeals.filter(d => d.stage === 'WON');
    const clientNotLostDeals = clientDeals.filter(d => d.stage !== 'LOST');

    return {
      name: client.name,
      openDeals: clientOpenDeals.length,
      pipelineValue: clientNotLostDeals.reduce((sum, d) => sum + d.value, 0),
      weightedPipeline: clientNotLostDeals.reduce((sum, d) => sum + d.value * (d.probability / 100), 0),
      wonRevenue: clientWonDeals.reduce((sum, d) => sum + d.value, 0),
      meetingsCount: client.meetings.length,
      prospectsCount: client.prospects.length,
      fill: ['#3b82f6', '#8b5cf6', '#6366f1'][i % 3],
    };
  });

  return <ReportsClient
    totalPipeline={totalPipeline}
    weightedPipeline={weightedPipeline}
    wonRevenue={wonRevenue}
    openDealsCount={openDealsCount}
    winRate={winRate}
    meetingsCount={meetings.length}
    prospectsCount={prospects.length}
    stageData={stageData}
    activityData={activityData}
    clientData={clientData}
  />;
}