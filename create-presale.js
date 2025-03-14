/**
 * XtraRichPeople (XRP) Token - Create Presale Script for XRP Ledger
 * 
 * This script demonstrates how to set up a presale for the XRP token on the XRP Ledger.
 * NOTE: This is a demonstration script. In production, you would need to:
 * 1. Securely manage your private keys
 * 2. Add proper error handling
 * 3. Implement user feedback
 */

const xrpl = require('xrpl');
const fs = require('fs');

// Load configuration from file
const loadConfig = () => {
  try {
    const configData = fs.readFileSync('./presale-config.json', 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error loading configuration:', error);
    return null;
  }
};

async function createPresale() {
  // Load configuration
  const config = loadConfig();
  if (!config) {
    console.error('Failed to load configuration. Exiting...');
    return;
  }

  console.log('Connecting to XRP Ledger...');
  
  // Connect to the XRP Ledger
  const client = new xrpl.Client('wss://s1.ripple.com');
  await client.connect();
  
  try {
    console.log('Connected to XRP Ledger');
    
    // Replace with your wallet seed or use a wallet instance
    // NEVER hardcode seeds in production code
    const wallet = xrpl.Wallet.fromSeed('REPLACE_WITH_YOUR_SEED');
    
    // XRP token details
    const currency = 'XRP';
    const issuer = 'rD1BefcC6ZK28H3m2bRxgMmTce5dVDNTYr';
    
    // Create offers for each tier
    const tiers = config.tiers;
    
    for (const tier of tiers) {
      // Calculate token amount based on tier bonus
      const effectivePrice = config.tokenPrice / (1 + tier.bonus / 100);
      const tokenAmount = (tier.allocation / effectivePrice).toFixed(0);
      
      console.log(`Creating offer for Tier ${tiers.indexOf(tier) + 1}:`);
      console.log(`- Bonus: ${tier.bonus}%`);
      console.log(`- Effective Price: ${effectivePrice} XRP per token`);
      console.log(`- Token Amount: ${tokenAmount} XRP tokens`);
      
      // Prepare offer create transaction
      const offerCreateTx = {
        TransactionType: 'OfferCreate',
        Account: wallet.address,
        TakerGets: {
          currency: 'XRP',
          value: tier.allocation.toString()
        },
        TakerPays: {
          currency: currency,
          issuer: issuer,
          value: tokenAmount.toString()
        }
      };
      
      // Sign and submit the transaction
      const prepared = await client.autofill(offerCreateTx);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);
      
      console.log(`Offer created successfully for Tier ${tiers.indexOf(tier) + 1}!`);
      console.log(`Transaction result: ${result.result.meta.TransactionResult}`);
      console.log(`Transaction hash: ${result.result.hash}`);
    }
    
    console.log('Presale setup completed successfully!');
    
  } catch (error) {
    console.error('Error creating presale:', error);
  } finally {
    client.disconnect();
  }
}

// Uncomment to run the function
// createPresale();

module.exports = { createPresale };
