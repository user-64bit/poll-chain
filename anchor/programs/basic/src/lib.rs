use anchor_lang::prelude::*;

declare_id!("DBCCbVg1LtpzghJiiUv9su2tYnj7mSUMGUeKyQjWtpRR");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod polly {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let poll_counter = &mut ctx.accounts.poll_counter;
        poll_counter.count = 0;

        let candidate_counter = &mut ctx.accounts.candidate_counter;
        candidate_counter.count = 0;
        Ok(())
    }

    pub fn create_poll(
        ctx: Context<CreatePoll>,
        title: String,
        start_date: u64,
        end_date: u64,
    ) -> Result<()> {
        if start_date >= end_date {
            return Err(error!(ErrorCode::InvalidPollDates));
        }
        let poll_counter = &mut ctx.accounts.poll_counter;
        poll_counter.count += 1;

        let poll = &mut ctx.accounts.poll;
        poll.id = poll_counter.count;
        poll.title = title;
        poll.start_date = start_date;
        poll.end_date = end_date;
        poll.options = 0;
        Ok(())
    }

    pub fn create_option(ctx: Context<CreateCandidate>) -> Result<()> {
        msg!("He");
        Ok(())
    }
}

/* Below are the structs */

// Couting number of polls and it helps to fetch all polls too.
#[account]
#[derive(InitSpace)]
pub struct PollCounter {
    pub count: u64,
}

// Couting number of options and it helps to fetch all options too.
#[account]
#[derive(InitSpace)]
pub struct CandidateCounter {
    pub count: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SIZE + PollCounter::INIT_SPACE,
        seeds = [b"poll_counter"],
        bump
    )]
    pub poll_counter: Account<'info, PollCounter>,

    #[account(
        init,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SIZE + CandidateCounter::INIT_SPACE,
        seeds = [b"candidate_counter"],
        bump
    )]
    pub candidate_counter: Account<'info, CandidateCounter>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SIZE + Poll::INIT_SPACE,
        seeds = [b"poll", poll_counter.count.to_le_bytes().as_ref()],
        bump
    )]
    pub poll: Account<'info, Poll>,

    #[account(
        mut,
        seeds = [b"poll_counter"],
        bump
    )]
    pub poll_counter: Account<'info, PollCounter>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub id: u64,
    #[max_len(280)]
    pub title: String,
    pub start_date: u64,
    pub end_date: u64,
    pub options: u64,
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct CreateCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll: Account<'info, Poll>,
    #[account(
        init,
        payer = signer,
        space = ANCHOR_DISCRIMINATOR_SIZE + Candidate::INIT_SPACE,
        seeds = [
            poll_id.to_le_bytes().as_ref(),
            (candidate_counter.count + 1).to_le_bytes().as_ref()
        ],
        bump
    )]
    pub option: Account<'info, Candidate>,
    #[account(mut)]
    pub candidate_counter: Account<'info, CandidateCounter>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
    pub id: u64,
    pub poll_id: u64,
    #[max_len(32)]
    pub name: String,
    pub votes: u64,
    pub has_voted: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The start date must be earlier than the end date.")]
    InvalidPollDates,
}
