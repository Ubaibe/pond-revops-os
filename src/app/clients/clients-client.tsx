'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ClientWithMetrics {
  id: string;
  name: string;
  domain: string | null;
  logo: string | null;
  status: string;
  metadata: string | null;
  createdAt: string;
  updatedAt: string;
  companiesCount: number;
  contactsCount: number;
  dealsCount: number;
  openDealsCount: number;
  pipelineValue: number;
  wonRevenue: number;
  meetingsCount: number;
  prospectsCount: number;
}

interface ClientsClientProps {
  initialClients: ClientWithMetrics[];
}

export function ClientsClient({ initialClients }: ClientsClientProps) {
  const [search, setSearch] = React.useState('');

  const filteredClients = initialClients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.domain?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground mt-1">Manage client accounts and relationships</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Clients ({filteredClients.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search clients..."
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Pipeline Value</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Open Deals</TableHead>
                  <TableHead className="text-right">Won Revenue</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Companies</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Contacts</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Prospects</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.companiesCount} companies • {client.contactsCount} contacts • {client.meetingsCount} meetings
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{client.domain || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'ACTIVE' ? 'success' : 'secondary'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium hidden md:table-cell">{formatCurrency(client.pipelineValue)}</TableCell>
                    <TableCell className="text-right text-muted-foreground hidden md:table-cell">{client.openDealsCount}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(client.wonRevenue)}</TableCell>
                    <TableCell className="text-right text-muted-foreground hidden lg:table-cell">{client.companiesCount}</TableCell>
                    <TableCell className="text-right text-muted-foreground hidden lg:table-cell">{client.contactsCount}</TableCell>
                    <TableCell className="text-right text-muted-foreground hidden lg:table-cell">{client.prospectsCount}</TableCell>
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
      </div>
    </DashboardLayout>
  );
}