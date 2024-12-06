import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Polly } from "../../anchor/target/types/polly";

export interface InitializeParams {
  program: Program<Polly>;
  publicKey: PublicKey;
}
export interface PollOptionProps {
  label: string;
  votes: number;
  color: string;
}
export interface PollProps {
  id: number;
  title: string;
  publicKey: string;
  candidates: number;
  startDate: number;
  endDate: number;
  options: PollOptionProps[];
}
export interface CandidateProps {
  id: number;
  pollId: number;
  name: string;
  votes: number;
  hasRegistered: boolean;
}
export interface VoteProps {
  candidateId: BN;
  pollId: BN;
  hasVoted: boolean;
}
