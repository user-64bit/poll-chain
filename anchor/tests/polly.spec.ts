import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("polly", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const program = anchor.workspace.Polly;

  let pollCounterPda: any,
    candidateCounterPda: any,
    pollPda: any,
    candidatePda: any;
  let pollId: any, candidateId: any;

  beforeAll(async () => {
    const signer = provider.wallet;

    [pollCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll_counter")],
      program.programId
    );

    [candidateCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("candidate_counter")],
      program.programId
    );

    try {
      await program.account.pollCounter.fetch(pollCounterPda);
      console.log("Poll Counter account exists.");
    } catch (err) {
      console.log("Initializing Poll Counter...");
      await program.methods
        .initialize()
        .accounts({
          signer: signer.publicKey,
          pollCounter: pollCounterPda,
          candidateCounter: candidateCounterPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    }
  });

  it("Creates a poll", async () => {
    const signer = provider.wallet;

    const pollCounter = await program.account.pollCounter.fetch(pollCounterPda);
    pollId = pollCounter.count.add(new anchor.BN(1));

    [pollPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const title = "Sample Poll";
    const startDate = new anchor.BN(Math.floor(Date.now() / 1000));
    const endDate = new anchor.BN(Math.floor(Date.now() / 1000) + 86400);

    await program.methods
      .createPoll(title, startDate, endDate)
      .accounts({
        signer: signer.publicKey,
        poll: pollPda,
        pollCounter: pollCounterPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const poll = await program.account.poll.fetch(pollPda);
    console.log("Poll created:", poll);
    expect(poll.title).toBe(title);
    expect(poll.startDate.toNumber()).toBe(startDate.toNumber());
    expect(poll.endDate.toNumber()).toBe(endDate.toNumber());
  });

  it("Create a candidate", async () => {
    const signer = provider.wallet;
    const candidates = await program.account.candidateCounter.fetch(
      candidateCounterPda
    );
    candidateId = candidates.count.add(new anchor.BN(1));
    [candidatePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("candidate"),
        pollId.toArrayLike(Buffer, "le", 8),
        candidateId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const candidateName = `Candidate ${new anchor.BN(1).toNumber()}`;
    await program.methods
      .createCandidate(new anchor.BN(1), candidateName)
      .accounts({
        signer: signer.publicKey,
        poll: pollPda,
        candidate: candidatePda,
        candidateCounter: candidateCounterPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const candidate = await program.account.candidate.fetch(candidatePda);
    console.log("Candidate registered:", candidate);
    expect(candidate.name).toBe(candidateName);
    expect(candidate.pollId.toNumber()).toBe(1);
  });

  it("Create Vote", async () => {
    const signer = provider.wallet;

    const [votePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("vote"),
        pollId.toArrayLike(Buffer, "le", 8),
        signer.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .createVote(new anchor.BN(1), new anchor.BN(1))
      .accounts({
        signer: signer.publicKey,
        vote: votePda,
        candidate: candidatePda,
        poll: pollPda,
        SystemProgram: SystemProgram.programId,
      })
      .rpc();

    const vote = await program.account.vote.fetch(votePda);
    console.log("Vote Created:", vote);
    expect(vote.hasVoted).toBeTruthy();
  });
});
