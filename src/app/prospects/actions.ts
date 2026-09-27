'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ConvertResult {
  success: boolean;
  error?: string;
  dealId?: string;
}

export async function convertProspectToDeal(prospectId: string, dealValue: string): Promise<ConvertResult> {
  const value = parseFloat(dealValue);
  if (!dealValue || isNaN(value) || !isFinite(value) || value < 0) {
    return { success: false, error: 'Invalid deal value. Must be a number greater than or equal to 0.' };
  }

  const prospect = await prisma.prospect.findUnique({
    where: { id: prospectId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      clientId: true,
      companyId: true,
      company: true,
      convertedDealId: true,
      status: true,
    },
  });

  if (!prospect) {
    return { success: false, error: 'Prospect not found.' };
  }

  if (prospect.convertedDealId) {
    return { success: false, error: 'Prospect has already been converted to a deal.' };
  }

  // Attempt to safely match an existing Contact by email within the same client.
  // Only assign contactId if a deterministic, unambiguous match exists.
  let matchedContactId: string | null = null;
  if (prospect.email) {
    const matchingContact = await prisma.contact.findFirst({
      where: {
        email: prospect.email,
        clientId: prospect.clientId,
      },
      select: { id: true },
    });
    if (matchingContact) {
      matchedContactId = matchingContact.id;
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const deal = await tx.deal.create({
        data: {
          name: `${prospect.firstName} ${prospect.lastName} - New Deal`,
          value,
          stage: 'LEAD',
          probability: 10,
          clientId: prospect.clientId,
          companyId: prospect.companyId,
          contactId: matchedContactId,
          metadata: JSON.stringify({
            source: 'prospect_conversion',
            prospectCompany: prospect.company || undefined,
          }),
        },
      });

      await tx.prospect.update({
        where: { id: prospect.id },
        data: {
          convertedDealId: deal.id,
          status: 'CONVERTED',
        },
      });

      await tx.activity.create({
        data: {
          type: 'DEAL_CREATED',
          subject: 'Prospect converted to deal',
          body: `Converted ${prospect.firstName} ${prospect.lastName} (${prospect.email}) to deal "${deal.name}".`,
          metadata: JSON.stringify({
            source: 'prospect_conversion',
            prospectId: prospect.id,
            dealId: deal.id,
          }),
          clientId: prospect.clientId,
          dealId: deal.id,
          prospectId: prospect.id,
          contactId: matchedContactId,
        },
      });

      return deal;
    });

    revalidatePath('/prospects');
    revalidatePath(`/prospects/${prospectId}`);
    revalidatePath(`/deals/${result.id}`);
    return { success: true, dealId: result.id };
  } catch (e) {
    console.error('Prospect to Deal conversion failed:', e);
    return { success: false, error: 'Failed to create deal. Please try again.' };
  }
}
