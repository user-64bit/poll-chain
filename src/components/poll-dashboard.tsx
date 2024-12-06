"use client";

import {
  getAllPollsWithCandidates,
  getPollCounter,
  getProvider,
  getReadonlyProvider,
  initialize,
} from "@/actions/blockchain.actions";
import { CreatePollDialog } from "@/components/create-poll";
import { PollCard } from "@/components/poll-card";
import { PlaceholderPollCard } from "@/components/poll-placeholder";
import { PollProps } from "@/utils/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";

const dummyPolls: any[] = [
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

export const PollDashboard = () => {
  const [polls, setPolls] = useState<PollProps[]>([]);
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const programReadOnly = useMemo(() => getReadonlyProvider(), []);
  const program = useMemo(
    () =>
      getProvider({
        publicKey,
        signTransaction,
        signAllTransactions,
      }),
    [publicKey, signTransaction, signAllTransactions]
  );

  const fetchData = async () => {
    getAllPollsWithCandidates({ program: programReadOnly }).then((data) =>
      setPolls(data as any)
    );
    const pollCounter = await getPollCounter(programReadOnly);
    setIsInitialized(pollCounter.toNumber() >= 0);
  };

  useEffect(() => {
    if (!programReadOnly) return;
    fetchData();
  }, [programReadOnly]);

  const handleInitialize = async () => {
    if (isInitialized && !!publicKey) return;
    setIsLoading(true);
    try {
      const transaction = await initialize({
        program: program as any,
        publicKey: publicKey as any,
      });
      console.log("Transaction signature:", transaction);
    } catch (error) {
      console.error("Initialization failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isInitialized && (
        <div>
          <CreatePollDialog program={program!} publicKey={publicKey!} />
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
                <h1 className="text-2xl font-bold opacity-50">
                  No polls found
                </h1>
                <p className="text-gray-500 opacity-70">
                  Create your first poll to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      {!isInitialized && (
        <div>
          <div>
            <Button
              onClick={() => handleInitialize()}
              size={"lg"}
              className="w-full transition-colors duration-300"
            >
              {isLoading ? "Initializing..." : "Initialize"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
