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
import { motion } from "framer-motion";
import { CalendarIcon, TrendingUpIcon, CheckCircleIcon, ClockIcon } from "lucide-react";

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

  const statusInfo = {
    [PollStatus.upcoming]: {
      icon: <ClockIcon className="h-4 w-4 mr-1" />,
      text: `Starts in ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
      color: "text-amber-500 dark:text-amber-400",
      bgColor: "bg-amber-500/10 dark:bg-amber-400/10"
    },
    [PollStatus.active]: {
      icon: <TrendingUpIcon className="h-4 w-4 mr-1" />,
      text: `Ends in ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-500/10 dark:bg-green-400/10"
    },
    [PollStatus.closed]: {
      icon: <CheckCircleIcon className="h-4 w-4 mr-1" />,
      text: "Poll is closed",
      color: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-500/10 dark:bg-red-400/10"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="w-full lg:w-[300px]"
    >
      <Card className="w-full h-full flex flex-col p-1 border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden backdrop-blur-sm bg-card/80">
        <CardHeader className="pb-2 relative">
          {pollStatus === PollStatus.closed && pollOutput && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -right-2 -top-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-medium py-1 px-2 rounded-full shadow-md"
            >
              Winner! 🎉
            </motion.div>
          )}
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo[pollStatus].color} ${statusInfo[pollStatus].bgColor} mb-2`}>
            {statusInfo[pollStatus].icon}
            {statusInfo[pollStatus].text}
          </div>
          
          <CardTitle className="text-lg font-semibold group">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-300 dark:to-gray-500 bg-clip-text text-transparent">
              {poll.title.slice(0, 30)}
              {poll.title.length > 30 && "..."}
            </span>
          </CardTitle>
          
          {pollStatus === PollStatus.closed && pollOutput && (
            <p className="text-sm mt-1 font-medium">
              Winner: <span className="font-bold text-primary">{pollOutput.name}</span>
            </p>
          )}
        </CardHeader>
        
        <CardContent className="flex-grow flex flex-col justify-between py-2">
          {totalVotes > 0 ? (
            <div className="space-y-2">
              <TooltipProvider>
                <div className="w-full h-8 rounded-full overflow-hidden flex cursor-pointer bg-muted/30">
                  {poll.options.map((option, index) => (
                    <Tooltip key={option.name}>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(option.votes / totalVotes) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1, type: "spring" }}
                          className={`h-full ${option.color} relative transition-all duration-300 ease-in-out`}
                          whileHover={{ opacity: 0.8 }}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="bg-popover text-popover-foreground border border-border/40 p-2 rounded-xl text-xs shadow-lg"
                      >
                        <p className="font-medium">{option.name}</p>
                        <p>
                          {option.votes} votes ({((option.votes / totalVotes) * 100).toFixed(1)}%)
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
                    <div className="w-full h-8 rounded-full overflow-hidden flex cursor-pointer">
                      <motion.div
                        animate={{ 
                          background: ["hsl(var(--muted))", "hsl(var(--muted-foreground))", "hsl(var(--muted))"] 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full w-full relative opacity-30"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-popover text-popover-foreground p-2 rounded-xl text-xs"
                  >
                    <p>No votes casted yet</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          <div className="mt-auto space-y-1">
            {pollStatus !== PollStatus.upcoming && (
              <p className="text-sm mt-3 flex items-center justify-center">
                <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">Total Votes:</span>{" "}
                <span className="font-bold ml-1">{totalVotes ?? 0}</span>
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 pb-4 flex gap-x-2">
          <Button
            onClick={() => router.push("/poll/" + poll.publicKey)}
            className="w-full rounded-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            View Poll
          </Button>
          <SharePollDialog pollAdress={poll.publicKey} candidates={poll.options} />
        </CardFooter>
      </Card>
    </motion.div>
  );
};
