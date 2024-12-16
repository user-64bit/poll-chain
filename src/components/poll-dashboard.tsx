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
import { PollProps } from "@/utils/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import { FilterDropdown } from "./filter-dropdown";
import PollDashboardPlaceholder from "./poll-dashboard-placeholder/poll-dashboard-placeholder";
import { Spinner } from "./spinner";
import { Button } from "./ui/button";

export const PollDashboard = () => {
  const [polls, setPolls] = useState<PollProps[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<PollProps[]>([]);
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<string>("running");

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

  const fetchAllPolls = async () => {
    const data = await getAllPollsWithCandidates({ program: programReadOnly });
    setPolls(data);
    const pollCounter = await getPollCounter(programReadOnly);
    setIsInitialized(pollCounter.toNumber() >= 0);
  };

  useEffect(() => {
    if (!programReadOnly) return;
    fetchAllPolls();
  }, [programReadOnly, polls]);

  useEffect(() => {
    const updatedFilteredPolls = polls.filter((poll) => {
      if (currentState === "upcoming") return currentTime < poll.startDate;
      if (currentState === "running")
        return currentTime >= poll.startDate && currentTime <= poll.endDate;
      if (currentState === "closed") return currentTime > poll.endDate;
      return true;
    });
    setFilteredPolls(updatedFilteredPolls);
  }, [polls, currentState]);

  const handleFilter = (state: string) => {
    setCurrentState(state);
  };

  // const handleInitialize = async () => {
  //   if (isInitialized && !!publicKey) return;
  //   setIsLoading(true);
  //   try {
  //     const transaction = await initialize({
  //       program: program as any,
  //       publicKey: publicKey as any,
  //     });
  //     console.log("Transaction signature:", transaction);
  //   } catch (error) {
  //     console.error("Initialization failed:", error);
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <>
      {isInitialized && (
        <div>
          <div className="flex gap-x-5 items-center">
            <CreatePollDialog program={program!} publicKey={publicKey!} />
            <FilterDropdown
              onFilter={handleFilter}
              currentState={currentState}
            />
          </div>
          {filteredPolls.length > 0 && (
            <div className="flex gap-4 flex-wrap gax-4 mt-4">
              {filteredPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          )}
          {filteredPolls.length === 0 && <PollDashboardPlaceholder />}
        </div>
      )}
      {!isInitialized && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <Spinner size={"lg"} />
        </div>
      )}

      {/* TODO: Uncomment below and comment above code when the contract needs to be deployed with new programId */}
      {/* {!isInitialized && (
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
      )} */}
    </>
  );
};
