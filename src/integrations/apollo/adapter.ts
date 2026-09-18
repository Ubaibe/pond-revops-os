import type { Prospect } from '../types';

export interface ApolloAdapter {
  searchProspects: (params: {
    q?: string;
    page?: number;
    perPage?: number;
    titles?: string[];
    companyDomains?: string[];
    locations?: string[];
  }) => Promise<{ prospects: Prospect[]; pagination: { page: number; perPage: number; total: number } }>;
  enrichProspect: (email: string) => Promise<Prospect | null>;
  createSequence: (params: {
    name: string;
    steps: Array<{ type: string; template: string; delayDays: number }>;
  }) => Promise<{ id: string; name: string }>;
  getSequenceActivity: (sequenceId: string) => Promise<Array<{ prospectId: string; step: number; status: string; timestamp: Date }>>;
}

export const createMockApolloAdapter = (): ApolloAdapter => {
  const mockProspects: Prospect[] = [];

  return {
    async searchProspects() {
      return {
        prospects: mockProspects,
        pagination: { page: 1, perPage: 25, total: mockProspects.length },
      };
    },
    async enrichProspect(email) {
      return mockProspects.find(p => p.email === email) || null;
    },
    async createSequence({ name }) {
      return { id: `apollo_seq_${Date.now()}`, name };
    },
    async getSequenceActivity() {
      return [];
    },
  };
};