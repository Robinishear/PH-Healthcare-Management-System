"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";

export const PublicFooter = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/30 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
                <HeartPulse className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  PH <span className="text-primary">HealthCare</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Hospital & Patient Care
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Empowering patients and medical providers with cutting-edge digital
              healthcare management, effortless doctor appointments, and personalized
              wellness solutions.
            </p>

            <div className="space-y-2 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-primary shrink-0" />
                <span>+1 (800) 744-2273 (24/7 Hotline)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-primary shrink-0" />
                <span>support@phhealthcare.org</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4 text-primary shrink-0" />
                <span>742 Evergreen Healthcare Ave, Suite 500</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-4 lg:col-span-2 lg:pl-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="transition-colors hover:text-primary">
                  Top Doctors
                </Link>
              </li>
              <li>
                <Link href="/diagnostics" className="transition-colors hover:text-primary">
                  Diagnostics Lab
                </Link>
              </li>
              <li>
                <Link href="/medicine" className="transition-colors hover:text-primary">
                  Medicine Store
                </Link>
              </li>
              <li>
                <Link href="/health-plans" className="transition-colors hover:text-primary">
                  Health Plans
                </Link>
              </li>
              <li>
                <Link href="/ngos" className="transition-colors hover:text-primary">
                  NGO Healthcare
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Patient Care */}
          <div className="space-y-4 lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Patient Care
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="#how-it-works" className="transition-colors hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="transition-colors hover:text-primary">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-primary">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition-colors hover:text-primary">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="transition-colors hover:text-primary">
                  Emergency Consult
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Trust */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Stay Informed
            </h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to get monthly health insights, emergency updates, and wellness tips.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex items-center gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-10 bg-background"
              />
              <Button type="submit" size="sm" className="h-10 shrink-0 gap-1.5">
                <span>Join</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </form>

            <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-primary" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} PH HealthCare Management System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/" className="transition-colors hover:text-foreground">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
