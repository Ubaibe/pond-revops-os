export interface MeetingNotes {
  id: string;
  meetingId: string;
  summary: string;
  actionItems: Array<{ description: string; assignee?: string; dueDate?: Date }>;
  keyPoints: string[];
  transcript?: string;
}

export interface GranolaAdapter {
  getMeeting: (meetingId: string) => Promise<{ id: string; title: string; startTime: Date; endTime?: Date; platform?: string; url?: string } | null>;
  getMeetingNotes: (meetingId: string) => Promise<MeetingNotes | null>;
  attachMeetingToDeal: (meetingId: string, dealId: string) => Promise<void>;
  listMeetings: (params?: { from?: Date; to?: Date; limit?: number }) => Promise<Array<{ id: string; title: string; startTime: Date; attendees: string[] }>>;
}

export const createMockGranolaAdapter = (): GranolaAdapter => {
  return {
    async getMeeting() {
      return null;
    },
    async getMeetingNotes() {
      return null;
    },
    async attachMeetingToDeal() {
      return;
    },
    async listMeetings() {
      return [];
    },
  };
};