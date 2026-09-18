import { prisma } from '@/lib/prisma';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const [
    deals,
    meetings,
    prospects,
    activities,
    clients,
  ] = await Promise.all([
    prisma.deal.findMany({
      include: { client: true, company: true, contact: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.meeting.findMany({
      include: { client: true, deal: true, contact: true },
      orderBy: { startTime: 'desc' },
    }),
    prisma.prospect.findMany({
      include: { client: true, campaign: true },
    }),
    prisma.activity.findMany({
      include: { client: true, deal: true, contact: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.client.findMany({
      include: {
        deals: true,
        prospects: true,
      },
    }),
  ]);

  const openDeals = deals.filter(d => d.stage !== 'WON' && d.stage !== 'LOST');
  const wonDeals = deals.filter(d => d.stage === 'WON');
  const notLostDeals = deals.filter(d => d.stage !== 'LOST');

  const totalPipeline = notLostDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipeline = notLostDeals.reduce((sum, d) => sum + d.value * (d.probability / 100), 0);
  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const openDealsCount = openDeals.length;
  const meetingsCount = meetings.length;
  const prospectsCount = prospects.length;

  const recentDeals = openDeals
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const upcomingMeetings = meetings
    .filter(m => new Date(m.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  const recentActivities = activities.slice(0, 10);

  const pipelineByStage = ['LEAD', 'QUALIFIED', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION'].map(stage => {
    const stageDeals = deals.filter(d => d.stage === stage);
    const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return { stage, totalValue, count: stageDeals.length };
  });

  const clientBreakdown = clients.map(client => {
    const clientDeals = deals.filter(d => d.clientId === client.id);
    const clientOpenDeals = clientDeals.filter(d => d.stage !== 'WON' && d.stage !== 'LOST');
    const clientWonDeals = clientDeals.filter(d => d.stage === 'WON');
    const clientNotLostDeals = clientDeals.filter(d => d.stage !== 'LOST');

    return {
      name: client.name,
      pipelineValue: clientNotLostDeals.reduce((sum, d) => sum + d.value, 0),
      openDealsCount: clientOpenDeals.length,
      wonRevenue: clientWonDeals.reduce((sum, d) => sum + d.value, 0),
    };
  });

  return (
    <DashboardClient
      stats={{
        activeClients: clients.filter(c => c.status === 'ACTIVE').length,
        openDeals: openDealsCount,
        pipelineValue: weightedPipeline,
        wonRevenue,
        meetings: meetingsCount,
        prospects: prospectsCount,
      }}
      recentDeals={recentDeals}
      upcomingMeetings={upcomingMeetings}
      recentActivities={recentActivities}
      pipelineByStage={pipelineByStage}
      clientBreakdown={clientBreakdown}
    />
  );
}