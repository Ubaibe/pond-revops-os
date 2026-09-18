import { prisma } from '@/lib/prisma';
import { OutboundClient } from './outbound-client';

export default async function OutboundPage() {
  const [campaigns, prospects, activities, clients] = await Promise.all([
    prisma.campaign.findMany({
      include: {
        client: true,
        prospects: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.prospect.findMany({
      include: { client: true, campaign: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.activity.findMany({
      include: { client: true, deal: true, contact: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.client.findMany({
      orderBy: { name: 'asc' },
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
      if (a.contact) {
        prospectName = `${a.contact.firstName} ${a.contact.lastName}`;
      } else if (a.deal) {
        prospectName = a.deal.name;
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
    campaigns={campaigns}
    prospects={prospects}
    clients={clients}
  />;
}