import { COLORS } from "./colors";
import { CandidateProps, PollProps } from "./types";

export function searilizedPollData(
  poll: PollProps,
  candidates: CandidateProps[]
) {
  let candidatesData: any = [];
  for (let candidate of candidates) {
    candidatesData.push({
      id: candidate.id,
      name: candidate.name,
      votes: candidate.votes,
      color: COLORS[candidate.id],
    });
  }
  const now = new Date();
  const startDate = new Date(poll.startDate);
  const endDate = new Date(poll.endDate);
  let status = "closed";
  if (now < startDate) {
    status = "upcoming";
  } else if (now >= startDate && now <= endDate) {
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