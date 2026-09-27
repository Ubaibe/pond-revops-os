import { prisma } from '@/lib/prisma';
import { MeetingsClient } from './meetings-client';
import { parseMeetingMetadata } from '@/lib/meeting-utils';

interface MeetingsPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function MeetingsPage({ searchParams }: MeetingsPageProps) {
  const { clientId } = await searchParams;

  const [meetings, selectedClient] = await Promise.all([
    prisma.meeting.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: true,
        deal: true,
        contact: true,
      },
      orderBy: { startTime: 'desc' },
    }),
    clientId ? prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, name: true },
    }) : null,
  ]);

  const meetingsWithIntelligence = meetings.map(meeting => ({
    ...meeting,
    intelligence: parseMeetingMetadata(meeting.metadata),
  }));

  return <MeetingsClient initialMeetings={meetingsWithIntelligence} selectedClient={selectedClient} />;
}