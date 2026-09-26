import { prisma } from '@/lib/prisma';
import { MeetingsClient } from './meetings-client';
import { parseMeetingMetadata } from '@/lib/meeting-utils';

interface MeetingsPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function MeetingsPage({ searchParams }: MeetingsPageProps) {
  const { clientId } = await searchParams;

  const meetings = await prisma.meeting.findMany({
    where: clientId ? { clientId } : undefined,
    include: {
      client: true,
      deal: true,
      contact: true,
    },
    orderBy: { startTime: 'desc' },
  });

  const meetingsWithIntelligence = meetings.map(meeting => ({
    ...meeting,
    intelligence: parseMeetingMetadata(meeting.metadata),
  }));

  return <MeetingsClient initialMeetings={meetingsWithIntelligence} />;
}