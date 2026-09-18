import type { Deal, Contact, Company } from '../types';

export interface AttioAdapter {
  getDeals: (params?: { limit?: number; cursor?: string }) => Promise<{ data: Deal[]; nextCursor?: string }>;
  getDeal: (id: string) => Promise<Deal | null>;
  createDeal: (deal: Omit<Deal, 'id'>) => Promise<Deal>;
  updateDeal: (id: string, deal: Partial<Deal>) => Promise<Deal>;
  getContacts: (params?: { limit?: number; cursor?: string }) => Promise<{ data: Contact[]; nextCursor?: string }>;
  getContact: (id: string) => Promise<Contact | null>;
  createContact: (contact: Omit<Contact, 'id'>) => Promise<Contact>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<Contact>;
  getCompanies: (params?: { limit?: number; cursor?: string }) => Promise<{ data: Company[]; nextCursor?: string }>;
  getCompany: (id: string) => Promise<Company | null>;
  createCompany: (company: Omit<Company, 'id'>) => Promise<Company>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<Company>;
}

export const createMockAttioAdapter = (): AttioAdapter => {
  const mockDeals: Deal[] = [];
  const mockContacts: Contact[] = [];
  const mockCompanies: Company[] = [];

  return {
    async getDeals() {
      return { data: mockDeals };
    },
    async getDeal(id) {
      return mockDeals.find(d => d.id === id) || null;
    },
    async createDeal(deal) {
      const newDeal = { ...deal, id: `attio_deal_${Date.now()}` };
      mockDeals.push(newDeal);
      return newDeal;
    },
    async updateDeal(id, deal) {
      const index = mockDeals.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Deal not found');
      mockDeals[index] = { ...mockDeals[index], ...deal };
      return mockDeals[index];
    },
    async getContacts() {
      return { data: mockContacts };
    },
    async getContact(id) {
      return mockContacts.find(c => c.id === id) || null;
    },
    async createContact(contact) {
      const newContact = { ...contact, id: `attio_contact_${Date.now()}` };
      mockContacts.push(newContact);
      return newContact;
    },
    async updateContact(id, contact) {
      const index = mockContacts.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Contact not found');
      mockContacts[index] = { ...mockContacts[index], ...contact };
      return mockContacts[index];
    },
    async getCompanies() {
      return { data: mockCompanies };
    },
    async getCompany(id) {
      return mockCompanies.find(c => c.id === id) || null;
    },
    async createCompany(company) {
      const newCompany = { ...company, id: `attio_company_${Date.now()}` };
      mockCompanies.push(newCompany);
      return newCompany;
    },
    async updateCompany(id, company) {
      const index = mockCompanies.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Company not found');
      mockCompanies[index] = { ...mockCompanies[index], ...company };
      return mockCompanies[index];
    },
  };
};