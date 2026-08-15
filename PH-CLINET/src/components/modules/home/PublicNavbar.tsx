"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserInfo } from "@/types/user.types";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import {
  HeartPulse,
  LayoutDashboard,
  LogIn,
  Menu,
  PhoneCall,
  Sparkles,
  User,
} from "lucide-react";

interface PublicNavbarProps {
  userInfo?: UserInfo | null;
}

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Consultation", href: "/consultation" },
  { title: "Diagnostics", href: "/diagnostics" },
  { title: "Medicine", href: "/medicine" },
  { title: "Health Plans", href: "/health-plans" },
  { title: "NGOs", href: "/ngos" },
];

export const PublicNavbar = ({ userInfo }: PublicNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const dashboardRoute = userInfo ? getDefaultDashboardRoute(userInfo.role) : "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25 transition-all duration-300 group-hover:bg-primary/90">
            <HeartPulse className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              PH <span className="text-primary">HealthCare</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Medical & Wellness
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.title}
                {isActive && (
                  <span className="absolute inset-x-3.5 -bottom-[1px] h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {userInfo ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href={dashboardRoute}>
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button asChild size="sm" className="gap-2">
                <Link href="/my-profile">
                  <User className="size-4" />
                  <span className="max-w-[120px] truncate">{userInfo.name}</span>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="gap-1.5">
                <Link href="/login">
                  <LogIn className="size-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
              <Button asChild size="sm" className="gap-1.5 shadow-sm shadow-primary/20">
                <Link href="/register">
                  <Sparkles className="size-4" />
                  <span>Get Started</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button & Sheet */}
        <div className="flex items-center gap-2 md:hidden">
          {userInfo && (
            <Button asChild size="sm" variant="outline" className="px-2.5">
              <Link href={dashboardRoute}>
                <LayoutDashboard className="size-4" />
              </Link>
            </Button>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-lg"
                aria-label="Toggle Menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-[300px] flex-col p-6 sm:w-[360px]">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <HeartPulse className="size-4" />
                  </div>
                  <span className="font-bold">
                    PH <span className="text-primary">HealthCare</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Nav Items */}
              <div className="mt-6 flex flex-col gap-1.5">
                <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Navigation
                </p>
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{link.title}</span>
                      {isActive && <span className="size-1.5 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Emergency Helpline Banner */}
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                <div className="flex items-center gap-2.5 text-primary">
                  <PhoneCall className="size-4" />
                  <span className="text-xs font-semibold">24/7 Medical Hotline</span>
                </div>
                <p className="mt-1 text-sm font-bold text-foreground">+1 (800) 744-2273</p>
              </div>

              {/* Mobile Auth Actions */}
              <div className="mt-auto pt-6">
                {userInfo ? (
                  <div className="flex flex-col gap-2">
                    <div className="mb-2 rounded-lg bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="text-sm font-semibold text-foreground truncate">{userInfo.name}</p>
                      <p className="text-xs text-primary capitalize">{userInfo.role.toLowerCase()}</p>
                    </div>
                    <Button asChild className="w-full justify-start gap-2" onClick={() => setIsOpen(false)}>
                      <Link href={dashboardRoute}>
                        <LayoutDashboard className="size-4" />
                        <span>Go to Dashboard</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start gap-2" onClick={() => setIsOpen(false)}>
                      <Link href="/my-profile">
                        <User className="size-4" />
                        <span>My Profile</span>
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <Button asChild className="w-full gap-2 shadow-sm" onClick={() => setIsOpen(false)}>
                      <Link href="/register">
                        <Sparkles className="size-4" />
                        <span>Create Free Account</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full gap-2" onClick={() => setIsOpen(false)}>
                      <Link href="/login">
                        <LogIn className="size-4" />
                        <span>Sign In</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
