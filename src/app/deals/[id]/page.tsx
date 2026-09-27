import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DealDetailClient } from './deal-detail-client';
import { parseMeetingMetadata } from '@/lib/meeting-utils';

interface DealDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ clientId?: string }>;
}

export default async function DealDetailPage({ params, searchParams }: DealDetailPageProps) {
  const { id } = await params;
  const { clientId } = await searchParams;

  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      client: true,
      company: true,
      contact: true,
      activities: {
        orderBy: { createdAt: 'desc' },
      },
      meetings: {
        orderBy: { startTime: 'desc' },
      },
      convertedProspects: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          company: true,
          status: true,
        },
      },
    },
  });

  if (!deal) {
    notFound();
  }

  const meetingsWithIntelligence = deal.meetings.map(meeting => ({
    ...meeting,
    intelligence: parseMeetingMetadata(meeting.metadata),
  }));

  return <DealDetailClient deal={deal} meetingsWithIntelligence={meetingsWithIntelligence} clientId={clientId} />;
}