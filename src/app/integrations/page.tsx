"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Database,
  Mail,
  Search,
  Shield,
  Users,
  Video,
  Zap,
} from "lucide-react";

type FlowTone = "purple" | "amber" | "blue" | "emerald" | "pink";

interface FlowNode {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: FlowTone;
}

interface SourceFeed {
  id: string;
  source: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: FlowTone;
}

interface SystemFlow {
  id: string;
  name: string;
  summary: string;
  direction: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: FlowTone;
}

interface ReportingMetric {
  name: string;
  required: string[];
  readiness: string;
}

const reportingMetrics: ReportingMetric[] = [
  {
    name: "Pipeline Value",
    required: ["Deal value", "Deal stage"],
    readiness: "Ready with standardized deal values",
  },
  {
    name: "Weighted Pipeline",
    required: ["Deal value", "Deal stage or probability"],
    readiness: "Requires standardized stage probabilities",
  },
  {
    name: "Won Revenue",
    required: ["Deal value", "Won/closed stage"],
    readiness: "Ready with consistent deal stages",
  },
  {
    name: "Open Deals",
    required: ["Deal stage"],
    readiness: "Ready with standardized pipeline stages",
  },
  {
    name: "Deals by Client",
    required: ["Deal → Client relationship"],
    readiness: "Requires consistent client attribution",
  },
  {
    name: "Activity Volume",
    required: ["Activity records", "Activity type", "Activity timestamp", "Related record/client"],
    readiness: "Requires standardized activity logging",
  },
  {
    name: "Meetings by Client",
    required: ["Meeting", "Client relationship", "Meeting timestamp"],
    readiness: "Requires consistent meeting attribution",
  },
  {
    name: "Meeting → Opportunity Conversion",
    required: ["Meeting → Deal relationship", "Meeting outcome", "Deal creation/conversion tracking"],
    readiness: "Requires explicit meeting-to-deal linkage",
  },
  {
    name: "Stage Velocity",
    required: ["Deal stage", "Historical stage-change timestamps"],
    readiness: "Requires historical stage-change data",
  },
  {
    name: "Source Performance",
    required: ["Prospect/deal source", "Source attribution", "Conversion relationship"],
    readiness: "Requires standardized source attribution",
  },
  {
    name: "Outbound Performance",
    required: ["Outbound activity", "Sequence/campaign", "Activity outcome", "Prospect/contact relationship"],
    readiness: "Requires Apollo/outbound activity synchronization",
  },
  {
    name: "Prospect → Deal Conversion",
    required: ["Prospect/contact relationship", "Deal relationship", "Conversion timestamp/status"],
    readiness: "Requires explicit conversion tracking",
  },
];

const primaryFlow: FlowNode[] = [
  {
    id: "apollo",
    title: "Apollo",
    description: "Prospect sourcing, enrichment and outbound sequencing",
    icon: Search,
    tone: "purple",
  },
  {
    id: "sales-workflow",
    title: "Prospecting / Enrichment / Outbound",
    description: "Sales activity and follow-up",
    icon: Zap,
    tone: "amber",
  },
  {
    id: "attio",
    title: "Attio — System of Record",
    description: "Companies, People, Deals, Activities, Meetings and Notes",
    icon: Database,
    tone: "blue",
  },
  {
    id: "pond",
    title: "Pond RevOps OS",
    description: "Cross-client visibility and operational analytics",
    icon: Users,
    tone: "emerald",
  },
  {
    id: "reporting",
    title: "Reporting / Dashboards",
    description: "RevOps metrics and client reporting",
    icon: BarChart3,
    tone: "pink",
  },
];

const sourceFeeds: SourceFeed[] = [
  {
    id: "granola",
    source: "Granola",
    icon: Video,
    tone: "emerald",
  },
  {
    id: "email-calendar",
    source: "Email / Calendar",
    icon: Mail,
    tone: "blue",
  },
];

const systemFlows: SystemFlow[] = [
  {
    id: "apollo",
    name: "Apollo",
    summary: "Prospect sourcing, enrichment, outbound sequencing and sales activity → Attio.",
    direction: "Writes to Attio",
    icon: Search,
    tone: "purple",
  },
  {
    id: "granola",
    name: "Granola",
    summary: "Meeting notes, summaries, action items and meeting intelligence → Attio, associated with the appropriate Deal, Person and Company.",
    direction: "Writes to Attio",
    icon: Video,
    tone: "emerald",
  },
  {
    id: "attio",
    name: "Attio",
    summary: "Companies, People, Deals, Activities, Meetings and Notes as the canonical source of truth.",
    direction: "Canonical source",
    icon: Database,
    tone: "blue",
  },
  {
    id: "email-calendar",
    name: "Email / Calendar",
    summary: "Communication and meeting activity → Attio.",
    direction: "Writes to Attio",
    icon: Mail,
    tone: "blue",
  },
  {
    id: "pond",
    name: "Pond RevOps OS",
    summary: "Reporting, cross-client visibility, operational dashboards and RevOps analytics → reads from Attio.",
    direction: "Reads from Attio",
    icon: Users,
    tone: "emerald",
  },
];

interface AttioRecord {
  name: string;
  bullets: string[];
  icon: React.ComponentType<{ className?: string }>;
  tone: FlowTone;
}

