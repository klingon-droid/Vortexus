import { Connection } from '@solana/web3.js';
import { ToolConfig } from './allTools.ts';

interface GetTransactionReceiptArgs {
  hash: string;
}

export const getTransactionReceiptTool: ToolConfig<GetTransactionReceiptArgs> = {
  definition: {
    type: 'function',
    function: {
      name: 'get_transaction_receipt',
      description: 'Get the receipt of a transaction to check its status and details on Solana',
      parameters: {
        type: 'object',
        properties: {
          hash: {
            type: 'string',
            pattern: '^[A-Za-z0-9]{88}$',
            description: 'The transaction signature to get the receipt for',
          },
        },
        required: ['hash'],
      },
    },
  },
  handler: async ({ hash }) => await getTransactionReceipt(hash),
};

async function getTransactionReceipt(hash: string) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const receipt = await connection.getTransaction(hash, {
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 2,
  });

  return receipt
    ? {
        status: receipt.meta?.err ? 'reverted' : 'confirmed',
        hash: receipt.transaction.signatures[0],
        ...(receipt.meta?.err && { error: 'Transaction reverted' }),
      }
    : 'Transaction not found';
}
