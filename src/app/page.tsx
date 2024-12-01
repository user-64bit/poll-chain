import { CreatePollDialog } from "@/components/create-poll";
import { PollCard } from "@/components/poll-card";
import { Button } from "@/components/ui/button";

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

const polls: Poll[] = [
  {
    id: "1",
    title: "Favorite Programming Language",
    totalVotes: 1500,
    startDate: "2023-06-01",
    endDate: "2023-06-30",
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
    startDate: "2024-12-15",
    endDate: "2024-12-31",
    options: [
      { label: "VS Code", votes: 500, color: "bg-blue-500" },
      { label: "IntelliJ IDEA", votes: 350, color: "bg-orange-500" },
      { label: "Sublime Text", votes: 200, color: "bg-yellow-500" },
      { label: "Vim", votes: 150, color: "bg-green-500" },
    ],
  },
  {
    id: "3",
    title: "Favorite Frontend Framework",
    totalVotes: 2000,
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    options: [
      { label: "React", votes: 800, color: "bg-blue-500" },
      { label: "Vue", votes: 600, color: "bg-green-500" },
      { label: "Angular", votes: 400, color: "bg-red-500" },
      { label: "Svelte", votes: 200, color: "bg-orange-500" },
    ],
  },
  {
    id: "4",
    title: "Favorite Frontend Framework",
    totalVotes: 2000,
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    options: [
      { label: "React", votes: 800, color: "bg-blue-500" },
      { label: "Vue", votes: 600, color: "bg-green-500" },
      { label: "Angular", votes: 400, color: "bg-red-500" },
      { label: "Svelte", votes: 200, color: "bg-orange-500" },
    ],
  },
  {
    id: "5",
    title: "Favorite Frontend Framework",
    totalVotes: 2000,
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    options: [
      { label: "React", votes: 800, color: "bg-blue-500" },
      { label: "Vue", votes: 600, color: "bg-green-500" },
      { label: "Angular", votes: 400, color: "bg-red-500" },
      { label: "Svelte", votes: 200, color: "bg-orange-500" },
    ],
  },
  {
    id: "6",
    title: "Favorite Frontend Framework",
    totalVotes: 2000,
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    options: [
      { label: "React", votes: 800, color: "bg-blue-500" },
      { label: "Vue", votes: 600, color: "bg-green-500" },
      { label: "Angular", votes: 400, color: "bg-red-500" },
      { label: "Svelte", votes: 200, color: "bg-orange-500" },
    ],
  },
  {
    id: "7",
    title: "Favorite Frontend Framework",
    totalVotes: 2000,
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    options: [
      { label: "React", votes: 800, color: "bg-blue-500" },
      { label: "Vue", votes: 600, color: "bg-green-500" },
      { label: "Angular", votes: 400, color: "bg-red-500" },
      { label: "Svelte", votes: 200, color: "bg-orange-500" },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto p-4 text-foreground">
      <CreatePollDialog />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 mt-4">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
}
