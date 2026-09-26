import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ClientDetailClient } from './client-detail-client';
import { parseMeetingMetadata } from '@/lib/meeting-utils';

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      companies: true,
      contacts: true,
      deals: {
        include: {
          company: true,
          contact: true,
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          meetings: {
            orderBy: { startTime: 'desc' },
            take: 5,
          },
        },
      },
      meetings: {
        include: {
          deal: true,
          contact: true,
        },
        orderBy: { startTime: 'desc' },
        take: 10,
      },
      activities: {
        include: {
          deal: true,
          contact: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      prospects: {
        include: {
          companyRecord: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!client) {
    notFound();
  }

  const meetingsWithIntelligence = client.meetings.map(meeting => ({
    ...meeting,
    intelligence: parseMeetingMetadata(meeting.metadata),
  }));

  return <ClientDetailClient client={client} meetingsWithIntelligence={meetingsWithIntelligence} />;
}