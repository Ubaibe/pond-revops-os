import { prisma } from '@/lib/prisma';
import { ProspectsClient } from './prospects-client';

export default async function ProspectsPage() {
  const [prospects, campaigns, clients] = await Promise.all([
    prisma.prospect.findMany({
      include: {
        client: true,
        campaign: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.campaign.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.client.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return <ProspectsClient initialProspects={prospects} campaigns={campaigns} clients={clients} />;
}