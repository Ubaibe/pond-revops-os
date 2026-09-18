import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DealDetailClient } from './deal-detail-client';
import { parseMeetingMetadata } from '@/lib/meeting-utils';

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
    },
  });

  if (!deal) {
    notFound();
  }

  const meetingsWithIntelligence = deal.meetings.map(meeting => ({
    ...meeting,
    intelligence: parseMeetingMetadata(meeting.metadata),
  }));

  return <DealDetailClient deal={deal} meetingsWithIntelligence={meetingsWithIntelligence} />;
}