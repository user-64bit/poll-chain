import PollID from "@/components/poll-id-page/poll-id-page";

import {
  getAllCandidatesOfPoll,
  getPollbyID,
  getReadonlyProvider,
} from "@/actions/blockchain.actions";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const readonly = getReadonlyProvider();

  try {
    const poll = await getPollbyID({
      program: readonly,
      pollAddress: params.id,
    });

    const candidates = await getAllCandidatesOfPoll({
      program: readonly,
      id: poll.id.toString(),
    });

    return {
      title: `${poll.title} - Poll`,
      description: `Vote in the ${
        poll.title
      } poll. Available candidates: ${candidates
        .map((c) => c.name)
        .join(", ")}`,
      openGraph: {
        title: `${poll.title} - Poll`,
        description: `Vote in the ${
          poll.title
        } poll. Available candidates: ${candidates
          .map((c) => c.name)
          .join(", ")}`,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${poll.title} - Poll`,
        description: `Vote in the ${
          poll.title
        } poll. Available candidates: ${candidates
          .map((c) => c.name)
          .join(", ")}`,
      },
    };
  } catch (error) {
    return {
      title: "Poll Not Found",
      description: "The requested poll could not be found.",
    };
  }
}

export default function PollIDPage() {
  return <PollID />;
}
