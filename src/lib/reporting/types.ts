export interface ReportingClient {
  id: string;
  name: string;
}

export interface ReportingDeal {
  id: string;
  clientId: string;
  companyName?: string | null;
  contactName?: string | null;
  value: number;
  stage: string;
  probability: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportingActivity {
  id: string;
  clientId: string;
  dealId?: string | null;
  type: string;
  occurredAt: Date;
  description?: string | null;
}

export interface ReportingMeeting {
  id: string;
  clientId: string;
  dealId?: string | null;
  title: string;
  scheduledAt: Date;
  source?: string | null;
  sentiment?: string | null;
}

export interface ReportingDataset {
  clients: ReportingClient[];
  deals: ReportingDeal[];
  activities: ReportingActivity[];
  meetings: ReportingMeeting[];
}
