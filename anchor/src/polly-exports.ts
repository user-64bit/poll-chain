// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import PollyIDl from '../target/idl/polly.json'
import type { Polly } from '../target/types/polly'

// Re-export the generated IDL and type
export { Polly, PollyIDl }

// The programId is imported from the program IDL.
export const BASIC_PROGRAM_ID = new PublicKey(PollyIDl.address)

// This is a helper function to get the Basic Anchor program.
export function getBasicProgram(provider: AnchorProvider) {
  return new Program(PollyIDl as Polly, provider)
}