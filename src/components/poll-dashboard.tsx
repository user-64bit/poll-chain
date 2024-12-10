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
import { FilterDropdown } from "./filter-dropdown";
import { Button } from "./ui/button";
import { Spinner } from "./spinner";

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
  const [filteredPolls, setFilteredPolls] = useState<PollProps[]>([]);
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentTime = Date.now();

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
    const data = await getAllPollsWithCandidates({ program: programReadOnly });
    setPolls(data);
    setFilteredPolls(
      data.filter(
        (poll) => currentTime >= poll.startDate && currentTime <= poll.endDate
      )
    );
    const pollCounter = await getPollCounter(programReadOnly);
    setIsInitialized(pollCounter.toNumber() >= 0);
  };

  useEffect(() => {
    if (!programReadOnly) return;
    fetchData();
  }, [programReadOnly, polls]);

  const handleFilter = (state: string) => {
    const filtered = polls.filter((poll) => {
      if (state === "upcoming") {
        return currentTime < poll.startDate;
      }
      if (state === "running") {
        return currentTime >= poll.startDate && currentTime <= poll.endDate;
      }
      if (state === "closed") {
        return currentTime > poll.endDate;
      }
      if (state === "all") {
        return true;
      }
      return false;
    });
    setFilteredPolls(filtered);
  };

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
          <div className="flex justify-between">
            <CreatePollDialog program={program!} publicKey={publicKey!} />
            <FilterDropdown onFilter={handleFilter} />
          </div>
          {filteredPolls.length > 0 && (
            <div className="flex gap-4 flex-wrap gax-4 mt-4">
              {filteredPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          )}
          {filteredPolls.length === 0 && (
            <div className="w-full">
              <div className="flex justify-around gap-x-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 mt-4">
                  {dummyPolls.map((poll) => (
                    <PlaceholderPollCard key={poll.id} poll={poll} />
                  ))}
                </div>
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
          <div className="flex flex-col justify-center items-center">
            <Button
              onClick={() => handleInitialize()}
              size={"lg"}
              className="transition-colors duration-300"
            >
              {isLoading ? <Spinner /> : "Initialize"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
