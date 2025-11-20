import { db } from '../server/db';
import { campaigns } from '../shared/schema';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

function testDecryption(encryptedData: string, keyString: string, keyLabel: string): boolean {
  try {
    if (!encryptedData || !encryptedData.includes(':')) {
      return false;
    }
    
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      return false;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    // Try the key as-is if it's 64 hex chars
    let key: Buffer;
    if (keyString.length === 64 && /^[0-9a-fA-F]+$/.test(keyString)) {
      key = Buffer.from(keyString, 'hex');
    } else {
      const keyBuffer = Buffer.from(keyString, 'utf8');
      if (keyBuffer.length === 31 || keyBuffer.length === 32) {
        // Pad to exactly 32 bytes if 31 bytes (for "default-key-32-chars-long-here!")
        key = keyBuffer.length === 31 ? Buffer.concat([keyBuffer, Buffer.from([0])]) : keyBuffer;
      } else {
        // Otherwise hash it
        key = crypto.createHash('sha256').update(keyString).digest();
      }
    }
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    console.log(`  ✓ Successfully decrypted with ${keyLabel}`);
    console.log(`    First 100 chars: ${decrypted.substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.log(`  ✗ Failed with ${keyLabel}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Diagnosing encryption keys...\n');
  
  // Get first campaign
  const sampleCampaigns = await db.select().from(campaigns).limit(3);
  
  if (sampleCampaigns.length === 0) {
    console.log('No campaigns found in database');
    return;
  }
  
  for (const campaign of sampleCampaigns) {
    console.log(`\nTesting Campaign ${campaign.id}: ${campaign.name}`);
    console.log(`Encrypted data preview: ${campaign.encryptedData.substring(0, 60)}...`);
    
    // Test with current ENCRYPTION_KEY
    const currentKey = process.env.ENCRYPTION_KEY || '';
    if (currentKey) {
      console.log('\nTrying current ENCRYPTION_KEY:');
      if (testDecryption(campaign.encryptedData, currentKey, 'ENCRYPTION_KEY')) {
        console.log('  → This campaign is encrypted with the current key (no migration needed)');
        continue;
      }
    }
    
    // Test with LEGACY_ENCRYPTION_KEYS
    const legacyKeys = process.env.LEGACY_ENCRYPTION_KEYS || '';
    if (legacyKeys) {
      const keys = legacyKeys.split(',');
      for (let i = 0; i < keys.length; i++) {
        console.log(`\nTrying legacy key ${i + 1}:`);
        if (testDecryption(campaign.encryptedData, keys[i].trim(), `LEGACY_KEY_${i + 1}`)) {
          console.log('  → This campaign is encrypted with a legacy key (migration needed)');
          break;
        }
      }
    }
    
    // Test with randomly generated keys (development scenario)
    console.log('\n  → Could not decrypt with any configured key');
    console.log('  → Data may be encrypted with a lost/rotated development key');
  }
  
  console.log('\n' + '═'.repeat(60));
}

main().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
