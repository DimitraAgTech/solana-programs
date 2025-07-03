import {
  Connection,
  PublicKey,
  SystemProgram,
  Keypair,
  clusterApiUrl,
} from "@solana/web3.js";
import { AnchorProvider, Program, setProvider, web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { DimitraDeforestationProtocolLogMemo } from "../target/types/dimitra_deforestation_protocol_log_memo";

describe("dimitra-deforestation-protocol-log-memo", () => {
  it("succeeds", async () => {
    // Constants
    const PROGRAM_ID = new PublicKey(
      "8mdGj2me34w4kvzTKgcZSi5Gk5yAAj92hSMCJCgVYufG"
    ); // your deployed program ID
    const RPC_URL = clusterApiUrl("devnet"); // or use local/testnet/mainnet
    const connection = new Connection(RPC_URL, "confirmed");

    // Load wallet keypair
    // Use a real wallet for production; this is just a demo
    const wallet = Keypair.generate(); // Replace with your wallet loader or integration
    const walletWrapper = {
      publicKey: wallet.publicKey,
      signTransaction: async (tx) => {
        tx.partialSign(wallet);
        return tx;
      },
      signAllTransactions: async (txs) => {
        return txs.map((tx) => {
          tx.partialSign(wallet);
          return tx;
        });
      },
    };

    (async () => {
      const provider = new AnchorProvider(connection, walletWrapper, {
        preflightCommitment: "confirmed",
      });
      setProvider(provider);

      // const program = new Program(idl as any, PROGRAM_ID, provider);
      anchor.setProvider(anchor.AnchorProvider.env());

      const program = anchor.workspace
        .dimitraDeforestationProtocolLogMemo as Program<DimitraDeforestationProtocolLogMemo>;

      console.log("My address:", wallet.publicKey.toBase58());

      const balance = await connection.getBalance(wallet.publicKey);
      console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

      const memo = "new message";

      const tx = await program.methods
        .logMemo(memo)
        .accounts({
          signer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction successful, signature:", tx);
    })();
  });
});