const attioRecords: AttioRecord[] = [
  {
    name: "Client",
    icon: Users,
    tone: "blue",
    bullets: ["Pond client/account context", "Used to separate reporting and operational data by client"],
  },
  {
    name: "Company",
    icon: Database,
    tone: "purple",
    bullets: ["Organization/account", "Related to people and deals"],
  },
  {
    name: "Person",
    icon: Users,
    tone: "blue",
    bullets: ["Individual contact or prospect", "Related to company and deals"],
  },
  {
    name: "Deal",
    icon: BarChart3,
    tone: "pink",
    bullets: ["Revenue opportunity", "Related to company, people, activities, meetings and notes"],
  },
  {
    name: "Activity",
    icon: Zap,
    tone: "amber",
    bullets: ["Email, call, task, LinkedIn or other sales activity"],
  },
  {
    name: "Meeting",
    icon: Video,
    tone: "emerald",
    bullets: ["Meeting record and associated intelligence"],
  },
  {
    name: "Note",
    icon: Mail,
    tone: "blue",
    bullets: ["CRM notes and meeting intelligence, action items and context"],
  },
];

const prototypePoints = [
  "Architecture defined",
  "External integrations not connected",
  "Existing prototype/demo data",
  "No live Apollo, Granola or Attio synchronization",
];

const productionPoints = [
  "External systems feed Attio",
  "Attio remains the source of truth",
  "Pond reporting reads from Attio",
  "Webhooks and scheduled reconciliation can keep reporting current",
];

const nodeClasses: Record<FlowTone, string> = {
  purple: "border-purple-400/25 bg-purple-400/5 text-purple-300",
  amber: "border-amber-400/25 bg-amber-400/5 text-amber-300",
  blue: "border-blue-400/25 bg-blue-400/5 text-blue-300",
  emerald: "border-emerald-400/25 bg-emerald-400/5 text-emerald-300",
  pink: "border-pink-400/25 bg-pink-400/5 text-pink-300",
};

const nodeBorderClasses: Record<FlowTone, string> = {
  purple: "border-purple-400/20",
  amber: "border-amber-400/20",
  blue: "border-blue-400/20",
  emerald: "border-emerald-400/20",
  pink: "border-pink-400/20",
};

const nodeBackgroundClasses: Record<FlowTone, string> = {
  purple: "bg-purple-400/10",
  amber: "bg-amber-400/10",
  blue: "bg-blue-400/10",
  emerald: "bg-emerald-400/10",
  pink: "bg-pink-400/10",
};

