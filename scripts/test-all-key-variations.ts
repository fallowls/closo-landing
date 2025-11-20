import { db } from '../server/db';
import { campaigns } from '../shared/schema';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const PLACEHOLDER = 'default-key-32-chars-long-here!';

function tryDecrypt(encryptedData: string, key: Buffer, label: string): boolean {
  try {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    console.log(`  ✓ SUCCESS with ${label}!`);
    console.log(`    Key (hex): ${key.toString('hex')}`);
    console.log(`    Decrypted preview: ${decrypted.substring(0, 100)}...`);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔬 Testing all possible key variations for placeholder key...\n');
  
  const campaign = (await db.select().from(campaigns).limit(1))[0];
  if (!campaign) {
    console.log('No campaigns found');
    return;
  }
  
  console.log(`Testing Campaign ${campaign.id}: ${campaign.name}`);
  console.log(`Encrypted: ${campaign.encryptedData.substring(0, 60)}...\n`);
  
  const variations: [Buffer, string][] = [
    // 1. Raw UTF-8 (31 bytes)
    [Buffer.from(PLACEHOLDER, 'utf8'), 'Raw UTF-8 (31 bytes)'],
    
    // 2. Padded with null byte
    [Buffer.concat([Buffer.from(PLACEHOLDER, 'utf8'), Buffer.from([0])]), 'UTF-8 + null byte (32 bytes)'],
    
    // 3. Padded with space
    [Buffer.concat([Buffer.from(PLACEHOLDER, 'utf8'), Buffer.from(' ')]), 'UTF-8 + space (32 bytes)'],
    
    // 4. SHA-256 hash
    [crypto.createHash('sha256').update(PLACEHOLDER).digest(), 'SHA-256 hash'],
    
    // 5. With newline
    [crypto.createHash('sha256').update(PLACEHOLDER + '\n').digest(), 'SHA-256 with newline'],
    
    // 6. Trimmed SHA-256
    [crypto.createHash('sha256').update(PLACEHOLDER.trim()).digest(), 'SHA-256 trimmed'],
    
    // 7. First 32 bytes of SHA-512
    [crypto.createHash('sha512').update(PLACEHOLDER).digest().slice(0, 32), 'SHA-512 first 32 bytes'],
    
    // 8. Repeated to 32 bytes
    [Buffer.from((PLACEHOLDER + PLACEHOLDER).substring(0, 32), 'utf8'), 'Repeated to 32 bytes'],
  ];
  
  for (const [key, label] of variations) {
    if (key.length !== 32) {
      console.log(`  ✗ ${label} - Invalid length: ${key.length} bytes`);
      continue;
    }
    
    if (tryDecrypt(campaign.encryptedData, key, label)) {
      process.exit(0);
    } else {
      console.log(`  ✗ ${label}`);
    }
  }
  
  console.log('\n❌ No variation worked. The data may be encrypted with a different key.');
  process.exit(1);
}

main();
