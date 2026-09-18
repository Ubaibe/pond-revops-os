import { prisma } from '@/lib/prisma';
import { MeetingsClient } from './meetings-client';
import { parseMeetingMetadata } from '@/lib/meeting-utils';

export default async function MeetingsPage() {
  const meetings = await prisma.meeting.findMany({
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