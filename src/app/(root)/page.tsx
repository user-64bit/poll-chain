import { PollDashboard } from "@/components/poll-dashboard";

export default async function HomePage() {
  return (
    <>
      <div className="mx-auto p-4 text-foreground">
        <PollDashboard />
      </div>
    </>
  );
}
