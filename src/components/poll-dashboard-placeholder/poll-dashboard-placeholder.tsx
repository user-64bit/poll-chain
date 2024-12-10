import { PlaceholderPollCard } from "../poll-placeholder";
import { dummyPolls } from "./constant";

export default function PollDashboardPlaceholder() {
  return (
    <div className="w-full">
      <div className="flex justify-around gap-x-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 mt-4">
          {dummyPolls.map((poll) => (
            <PlaceholderPollCard key={poll.id} poll={poll} />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <h1 className="text-2xl font-bold opacity-50">No polls found</h1>
        <p className="text-gray-500 opacity-70">
          Create your first poll to get started.
        </p>
      </div>
    </div>
  );
}
