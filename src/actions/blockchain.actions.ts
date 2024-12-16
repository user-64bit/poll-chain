import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import idl from "../../anchor/target/idl/polly.json";
import { Polly } from "../../anchor/target/types/polly";
import {
  CandidateProps,
  InitializeParams,
  PollProps,
  VoteProps,
} from "@/utils/types";

// constants
const RPC_ENDPOINT = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(idl.address);

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
  const connection = new Connection(RPC_ENDPOINT, "confirmed");

  const dummyWallet = {
    publicKey: PublicKey.default, // Default public key for read-only operations
    signTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions."); // Prevent signing
    },
    signAllTransactions: async () => {
      throw new Error("Read-only provider cannot sign transactions."); // Prevent signing
    },
  };

  const provider = new AnchorProvider(connection, dummyWallet as any, {
    commitment: "processed",
  });

  return new Program<Polly>(idl as any, provider);
};

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
// serializePolls
export const serializePolls = (polls: any): PollProps[] => {
  return polls.map((poll: any) => {
    return {
      ...poll.account,
      id: poll.account.id.toNumber(),
      publicKey: poll.publicKey.toBase58(),
      startDate: poll.account.startDate.toNumber() * 1000,
      endDate: poll.account.endDate.toNumber() * 1000,
      candidates: poll.account.candidates.toNumber(),
      options: [],
    };
  });
};

// getPollbyID
export const getPollbyID = async ({
  program,
  pollAddress,
}: {
  program: Program<Polly>;
  pollAddress: string;
}): Promise<PollProps> => {
  const poll = await program.account.poll.fetch(pollAddress);
  return {
    ...poll,
    publicKey: pollAddress,
    id: poll.id.toNumber(),
    startDate: poll.startDate.toNumber() * 1000,
    endDate: poll.endDate.toNumber() * 1000,
    totalVotes: 0,
    status: "",
    candidates: poll.candidates.toNumber(),
    options: [],
  };
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
// serializeCandidates
export const serializeCandidates = (candidates: any): CandidateProps[] => {
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

// getAllCandidatesOfPoll
export const getAllCandidatesOfPoll = async ({
  program,
  id,
}: {
  program: Program<Polly>;
  id: string;
}) => {
  const poll_id = new BN(id);
  const candidateAccounts = await program.account.candidate.all();
  const candidates = candidateAccounts.filter((candidate) => {
    return candidate.account.pollId.eq(poll_id);
  });
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
}): Promise<VoteProps> => {
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
}): Promise<VoteProps | null> => {
  const [votePda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vote"),
      pollId.toArrayLike(Buffer, "le", 8),
      publicKey.toBuffer(),
    ],
    program.programId
  );
  try {
    const vote = await program.account.vote.fetch(votePda);
    return vote;
  } catch (e) {
    return null;
  }
};

// getAllPollsWithCandidates
export const getAllPollsWithCandidates = async ({
  program,
}: {
  program: Program<Polly>;
}) => {
  const polls = await program.account.poll.all();
  const candidatesData = await program.account.candidate.all();
  const candidates = serializeCandidates(candidatesData);
  const candidatesByPoll = serializePolls(polls);

  candidates.map((candidate) => {
    candidatesByPoll.map((poll) => {
      if (poll.id.toString() === candidate.pollId.toString()) {
        poll.options.push({
          id: candidate.id.toString(),
          name: candidate.name,
          votes: candidate.votes,
          color: candidate.hasRegistered ? "bg-green-500" : "bg-red-500",
        });
      }
    });
  });
  return candidatesByPoll;
};

// createPollWithCandidates
export const createPollWithCandidates = async ({
  program,
  publicKey,
  title,
  startDate,
  endDate,
  options,
  connection,
  wallet,
}: {
  program: Program<Polly>;
  publicKey: PublicKey;
  title: string;
  startDate: number;
  endDate: number;
  options: string[];
  connection: Connection;
  wallet: any;
}) => {
  const [pollCounterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll_counter")],
    program.programId
  );
  const pollCounter = await program.account.pollCounter.fetch(pollCounterPda);
  const pollId = pollCounter.count.add(new BN(1));

  const [pollPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const transaction = new Transaction();

  // Add createPoll instruction
  const pollTx = await program.methods
    .createPoll(title, new BN(startDate), new BN(endDate))
    .accounts({
      signer: publicKey,
      poll: pollPda,
      // @ts-ignore
      pollCounter: pollCounterPda,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  transaction.add(pollTx);

  const [candidateCounterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("candidate_counter")],
    program.programId
  );
  const candidateCounter = await program.account.candidateCounter.fetch(
    candidateCounterPda
  );
  let candidateId = candidateCounter.count;

  for (const option of options) {
    candidateId = candidateId.add(new BN(1));

    const [candidatePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("candidate"),
        pollId.toArrayLike(Buffer, "le", 8),
        candidateId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const candidateTx = await program.methods
      .createCandidate(pollId, option)
      .accounts({
        signer: publicKey,
        // @ts-ignore
        poll: pollPda,
        candidate: candidatePda,
        candidateCounter: candidateCounterPda,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    transaction.add(candidateTx);
  }

  // Finalize transaction
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.feePayer = publicKey;

  const signedTransaction = await wallet.signTransaction(transaction);
  const txSignature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  );
  console.log("Transaction Signature:", txSignature);

  return txSignature;
};
