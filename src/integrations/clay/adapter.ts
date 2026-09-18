import type { Prospect, Company } from '../types';

export interface ClayAdapter {
  enrichProspect: (params: { email: string; linkedin?: string }) => Promise<Prospect | null>;
  researchCompany: (params: { domain: string; name?: string }) => Promise<Company | null>;
  runWorkflow: (workflowId: string, inputs: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export const createMockClayAdapter = (): ClayAdapter => {
  return {
    async enrichProspect() {
      return null;
    },
    async researchCompany() {
      return null;
    },
    async runWorkflow() {
      return {};
    },
  };
};