"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";

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

enum PollStatus {
  upcoming,
  active,
  closed,
}

export const PollCard = ({ poll }: { poll: Poll }) => {
  const [pollStatus, setPollStatus] = useState<PollStatus>(PollStatus.upcoming);
  const pollStartDate = new Date(poll.startDate);
  const pollEndDate = new Date(poll.endDate);
  const now = new Date();
  const diffDays = Math.ceil(
    Math.abs(
      (pollStatus === PollStatus.upcoming
        ? pollStartDate.getTime()
        : pollEndDate.getTime()) - now.getTime()
    ) /
      (1000 * 60 * 60 * 24)
  );

  useEffect(() => {
    if (now >= pollStartDate && now <= pollEndDate) {
      setPollStatus(PollStatus.active);
    } else if (now < pollStartDate) {
      setPollStatus(PollStatus.upcoming);
    } else {
      setPollStatus(PollStatus.closed);
    }
  }, [poll.startDate, poll.endDate]);

  return (
    <Card className="w-full flex flex-col p-2 shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          {poll.title.slice(0, 30) + "..."}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between py-2">
        {pollStatus !== PollStatus.upcoming ? (
          <div className="space-y-2">
            <TooltipProvider>
              <div className="w-full h-6 rounded-full overflow-hidden flex cursor-pointer">
                {poll.options.map((option) => (
                  <Tooltip key={option.label}>
                    <TooltipTrigger asChild>
                      <div
                        className={`h-full ${option.color} relative transition-all duration-300 ease-in-out`}
                        style={{
                          width: `${(option.votes / poll.totalVotes) * 100}%`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-gray-800 text-white p-2 rounded-xl text-xs"
                    >
                      <p>
                        {option.label}: {option.votes} votes
                      </p>
                      <p>
                        ({((option.votes / poll.totalVotes) * 100).toFixed(1)}%)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        ) : (
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full h-6 rounded-full overflow-hidden flex cursor-pointer">
                    <div
                      className={`h-full bg-gray-700 relative transition-all w-full duration-300 ease-in-out`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-gray-800 text-white p-2 rounded-xl text-xs"
                >
                  <p>No votes casted yet</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <div className="mt-auto space-y-1">
          {pollStatus !== PollStatus.upcoming && (
            <p className="text-sm mt-2">
              Total Votes: <span className="font-bold">{poll.totalVotes}</span>
            </p>
          )}
          <p
            className={cn(
              "text-sm font-medium text-center mt-1",
              pollStatus === PollStatus.upcoming && "text-neutral-content",
              pollStatus === PollStatus.active && "text-success",
              pollStatus === PollStatus.closed && "text-error"
            )}
          >
            {pollStatus === PollStatus.upcoming
              ? `Poll starts in ${diffDays} day${diffDays !== 1 ? "s" : ""}`
              : pollStatus === PollStatus.active
              ? `Poll ends in ${diffDays} day${diffDays !== 1 ? "s" : ""}`
              : "Poll is closed"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button className="w-full rounded-full transition-colors duration-300">
          View Poll
        </Button>
      </CardFooter>
    </Card>
  );
};
