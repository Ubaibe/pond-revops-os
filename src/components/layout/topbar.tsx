"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Search, Bell, ChevronDown, Sun, Moon, LogOut, User, Settings } from "lucide-react";

const pageTitles: Record<string, { title: string; breadcrumb?: string }> = {
  "/": { title: "Dashboard" },
  "/clients": { title: "Clients" },
  "/pipeline": { title: "Pipeline" },
  "/prospects": { title: "Prospects" },
  "/outbound": { title: "Outbound" },
  "/meetings": { title: "Meetings" },
  "/reports": { title: "Reports" },
  "/integrations": { title: "Integrations" },
  "/settings": { title: "Settings" },
};

export function TopBar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const pageInfo = pageTitles[pathname] || { title: "Dashboard" };

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
              POND
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm font-medium text-foreground">{pageInfo.title}</span>
            {pageInfo.breadcrumb && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">{pageInfo.breadcrumb}</span>
              </>
            )}
          </div>
          
          <div className="relative flex-1 max-w-xl hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search deals, contacts, companies..."
              className="pl-10 h-9 bg-muted/50 border-border/50 focus:border-primary focus:bg-background"
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              aria-label="Global search"
            />
            {searchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-popover p-2 shadow-lg">
                <p className="px-3 py-2 text-sm text-muted-foreground">Search functionality coming soon</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 relative" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0" aria-label="User menu">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt="Current user" />
                  <AvatarFallback className="text-xs font-medium">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">Current User</p>
                <p className="text-xs text-muted-foreground truncate">user@company.com</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2" onClick={() => {}}>
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => {}}>
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}