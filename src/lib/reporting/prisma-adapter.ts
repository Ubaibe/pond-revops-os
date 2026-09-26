import { prisma } from "@/lib/prisma";
import type { ReportingDataAdapter } from "./adapter";
import type {
  ReportingActivity,
  ReportingClient,
  ReportingDeal,
  ReportingMeeting,
  ReportingDataset,
} from "./types";

export class PrismaReportingAdapter implements ReportingDataAdapter {
  async getClients(): Promise<ReportingClient[]> {
    return prisma.client.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getDeals(): Promise<ReportingDeal[]> {
    const deals = await prisma.deal.findMany({
      select: {
        id: true,
        clientId: true,
        company: { select: { name: true } },
        contact: { select: { firstName: true, lastName: true } },
        value: true,
        stage: true,
        probability: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return deals.map((deal) => ({
      id: deal.id,
      clientId: deal.clientId,
      companyName: deal.company?.name ?? null,
      contactName: deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : null,
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
    }));
  }

  async getActivities(): Promise<ReportingActivity[]> {
    const activities = await prisma.activity.findMany({
      select: {
        id: true,
        clientId: true,
        dealId: true,
        type: true,
        createdAt: true,
        subject: true,
        body: true,
      },
    });

    return activities.map((activity) => ({
      id: activity.id,
      clientId: activity.clientId,
      dealId: activity.dealId ?? null,
      type: activity.type,
      occurredAt: activity.createdAt,
      description: activity.subject ?? activity.body ?? null,
    }));
  }

  async getMeetings(): Promise<ReportingMeeting[]> {
    const meetings = await prisma.meeting.findMany({
      select: {
        id: true,
        clientId: true,
        dealId: true,
        title: true,
        startTime: true,
        platform: true,
      },
    });

    return meetings.map((meeting) => ({
      id: meeting.id,
      clientId: meeting.clientId,
      dealId: meeting.dealId ?? null,
      title: meeting.title,
      scheduledAt: meeting.startTime,
      source: meeting.platform ?? null,
      sentiment: null,
    }));
  }

  async getDataset(): Promise<ReportingDataset> {
    const [clients, deals, activities, meetings] = await Promise.all([
      this.getClients(),
      this.getDeals(),
      this.getActivities(),
      this.getMeetings(),
    ]);

    return { clients, deals, activities, meetings };
  }
}

export const prismaReportingAdapter = new PrismaReportingAdapter();
