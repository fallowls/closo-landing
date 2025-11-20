import { db } from '../server/db';
import { campaigns, notes, documents } from '../shared/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

// Get legacy key from environment
function getLegacyKey(): Buffer {
  const legacyKeysEnv = process.env.LEGACY_ENCRYPTION_KEYS;
  if (!legacyKeysEnv) {
    throw new Error('LEGACY_ENCRYPTION_KEYS environment variable is not set');
  }
  
  const legacyKey = legacyKeysEnv.split(',')[0].trim();
  
  // For the placeholder key, pad to 32 bytes if it's close to 32
  const keyBuffer = Buffer.from(legacyKey, 'utf8');
  if (keyBuffer.length === 31 || keyBuffer.length === 32) {
    // Pad to exactly 32 bytes if needed
    if (keyBuffer.length === 31) {
      return Buffer.concat([keyBuffer, Buffer.from([0])]);
    }
    return keyBuffer;
  }
  
  // Otherwise, hash it to ensure 32 bytes
  return crypto.createHash('sha256').update(legacyKey).digest();
}

// Get current encryption key
function getCurrentKey(): Buffer {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  
  // If the key is exactly 64 hex characters (32 bytes), use it directly
  if (encryptionKey.length === 64 && /^[0-9a-fA-F]+$/.test(encryptionKey)) {
    return Buffer.from(encryptionKey, 'hex');
  }
  
  // Otherwise, hash it to ensure 32 bytes
  return crypto.createHash('sha256').update(encryptionKey).digest();
}

// Decrypt with legacy key
function decryptWithLegacyKey(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(':')) {
    throw new Error('Invalid encrypted data format');
  }
  
  const parts = encryptedData.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const key = getLegacyKey();
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Encrypt with current key
function encryptWithCurrentKey(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = getCurrentKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

// Test if data can be decrypted with current key
function canDecryptWithCurrentKey(encryptedData: string): boolean {
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
    const key = getCurrentKey();
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return true;
  } catch (error) {
    return false;
  }
}

async function migrateCampaigns() {
  console.log('\n📦 Migrating campaigns...');
  
  const allCampaigns = await db.select().from(campaigns);
  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const campaign of allCampaigns) {
    try {
      // Check if already using current key
      if (canDecryptWithCurrentKey(campaign.encryptedData)) {
        console.log(`  ✓ Campaign ${campaign.id} already uses current key, skipping`);
        skipped++;
        continue;
      }
      
      // Decrypt with legacy key
      const decrypted = decryptWithLegacyKey(campaign.encryptedData);
      
      // Re-encrypt with current key
      const reencrypted = encryptWithCurrentKey(decrypted);
      
      // Update in database
      await db
        .update(campaigns)
        .set({ encryptedData: reencrypted })
        .where(eq(campaigns.id, campaign.id));
      
      console.log(`  ✓ Migrated campaign ${campaign.id}: ${campaign.name}`);
      migrated++;
    } catch (error) {
      console.error(`  ✗ Failed to migrate campaign ${campaign.id}:`, error instanceof Error ? error.message : String(error));
      failed++;
    }
  }
  
  console.log(`\nCampaigns: ${migrated} migrated, ${skipped} skipped, ${failed} failed`);
}

async function migrateNotes() {
  console.log('\n📝 Migrating notes...');
  
  const allNotes = await db.select().from(notes);
  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const note of allNotes) {
    try {
      // Check if already using current key
      if (canDecryptWithCurrentKey(note.encryptedContent)) {
        console.log(`  ✓ Note ${note.id} already uses current key, skipping`);
        skipped++;
        continue;
      }
      
      // Decrypt with legacy key
      const decrypted = decryptWithLegacyKey(note.encryptedContent);
      
      // Re-encrypt with current key
      const reencrypted = encryptWithCurrentKey(decrypted);
      
      // Update in database
      await db
        .update(notes)
        .set({ encryptedContent: reencrypted })
        .where(eq(notes.id, note.id));
      
      console.log(`  ✓ Migrated note ${note.id}`);
      migrated++;
    } catch (error) {
      console.error(`  ✗ Failed to migrate note ${note.id}:`, error instanceof Error ? error.message : String(error));
      failed++;
    }
  }
  
  console.log(`\nNotes: ${migrated} migrated, ${skipped} skipped, ${failed} failed`);
}

async function migrateDocuments() {
  console.log('\n📄 Migrating documents...');
  
  const allDocuments = await db.select().from(documents);
  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const doc of allDocuments) {
    try {
      // Check if already using current key
      if (canDecryptWithCurrentKey(doc.encryptedPath)) {
        console.log(`  ✓ Document ${doc.id} already uses current key, skipping`);
        skipped++;
        continue;
      }
      
      // Decrypt with legacy key
      const decrypted = decryptWithLegacyKey(doc.encryptedPath);
      
      // Re-encrypt with current key
      const reencrypted = encryptWithCurrentKey(decrypted);
      
      // Update in database
      await db
        .update(documents)
        .set({ encryptedPath: reencrypted })
        .where(eq(documents.id, doc.id));
      
      console.log(`  ✓ Migrated document ${doc.id}: ${doc.filename}`);
      migrated++;
    } catch (error) {
      console.error(`  ✗ Failed to migrate document ${doc.id}:`, error instanceof Error ? error.message : String(error));
      failed++;
    }
  }
  
  console.log(`\nDocuments: ${migrated} migrated, ${skipped} skipped, ${failed} failed`);
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔐 ENCRYPTION KEY MIGRATION');
  console.log('═══════════════════════════════════════════════════════════');
  
  // Verify both keys are set
  if (!process.env.ENCRYPTION_KEY) {
    console.error('❌ ENCRYPTION_KEY is not set. Please add it to your environment.');
    process.exit(1);
  }
  
  if (!process.env.LEGACY_ENCRYPTION_KEYS) {
    console.error('❌ LEGACY_ENCRYPTION_KEYS is not set. Please add it to your environment.');
    process.exit(1);
  }
  
  console.log('✓ ENCRYPTION_KEY is set');
  console.log('✓ LEGACY_ENCRYPTION_KEYS is set');
  
  try {
    await migrateCampaigns();
    await migrateNotes();
    await migrateDocuments();
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ Migration completed successfully!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📝 Next steps:');
    console.log('1. Verify all data is accessible in the application');
    console.log('2. Once confirmed, remove LEGACY_ENCRYPTION_KEYS from environment');
    console.log('3. Keep only ENCRYPTION_KEY for future operations\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
