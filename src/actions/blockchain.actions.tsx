import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../../anchor/target/idl/polly.json";
import { Polly } from "../../anchor/target/types/polly";

// constants
const RPC_ENDPOINT = "http://localhost:8899";
const PROGRAM_ID = new PublicKey(idl.address);

// interfaces
interface InitializeParams {
  program: Program<Polly>;
  publicKey: PublicKey;
  sendTransaction: (transaction: any, connection: any) => Promise<string>;
}
interface Poll {
  id: BN;
  title: string;
  startDate: BN;
  endDate: BN;
  candidates: BN;
}
interface Candidate {
  id: BN;
  pollId: BN;
  name: string;
  votes: BN;
  hasRegistered: boolean;
}
interface Vote {
  candidateId: BN;
  pollId: BN;
  hasVoted: boolean;
}

// getProvider
export const getProvider = ({
  publicKey,
  signTransaction,
  signAllTransactions,
}: {
  publicKey: PublicKey | null;
  signTransaction: any;
  signAllTransactions: any;
}) => {
  if (!publicKey || !signTransaction) {
    return null;
  }
  const connection = new Connection(RPC_ENDPOINT);
  const provider = new AnchorProvider(
    connection,
    {
      publicKey,
      signTransaction,
      signAllTransactions,
    },
    {
      preflightCommitment: "processed",
    }
  );
  return new Program(idl as any, provider);
};
// getReadonlyProvider
// Creates a read-only provider for fetching data without signing transactions
export const getReadonlyProvider = (): Program<Polly> => {
  const connection = new Connection(RPC_ENDPOINT, 'confirmed');

  const dummyWallet = {
    publicKey: PublicKey.default, // Default public key for read-only operations
    signTransaction: async () => {
      throw new Error('Read-only provider cannot sign transactions.'); // Prevent signing
    },
    signAllTransactions: async () => {
      throw new Error('Read-only provider cannot sign transactions.'); // Prevent signing
    },
  };

  const provider = new AnchorProvider(connection, dummyWallet as any, {
    commitment: 'processed',
  });

  return new Program<Polly>(idl as any, provider);
}

