import { CreatePollDialog } from "@/components/create-poll";
import { PollCard } from "@/components/poll-card";
import { PlaceholderPollCard } from "@/components/poll-placeholder";

interface PollOption {
  label: string;
  votes: number;
  color: string;
}

interface Poll {
  id: string;
  title: string;
  totalVotes: number;
  startDate: string;
  endDate: string;
  options: PollOption[];
}

const dummyPolls: Poll[] = [
  {
    id: "1",
    title: "Favorite Programming Language",
    totalVotes: 1500,
    startDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-1`,
    endDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-28`,
    options: [
      { label: "JavaScript", votes: 600, color: "bg-yellow-500" },
      { label: "Python", votes: 450, color: "bg-blue-500" },
      { label: "Java", votes: 300, color: "bg-red-500" },
      { label: "C++", votes: 150, color: "bg-green-500" },
    ],
  },
  {
    id: "2",
    title: "Preferred Development Environment",
    totalVotes: 1200,
    startDate: `${new Date().getFullYear() + 1}-${
      (new Date().getMonth() + 2) % 12
    }-1`,
    endDate: `${new Date().getFullYear() + 1}-${
      (new Date().getMonth() + 3) % 12
    }-28`,
    options: [
      { label: "VS Code", votes: 500, color: "bg-blue-500" },
      { label: "IntelliJ IDEA", votes: 350, color: "bg-orange-500" },
      { label: "Sublime Text", votes: 200, color: "bg-yellow-500" },
      { label: "Vim", votes: 150, color: "bg-green-500" },
    ],
  },
];

export default function HomePage() {
  const polls: Poll[] = [];
  return (
    <>
      <div className="mx-auto p-4 text-foreground">
        <CreatePollDialog />
        {polls.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 mt-4">
              {polls?.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          </>
        )}
        {polls.length === 0 && (
          <div className="w-full">
            <div className="flex justify-around gap-x-4">
              {
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 mt-4">
                  {dummyPolls.map((poll) => (
                    <PlaceholderPollCard key={poll.id} poll={poll} />
                  ))}
                </div>
              }
            </div>
            <div className="flex flex-col items-center justify-center mt-4">
              <h1 className="text-2xl font-bold opacity-50">No polls found</h1>
              <p className="text-gray-500 opacity-70">
                Create your first poll to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
