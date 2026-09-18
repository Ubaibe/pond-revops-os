import { prisma } from '@/lib/prisma';
import { ClientsClient } from './clients-client';

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      companies: true,
      contacts: true,
      deals: true,
      meetings: true,
      prospects: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const clientsWithMetrics = clients.map(client => {
    const openDeals = client.deals.filter(d => d.stage !== 'WON' && d.stage !== 'LOST');
    const wonDeals = client.deals.filter(d => d.stage === 'WON');
    const notLostDeals = client.deals.filter(d => d.stage !== 'LOST');

    return {
      id: client.id,
      name: client.name,
      domain: client.domain,
      logo: client.logo,
      status: client.status,
      metadata: client.metadata,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      companiesCount: client.companies.length,
      contactsCount: client.contacts.length,
      dealsCount: client.deals.length,
      openDealsCount: openDeals.length,
      pipelineValue: notLostDeals.reduce((sum, d) => sum + d.value, 0),
      wonRevenue: wonDeals.reduce((sum, d) => sum + d.value, 0),
      meetingsCount: client.meetings.length,
      prospectsCount: client.prospects.length,
    };
  });

  return <ClientsClient initialClients={clientsWithMetrics} />;
}