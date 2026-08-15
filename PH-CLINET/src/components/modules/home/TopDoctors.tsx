"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BookAppointmentModal from "@/components/modules/Patient/Appointments/BookAppointmentModal";
import { getDoctors } from "@/services/doctor.services";
import { Gender, IDoctor, UserStatus } from "@/types/doctor.types";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Sparkles,
  Star,
  Stethoscope,
} from "lucide-react";

interface TopDoctorsProps {
  isAuthenticated?: boolean;
  viewerRole?: string | null;
  initialDoctors?: IDoctor[];
}

const getDoctorInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("") || "DR";
};

// Fallback high-quality doctors in case database returns fewer than 3 records
const fallbackTopDoctors: IDoctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@phcare.org",
    profilePhoto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    designation: "Senior Cardiologist",
    currentWorkingPlace: "National Heart & Lung Institute",
    qualification: "MD, FACC, FCPS (Cardiology)",
    registrationNumber: "BMDC-68291",
    experience: 12,
    appointmentFee: 85,
    averageRating: 4.9,
    gender: Gender.FEMALE,
    createdAt: new Date(),
    user: { status: UserStatus.ACTIVE },
    specialties: [
      {
        specialtyId: "spec-1",
        doctorId: "1",
        specialty: { id: "spec-1", title: "Cardiology", icon: "Heart" },
      },
      {
        specialtyId: "spec-2",
        doctorId: "1",
        specialty: { id: "spec-2", title: "Internal Medicine", icon: "Activity" },
      },
    ],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "michael.chen@phcare.org",
    profilePhoto: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    designation: "Consultant Neurologist",
    currentWorkingPlace: "Metropolitan Neuroscience Center",
    qualification: "MBBS, MD (Neurology), PhD",
    registrationNumber: "BMDC-74912",
    experience: 15,
    appointmentFee: 95,
    averageRating: 4.95,
    gender: Gender.MALE,
    createdAt: new Date(),
    user: { status: UserStatus.ACTIVE },
    specialties: [
      {
        specialtyId: "spec-3",
        doctorId: "2",
        specialty: { id: "spec-3", title: "Neurology", icon: "Brain" },
      },
      {
        specialtyId: "spec-4",
        doctorId: "2",
        specialty: { id: "spec-4", title: "Neuro Surgery", icon: "Zap" },
      },
    ],
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@phcare.org",
    profilePhoto: "https://images.unsplash.com/photo-1594824813589-3221a6015b63?auto=format&fit=crop&q=80&w=400",
    designation: "Chief Pediatrician",
    currentWorkingPlace: "St. Jude Children's Hospital",
    qualification: "MBBS, DCH, MRCPCH (UK)",
    registrationNumber: "BMDC-81045",
    experience: 10,
    appointmentFee: 70,
    averageRating: 4.88,
    gender: Gender.FEMALE,
    createdAt: new Date(),
    user: { status: UserStatus.ACTIVE },
    specialties: [
      {
        specialtyId: "spec-5",
        doctorId: "3",
        specialty: { id: "spec-5", title: "Pediatrics", icon: "Baby" },
      },
      {
        specialtyId: "spec-6",
        doctorId: "3",
        specialty: { id: "spec-6", title: "Child Care", icon: "Smile" },
      },
    ],
  },
];

export const TopDoctors = ({
  isAuthenticated = false,
  viewerRole = null,
  initialDoctors = [],
}: TopDoctorsProps) => {
  const { data: response } = useQuery({
    queryKey: ["top-doctors-featured"],
    queryFn: () => getDoctors("limit=3&sortBy=averageRating&sortOrder=desc"),
    staleTime: 1000 * 60 * 15,
  });

  const apiDoctors = response?.data;
  const validFetchedDoctors =
    Array.isArray(apiDoctors) && apiDoctors.length > 0
      ? apiDoctors
      : Array.isArray(initialDoctors) && initialDoctors.length > 0
      ? initialDoctors
      : [];

  // Display fetched doctors if at least 3 exist, otherwise fill with fallback high quality doctors
  const displayDoctors: IDoctor[] =
    validFetchedDoctors.length >= 3
      ? validFetchedDoctors.slice(0, 3)
      : validFetchedDoctors.length > 0
      ? [...validFetchedDoctors, ...fallbackTopDoctors].slice(0, 3)
      : fallbackTopDoctors;

  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>Certified Healthcare Specialists</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Meet Our Top Doctors
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              Book consultations with top-rated medical experts with proven clinical excellence.
            </p>
          </div>

          {/* Desktop Show All Link */}
          <Button asChild variant="outline" className="hidden gap-2 md:flex">
            <Link href="/consultation">
              <span>Show All Doctors</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Doctors Card Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayDoctors.map((doctor) => {
            const specialtiesList =
              doctor.specialties?.map((s) => s.specialty?.title).filter(Boolean) ?? [];

            return (
              <article
                key={String(doctor.id)}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                {/* Top Accent Line */}
                <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-linear-to-r from-primary via-sky-500 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100" />

                {/* Header: Doctor Avatar, Name, Rating */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <Avatar className="size-16 ring-2 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
                      <AvatarImage
                        src={doctor.profilePhoto}
                        alt={doctor.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 font-bold text-primary">
                        {getDoctorInitials(doctor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="truncate text-base font-bold text-foreground group-hover:text-primary">
                        {doctor.name}
                      </h3>
                      <div className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        <span>{doctor.averageRating?.toFixed(1) ?? "4.9"}</span>
                      </div>
                    </div>
                    <p className="truncate text-xs font-medium text-primary">
                      {doctor.designation || "Specialist Doctor"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {doctor.currentWorkingPlace || "Central Medical Hospital"}
                    </p>
                  </div>
                </div>

                {/* Qualifications & Badges */}
                <div className="mt-4 flex flex-col gap-1.5 rounded-xl bg-muted/40 p-3.5 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="size-3.5 text-primary shrink-0" />
                    <span className="truncate">{doctor.qualification || "MBBS, Specialist"}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/50 text-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="size-3.5 text-primary" />
                      <span>{doctor.experience ?? 5}+ Years Exp.</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-bold">
                      <span>Fee:</span>
                      <span>${doctor.appointmentFee?.toFixed(2) ?? "50.00"}</span>
                    </div>
                  </div>
                </div>

                {/* Specialties Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {specialtiesList.length > 0 ? (
                    specialtiesList.slice(0, 3).map((spec) => (
                      <Badge
                        key={`${doctor.id}-${spec}`}
                        variant="secondary"
                        className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                      >
                        {spec}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary" className="text-[11px]">
                      General Medicine
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto grid gap-2.5 pt-6 sm:grid-cols-2">
                  <BookAppointmentModal
                    doctorId={String(doctor.id)}
                    doctorName={doctor.name}
                    isAuthenticated={isAuthenticated}
                    viewerRole={viewerRole}
                    triggerClassName="w-full"
                    fullWidth
                  />

                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/consultation/doctor/${doctor.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile & Bottom CTA Button to See All Doctors */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 w-full max-w-xs gap-2 rounded-xl text-base font-semibold shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 hover:scale-[1.02]"
          >
            <Link href="/consultation">
              <Stethoscope className="size-5" />
              <span>Show All Doctors</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Explore 500+ verified doctors across all specialties
          </p>
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;
