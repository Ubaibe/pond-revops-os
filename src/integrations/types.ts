export interface Deal {
  id: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
  expectedClose?: Date;
  companyId?: string;
  contactId?: string;
  metadata?: Record<string, unknown>;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  linkedin?: string;
  avatar?: string;
  companyId?: string;
  metadata?: Record<string, unknown>;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  size?: string;
  industry?: string;
  location?: string;
  metadata?: Record<string, unknown>;
}

export interface Activity {
  id: string;
  type: string;
  subject?: string;
  body?: string;
  dealId?: string;
  contactId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  platform?: string;
  meetingUrl?: string;
  recordingUrl?: string;
  notes?: string;
  dealId?: string;
  contactId?: string;
  metadata?: Record<string, unknown>;
}

export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  company?: string;
  linkedin?: string;
  source?: string;
  status: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  metadata?: Record<string, unknown>;
}