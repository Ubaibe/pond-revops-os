import type {
  ReportingActivity,
  ReportingClient,
  ReportingDeal,
  ReportingMeeting,
  ReportingDataset,
} from "./types";

export interface ReportingDataAdapter {
  getClients(): Promise<ReportingClient[]>;
  getDeals(): Promise<ReportingDeal[]>;
  getActivities(): Promise<ReportingActivity[]>;
  getMeetings(): Promise<ReportingMeeting[]>;
  getDataset(): Promise<ReportingDataset>;
}
