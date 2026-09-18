"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Bell, Palette, Database, Key, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("profile");

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 overflow-x-auto pb-2">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
            <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-2" />Appearance</TabsTrigger>
            <TabsTrigger value="integrations"><Database className="h-4 w-4 mr-2" />Integrations</TabsTrigger>
            <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
            <TabsTrigger value="api"><Key className="h-4 w-4 mr-2" />API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground">U</span>
                  </div>
                  <div>
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Current" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="User" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="user@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="America/Los_Angeles" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button><Save className="h-4 w-4 mr-2" />Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: "Email Notifications", description: "Receive email updates for important events", items: ["Deal stage changes", "New meeting scheduled", "Prospect replies", "Weekly pipeline digest"] },
                  { title: "In-App Notifications", description: "Real-time notifications within the application", items: ["Deal updates", "Meeting reminders", "Task assignments", "Mentions"] },
                  { title: "Push Notifications", description: "Browser push notifications (requires permission)", items: ["Urgent deal alerts", "Meeting starting soon", "High-priority tasks"] },
                ].map((section) => (
                  <div key={section.title} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="ml-10 space-y-2">
                      {section.items.map((item) => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                          <Switch defaultChecked />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="font-medium">Theme</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {["Light", "Dark", "System"].map((theme) => (
                      <label
                        key={theme}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="theme"
                          defaultChecked={theme === "Dark"}
                          className="sr-only"
                        />
                        <div className={`p-4 border rounded-lg transition-colors ${
                          theme === "Dark"
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}>
                          <div className="font-medium">{theme}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <p className="font-medium">Density</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {["Compact", "Comfortable", "Spacious"].map((density) => (
                      <label
                        key={density}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="density"
                          defaultChecked={density === "Comfortable"}
                          className="sr-only"
                        />
                        <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                          <div className="font-medium">{density}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Connected Integrations</CardTitle>
                <CardDescription>Manage your connected GTM tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Attio", "Apollo", "Clay", "Granola"].map((name) => (
                  <div key={name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Database className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session Management</p>
                      <p className="text-sm text-muted-foreground">View and manage active sessions</p>
                    </div>
                    <Button variant="ghost">View Sessions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API keys for programmatic access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Production Key</p>
                    <p className="text-sm text-muted-foreground font-mono">pond_live_••••••••••••••••</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Globe className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive">Revoke</Button>
                  </div>
                </div>
                <Button variant="outline"><Key className="h-4 w-4 mr-2" />Generate New Key</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}