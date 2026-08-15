/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  CalendarClock,
  CheckCircle2,
  Search,
  Sparkles,
  Stethoscope,
} from "lucide-react";

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: typeof Search;
  colorClass: string;
  bgClass: string;
}

const serviceSteps: StepItem[] = [
  {
    number: "01",
    title: "Find Your Doctor",
    description:
      "Browse our directory of top-rated physicians and filter by department, rating, fee, or location.",
    icon: Search,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-500/10 border-blue-500/20",
  },
  {
    number: "02",
    title: "Select Schedule",
    description:
      "View live doctor availability and choose an appointment slot that fits your schedule with zero wait times.",
    icon: CalendarClock,
    colorClass: "text-cyan-600 dark:text-cyan-400",
    bgClass: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    number: "03",
    title: "Instant Confirmation",
    description:
      "Securely confirm your appointment with quick validation, SMS alerts, and calendar notifications.",
    icon: CheckCircle2,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    number: "04",
    title: "Consult & Treatment",
    description:
      "Attend your in-person or online consultation, receive digital prescriptions, and track health records.",
    icon: Stethoscope,
    colorClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-500/10 border-indigo-500/20",
  },
];

export const Steps = () => {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-20 border-y border-border/40 bg-muted/20 py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Seamless Patient Journey</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How To Get Started
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Accessing world-class healthcare is simple and streamlined in four easy steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {serviceSteps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative flex flex-col items-start rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                {/* Step Number Watermark */}
                <span className="pointer-events-none absolute right-4 top-4 font-mono text-3xl font-black text-muted-foreground/15 transition-colors group-hover:text-primary/20">
                  {step.number}
                </span>

                {/* Step Icon Container */}
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl border ${step.bgClass} ${step.colorClass} shadow-xs transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="size-7" />
                </div>

                {/* Step Badge */}
                <span className="mt-5 inline-block rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {step.number}
                </span>

                {/* Step Content */}
                <h3 className="mt-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {/* Bottom decorative bar */}
                <div className="mt-auto pt-4">
                  <div className="h-1 w-8 rounded-full bg-primary/20 transition-all duration-300 group-hover:w-16 group-hover:bg-primary" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Steps;
