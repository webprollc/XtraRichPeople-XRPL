/**
 * XtraRichPeople (XRP) Token - Create Trustline Script
 * 
 * This script demonstrates how to create a trustline to the XRP token on the XRP Ledger.
 * NOTE: This is a demonstration script. In production, you would need to:
 * 1. Securely manage your private keys
 * 2. Add proper error handling
 * 3. Implement user feedback
 */

const xrpl = require('xrpl');

async function createTrustline() {
  console.log('Connecting to XRP Ledger...');
  
  // Connect to the XRP Ledger
  const client = new xrpl.Client('wss://s1.ripple.com');
  await client.connect();
  
  try {
    console.log('Connected to XRP Ledger');
    
    // Replace with your wallet seed or use a wallet instance
    // NEVER hardcode seeds in production code
    // This is just for demonstration purposes
    const wallet = xrpl.Wallet.fromSeed('REPLACE_WITH_YOUR_SEED');
    
    // XRP token details
    const currency = 'XRP';
    const issuer = 'rD1BefcC6ZK28H3m2bRxgMmTce5dVDNTYr';
    const limit = '10000000'; // Maximum amount of XRP tokens you want to hold
    
    // Prepare trustline transaction
    const trustSetTx = {
      TransactionType: 'TrustSet',
      Account: wallet.address,
      LimitAmount: {
        currency: currency,
        issuer: issuer,
        value: limit
      }
    };
    
    console.log(`Creating trustline for ${currency} from issuer ${issuer}...`);
    
    // Sign and submit the transaction
    const prepared = await client.autofill(trustSetTx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    
    console.log('Trustline created successfully!');
    console.log(`Transaction result: ${result.result.meta.TransactionResult}`);
    console.log(`Transaction hash: ${result.result.hash}`);
    
  } catch (error) {
    console.error('Error creating trustline:', error);
  } finally {
    client.disconnect();
  }
}

// Uncomment to run the function
// createTrustline();

module.exports = { createTrustline };
