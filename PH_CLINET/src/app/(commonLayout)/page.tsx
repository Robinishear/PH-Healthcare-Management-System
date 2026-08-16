import {
  PublicNavbar,
  Hero,
  Steps,
  TopDoctors,
  PublicFooter,
} from "@/components/modules/home";
import { getUserInfo } from "@/services/auth.services";
import { getDoctors } from "@/services/doctor.services";
import { IDoctor } from "@/types/doctor.types";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

export default async function Home() {
  const currentUser = await getUserInfo();

  const queryClient = new QueryClient();

  let initialDoctors: IDoctor[] = [];

  try {
    const fetchedResponse = await getDoctors(
      "limit=3&sortBy=averageRating&sortOrder=desc"
    );
    if (Array.isArray(fetchedResponse?.data)) {
      initialDoctors = fetchedResponse.data;
    }
  } catch (error) {
    console.error("Home page: could not fetch top doctors", error);
  }

  await queryClient.prefetchQuery({
    queryKey: ["top-doctors-featured"],
    queryFn: () => getDoctors("limit=3&sortBy=averageRating&sortOrder=desc"),
    staleTime: 1000 * 60 * 15,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        {/* Navigation Bar */}
        <PublicNavbar userInfo={currentUser} />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero />
          <Steps />
          <TopDoctors
            isAuthenticated={Boolean(currentUser)}
            viewerRole={currentUser?.role ?? null}
            initialDoctors={initialDoctors}
          />
        </main>

        {/* Public Footer */}
        <PublicFooter />
      </div>
    </HydrationBoundary>
  );
}
