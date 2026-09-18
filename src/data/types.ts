export type DealStage = 'LEAD' | 'QUALIFIED' | 'DISCOVERY' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export type ActivityType = 
  | 'EMAIL_SENT' 
  | 'EMAIL_OPENED' 
  | 'EMAIL_REPLIED' 
  | 'LINKEDIN_TASK' 
  | 'CALL' 
  | 'MEETING' 
  | 'DEAL_CREATED' 
  | 'STAGE_CHANGED' 
  | 'NOTE';

export interface Client {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  status: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  size?: string;
  industry?: string;
  location?: string;
  metadata?: Record<string, unknown>;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
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
  metadata?: Record<string, unknown>;
  clientId: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedClose?: Date;
  metadata?: Record<string, unknown>;
  clientId: string;
  companyId?: string;
  contactId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  type: ActivityType;
  subject?: string;
  body?: string;
  metadata?: Record<string, unknown>;
  clientId: string;
  dealId?: string;
  contactId?: string;
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
  metadata?: Record<string, unknown>;
  clientId: string;
  dealId?: string;
  contactId?: string;
  createdAt: Date;
  updatedAt: Date;
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
  clientId: string;
  campaignId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  metadata?: Record<string, unknown>;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  section: 'workspace' | 'system';
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard', section: 'workspace' },
  { label: 'Clients', href: '/clients', icon: 'Users', section: 'workspace' },
  { label: 'Pipeline', href: '/pipeline', icon: 'GitBranch', section: 'workspace' },
  { label: 'Prospects', href: '/prospects', icon: 'Target', section: 'workspace' },
  { label: 'Outbound', href: '/outbound', icon: 'Send', section: 'workspace' },
  { label: 'Meetings', href: '/meetings', icon: 'Calendar', section: 'workspace' },
  { label: 'Reports', href: '/reports', icon: 'BarChart3', section: 'workspace' },
  { label: 'Integrations', href: '/integrations', icon: 'Plug', section: 'system' },
  { label: 'Settings', href: '/settings', icon: 'Settings', section: 'system' },
];

export const DEAL_STAGES: { value: DealStage; label: string; order: number }[] = [
  { value: 'LEAD', label: 'Lead', order: 0 },
  { value: 'QUALIFIED', label: 'Qualified', order: 1 },
  { value: 'DISCOVERY', label: 'Discovery', order: 2 },
  { value: 'PROPOSAL', label: 'Proposal', order: 3 },
  { value: 'NEGOTIATION', label: 'Negotiation', order: 4 },
  { value: 'WON', label: 'Won', order: 5 },
  { value: 'LOST', label: 'Lost', order: 6 },
];

export const ACTIVITY_TYPES: { value: ActivityType; label: string; icon: string }[] = [
  { value: 'EMAIL_SENT', label: 'Email Sent', icon: 'Mail' },
  { value: 'EMAIL_OPENED', label: 'Email Opened', icon: 'MailOpen' },
  { value: 'EMAIL_REPLIED', label: 'Email Replied', icon: 'Reply' },
  { value: 'LINKEDIN_TASK', label: 'LinkedIn Task', icon: 'Linkedin' },
  { value: 'CALL', label: 'Call', icon: 'Phone' },
  { value: 'MEETING', label: 'Meeting', icon: 'Calendar' },
  { value: 'DEAL_CREATED', label: 'Deal Created', icon: 'PlusCircle' },
  { value: 'STAGE_CHANGED', label: 'Stage Changed', icon: 'GitBranch' },
  { value: 'NOTE', label: 'Note', icon: 'FileText' },
];