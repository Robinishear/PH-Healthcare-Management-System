"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background py-16 sm:py-24 lg:py-28">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-24 -z-10 size-[350px] rounded-full bg-sky-500/10 blur-2xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Hero Text & CTAs */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
              <Sparkles className="size-3.5" />
              <span>Smart Healthcare Management</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Compassionate Care, <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-primary via-sky-600 to-blue-600 bg-clip-text text-transparent">
                Expert Doctors
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl">
              Access certified physicians, schedule instant consultations, manage
              prescriptions, and experience hassle-free healthcare designed around you.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 rounded-xl px-6 text-base font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                <Link href="/consultation">
                  <Search className="size-4" />
                  <span>Find a Doctor</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 gap-2 rounded-xl border-border px-6 text-base font-medium transition-all duration-200 hover:bg-muted"
              >
                <Link href="#how-it-works">
                  <span>How It Works</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Trust Highlights */}
            <div className="mt-10 grid grid-cols-2 gap-4 text-left sm:grid-cols-3 sm:gap-6">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground sm:text-sm">Verified Specialists</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground sm:text-sm">Secure Records</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground sm:text-sm">24/7 Availability</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card Grid */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md space-y-4">
              {/* Card 1: Emergency & Quick Access */}
              <div className="group rounded-2xl border border-border/80 bg-card/90 p-5 shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                      <PhoneCall className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">24/7 Emergency Line</h4>
                      <p className="text-xs text-muted-foreground">Immediate medical guidance</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
                    Live
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/60 px-3.5 py-2.5">
                  <span className="text-xs font-medium text-muted-foreground">Direct Hotline</span>
                  <span className="font-mono text-sm font-bold text-primary">+1 (800) 744-2273</span>
                </div>
              </div>

              {/* Card 2: Doctors & Fast Booking */}
              <div className="group rounded-2xl border border-border/80 bg-card/90 p-5 shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Stethoscope className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Top Rated Specialists</h4>
                      <p className="text-xs text-muted-foreground">Over 30+ Medical Departments</p>
                    </div>
                  </div>
                  <Award className="size-5 text-amber-500" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-base font-bold text-foreground">500+</p>
                    <p className="text-[10px] text-muted-foreground">Doctors</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-base font-bold text-foreground">25k+</p>
                    <p className="text-[10px] text-muted-foreground">Patients</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-base font-bold text-foreground">99.4%</p>
                    <p className="text-[10px] text-muted-foreground">Satisfaction</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Instant Appointment */}
              <div className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card/90 p-4 shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CalendarCheck className="size-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Instant Booking</h5>
                    <p className="text-[11px] text-muted-foreground">No waiting queues</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="secondary" className="h-8 text-xs font-semibold">
                  <Link href="/consultation">Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
