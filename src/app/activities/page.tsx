import { prisma } from '@/lib/prisma';
import { ActivitiesClient } from './activities-client';

interface ActivitiesPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function ActivitiesPage({ searchParams }: ActivitiesPageProps) {
  const { clientId } = await searchParams;

  const [clients, activities] = await Promise.all([
    prisma.client.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
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
    }),
  ]);

  const selectedClient = clients.find(c => c.id === clientId) || null;

  return <ActivitiesClient activities={activities} selectedClient={selectedClient} />;
}