export default function IntegrationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Data Operations</h1>
              <Badge variant="secondary" className="text-[10px] font-medium">
                Prototype / Demo
              </Badge>
            </div>
            <p className="text-muted-foreground">
              How prospect, meeting, CRM, and reporting data moves through the Pond RevOps OS.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attio Data Model</CardTitle>
            <CardDescription>
              Recommended logical production data model. Attio is the canonical source of truth for reporting. This does not imply that every record below is currently configured as a native Attio object in the live workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Recommended hierarchy</p>
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-lg border border-border bg-card px-3.5 py-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-semibold">Client</span>
                  </div>
                </div>
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
                <div className="grid w-full gap-4 sm:grid-cols-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-lg border border-border bg-card px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-semibold">Companies</span>
                      </div>
                    </div>
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    <div className="rounded-lg border border-border bg-card px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-300" />
                        <span className="text-sm font-semibold">People</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-lg border border-border bg-card px-3 py-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-pink-400" />
                        <span className="text-sm font-semibold">Deals</span>
                      </div>
                    </div>
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    <div className="grid w-full gap-2">
                      {[
                        { name: "Company", icon: Database, tone: "blue" as FlowTone },
                        { name: "Person", icon: Users, tone: "blue" as FlowTone },
                        { name: "Activity", icon: Zap, tone: "amber" as FlowTone },
                        { name: "Meeting", icon: Video, tone: "emerald" as FlowTone },
                        { name: "Note", icon: Mail, tone: "pink" as FlowTone },
                      ].map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <div key={child.name} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
                            <ChildIcon className={`h-3.5 w-3.5 ${nodeClasses[child.tone]}`} />
                            <span className="text-xs font-medium">{child.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Record definitions</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {attioRecords.map((record) => {
                  const RecordIcon = record.icon;
                  return (
                    <div key={record.name} className="rounded-lg border border-border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${nodeBackgroundClasses[record.tone]}`}>
                          <RecordIcon className={`h-4 w-4 ${nodeClasses[record.tone]}`} />
                        </div>
                        <span className="font-medium">{record.name}</span>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {record.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2">
                            <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground/50" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Record Matching &amp; Deduplication</CardTitle>
            <CardDescription>
              Incoming records should not be inserted into Attio directly. Each record is matched against existing data before it is created or updated, then monitored for drift.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {["Find", "Match", "Create or Update", "Monitor"].map((step, index, arr) => (
                <React.Fragment key={step}>
                  <Badge variant="outline" className="text-xs font-medium">
                    {step}
                  </Badge>
                  {index < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </React.Fragment>
              ))}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="text-sm font-semibold text-foreground">Person Matching</h3>
                <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>External source ID</li>
                  <li>Verified work email</li>
                  <li>LinkedIn identifier/profile</li>
                  <li>Normalized name + company</li>
                  <li>Manual review</li>
                </ol>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h3 className="text-sm font-semibold text-foreground">Company Matching</h3>
                <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>External source ID</li>
                  <li>Normalized company domain</li>
                  <li>Website</li>
                  <li>Normalized company name</li>
                  <li>Manual review</li>
                </ol>
              </div>
            </div>

            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              Name alone should not normally be sufficient to identify a person or company.
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold text-foreground">Why matching matters</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Correct matching and deduplication help prevent:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>&middot; duplicate people</li>
                <li>&middot; duplicate companies</li>
                <li>&middot; fragmented activity history</li>
                <li>&middot; incorrect deal relationships</li>
                <li>&middot; unreliable reporting</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sync Metadata</CardTitle>
            <CardDescription>
              Recommended production data requirements for every synchronized record. These fields are presented as recommended requirements and are not claimed to be currently configured in the live Attio workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Source system",
                  description: "Identifies the originating platform, such as Apollo or Granola.",
                  icon: Database,
                },
                {
                  name: "External source ID",
                  description: "Provides a stable identifier for matching the external record to its Attio record.",
                  icon: Search,
                },
                {
                  name: "Record source",
                  description: "How the record entered the system, such as Apollo, Granola, manual research, referral or another source.",
                  icon: Users,
                },
                {
                  name: "Last synced",
                  description: "Records when the external record was last synchronized.",
                  icon: Zap,
                },
                {
                  name: "Sync status",
                  description: "Indicates whether synchronization is current, pending review, failed, or requires attention.",
                  icon: Shield,
                },
              ].map((field) => {
                const FieldIcon = field.icon;
                return (
                  <div key={field.name} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted/30">
                      <FieldIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{field.name}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{field.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              These fields provide traceability, support reconciliation, reduce duplicate creation, and make synchronization issues easier to diagnose.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Sync Lifecycle</CardTitle>
            <CardDescription>
              Recommended production synchronization flow. External systems are not connected in this prototype.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-col items-center gap-2">
              {[
                "Source",
                "Find / Match",
                "Create or Update Attio",
                "Store External ID",
                "Track Last Sync",
                "Report",
              ].map((step, index, arr) => (
                <React.Fragment key={step}>
                  <Badge variant="outline" className="text-xs font-medium">
                    {step}
                  </Badge>
                  {index < arr.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" />}
                </React.Fragment>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Apollo / Granola / other sources identify incoming records. Each record is matched against Attio before a corresponding Attio record is created or updated. The external source identifier is retained, synchronization state is tracked, and the resulting Attio record is made available to reporting.
            </p>

            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Supporting mechanisms</p>
              <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                <li>&middot; Event/webhook-driven updates</li>
                <li>&middot; Scheduled reconciliation</li>
                <li>&middot; API-based synchronization</li>
                <li>&middot; Manual review for ambiguous matches</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Quality Principle</CardTitle>
            <CardDescription>
              Recommended architecture principle for reliable reporting. Not all controls are claimed to be currently implemented in the live Attio workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-sm font-medium text-foreground">Attio should be the reporting source of truth.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The reporting layer should consume standardized Attio records rather than independently maintaining competing CRM records.
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Reliable reporting depends on</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground sm:grid sm:grid-cols-2">
                <li>&middot; Consistent client attribution</li>
                <li>&middot; Consistent pipeline stages</li>
                <li>&middot; Consistent activity logging</li>
                <li>&middot; Reliable meeting-to-deal relationships</li>
                <li>&middot; Stable record identity</li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground">
              These data-quality rules allow client-level and cross-client reporting to remain consistent as data enters Attio from multiple systems.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reporting Readiness</CardTitle>
            <CardDescription>
              Which RevOps metrics can be calculated from standardized Attio records, and which require additional data-flow or field setup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              <strong className="text-foreground">Attio can serve as the reporting source of truth</strong> once records, relationships, stages, activities, and attribution fields are standardized.
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left font-medium py-2 pr-4 pl-[10px]">Metric</th>
                    <th className="text-left font-medium py-2 pr-4">Required Attio Data</th>
                    <th className="text-left font-medium py-2 pr-4">Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reportingMetrics.map((metric) => (
                    <tr key={metric.name}>
                      <td className="py-2 pr-4 align-top">{metric.name}</td>
                      <td className="py-2 pr-4 align-top">
                        <ul className="list-disc list-inside">
                          {metric.required.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-2 pr-4 align-top">{metric.readiness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden grid gap-3">
              {reportingMetrics.map((metric) => (
                <div key={metric.name} className="rounded-lg border border-border bg-card p-4">
                  <p className="font-medium">{metric.name}</p>
                  <ul className="mt-1 list-disc list-inside text-muted-foreground">
                    {metric.required.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-muted-foreground">{metric.readiness}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Reporting readiness depends less on the dashboard itself and more on the consistency of the data entering Attio. The dashboard should consume standardized Attio records rather than maintain a separate reporting dataset.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metric Classification</CardTitle>
            <CardDescription>
              Recommended production architecture classification, not the current prototype's live integration status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Direct</p>
              <p>Metrics that can be calculated from standardized Attio records without additional historical data.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Requires Field Discipline</p>
              <p>Metrics that are technically calculable but depend on consistent attribution, relationships, stages, or activity fields.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Requires Historical / Integration Data</p>
              <p>Metrics that require historical events, external activity synchronization, or additional source data before they can be reported reliably.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard → Attio Connection</CardTitle>
            <CardDescription>
              How the Pond RevOps dashboard should consume Attio as the reporting source of truth in production.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              <strong className="text-foreground">In production</strong>, Attio should remain the system of record while the Pond RevOps dashboard acts as a reporting consumer. The dashboard should read standardized Attio records rather than maintain a competing CRM dataset.
            </div>

            <div className="flex flex-col items-center gap-2">
              {[
                "Attio",
                "Attio REST API / Webhooks",
                "Pond RevOps Data Adapter",
                "Reporting / Dashboard Layer",
              ].map((step, index, arr) => (
                <React.Fragment key={step}>
                  <div className="rounded-lg border border-border bg-card px-4 py-2 text-center min-w-[180px]">
                    <span className="text-sm font-medium">{step}</span>
                  </div>
                  {index < arr.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" />}
                </React.Fragment>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  name: "Attio",
                  icon: Database,
                  color: "text-blue-400",
                  description:
                    "Canonical CRM and reporting source of truth. Stores standardized clients, companies, people, deals, activities, meetings, and related metadata. Client attribution and record relationships should be established here.",
                },
                {
                  name: "Attio REST API / Webhooks",
                  icon: Zap,
                  color: "text-amber-400",
                  description:
                    "REST API provides the dashboard/reporting layer with access to Attio data. Webhooks can notify the application when relevant records change. Event-driven updates should reduce unnecessary polling. API access should be treated as the production integration boundary.",
                },
                {
                  name: "Pond RevOps Data Adapter",
                  icon: Shield,
                  color: "text-emerald-400",
                  description:
                    "A dedicated application layer between Attio and the dashboard. Translates Attio records into the normalized reporting shape expected by the Pond RevOps UI. Keeps Attio-specific API details out of dashboard components. Provides one place for validation, normalization, error handling, and future caching/reconciliation logic.",
                },
                {
                  name: "Reporting / Dashboard Layer",
                  icon: BarChart3,
                  color: "text-pink-400",
                  description:
                    "Reads normalized reporting data from the adapter. Calculates and displays dashboard metrics. Should not directly mutate CRM records as part of normal reporting. Should not become a second system of record.",
                },
              ].map((layer) => {
                const LayerIcon = layer.icon;
                return (
                  <div key={layer.name} className="rounded-lg border border-border bg-card p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/30">
                        <LayerIcon className={`h-4 w-4 ${layer.color}`} />
                      </div>
                      <span className="text-sm font-semibold">{layer.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{layer.description}</p>
                  </div>
                );
              })}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Prototype vs Production</h3>
              <div className="grid gap-3 pt-2 md:grid-cols-2">
                <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-4">
                  <p className="font-medium text-amber-300">Prototype</p>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Prisma/PostgreSQL provides the current demo data.</li>
                    <li>Dashboard pages query the prototype database.</li>
                    <li>No live Attio API connection exists.</li>
                    <li>Metrics demonstrate the intended reporting experience.</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4">
                  <p className="font-medium text-emerald-300">Production</p>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Attio becomes the canonical source of truth.</li>
                    <li>A server-side Attio integration reads the required records.</li>
                    <li>The Pond data adapter normalizes Attio data for the dashboard.</li>
                    <li>Webhooks can trigger updates while scheduled reconciliation provides a consistency check.</li>
                    <li>Dashboard components remain decoupled from the Attio API.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Recommended Connection Pattern</h3>
              <div className="mt-2 flex flex-col items-center gap-2">
                {[
                  "Attio record change",
                  "Webhook/event",
                  "Pond integration layer",
                  "Validate + normalize",
                  "Update reporting cache/read model",
                  "Dashboard reads normalized data",
                ].map((step, index, arr) => (
                  <React.Fragment key={step}>
                    <Badge variant="outline" className="text-xs font-medium">
                      {step}
                    </Badge>
                    {index < arr.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" />}
                  </React.Fragment>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Scheduled reconciliation should periodically compare the reporting layer with Attio so missed events or temporary integration failures do not permanently leave reporting data stale.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Refresh Strategy</h3>
              <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  <strong>Event-driven updates:</strong> Attio record changes can trigger webhook events that enter the Pond integration layer.
                </li>
                <li>
                  <strong>Near-real-time processing:</strong> The integration layer validates and normalizes incoming changes and updates the reporting read model/cache when appropriate.
                </li>
                <li>
                  <strong>Scheduled reconciliation:</strong> A scheduled process periodically checks Attio against the reporting layer to detect missed webhook events, failed processing, or stale records.
                </li>
                <li>
                  <strong>Dashboard reads:</strong> The dashboard reads the latest normalized reporting data rather than repeatedly querying Attio directly from individual UI components.
                </li>
                <li>
                  <strong>Manual/on-demand refresh:</strong> An operator can trigger a controlled refresh/reconciliation for troubleshooting or urgent reporting updates.
                </li>
              </ol>
              <p className="mt-3 text-sm text-muted-foreground">
                The exact production refresh interval should be determined after observing Attio workspace size, API limits, reporting requirements, and webhook reliability. No specific guaranteed refresh time is claimed in this prototype.
              </p>
              <div className="mt-3 overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left font-medium py-2 pr-4 pl-[10px]">Mechanism</th>
                      <th className="text-left font-medium py-2 pr-4">Purpose</th>
                      <th className="text-left font-medium py-2 pr-4">Expected behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { mechanism: "Webhook events", purpose: "Detect record changes", behavior: "Event-driven" },
                      { mechanism: "Integration processing", purpose: "Validate and normalize changes", behavior: "Near-real-time where processing succeeds" },
                      { mechanism: "Scheduled reconciliation", purpose: "Catch missed/stale changes", behavior: "Periodic consistency check" },
                      { mechanism: "Dashboard read", purpose: "Serve reporting data", behavior: "Reads latest available normalized data" },
                      { mechanism: "Manual refresh", purpose: "Troubleshooting / urgent update", behavior: "Operator initiated" },
                    ].map((row) => (
                      <tr key={row.mechanism}>
                        <td className="py-2 pr-4 align-top">{row.mechanism}</td>
                        <td className="py-2 pr-4 align-top">{row.purpose}</td>
                        <td className="py-2 pr-4 align-top">{row.behavior}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Production Limitations &amp; Considerations</h3>
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  <strong>API availability and rate limits:</strong> The dashboard and integration layer depend on Attio API availability and applicable API limits. Production architecture should include retry handling and backoff rather than assuming every request succeeds.
                </li>
                <li>
                  <strong>Webhook delivery and processing:</strong> Webhook-driven updates should not be treated as the only consistency mechanism. Failed events or temporary outages are why scheduled reconciliation is recommended.
                </li>
                <li>
                  <strong>Historical reporting:</strong> Current Attio records alone may not provide all historical information required for metrics such as stage velocity. Historical stage changes and other event history may need to be captured explicitly.
                </li>
                <li>
                  <strong>Data quality:</strong> Reporting quality depends on consistent client attribution, pipeline stages, activity types, meeting relationships, source attribution, and stable record identity.
                </li>
                <li>
                  <strong>External activity synchronization:</strong> Apollo and other outbound tools may contain activity information that is not automatically available in the required reporting shape. Production reporting may therefore depend on additional synchronization and normalization.
                </li>
                <li>
                  <strong>Meeting-to-deal attribution:</strong> Meeting intelligence is only useful for deal-level reporting when meetings are reliably associated with the correct Deal.
                </li>
                <li>
                  <strong>Temporary staleness:</strong> A reporting layer may temporarily lag behind Attio during webhook delays, failed processing, API outages, or reconciliation windows. The UI should not imply guaranteed real-time consistency unless that has actually been implemented and measured.
                </li>
                <li>
                  <strong>Deleted or changed records:</strong> The integration layer needs to handle records that are renamed, merged, deleted, or otherwise changed in the source system.
                </li>
              </ul>
              <div className="mt-3 rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                <strong className="text-foreground">Recommended approach:</strong> optimize for reliable, traceable synchronization rather than assuming every dashboard request should query Attio directly. Webhooks provide timely updates; scheduled reconciliation provides resilience.
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Current Prototype Status</h3>
              <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
                <Badge variant="secondary" className="text-[10px] font-medium">
                  Prototype / Demo
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Current prototype: dashboard data is served from Prisma/PostgreSQL. Attio is documented as the intended production source of truth, but no live Attio API connection is implemented.
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                This architecture is intentionally integration-ready without introducing credentials or external API dependencies into the prototype.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Gap Map</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Production readiness depends on closing the data-flow gaps between the systems already used by the team. The following map identifies the recommended role of each system and the main implementation gap to validate.
            </p>

            <div className="hidden sm:block overflow-x-auto rounded-lg border border-border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="font-medium py-2 pr-4 pl-[10px] text-left">System</th>
                    <th className="font-medium py-2 pr-4 text-left">Role</th>
                    <th className="font-medium py-2 pr-4 text-left">Target flow</th>
                    <th className="font-medium py-2 pr-4 text-left">Data expected to move</th>
                    <th className="font-medium py-2 pr-4 text-left">Current prototype status</th>
                    <th className="font-medium py-2 pr-4 text-left">Primary gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    {
                      system: "Apollo",
                      role: "Prospecting, enrichment, outbound sequencing, and sales activity",
                      target: "Apollo → Attio",
                      data: ["People/prospect records", "Company information", "Verified contact details", "Outbound activity", "Sequence/campaign context", "Tasks or follow-up activity where applicable"],
                      status: "Documented only",
                      gap: "Audit the existing Apollo → Attio workflow and determine which records/actions are already synchronized versus which require additional workflow automation or API handling.",
                    },
                    {
                      system: "Granola",
                      role: "Meeting notes, summaries, action items, and meeting intelligence",
                      target: "Granola → Attio People / Companies / Deals",
                      data: ["Meeting notes", "Summary", "Action items", "Meeting context", "Deal association"],
                      status: "Documented only",
                      gap: "Validate how meetings are currently routed into Attio and ensure meeting intelligence is reliably associated with the correct Deal rather than only the Person or Company.",
                    },
                    {
                      system: "Attio",
                      role: "Canonical CRM and reporting source of truth",
                      target: "Sources → Attio → Pond Reporting",
                      data: ["Clients", "Companies", "People", "Deals", "Activities", "Meetings", "Source attribution", "Sync metadata", "Relationships"],
                      status: "Reporting architecture documented",
                      gap: "Audit the client's existing objects, fields, relationships, pipelines, and client attribution conventions against the recommended reporting model.",
                    },
                    {
                      system: "Pond RevOps Dashboard",
                      role: "Reporting and operational visibility layer",
                      target: "Attio → Pond Data Adapter → Dashboard",
                      data: ["Pipeline", "Revenue", "Activity", "Meetings", "Prospecting", "Client-level reporting", "Cross-client reporting"],
                      status: "Working against prototype Prisma/PostgreSQL data",
                      gap: "Replace the prototype data source with an Attio-backed reporting adapter after the Attio workspace and data model have been validated.",
                    },
                    {
                      system: "LinkedIn",
                      role: "Human-executed prospecting and relationship activity",
                      target: "Human action → activity logged into Attio",
                      data: ["Connection/outreach activity", "Follow-ups", "Responses where available", "Relevant prospect activity"],
                      status: "Workflow documented only",
                      gap: "Define a compliant human-executed workflow for LinkedIn activity and standardize how those activities are recorded in Attio.",
                    },
                    {
                      system: "Reporting / Reconciliation Layer",
                      role: "Data consistency, normalization, and reporting readiness",
                      target: "Attio events/API → Pond adapter → normalized reporting data",
                      data: ["Record normalization", "Identity matching", "Sync metadata", "Failed/missed events", "Historical reporting requirements"],
                      status: "Architecture boundary implemented",
                      gap: "Implement the production Attio adapter and reconciliation process after workspace access and API requirements are validated.",
                    },
                  ].map((item) => (
                    <tr key={item.system}>
                      <td className="py-2 pr-4 align-top font-medium">{item.system}</td>
                      <td className="py-2 pr-4 align-top">{item.role}</td>
                      <td className="py-2 pr-4 align-top">{item.target}</td>
                      <td className="py-2 pr-4 align-top">
                        <ul className="list-disc list-inside">
                          {item.data.map((row) => (
                            <li key={row}>{row}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-2 pr-4 align-top">{item.status}</td>
                      <td className="py-2 pr-4 align-top">{item.gap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden grid gap-4">
              {[
                {
                  system: "Apollo",
                  role: "Prospecting, enrichment, outbound sequencing, and sales activity",
                  target: "Apollo → Attio",
                  data: ["People/prospect records", "Company information", "Verified contact details", "Outbound activity", "Sequence/campaign context", "Tasks or follow-up activity where applicable"],
                  status: "Documented only",
                  gap: "Audit the existing Apollo → Attio workflow and determine which records/actions are already synchronized versus which require additional workflow automation or API handling.",
                },
                {
                  system: "Granola",
                  role: "Meeting notes, summaries, action items, and meeting intelligence",
                  target: "Granola → Attio People / Companies / Deals",
                  data: ["Meeting notes", "Summary", "Action items", "Meeting context", "Deal association"],
                  status: "Documented only",
                  gap: "Validate how meetings are currently routed into Attio and ensure meeting intelligence is reliably associated with the correct Deal rather than only the Person or Company.",
                },
                {
                  system: "Attio",
                  role: "Canonical CRM and reporting source of truth",
                  target: "Sources → Attio → Pond Reporting",
                  data: ["Clients", "Companies", "People", "Deals", "Activities", "Meetings", "Source attribution", "Sync metadata", "Relationships"],
                  status: "Reporting architecture documented",
                  gap: "Audit the client's existing objects, fields, relationships, pipelines, and client attribution conventions against the recommended reporting model.",
                },
                {
                  system: "Pond RevOps Dashboard",
                  role: "Reporting and operational visibility layer",
                  target: "Attio → Pond Data Adapter → Dashboard",
                  data: ["Pipeline", "Revenue", "Activity", "Meetings", "Prospecting", "Client-level reporting", "Cross-client reporting"],
                  status: "Working against prototype Prisma/PostgreSQL data",
                  gap: "Replace the prototype data source with an Attio-backed reporting adapter after the Attio workspace and data model have been validated.",
                },
                {
                  system: "LinkedIn",
                  role: "Human-executed prospecting and relationship activity",
                  target: "Human action → activity logged into Attio",
                  data: ["Connection/outreach activity", "Follow-ups", "Responses where available", "Relevant prospect activity"],
                  status: "Workflow documented only",
                  gap: "Define a compliant human-executed workflow for LinkedIn activity and standardize how those activities are recorded in Attio.",
                },
                {
                  system: "Reporting / Reconciliation Layer",
                  role: "Data consistency, normalization, and reporting readiness",
                  target: "Attio events/API → Pond adapter → normalized reporting data",
                  data: ["Record normalization", "Identity matching", "Sync metadata", "Failed/missed events", "Historical reporting requirements"],
                  status: "Architecture boundary implemented",
                  gap: "Implement the production Attio adapter and reconciliation process after workspace access and API requirements are validated.",
                },
              ].map((item) => (
                <div key={item.system} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{item.system}</p>
                    <Badge variant="secondary" className="text-[10px]">Prototype / Demo</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.role}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.target}</p>
                  <ul className="mt-1 list-disc list-inside text-xs text-muted-foreground">
                    {item.data.map((row) => (
                      <li key={row}>{row}</li>
                    ))}
                  </ul>
                  <p className="mt-1 text-xs text-muted-foreground">{item.status}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.gap}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Priority Gaps to Validate</h3>
              <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Apollo → Attio synchronization:</strong> Confirm what Apollo currently creates, updates, and logs in Attio.</li>
                <li><strong>Granola → Deal attribution:</strong> Confirm whether meeting notes consistently reach the correct Deal.</li>
                <li><strong>Identity resolution:</strong> Confirm the identifiers and matching rules used to prevent duplicate People and Companies.</li>
                <li><strong>Client attribution:</strong> Confirm how every Company, Person, Deal, Activity, and Meeting is associated with the correct client.</li>
                <li><strong>Historical reporting:</strong> Confirm whether stage changes, activity history, source attribution, and other historical events are available for reporting.</li>
                <li><strong>Dashboard data access:</strong> Confirm the Attio API access, workspace permissions, relevant objects/fields, and expected reporting volume required for the production adapter.</li>
              </ol>
            </div>

            <p className="text-sm text-muted-foreground">
              These gaps should be validated against the client's actual workspace before production automation is implemented. The prototype intentionally documents the target architecture without claiming that any external integration is currently connected.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Integration Blueprint</CardTitle>
            <CardDescription>
              How the documented architecture becomes a production implementation once Pond provides workspace access. This describes the recommended production architecture, not the current prototype.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-7">
            <p className="text-sm text-muted-foreground">
              The sections below map each source-to-Attio flow, the identity and client-attribution model, an incremental production implementation sequence, and a readiness gate. External systems are not connected in the current prototype.
            </p>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Apollo → Attio</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Role: Apollo is the prospecting, enrichment, and outbound execution source.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Production flow: Apollo → identity resolution → Attio People/Companies → outbound/activity records → reporting.
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Source record identifiers should be preserved.</li>
                <li>People should be matched using stable identifiers where available, then verified work email, LinkedIn/profile identifiers, and normalized person/company attributes.</li>
                <li>Companies should be matched using stable identifiers where available, normalized domain/website, then normalized company name.</li>
                <li>Existing Attio records should be updated rather than blindly recreated.</li>
                <li>Outbound activity should be mapped to standardized Attio activity/task/campaign structures where supported by the actual workspace configuration.</li>
                <li>Apollo sequences and outbound performance should retain enough attribution for reporting.</li>
              </ul>
              <p className="mt-2 text-xs font-medium text-foreground">Validate in workspace:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Existing Apollo → Attio workflows/integrations</li>
                <li>Which Apollo fields are currently transferred</li>
                <li>Whether outbound activity is already logged</li>
                <li>Whether source IDs are preserved</li>
                <li>Current duplicate behavior</li>
                <li>Current client attribution</li>
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                These items must be audited against the real workspace before implementation.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Granola → Attio</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Role: Granola provides meeting notes and meeting intelligence.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Production flow: Meeting → Granola → Person/Company/Deal matching → Attio meeting/note/activity → reporting.
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Meeting notes should be associated with the correct People/Company.</li>
                <li>Where a meeting is opportunity-related, the notes should be associated with the correct Deal.</li>
                <li>Summary, pain points, action items, next step, and relevant context should be retained where supported.</li>
                <li>Meeting routing should avoid creating duplicate records.</li>
                <li>Failed or ambiguous matching should go to a review path rather than silently attaching notes to the wrong Deal.</li>
              </ul>
              <p className="mt-2 text-xs font-medium text-foreground">Validate in workspace:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Current Granola → Attio configuration</li>
                <li>Whether Deal routing is enabled</li>
                <li>How meetings are currently associated</li>
                <li>Which note fields are available</li>
                <li>Whether folders/routing rules exist</li>
                <li>Handling of unmatched meetings</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Attio → Pond Reporting</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Role: Attio is the canonical CRM and reporting source of truth.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Production flow: Attio API/Webhooks → Pond Reporting Data Adapter → normalized reporting model → dashboard.
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>The dashboard should not become a second CRM.</li>
                <li>Reporting should read normalized data from the adapter.</li>
                <li>API access should remain server-side.</li>
                <li>Webhooks should provide timely change detection where available.</li>
                <li>Scheduled reconciliation should catch missed events or stale records.</li>
                <li>The adapter should normalize records into stable reporting types.</li>
                <li>Errors should be observable and recoverable.</li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground">
                The prototype reporting adapter boundary is already present in{" "}
                <code className="text-xs">src/lib/reporting/types.ts</code>,{" "}
                <code className="text-xs">src/lib/reporting/adapter.ts</code>, and{" "}
                <code className="text-xs">src/lib/reporting/prisma-adapter.ts</code>. The current Prisma adapter remains the prototype data source until it is swapped for an Attio-backed adapter.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Identity Resolution</h3>
              <div className="mt-2 flex flex-col items-center gap-2">
                {[
                  "Find candidate",
                  "Match stable external ID",
                  "Match verified email/domain",
                  "Match LinkedIn/profile identifier where available",
                  "Match normalized attributes",
                  "Manual review if ambiguous",
                  "Create/update Attio record",
                ].map((step, index, arr) => (
                  <React.Fragment key={step}>
                    <Badge variant="outline" className="text-xs font-medium">
                      {step}
                    </Badge>
                    {index < arr.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-foreground">Person</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>external source ID</li>
                    <li>verified work email</li>
                    <li>LinkedIn/profile identifier</li>
                    <li>normalized name + company</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Company</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>external source ID</li>
                    <li>normalized domain</li>
                    <li>website</li>
                    <li>normalized company name</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                Name alone should not normally be treated as sufficient for automated matching.
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Client Attribution</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Pond serves multiple clients, and reporting must prevent cross-client contamination.
              </p>
              <div className="mt-3 rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Recommended client model</p>
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-lg border border-border bg-card px-3.5 py-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-semibold">Client</span>
                    </div>
                  </div>
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  <div className="grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {["Companies", "People", "Deals", "Activities", "Meetings", "Outbound / Prospecting"].map((child) => (
                      <div key={child} className="rounded-lg border border-border bg-card px-3 py-1.5 text-center">
                        <span className="text-xs font-medium">{child}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <ul className="mt-3 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Every reportable record should have a deterministic client relationship.</li>
                <li>Client attribution should be established at ingestion/matching time, not inferred later by dashboard queries.</li>
                <li>Shared companies or contacts should have an explicit business rule rather than being silently duplicated or assigned.</li>
                <li>Cross-client reporting should aggregate only after client attribution has been validated.</li>
                <li>Client attribution changes should be auditable.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Production Implementation Sequence</h3>
              <ol className="mt-2 list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong>Workspace Audit:</strong> Confirm actual tools, permissions, integrations, fields, workflows, and existing automation.
                </li>
                <li>
                  <strong>Attio Data Model Validation:</strong> Confirm actual objects, attributes, relationships, pipelines, stages, client attribution, and activity structure.
                </li>
                <li>
                  <strong>Apollo / Granola Flow Audit:</strong> Determine what is already connected and what requires additional workflows/API automation.
                </li>
                <li>
                  <strong>Identity + Client Attribution:</strong> Implement deterministic matching and ensure every reportable record belongs to the correct Pond client.
                </li>
                <li>
                  <strong>Production Sync:</strong> Implement validated source-to-Attio synchronization with create/update/upsert behavior.
                </li>
                <li>
                  <strong>Reporting Adapter:</strong> Replace the prototype Prisma reporting source with a production Attio-backed adapter.
                </li>
                <li>
                  <strong>Dashboard Validation:</strong> Compare dashboard metrics against Attio records and expected client-level results.
                </li>
                <li>
                  <strong>Reconciliation + Monitoring:</strong> Add scheduled consistency checks, failed-event handling, stale-record detection, and operational visibility.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Production Readiness Gate</h3>
              <p className="mt-1 text-xs text-muted-foreground">Before live implementation:</p>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />Attio workspace access</li>
                <li className="flex gap-2"><span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />Apollo workspace access</li>
                <li className="flex gap-2"><span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />Granola workspace access</li>
                <li className="flex gap-2"><span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />Existing automation inventory</li>
                <li className="flex gap-2"><span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />Attio object/field inventory</li>
                <li className="flex gap-2"><span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />Client attribution rules</li>
                <li className="flex gap-2"><span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />Existing pipeline definitions</li>
                <li className="flex gap-2"><span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />Existing reporting requirements</li>
                <li className="flex gap-2"><span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />API/webhook availability</li>
                <li className="flex gap-2"><span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />Data quality/duplicate baseline</li>
              </ul>
              <div className="mt-3 rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                Prototype documents the target architecture. Production implementation begins only after the actual workspace configuration, data model, permissions, and existing integrations have been audited.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-start gap-3 p-4 sm:p-6">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
              <Shield className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="font-medium text-amber-400">Prototype architecture documentation</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This page describes the intended data architecture. External integrations are not connected, and no live Apollo, Granola, Attio, email, or calendar data is displayed.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>System Data Flow</CardTitle>
                <CardDescription>
                  Attio is the canonical system of record. Pond RevOps OS reads from Attio for reporting and operational visibility.
                </CardDescription>
              </div>
              <Badge variant="outline" className="w-fit text-[10px]">
                Attio → Pond RevOps OS
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-stretch lg:justify-center">
              {primaryFlow.map((node, index) => {
                const NodeIcon = node.icon;
                return (
                  <React.Fragment key={node.id}>
                    <div className={`flex w-full max-w-xs flex-col items-center rounded-xl border p-4 text-center lg:max-w-[190px] lg:flex-1 ${nodeBorderClasses[node.tone]}`}>
                      <div className={`mb-3 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${nodeBackgroundClasses[node.tone]}`}>
                        <NodeIcon className={`h-6 w-6 ${nodeClasses[node.tone]}`} />
                      </div>
                      <p className="text-base font-semibold">{node.title}</p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">{node.description}</p>
                      {node.id === "attio" && (
                        <Badge variant="outline" className="mt-3 text-[10px] border-blue-400/30 text-blue-300">
                          Source of truth
                        </Badge>
                      )}
                    </div>
                    {index < primaryFlow.length - 1 && (
                      <ArrowRight className="h-4 w-4 flex-shrink-0 rotate-90 text-muted-foreground lg:rotate-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="mt-6 flex items-start justify-center gap-2 rounded-lg border border-blue-400/20 bg-blue-400/5 p-3 text-center text-sm text-muted-foreground">
              <Database className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
              <span>
                <strong className="text-blue-300">Attio is the system of record</strong> for CRM objects and activity. All reporting in Pond RevOps OS is based on Attio data.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Source Feeds into Attio</CardTitle>
            <CardDescription>Meeting intelligence and communication activity flow into the canonical CRM record.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {sourceFeeds.map((feed) => {
                const FeedIcon = feed.icon;
                return (
                  <div key={feed.id} className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row">
                    <div className={`flex w-full items-center gap-2 rounded-lg border p-3 sm:w-auto sm:flex-1 ${nodeBorderClasses[feed.tone]}`}>
                      <FeedIcon className={`h-5 w-5 ${nodeClasses[feed.tone]}`} />
                      <span className="font-medium text-sm">{feed.source}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" />
                    <div className={`flex w-full items-center gap-2 rounded-lg border p-3 sm:w-auto sm:flex-1 ${nodeBorderClasses.blue}`}>
                      <Database className="h-5 w-5 text-blue-400" />
                      <span className="font-medium text-sm text-blue-300">Attio — System of Record</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Flow by System</CardTitle>
            <CardDescription>Each system has a defined role in the RevOps data model and reporting path.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {systemFlows.map((flow) => {
                const FlowIcon = flow.icon;
                return (
                  <div key={flow.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${nodeBackgroundClasses[flow.tone]}`}>
                        <FlowIcon className={`h-4 w-4 ${nodeClasses[flow.tone]}`} />
                      </div>
                      <Badge variant="outline" className={`h-fit text-[10px] ${flow.id === "attio" ? "border-blue-400/30 text-blue-300" : "text-muted-foreground"}`}>
                        {flow.direction}
                      </Badge>
                    </div>
                    <h3 className="mt-3 font-semibold">{flow.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{flow.summary}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Prototype vs Production</CardTitle>
                <CardDescription>The current page is an architecture reference, not a live integration status page.</CardDescription>
              </div>
              <Badge variant="secondary" className="w-fit text-[10px]">
                Prototype / Demo
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-amber-300">Prototype</h3>
                  <Badge variant="outline" className="text-[10px] border-amber-400/30 text-amber-300">
                    Current state
                  </Badge>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {prototypePoints.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-amber-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-emerald-300">Production</h3>
                  <Badge variant="outline" className="text-[10px] border-emerald-400/30 text-emerald-300">
                    Target state
                  </Badge>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {productionPoints.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              No live integration data is shown in this prototype.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
