'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Search, Filter, MoreHorizontal, Target, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { formatRelativeTime } from '@/lib/utils';
import { convertProspectToDeal } from './actions';

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
  companyRecord: { id: string; name: string } | null;
  convertedDealId: string | null;
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
  selectedClientId?: string;
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

export function ProspectsClient({ initialProspects, campaigns, clients, selectedClientId }: ProspectsClientProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [clientFilter, setClientFilter] = React.useState(selectedClientId || 'all');
  const [convertProspect, setConvertProspect] = React.useState<ProspectWithRelations | null>(null);
  const [dealValue, setDealValue] = React.useState('');
  const [error, setError] = React.useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredProspects = initialProspects.filter((prospect) => {
    const matchesSearch =
      prospect.firstName.toLowerCase().includes(search.toLowerCase()) ||
      prospect.lastName.toLowerCase().includes(search.toLowerCase()) ||
      prospect.email.toLowerCase().includes(search.toLowerCase()) ||
      prospect.companyRecord?.name?.toLowerCase().includes(search.toLowerCase());
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
            <Button variant="outline" asChild>
              <Link href={selectedClientId ? `/prospects?clientId=${selectedClientId}` : '/prospects'}>
                <Target className="h-4 w-4 mr-2" />
                View All
              </Link>
            </Button>
            <Button asChild>
              <Link href={selectedClientId ? `/outbound?clientId=${selectedClientId}` : '/outbound'}>
                <Send className="h-4 w-4 mr-2" />
                Outbound
              </Link>
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
                        <Link href={`/prospects/${prospect.id}`} className="font-medium hover:text-primary transition-colors">
                          {prospect.firstName} {prospect.lastName}
                        </Link>
                        <p className="text-sm text-muted-foreground">{prospect.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{prospect.companyRecord?.name || '—'}</TableCell>
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
                         <Link href={`/clients/${prospect.client.id}`} className="text-sm hover:text-primary transition-colors">
                           {prospect.client.name}
                         </Link>
                       )}
                    </TableCell>
                     <TableCell>
                      {prospect.convertedDealId ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="success" className="text-xs">Converted</Badge>
                          <Link
                            href={`/deals/${prospect.convertedDealId}`}
                            className="text-xs hover:underline"
                          >
                            View deal
                          </Link>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                setConvertProspect(prospect);
                                setDealValue('');
                                setError('');
                              }}
                            >
                              Convert to Deal
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
                      <Link
                        href={selectedClientId
                          ? `/prospects?clientId=${selectedClientId}&campaignId=${campaign.id}`
                          : `/prospects?campaignId=${campaign.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        View prospects →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
         </Card>
      </div>

      <Sheet open={!!convertProspect} onOpenChange={(open) => { if (!open) { setConvertProspect(null); setError(''); } }}>
        <SheetContent className="max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>Convert to Deal</SheetTitle>
            <SheetDescription>
              Convert {convertProspect?.firstName} {convertProspect?.lastName} to a new Deal.
              The deal will be created under the same client and company.
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const value = parseFloat(dealValue);
              if (!dealValue || isNaN(value) || !isFinite(value) || value < 0) {
                setError('Deal value must be a number greater than or equal to 0.');
                return;
              }
              startTransition(async () => {
                const result = await convertProspectToDeal(convertProspect!.id, dealValue);
                if (result.success) {
                  setConvertProspect(null);
                  setDealValue('');
                  setError('');
                  router.refresh();
                } else {
                  setError(result.error || 'Conversion failed.');
                }
              });
            }}
            className="space-y-4 mt-4"
          >
            <div>
              <Label htmlFor="dealValue">Deal Value ($)</Label>
              <Input
                id="dealValue"
                type="number"
                min="0"
                step="0.01"
                value={dealValue}
                onChange={(e) => { setDealValue(e.target.value); setError(''); }}
                placeholder="0.00"
                required
                disabled={isPending}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" type="button" disabled={isPending}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Deal'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}