// initialize
export const initialize = async ({
  program,
  publicKey,
}: InitializeParams): Promise<string> => {
  const [pollCounterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll_counter")],
    PROGRAM_ID
  );

  const [candidateCounterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("candidate_counter")],
    PROGRAM_ID
  );

  try {
    const txSignature = await program.methods
      .initialize()
      .accounts({
        signer: publicKey,
        // @ts-ignore
        pollCounter: pollCounterPda,
        candidateCounter: candidateCounterPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", txSignature);
    return txSignature;
  } catch (error) {
    console.error("Initialization failed:", error);
    throw error;
  }
};

// getPollCounter
export const getPollCounter = async (program: Program<Polly>): Promise<BN> => {
  try {
    const [pollCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll_counter")],
      PROGRAM_ID
    );
    const pollCounter = await program.account.pollCounter.fetch(pollCounterPda);
    if (!pollCounter) {
      return new BN(0);
    }
    return pollCounter.count;
  } catch (error) {
    console.error("Error fetching poll counter:", error);
    throw new BN(-1);
  }
};
// getAllPolls
export const getAllPolls = async ({
  program,
}: {
  program: Program<Polly>;
}): Promise<Poll[]> => {
  const polls = await program.account.poll.all();
  return serializePolls(polls);
};
// serializePolls
export const serializePolls = (polls: any): Poll[] => {
  return polls.map((poll: any) => {
    return {
      ...poll.account,
      id: poll.account.id.toNumber(),
      publicKey: poll.publicKey.toBase58(),
      startDate: poll.account.startDate.toNumber() * 1000,
      endDate: poll.account.endDate.toNumber() * 1000,
      candidates: poll.account.candidates.toNumber(),
    };
  });
};
// createPoll
export const createPoll = async ({
  program,
  publicKey,
  nextPollCount,
  title,
  start_date,
  end_date,
}: {
  program: Program<Polly>;
  publicKey: PublicKey;
  nextPollCount: BN;
  title: string;
  start_date: number;
  end_date: number;
}): Promise<Poll> => {
  const [pollCounterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll_counter")],
    program.programId
  );
  const [pollPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll"), nextPollCount.toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  await program.methods
    .createPoll(title, new BN(start_date), new BN(end_date))
    .accounts({
      signer: publicKey,
      poll: pollPda,
      // @ts-ignore
      pollCounter: pollCounterPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  const poll = await program.account.poll.fetch(pollPda);
  return poll;
};

// getCandidateCounter
export const getCandidateCounter = async (
  program: Program<Polly>
): Promise<BN> => {
  try {
    const [candidateCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("candidate_counter")],
      PROGRAM_ID
    );
    const candidateCounter = await program.account.candidateCounter.fetch(
      candidateCounterPda
    );
    if (!candidateCounter) {
      return new BN(0);
    }
    return candidateCounter.count;
  } catch (error) {
    console.error("Error fetching candidate counter:", error);
    throw new BN(-1);
  }
};
// createCandidate
export const createCandidate = async ({
  program,
  publicKey,
  pollId,
  name,
}: {
  program: Program<Polly>;
  publicKey: PublicKey;
  pollId: BN;
  name: string;
}): Promise<Candidate> => {
  const [candidateCounterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("candidate_counter")],
    program.programId
  );
  const candidateCounter = await program.account.candidateCounter.fetch(
    candidateCounterPda
  );
  const candidateId = candidateCounter.count.add(new BN(1));
  const [candidatePda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("candidate"),
      pollId.toArrayLike(Buffer, "le", 8),
      candidateId.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const [pollPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  try {
    await program.methods
      .createCandidate(candidateId, name)
      .accounts({
        signer: publicKey,
        // @ts-ignore
        poll: pollPda,
        candidate: candidatePda,
        candidateCounter: candidateCounterPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    const candidate = await program.account.candidate.fetch(candidatePda);
    return candidate;
  } catch (error) {
    console.error("Error creating candidate:", error);
    throw error;
  }
};
// serializeCandidates
export const serializeCandidates = (candidates: any): Candidate[] => {
  return candidates.map((candidate: any) => {
    return {
      ...candidate.account,
      id: candidate.account.id.toNumber(),
      pollId: candidate.account.pollId.toNumber(),
      name: candidate.account.name,
      votes: candidate.account.votes.toNumber(),
      hasRegistered: candidate.account.hasRegistered,
    };
  });
};
// getAllCandidates
export const getAllCandidates = async ({
  program,
}: {
  program: Program<Polly>;
}): Promise<Candidate[]> => {
  const candidates = await program.account.candidate.all();
  return serializeCandidates(candidates);
};

// vote
export const vote = async ({
  program,
  publicKey,
  pollId,
  candidateId,
}: {
  program: Program<Polly>;
  publicKey: PublicKey;
  pollId: BN;
  candidateId: BN;
}): Promise<Vote> => {
  const [candidatePda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("candidate"),
      pollId.toArrayLike(Buffer, "le", 8),
      candidateId.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  const [pollPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  const [votePda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vote"),
      pollId.toArrayLike(Buffer, "le", 8),
      publicKey.toBuffer(),
    ],
    program.programId
  );
  try {
    await program.methods
      .createVote(pollId, candidateId)
      .accounts({
        signer: publicKey,
        // @ts-ignore
        vote: votePda,
        candidate: candidatePda,
        poll: pollPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    const vote = await program.account.vote.fetch(votePda);
    return vote;
  } catch (error) {
    console.error("Error voting:", error);
    throw error;
  }
};
// hasVoted
export const hasVoted = async ({
  program,
  publicKey,
  pollId,
}: {
  program: Program<Polly>;
  publicKey: PublicKey;
  pollId: BN;
}): Promise<boolean> => {
  const [votePda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vote"),
      pollId.toArrayLike(Buffer, "le", 8),
      publicKey.toBuffer(),
    ],
    program.programId
  );
  const vote = await program.account.vote.fetch(votePda);
  if (!vote) return false;
  return vote.hasVoted ?? false;
};
