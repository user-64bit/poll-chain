"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

interface Candidate {
  name: string;
  votes: number;
  color: string;
}

interface PollData {
  id: string;
  title: string;
  totalVotes: number;
  publicKey: string;
  startDate: string;
  endDate: string;
  options: Candidate[];
}
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function Poll({ pollData }: { pollData: PollData }) {
  if (!pollData) {
    return <div>Loading...</div>;
  }

  const totalVotes = pollData.totalVotes;

  return (
    <div className="mx-auto text-foreground">
      <h1 className="text-3xl font-bold mb-6">{pollData.title}</h1>
      <div className="flex flex-col gap-y-4">
        <Card className={totalVotes > 0 ? `w-full` : "w-[650px]"}>
          <CardHeader>
            <CardTitle className="text-center underline">
              Vote Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalVotes !== 0 ? (
              <ChartContainer className="w-full" config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pollData.options}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="votes"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pollData.options.length > 0 &&
                        pollData.options.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="font-bold text-center py-4 underline">
                No vote has been made yet.
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mx-auto"></div>
        <Card className={totalVotes > 0 ? `w-full` : "w-[650px]"}>
          <CardHeader>
            <CardTitle>Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {pollData.options.map((option) => (
                <li
                  key={option.name}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: option.color }}
                    ></div>
                    <span>{option.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">{option.votes}</span>
                    <span className="text-sm text-muted-foreground">
                      ({((option.votes / totalVotes) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
