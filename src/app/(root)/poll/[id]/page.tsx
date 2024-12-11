"use client";
import {
  getAllCandidatesOfPoll,
  getPollbyID,
  getReadonlyProvider,
} from "@/actions/blockchain.actions";
import Poll from "@/components/poll";
import { Spinner } from "@/components/spinner";
import { CandidateProps, PollProps } from "@/utils/types";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const COLORS = [
  "#53ca19",
  "#705184",
  "#150cc3",
  "#ad808b",
  "#85234f",
  "#74ffe8",
  "#15f662",
  "#8bf325",
  "#e8377f",
  "#b1541f",
  "#9eb173",
  "#411796",
  "#08cae1",
  "#2e1ece",
  "#be6856",
  "#aea0af",
  "#71193f",
  "#4e7d0e",
  "#447cdf",
  "#090f6d",
];

function searilizedPollData(poll: PollProps, candidates: CandidateProps[]) {
  let candidatesData: any = [];
  for (let candidate of candidates) {
    candidatesData.push({
      id: candidate.id,
      name: candidate.name,
      votes: candidate.votes,
      color: COLORS[candidate.id],
    });
  }
  const now = new Date()
  const startDate = new Date(poll.startDate);
  const endDate = new Date(poll.endDate);
  let status = "closed";
  if (now < startDate){
    status = "upcoming";
  }
  else if (now >= startDate && now <= endDate){
    status = "running";
  }
  return {
    ...poll,
    id: poll.id,
    title: poll.title,
    totalVotes: candidatesData.reduce(
      (acc: any, curr: any) => acc + curr.votes,
      0
    ),
    startDate: poll.startDate,
    endDate: poll.endDate,
    options: candidatesData,
    status,
  };
}
export default function PollIDPage() {
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
