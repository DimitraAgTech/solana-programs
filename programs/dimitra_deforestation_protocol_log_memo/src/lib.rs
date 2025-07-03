use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey::Pubkey;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("E22mM2hSBAb786m9c9mfdgCopdHVaXqeGF8fuNC7rgFJ");

// Define the authorized signer's public key
// This would typically be set during deployment
pub const AUTHORIZED_SIGNER: Pubkey = pubkey!("HagTF73PcvgsKvTCjMyAw1TQi82TsurMrrduoME4aqEj");

#[program]
pub mod dimitra_deforestation_protocol_log_memo {
    use super::*;

    /// Logs a memo message to the blockchain transaction history.
    ///
    /// This instruction function takes a string parameter and emits it as a
    /// transaction log using the Solana built-in `msg!` function.
    ///
    /// Only the authorized signer can successfully call this function.
    /// If any other account attempts to call it, an error will be returned.
    ///
    /// # Arguments
    ///
    /// * `ctx` - The context of the instruction.
    /// * `memo` - The string message to be logged in the transaction.
    ///
    /// # Errors
    ///
    /// Returns an error if the signer is not the authorized account.
    pub fn log_memo(ctx: Context<LogMemo>, memo: String) -> Result<()> {
        // Check if the signer is authorized
        if ctx.accounts.signer.key() != AUTHORIZED_SIGNER {
            // Return an error if the signer is not authorized
            return err!(ErrorCode::UnauthorizedSigner);
        }

        // Log the memo message to the transaction logs
        msg!("{}", memo);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct LogMemo<'info> {
    /// The account that pays for the transaction.
    /// Must be the authorized signer for the operation to succeed.
    #[account(mut)]
    pub signer: Signer<'info>,

    /// System program, used to identify system instructions
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized signer. Only the authorized account can log memos.")]
    UnauthorizedSigner,
}
