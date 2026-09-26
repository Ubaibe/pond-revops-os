import { prisma } from '@/lib/prisma';
import { PipelineClient } from './pipeline-client';
import { DEAL_STAGES } from '@/data/types';

const stages = DEAL_STAGES.filter(s => s.value !== 'WON' && s.value !== 'LOST');

interface PipelinePageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function PipelinePage({ searchParams }: PipelinePageProps) {
  const { clientId } = await searchParams;
  
  const [clients, deals] = await Promise.all([
    prisma.client.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.deal.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: true,
        company: true,
        contact: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  const selectedClient = clients.find(c => c.id === clientId) || null;

  return <PipelineClient 
    initialDeals={deals} 
    stages={stages}
    clients={clients}
    selectedClient={selectedClient}
  />;
}