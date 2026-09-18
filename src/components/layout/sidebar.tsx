"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Target,
  Send,
  Calendar,
  BarChart3,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { NAV_ITEMS } from "@/data/types";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navigationItems = NAV_ITEMS.reduce(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    },
    {} as Record<string, typeof NAV_ITEMS>
  );

  const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Users,
    GitBranch,
    Target,
    Send,
    Calendar,
    BarChart3,
    Plug,
    Settings,
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: typeof NAV_ITEMS[0]) => {
    const Icon = IconMap[item.icon];
    const active = isActive(item.href);
    
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          active
            ? "bg-primary/10 text-primary border-l-2 border-primary"
            : "text-muted-foreground",
          collapsed && "justify-center px-2"
        )}
        title={collapsed ? item.label : undefined}
        onClick={() => setMobileOpen(false)}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile sheet trigger */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-lg bg-background border border-border">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </SheetTrigger>
        <SheetContent className="w-64 p-0 max-h-full fixed left-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">POND</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">RevOps OS</span>
              </div>
              <SheetClose>
                <X className="h-5 w-5" aria-hidden="true" />
              </SheetClose>
            </div>
            <ScrollArea className="flex-1">
              <nav className="flex-1 p-4 space-y-6">
                {Object.entries(navigationItems).map(([section, items]) => (
                  <div key={section}>
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.toUpperCase()}
                    </p>
                    <div className="space-y-1">
                      {items.map(renderNavItem)}
                    </div>
                  </div>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-200",
          "flex flex-col",
          collapsed ? "w-16" : "w-64",
          "lg:block"
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className={cn("flex items-center gap-2 transition-opacity", collapsed && "opacity-0")}>
            <span className="text-xl font-bold tracking-tight">POND</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">RevOps OS</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", collapsed && "justify-center")}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex-1 p-4 space-y-6" aria-label="Main navigation">
            {Object.entries(navigationItems).map(([section, items]) => (
              <div key={section}>
                <p className={cn(
                  "mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-opacity",
                  collapsed && "opacity-0 pointer-events-none h-0 overflow-hidden"
                )}>
                  {section.toUpperCase()}
                </p>
                <div className="space-y-1">
                  {items.map(renderNavItem)}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t p-4">
          <div className={cn("flex items-center gap-3 px-3 py-2", collapsed && "justify-center")}>
            <div className={cn("h-8 w-8 rounded-full bg-muted flex items-center justify-center", collapsed && "mx-auto")}>
              <span className="text-xs font-medium text-muted-foreground">U</span>
            </div>
            <div className={cn("flex-1 min-w-0", collapsed && "hidden")}>
              <p className="text-sm font-medium truncate">Current User</p>
              <p className="text-xs text-muted-foreground truncate">user@company.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}