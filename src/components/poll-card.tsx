"use client";

import { cn } from "@/lib/utils";
import { PollProps, PollStatus } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { getPollWinner } from "@/utils/helper";
import SharePollDialog from "./share-poll-dailog";

export const PollCard = ({ poll }: { poll: PollProps }) => {
  const router = useRouter();
  const [pollStatus, setPollStatus] = useState<PollStatus>(PollStatus.upcoming);
  const pollStartDate = new Date(poll.startDate);
  const pollEndDate = new Date(poll.endDate);
  const pollOutput = getPollWinner(poll);
  const now = new Date();
  const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
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
    <Card className="w-full lg:w-[300px] flex flex-col p-1 shadow-xl cursor-default">
      <CardHeader className="pb-2">
        <p className="text-sm text-center underline">
          {pollStatus === PollStatus.closed && pollOutput
            ? `${pollOutput.name} won the poll 🎉`
            : "No winner for this poll."}
        </p>
        <CardTitle className="text-lg font-semibold">
          {poll.title.slice(0, 30)}
          {poll.options.length > 30 && "..."}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between py-2">
        {totalVotes > 0 ? (
          <div className="space-y-2">
            <TooltipProvider>
              <div className="w-full h-6 rounded-full overflow-hidden flex cursor-pointer">
                {poll.options.map((option) => (
                  <Tooltip key={option.name}>
                    <TooltipTrigger asChild>
                      <div
                        className={`h-full ${option.color} relative transition-all duration-300 ease-in-out`}
                        style={{
                          width: `${(option.votes / totalVotes) * 100}%`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-gray-800 text-white p-2 rounded-xl text-xs"
                    >
                      <p>
                        {option.name}: {option.votes} votes
                      </p>
                      <p>
                        ({((option.votes / totalVotes) * 100).toFixed(1)}
                        %)
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
              Total Votes: <span className="font-bold">{totalVotes ?? 0}</span>
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
      <CardFooter className="pt-2 pb-4 flex gap-x-2">
        <Button
          onClick={() => router.push("/poll/" + poll.publicKey)}
          className="w-full rounded-full transition-colors duration-300"
        >
          View Poll
        </Button>
        <SharePollDialog pollAdress={poll.publicKey} candidates={poll.options} />
      </CardFooter>
    </Card>
  );
};
