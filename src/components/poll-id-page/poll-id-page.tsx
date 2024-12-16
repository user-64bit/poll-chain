"use client";

import {
  getAllCandidatesOfPoll,
  getPollbyID,
  getReadonlyProvider,
} from "@/actions/blockchain.actions";
import Poll from "@/components/poll";
import { Spinner } from "@/components/spinner";
import { searilizedPollData } from "@/utils/helper";
import { PollProps } from "@/utils/types";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function PollID() {
  const { id } = useParams();
  const readonly = useMemo(() => getReadonlyProvider(), []);
  const [pollData, setPollData] = useState<PollProps>();

  const fetchPollData = async () => {
    const poll = await getPollbyID({
      program: readonly,
      pollAddress: id.toString(),
    });
    const candidates = await getAllCandidatesOfPoll({
      program: readonly,
      id: poll.id.toString(),
    });
    const data = searilizedPollData(poll, candidates);
    setPollData(data);
  };
  useEffect(() => {
    fetchPollData();
  }, [pollData]);
  if (!pollData)
    return (
      <div>
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <Spinner size={"lg"} />
        </div>
      </div>
    );
  return (
    <>
      <Poll pollData={pollData} />
    </>
  );
}
