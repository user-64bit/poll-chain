import {
  getAllCandidatesOfPoll,
  getPollbyID,
  getReadonlyProvider,
} from "@/actions/blockchain.actions";
import Poll from "@/components/poll";
import { CandidateProps, PollProps } from "@/utils/types";

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

function adjustPollData(poll: PollProps, candidates: CandidateProps[]) {
  let candidatesData: any = [];
  for (let candidate of candidates) {
    candidatesData.push({
      label: candidate.name,
      votes: candidate.votes,
      color: COLORS[candidate.id],
    });
  }
  return {
    ...poll,
    id: poll.id,
    title: poll.title,
    totalVotes: poll.options.reduce((acc, curr) => acc + curr.votes, 0),
    startDate: poll.startDate,
    endDate: poll.endDate,
    options: candidatesData,
  };
}
export default async function PollIDPage({ params }: { params: any }) {
  const id = await params.id;
  const readonly = getReadonlyProvider();
  const poll = await getPollbyID({ program: readonly, pollAddress: id });
  const candidates = await getAllCandidatesOfPoll({
    program: readonly,
    id: poll.id.toString(),
  });
  const pollData = adjustPollData(poll, candidates);
  return (
    <>
      <Poll pollData={pollData} />
    </>
  );
}
