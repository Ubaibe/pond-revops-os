'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Filter, MoreHorizontal, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';

interface ProspectWithRelations {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  title: string | null;
  company: string | null;
  linkedin: string | null;
  source: string | null;
  status: string;
  score: number;
  metadata: string | null;
  client: { name: string; id: string } | null;
  campaign: { name: string; id: string } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface CampaignWithRelations {
  id: string;
  name: string;
  type: string;
  status: string;
  metadata: string | null;
  client: { name: string } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ClientBasic {
  id: string;
  name: string;
}

interface ProspectsClientProps {
  initialProspects: ProspectWithRelations[];
  campaigns: CampaignWithRelations[];
  clients: ClientBasic[];
}

const STATUS_OPTIONS = ['all', 'NEW', 'ENRICHED', 'QUALIFIED', 'CONTACTED', 'ENGAGED', 'CONVERTED', 'DISQUALIFIED'] as const;

const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
  switch (status) {
    case 'QUALIFIED':
    case 'CONVERTED':
      return 'success';
    case 'ENGAGED':
      return 'default';
    case 'NEW':
    case 'ENRICHED':
      return 'secondary';
    case 'CONTACTED':
      return 'outline';
    case 'DISQUALIFIED':
      return 'destructive';
    default:
      return 'outline';
  }
};

export function ProspectsClient({ initialProspects, campaigns, clients }: ProspectsClientProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [clientFilter, setClientFilter] = React.useState('all');

  const filteredProspects = initialProspects.filter((prospect) => {
    const matchesSearch =
      prospect.firstName.toLowerCase().includes(search.toLowerCase()) ||
      prospect.lastName.toLowerCase().includes(search.toLowerCase()) ||
      prospect.email.toLowerCase().includes(search.toLowerCase()) ||
      prospect.company?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    const matchesClient = clientFilter === 'all' || prospect.client?.id === clientFilter;
    return matchesSearch && matchesStatus && matchesClient;
  });

  const statusCounts = initialProspects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prospects</h1>
            <p className="text-muted-foreground mt-1">Manage and enrich prospect database</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Enrich
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Prospect
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prospects ({filteredProspects.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search prospects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b px-4 py-2">
              <div className="flex gap-2 overflow-x-auto">
                {STATUS_OPTIONS.map((status) => {
                  const count = status === 'all' ? initialProspects.length : statusCounts[status] || 0;
                  return (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className="whitespace-nowrap"
                    >
                      {status === 'all' ? 'All' : status}
                      <span className="ml-1 text-xs">{count}</span>
                    </Button>
                  );
                })}
                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="px-2 py-1 border rounded bg-background text-sm"
                >
                  <option value="all">All Clients</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prospect</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead className="hidden md:table-cell">Title</TableHead>
                  <TableHead className="hidden md:table-cell">Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Score</TableHead>
                  <TableHead className="hidden lg:table-cell">Client</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProspects.map((prospect) => (
                  <TableRow key={prospect.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{prospect.firstName} {prospect.lastName}</p>
                        <p className="text-sm text-muted-foreground">{prospect.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{prospect.company || '—'}</TableCell>
                    <TableCell className="hidden md:table-cell">{prospect.title || '—'}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {prospect.source || '—'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(prospect.status)}
                        className="text-xs"
                      >
                        {prospect.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm hidden md:table-cell">{prospect.score}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {prospect.client && (
                        <Link href={`/clients`} className="text-sm hover:text-primary transition-colors">
                          {prospect.client.name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaigns ({campaigns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {campaigns.map((campaign) => {
                const campaignProspects = initialProspects.filter(p => p.campaign?.id === campaign.id);
                return (
                  <div key={campaign.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.type} • {campaign.status}</p>
                      </div>
                      <Badge variant={campaign.status === 'ACTIVE' ? 'success' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {campaignProspects.length} prospects
                      </span>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}