import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProspectDetailClient } from './prospect-detail-client';

interface ProspectDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ clientId?: string }>;
}

export default async function ProspectDetailPage({ params, searchParams }: ProspectDetailPageProps) {
  const { id } = await params;
  const { clientId } = await searchParams;

  const prospect = await prisma.prospect.findUnique({
    where: { id },
    include: {
      client: true,
      campaign: true,
      companyRecord: true,
      convertedDeal: true,
    },
  });

  if (!prospect) {
    notFound();
  }

  const activities = await prisma.activity.findMany({
    where: { prospectId: id },
    include: {
      deal: true,
      meeting: {
        select: {
          id: true,
          title: true,
          metadata: true,
        },
      },
      contact: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <ProspectDetailClient
      prospect={prospect}
      activities={activities}
      clientId={clientId}
    />
  );
}
