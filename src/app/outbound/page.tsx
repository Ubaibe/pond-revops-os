import { prisma } from '@/lib/prisma';
import { OutboundClient } from './outbound-client';
import { notFound } from 'next/navigation';

interface OutboundPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function OutboundPage({ searchParams }: OutboundPageProps) {
  const { clientId } = await searchParams;

  // Validate clientId if supplied — do not fall back to all-client data
  let selectedClient = null;
  if (clientId) {
    selectedClient = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, name: true, domain: true },
    });
    if (!selectedClient) {
      notFound();
    }
  }

  const [campaigns, prospects, activities] = await Promise.all([
    prisma.campaign.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: true,
        prospects: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.prospect.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: true,
        campaign: true,
        companyRecord: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.activity.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: true,
        deal: true,
        contact: true,
        prospect: true,
        meeting: {
          select: {
            id: true,
            title: true,
            startTime: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  // Map campaigns to sequence-like objects for the existing UI
  const sequences = campaigns.map((campaign) => {
    const campaignProspects = prospects.filter(p => p.campaignId === campaign.id);
    const contactedProspects = campaignProspects.filter(p => 
      ['CONTACTED', 'ENGAGED', 'QUALIFIED', 'CONVERTED'].includes(p.status)
    );
    const engagedProspects = campaignProspects.filter(p => 
      ['ENGAGED', 'QUALIFIED', 'CONVERTED'].includes(p.status)
    );

    return {
      id: campaign.id,
      name: campaign.name,
      campaignId: campaign.id,
      clientId: campaign.clientId,
      client: campaign.client?.name,
      type: campaign.type,
      status: campaign.status,
      steps: campaign.metadata ? JSON.parse(campaign.metadata).sequences || 5 : 5,
      active: campaignProspects.filter(p => p.status === 'NEW' || p.status === 'ENRICHED').length,
      completed: contactedProspects.length,
      replied: engagedProspects.length,
    };
  });

  // Map real activities to the activity feed format
  const activityFeed = activities
    .filter(a => ['EMAIL_SENT', 'EMAIL_OPENED', 'EMAIL_REPLIED', 'LINKEDIN_TASK', 'CALL'].includes(a.type))
    .map(a => {
      let prospectName = 'Unknown';
      if (a.prospect) {
        prospectName = `${a.prospect.firstName} ${a.prospect.lastName}`;
      } else if (a.deal) {
        prospectName = a.deal.name;
      } else if (a.contact) {
        prospectName = `${a.contact.firstName} ${a.contact.lastName}`;
      }
      return {
        id: a.id,
        type: a.type,
        prospect: prospectName,
        subject: a.subject || a.body || 'No subject',
        time: a.createdAt,
        status: a.type === 'EMAIL_SENT' ? 'SENT' : 
                a.type === 'EMAIL_OPENED' ? 'OPENED' :
                a.type === 'EMAIL_REPLIED' ? 'REPLIED' :
                a.type === 'LINKEDIN_TASK' ? 'PENDING' : 'COMPLETED',
        client: a.client?.name,
        clientId: a.clientId,
        dealId: a.dealId ?? null,
        prospectId: a.prospectId ?? null,
        meetingId: a.meetingId ?? null,
      };
    });

  // Outbound metrics
  const outboundActivities = activities.filter(a => 
    ['EMAIL_SENT', 'EMAIL_OPENED', 'EMAIL_REPLIED', 'LINKEDIN_TASK'].includes(a.type)
  );

  const metrics = {
    totalProspects: prospects.length,
    prospectsInCampaigns: prospects.filter(p => p.campaignId).length,
    newProspects: prospects.filter(p => p.status === 'NEW').length,
    contactedProspects: prospects.filter(p => p.status === 'CONTACTED').length,
    engagedProspects: prospects.filter(p => p.status === 'ENGAGED').length,
    emailsSent: outboundActivities.filter(a => a.type === 'EMAIL_SENT').length,
    emailsOpened: outboundActivities.filter(a => a.type === 'EMAIL_OPENED').length,
    emailsReplied: outboundActivities.filter(a => a.type === 'EMAIL_REPLIED').length,
    linkedInTasks: outboundActivities.filter(a => a.type === 'LINKEDIN_TASK').length,
  };

  return <OutboundClient
    sequences={sequences}
    activityFeed={activityFeed}
    metrics={metrics}
    prospects={prospects}
    selectedClient={selectedClient}
  />;
}