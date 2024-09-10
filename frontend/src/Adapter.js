import * as base58 from "bs58";
import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

const CANVAS_CHAIN_ID = "solana:103";
const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

const addMemoTracker = async (tx, address) => {
  let base58Tx = tx.serialize({ verifySignatures: false });

  try {
    //can't compose already signed transactions
    let isSigned = tx.signatures.some((sig) => sig.some((s) => s > 0));
    if (isSigned) {
      return base58Tx;
    }

    //handle tx with lookup tables later
    if (tx.message.addressTableLookups.length > 0) {
      return base58Tx;
    }

    const txMessage = TransactionMessage.decompile(tx.message);
    txMessage.instructions.push(
      new TransactionInstruction({
        programId: new PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from("dscvr.one", "utf8"),
        keys: [
          {
            pubkey: new PublicKey(address),
            isSigner: true,
            isWritable: false,
          },
        ],
      }),
    );

    const newMessage =
      tx.version === "legacy"
        ? txMessage.compileToLegacyMessage()
        : txMessage.compileToV0Message();

    let newTx = new VersionedTransaction(newMessage);

    const serializedNewTransaction = newTx.serialize();

    if (serializedNewTransaction.byteLength > 1232) {
      return base58Tx;
    }
    return base58.encode(serializedNewTransaction);
  } catch (error) {
    console.error("Error adding memo tracker:", error);
    return base58Tx;
  }
};

export class Adapter {
  constructor(canvasClient, address, chainId = CANVAS_CHAIN_ID) {
    this.canvasClient = canvasClient;

    if (canvasClient && address) {
      this.publicKey = new PublicKey(address);
      this.address = address;
    }
    this.chainId = chainId;
  }

  signTransaction = async (tx, _) => {
    try {
      console.log("signTransaction:", tx, this.address);

      const results = await this.canvasClient.signAndSendTransaction({
        unsignedTx: await addMemoTracker(tx, this.address),
        awaitCommitment: "confirmed",
        chainId: this.chainId,
      });

      if (!results?.untrusted.success) {
        throw new Error("Failed to sign transaction");
      }

      return {
        message: tx.message,
        signatures: results.untrusted.signedTx,
      };
    } catch (error) {
      console.error("Transaction signing error:", error);
      return { error: "Failed to sign transaction" };
    }
  };
}
