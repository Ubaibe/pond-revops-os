import { prisma } from '@/lib/prisma';
import { ProspectsClient } from './prospects-client';

interface ProspectsPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function ProspectsPage({ searchParams }: ProspectsPageProps) {
  const { clientId } = await searchParams;

  const [prospects, campaigns, clients] = await Promise.all([
    prisma.prospect.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: true,
        campaign: true,
        companyRecord: true,
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

  return <ProspectsClient initialProspects={prospects} campaigns={campaigns} clients={clients} selectedClientId={clientId || undefined} />;
}