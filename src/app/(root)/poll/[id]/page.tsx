import {
  getAllCandidatesOfPoll,
  getPollbyID,
  getReadonlyProvider,
} from "@/actions/blockchain.actions";
import { searilizedPollData } from "@/utils/helper";
import { Metadata } from "next";
import { Spinner } from "@/components/spinner";
import Poll from "@/components/poll";

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

export default async function PollIDPage({
  params,
}: {
  params: { id: string };
}) {
  const readonly = getReadonlyProvider();
  const poll = await getPollbyID({
    program: readonly,
    pollAddress: params.id,
  });
  const candidates = await getAllCandidatesOfPoll({
    program: readonly,
    id: poll.id.toString(),
  });
  const pollData = searilizedPollData(poll, candidates);

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
