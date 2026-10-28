import { TripNav } from "@/components/nav/trip-nav";

export default async function TripLayout({
  children,
  params,
}: LayoutProps<"/trips/[tripId]">) {
  const { tripId } = await params;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <TripNav tripId={tripId} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
    </div>
  );
}
