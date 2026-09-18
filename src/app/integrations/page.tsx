"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  Search,
  Zap,
  Video,
  Mic,
  BarChart3,
  ArrowRight,
  ArrowDown,
  Users,
  Mail,
  Linkedin,
  Target,
  Shield,
  Code2,
} from "lucide-react";

interface IntegrationSystem {
  id: string;
  name: string;
  role: string;
  handles: string[];
  status: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: number;
}

const systems: IntegrationSystem[] = [
  {
    id: "apollo",
    name: "Apollo",
    role: "Prospecting & Sales Engagement",
    handles: ["Prospect sourcing", "Enrichment", "Email sequences", "LinkedIn tasks", "Intent data"],
    status: "Prototype / Demo",
    icon: Search,
    color: "#8b5cf6",
    position: 1,
  },
  {
    id: "clay",
    name: "Clay",
    role: "Enrichment & Research",
    handles: ["Waterfall enrichment", "Company research", "Data verification", "Custom workflows", "API access"],
    status: "Prototype / Demo",
    icon: Zap,
    color: "#f59e0b",
    position: 2,
  },
  {
    id: "attio",
    name: "Attio",
    role: "System of Record",
    handles: ["Clients, Companies, Contacts", "Deals & Pipeline", "Activities & Timeline", "Custom fields & objects", "Reporting foundation"],
    status: "Prototype / Demo",
    icon: Database,
    color: "#3b82f6",
    position: 3,
  },
  {
    id: "granola",
    name: "Granola",
    role: "Meeting Intelligence",
    handles: ["Meeting notes & summaries", "Action items", "Pain points extraction", "Next steps tracking", "Deal attachment"],
    status: "Prototype / Demo",
    icon: Video,
    color: "#22c55e",
    position: 4,
  },
  {
    id: "attio-call",
    name: "Attio Call Intelligence",
    role: "Call Recording & Intelligence",
    handles: ["Call recording & transcription", "Meeting analysis", "Sentiment tracking", "Topic detection", "Deal attachment"],
    status: "Prototype / Demo",
    icon: Mic,
    color: "#10b981",
    position: 4,
  },
  {
    id: "reporting",
    name: "Reporting",
    role: "RevOps Reporting",
    handles: ["Client dashboards", "Pipeline reporting", "Activity reporting", "Cross-client analytics", "Executive metrics"],
    status: "Prototype / Demo",
    icon: BarChart3,
    color: "#ec4899",
    position: 5,
  },
];

const activityFlows = [
  { from: "Apollo / LinkedIn", label: "Outbound Activity", to: "Attio", types: ["EMAIL_SENT", "EMAIL_OPENED", "EMAIL_REPLIED", "LINKEDIN_TASK"] },
  { from: "Attio", label: "Meeting Data", to: "Granola / Attio Call Intelligence", types: ["MEETING"] },
  { from: "Granola / Attio Call Intelligence", label: "Intelligence", to: "Attio (Deal)", types: ["Summary", "Action Items", "Pain Points", "Sentiment"] },
];

