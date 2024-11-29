import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("polly", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const program = anchor.workspace.polly;

  it("Create Poll", async () => {
    const signer = provider.wallet;

    // Derive the PDAs for both counters
    const [pollCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll_counter")],
      program.programId
    );

    const [candidateCounterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("candidate_counter")],
      program.programId
    );
    try {
      await program.methods
        .initialize()
        .accounts({
          signer: signer.publicKey,
          pollCounter: pollCounterPda,
          candidateCounter: candidateCounterPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    } catch (err) {
      console.log("Initialization might have failed:", err);
    }

    const pollCounter = await program.account.pollCounter.fetch(pollCounterPda);

    const [pollPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), pollCounter.count.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .createPoll(
        "Test Poll",
        new anchor.BN(Math.floor(Date.now() / 1000)),
        new anchor.BN(Math.floor(Date.now() / 1000) + 86400)
      )
      .accounts({
        signer: signer.publicKey,
        poll: pollPda,
        pollCounter: pollCounterPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const poll = await program.account.poll.fetch(pollPda);

    expect(poll.title).toEqual("Test Poll");
    expect(poll.startDate.toNumber()).toEqual(Math.floor(Date.now() / 1000));
    expect(poll.endDate.toNumber()).toEqual(
      Math.floor(Date.now() / 1000) + 86400
    );
  });
});
