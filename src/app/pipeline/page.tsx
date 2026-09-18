import { prisma } from '@/lib/prisma';
import { PipelineClient } from './pipeline-client';
import { DEAL_STAGES } from '@/data/types';

const stages = DEAL_STAGES.filter(s => s.value !== 'WON' && s.value !== 'LOST');

export default async function PipelinePage() {
  const deals = await prisma.deal.findMany({
    include: {
      client: true,
      company: true,
      contact: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  return <PipelineClient initialDeals={deals} stages={stages} />;
}