export default function IntegrationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations / Architecture</h1>
          <p className="text-muted-foreground mt-1">RevOps system architecture and integration design</p>
        </div>

        {/* Disclaimer */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-4 pb-4 px-6">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="font-medium text-amber-400">Prototype Architecture Visualization</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This prototype demonstrates the intended RevOps architecture using simulated data. 
                  External integrations (Apollo, Clay, Attio, Granola, Attio Call Intelligence) are <strong>not connected</strong> in this demo. 
                  Status labels indicate <strong>architecture readiness</strong>, not live connection state.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Architecture Flow */}
        <Card>
          <CardHeader>
            <CardTitle>RevOps Architecture Flow</CardTitle>
            <CardDescription>
              Data flows from prospecting through enrichment into the system of record, 
              with meeting intelligence feeding back into deals and reporting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Horizontal flow */}
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 flex-wrap justify-center">
                {systems
                  .filter(s => s.position <= 3)
                  .sort((a, b) => a.position - b.position)
                  .map((system, idx, arr) => (
                    <React.Fragment key={system.id}>
                      <div 
                        className={`flex flex-col items-center p-4 bg-card border rounded-xl min-w-[180px] relative`} 
                        style={{ borderColor: system.color + '40' }}
                      >
                        <div 
                          className="h-14 w-14 rounded-xl flex items-center justify-center mb-3 flex-shrink-0" 
                          style={{ backgroundColor: system.color + '20', border: `1px solid ${system.color}40` }}
                        >
<system.icon className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-center text-base">{system.name}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1 mb-2">
                          {system.role}
                        </Badge>
                        <div className="text-[11px] text-muted-foreground text-center space-y-1 w-full">
                          {system.handles.map((h, i) => (
                            <div key={i} className="flex items-center gap-1 justify-center">
                              <span style={{ color: system.color }}>•</span>
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                        <Badge variant="secondary" className="mt-2 text-[10px]">
                          {system.status}
                        </Badge>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="flex items-center justify-center h-full px-2 text-muted-foreground">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
              </div>

              {/* Branch for meeting intelligence */}
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 flex-wrap justify-center pt-4 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowDown className="h-5 w-5" />
                  <span className="text-sm">branches to meeting intelligence</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 flex-wrap justify-center">
                {[systems.find(s => s.id === 'granola')!, systems.find(s => s.id === 'attio-call')!].map((system, idx, arr) => (
                  <React.Fragment key={system.id}>
                    <div 
                      className={`flex flex-col items-center p-4 bg-card border rounded-xl min-w-[180px] relative`} 
                      style={{ borderColor: system.color + '40' }}
                    >
                      <div 
                        className="h-14 w-14 rounded-xl flex items-center justify-center mb-3 flex-shrink-0" 
                        style={{ backgroundColor: system.color + '20', border: `1px solid ${system.color}40` }}
                      >
                        <system.icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-center text-base">{system.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1 mb-2">
                        {system.role}
                      </Badge>
                      <div className="text-[11px] text-muted-foreground text-center space-y-1 w-full">
                        {system.handles.map((h, i) => (
                          <div key={i} className="flex items-center gap-1 justify-center">
                            <span style={{ color: system.color }}>•</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                      <Badge variant="secondary" className="mt-2 text-[10px]">
                        {system.status}
                      </Badge>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex items-center justify-center h-full px-2 text-muted-foreground">
                        <span className="text-[10px]">or</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Reporting at bottom */}
              <div className="flex flex-col items-center pt-4 border-t">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <ArrowDown className="h-5 w-5" />
                  <span className="text-sm">feeds into reporting</span>
                </div>
                <div 
                  className={`flex flex-col items-center p-4 bg-card border rounded-xl min-w-[200px] relative`} 
                  style={{ borderColor: systems.find(s => s.id === 'reporting')!.color + '40' }}
                >
                  <div 
                    className="h-14 w-14 rounded-xl flex items-center justify-center mb-3 flex-shrink-0" 
                    style={{ backgroundColor: systems.find(s => s.id === 'reporting')!.color + '20', border: `1px solid ${systems.find(s => s.id === 'reporting')!.color}40` }}
                  >
                    <BarChart3 className="h-7 w-7" style={{ color: systems.find(s => s.id === 'reporting')!.color }} />
                  </div>
                  <CardTitle className="text-center text-base">Reporting</CardTitle>
                  <Badge variant="outline" className="text-xs mt-1 mb-2" style={{ borderColor: systems.find(s => s.id === 'reporting')!.color + '40', color: systems.find(s => s.id === 'reporting')!.color }}>
                    RevOps Reporting
                  </Badge>
                  <div className="text-[11px] text-muted-foreground text-center space-y-1 w-full">
                    {systems.find(s => s.id === 'reporting')!.handles.map((h, i) => (
                      <div key={i} className="flex items-center gap-1 justify-center">
                        <span style={{ color: systems.find(s => s.id === 'reporting')!.color }}>•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                  <Badge variant="secondary" className="mt-2 text-[10px]">
                    Prototype / Demo
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outbound Activity Flow Back to Attio */}
        <Card>
          <CardHeader>
            <CardTitle>Outbound Activity Flow</CardTitle>
            <CardDescription>
              Outbound actions originate from Apollo/LinkedIn and are recorded in Attio as activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Search className="h-5 w-5 text-purple-500" />
                <Linkedin className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-sm">Apollo / LinkedIn</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">EMAIL_SENT</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-muted-foreground">EMAIL_OPENED</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-muted-foreground">EMAIL_REPLIED</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Linkedin className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-muted-foreground">LINKEDIN_TASK</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <Database className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm text-primary">Attio</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              All outbound activity types are standardized Activity records in the Prisma schema, associated with Client, Deal, Contact, and Prospect.
            </p>
          </CardContent>
        </Card>

        {/* Architecture Details */}
        <Card>
          <CardHeader>
            <CardTitle>Architecture Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">System of Record</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Attio is the central CRM and deal/activity record. All Clients, Companies, Contacts, Deals, Activities, Meetings, Prospects, and Campaigns are modeled in Prisma with strict relationships.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-5 w-5 text-purple-500" />
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span className="font-medium">Prospecting</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Apollo and Clay provide sourcing, enrichment, and research before prospects enter the CRM. Prospect records include source, score, status, and campaign association.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <Linkedin className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Outbound</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Email activity and human-executed LinkedIn tasks are captured as outbound Activity records with types: EMAIL_SENT, EMAIL_OPENED, EMAIL_REPLIED, LINKEDIN_TASK.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-5 w-5 text-green-500" />
                  <Mic className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium">Meeting Intelligence</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Granola and Attio Call Intelligence provide meeting notes, summaries, action items, and intelligence attached to Deals via Meeting.metadata JSON.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">Reporting</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Client-level and cross-client reporting is generated from the standardized Prisma data model. Dashboards, Pipeline, Reports, and Clients pages query real database values.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration-ready Architecture */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <CardTitle>Integration-Ready Architecture</CardTitle>
            </div>
            <CardDescription>
              The prototype is intentionally separated into data/workflow layers so real APIs can be connected later without replacing the core UI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Data Layer
                </p>
                <p className="text-sm text-muted-foreground">
                  Prisma schema defines all entities with strict types, relations, and indexes. Real APIs map directly to these models.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Workflow Layer
                </p>
                <p className="text-sm text-muted-foreground">
                  Server Components fetch data, Client Components handle interactions. API routes can be added later for webhooks/sync.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Multi-Client
                </p>
                <p className="text-sm text-muted-foreground">
                  Every entity is client-scoped. Adding real integrations means mapping external objects to the client-scoped Prisma models.
                </p>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Next steps for production:</strong> Implement OAuth/API key storage per client, add webhook endpoints for real-time sync, build adapter pattern (as shown in previous architecture section), implement rate limiting and error handling, add integration health monitoring.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prisma Data Models Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Prisma Data Models (Reference)</CardTitle>
            <CardDescription>Core entities with relationships ready for integration sync.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { name: "Client", fields: ["id", "name", "domain", "logo", "status", "metadata"], color: "blue" },
                { name: "Company", fields: ["id", "name", "domain", "size", "industry", "location", "clientId"], color: "purple" },
                { name: "Contact", fields: ["id", "firstName", "lastName", "email", "phone", "title", "companyId", "clientId"], color: "amber" },
                { name: "Deal", fields: ["id", "name", "value", "stage", "probability", "companyId", "contactId", "clientId"], color: "green" },
                { name: "Activity", fields: ["id", "type", "subject", "body", "dealId", "contactId", "clientId"], color: "orange" },
                { name: "Meeting", fields: ["id", "title", "startTime", "endTime", "platform", "notes", "dealId", "contactId", "clientId"], color: "emerald" },
                { name: "Prospect", fields: ["id", "firstName", "lastName", "email", "company", "score", "status", "campaignId", "clientId"], color: "indigo" },
                { name: "Campaign", fields: ["id", "name", "type", "status", "clientId"], color: "pink" },
              ].map((model) => (
                <div key={model.name} className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">{model.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {model.fields.map((field) => (
                      <Badge key={field} variant="outline" className="text-[11px] h-5 font-mono">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}