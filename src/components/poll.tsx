"use client";

import { getProvider, hasVoted, vote } from "@/actions/blockchain.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { getPollWinner } from "@/utils/helper";
import { PollProps } from "@/utils/types";
import { BN, Program } from "@coral-xyz/anchor";
import { Polly } from "@project/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import SharePollDialog from "./share-poll-dailog";
import { Spinner } from "./spinner";
import { Button } from "./ui/button";
import { Share2 } from "lucide-react";

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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={"middle"}
      dominantBaseline="central"
      className="rounded-full"
    >
      {name.length > 20 ? `${name.slice(0, 10)}...` : name}
      {` (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

export default function Poll({ pollData }: { pollData: PollProps }) {
  const router = useRouter();
  const totalVotes = pollData.totalVotes;
  const [voted, setVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pollOutput = getPollWinner(pollData);
  const { publicKey, signTransaction, signAllTransactions, wallet } =
    useWallet();
  const program = useMemo(
    () =>
      getProvider({
        publicKey,
        signTransaction,
        signAllTransactions,
      }),
    [publicKey, signTransaction, signAllTransactions]
  );
  const { toast } = useToast();

  const checkVoted = async () => {
    const voteStatus = await hasVoted({
      program: program as Program<Polly>,
      publicKey: publicKey!,
      pollId: new BN(pollData.id),
    });
    setVotedFor(voteStatus?.candidateId.toString() ?? null);
    setVoted(voteStatus?.hasVoted ?? false);
  };

  useEffect(() => {
    if (!program || voted || !publicKey || !pollData) return;
    checkVoted();
  }, [program, publicKey, wallet, voted, setVoted]);

  const handleVote = async (option: any) => {
    if (pollData.status === "closed" || pollData.status === "upcoming") {
      toast({
        title: "Poll is not running",
        description: "You cannot vote in a poll that is not running",
        variant: "destructive",
      });
      return;
    }
    if (!publicKey || !wallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const voteData = await vote({
        program: program as Program<Polly>,
        publicKey: publicKey!,
        pollId: new BN(pollData.id),
        candidateId: new BN(option.id),
      });
      if (voteData.hasVoted) {
        setVoted(true);
        setVotedFor(option.id.toString());
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsLoading(false);
      // Hack: hard refresh to show voting data on page
      window.location.reload();
    }
  };
  return (
    <div className="flex justify-center text-foreground cursor-default">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          <p className="flex items-center gap-x-2 justify-center">
            <span className="border-b-2">{pollData.title}</span>
            <span>
              <SharePollDialog
                pollAdress={pollData.publicKey}
                candidates={pollData.options}
                trigger={<Share2 className="w-5 h-5 text-gray-400 cursor-pointer" />}
              />
            </span>
          </p>
          {pollData.status === "closed" && (
            <span className="text-sm underline text-red-400">
              Poll is closed
            </span>
          )}
          {pollData.status === "upcoming" && (
            <span className="text-sm underline text-gray-400">
              Poll not started
            </span>
          )}
          <p className="text-sm text-center underline">
            {pollData.status === "closed" && pollOutput
              ? `${pollOutput.name} won the poll 🎉`
              : "No winner for this poll."}
          </p>
        </h1>
        <div className="flex flex-col gap-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-lg sm:text-xl">
                <span className="border-b-2">Vote Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] sm:h-[400px]">
              <ChartContainer className="w-full h-full" config={chartConfig}>
                {totalVotes !== 0 ? (
                  <PieChart>
                    <Pie
                      data={pollData.options}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="votes"
                      label={renderCustomizedLabel}
                    >
                      {pollData.options.length > 0 &&
                        pollData.options.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <div className="font-bold text-center py-4">
                    No vote has been made yet.(Be first one to vote)
                    <div className="flex justify-center">
                      <img
                        className="object-contain w-[200px] sm:w-[250px]"
                        src="https://wallpapers.com/images/high/pompadour-giga-chad-kni4u74uoegys5o9.webp"
                      />
                    </div>
                  </div>
                )}
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Candidates</CardTitle>
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
                        className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
                        style={{ backgroundColor: option.color }}
                      ></div>
                      <span className="text-sm sm:text-base">
                        {option.name}
                      </span>
                      {totalVotes > 0 ? (
                        <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                          {`(${((option.votes / totalVotes) * 100).toFixed(
                            1
                          )}%)`}
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                          (0%)
                        </span>
                      )}
                      <span className="ml-2 text-sm sm:text-base">
                        {`(${option.votes} votes)`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Button
                        disabled={voted || pollData.status === "closed"}
                        onClick={() => handleVote(option)}
                      >
                        {isLoading ? (
                          <Spinner />
                        ) : voted && votedFor === option.id.toString() ? (
                          "Voted"
                        ) : (
                          "Vote"
                        )}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
