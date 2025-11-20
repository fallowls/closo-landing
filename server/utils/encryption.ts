import crypto from 'crypto';

let ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-cbc';

if (!ENCRYPTION_KEY) {
  console.error('═══════════════════════════════════════════════════════════');
  console.error('⚠️  CRITICAL SECURITY WARNING ⚠️');
  console.error('═══════════════════════════════════════════════════════════');
  console.error('ENCRYPTION_KEY environment variable is not set!');
  console.error('Using a temporary development key - DO NOT USE IN PRODUCTION!');
  console.error('Generate a secure key: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  console.error('═══════════════════════════════════════════════════════════\n');
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY must be set in production');
  }
  
  ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
}

// Ensure the key is exactly 32 bytes for AES-256
function getKey(): Buffer {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY not set');
  }
  
  // If the key is exactly 64 hex characters (32 bytes), use it directly
  if (ENCRYPTION_KEY.length === 64 && /^[0-9a-fA-F]+$/.test(ENCRYPTION_KEY)) {
    return Buffer.from(ENCRYPTION_KEY, 'hex');
  }
  
  // Otherwise, hash it to ensure 32 bytes
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  return key;
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error('No encrypted data provided');
  }
  
  // Try to parse as JSON first - maybe it's not encrypted at all
  try {
    const parsed = JSON.parse(encryptedData);
    return encryptedData;
  } catch (e) {
    // Not JSON, continue with decryption attempts
  }
  
  // Check if it contains colon (IV:encrypted format) - this is the current working method
  if (encryptedData.includes(':')) {
    const parts = encryptedData.split(':');
    if (parts.length === 2) {
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      
      // Use the same method that works for new campaigns
      try {
        const key = getKey(); // This works for recent uploads
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        JSON.parse(decrypted); // Validate it's JSON
        return decrypted;
      } catch (error) {
        const legacyKeysEnv = process.env.LEGACY_ENCRYPTION_KEYS;
        if (legacyKeysEnv) {
          console.warn('WARNING: Using legacy encryption keys. This is a security risk. Please re-encrypt your data with the current key.');
          const legacyKeys = legacyKeysEnv.split(',');
          
          for (const legacyKey of legacyKeys) {
            try {
              const key = crypto.createHash('sha256').update(legacyKey.trim()).digest();
              const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
              let decrypted = decipher.update(encrypted, 'hex', 'utf8');
              decrypted += decipher.final('utf8');
              JSON.parse(decrypted);
              console.warn(`Successfully decrypted with legacy key. Re-encrypt this data immediately!`);
              return decrypted;
            } catch (e) {
              continue;
            }
          }
        }
        throw new Error('Decryption failed with current and legacy keys');
      }
    }
  }
  
  // Try other formats for very old data
  const fallbackMethods = [
    () => {
      // Base64 encoded
      const decoded = Buffer.from(encryptedData, 'base64').toString('utf8');
      JSON.parse(decoded);
      return decoded;
    },
    () => {
      // Hex encoded
      const decoded = Buffer.from(encryptedData, 'hex').toString('utf8');
      JSON.parse(decoded);
      return decoded;
    }
  ];
  
  for (const method of fallbackMethods) {
    try {
      return method();
    } catch (e) {
      continue;
    }
  }
  
  // If all methods fail, throw an error
  console.error(`Failed to decrypt data with all available methods: ${encryptedData.substring(0, 50)}...`);
  throw new Error('Decryption failed: data may be corrupted or encrypted with an unknown key');
}

// New function specifically for notes that doesn't require JSON validation
export function decryptNote(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error('No encrypted data provided');
  }
  
  // Check if it contains colon (IV:encrypted format)
  if (encryptedData.includes(':')) {
    const parts = encryptedData.split(':');
    if (parts.length === 2) {
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      
      // Try with current key
      try {
        const key = getKey();
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      } catch (error) {
        const legacyKeysEnv = process.env.LEGACY_ENCRYPTION_KEYS;
        if (legacyKeysEnv) {
          console.warn('WARNING: Using legacy encryption keys for note decryption. Please re-encrypt your data.');
          const legacyKeys = legacyKeysEnv.split(',');
          
          for (const legacyKey of legacyKeys) {
            try {
              const key = crypto.createHash('sha256').update(legacyKey.trim()).digest();
              const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
              let decrypted = decipher.update(encrypted, 'hex', 'utf8');
              decrypted += decipher.final('utf8');
              return decrypted;
            } catch (e) {
              continue;
            }
          }
        }
      }
    }
  }
  
  // If decryption fails, throw error instead of returning empty structure
  throw new Error(`Unable to decrypt note content: ${encryptedData.substring(0, 50)}...`);
}

// New function specifically for file paths (simple strings, not JSON)
export function decryptFilePath(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error('No encrypted file path provided');
  }
  
  // Check if it contains colon (IV:encrypted format)
  if (encryptedData.includes(':')) {
    const parts = encryptedData.split(':');
    if (parts.length === 2) {
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      
      // Try with current key
      try {
        const key = getKey();
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      } catch (error) {
        const legacyKeysEnv = process.env.LEGACY_ENCRYPTION_KEYS;
        if (legacyKeysEnv) {
          console.warn('WARNING: Using legacy encryption keys for file path decryption. Please re-encrypt your data.');
          const legacyKeys = legacyKeysEnv.split(',');
          
          for (const legacyKey of legacyKeys) {
            try {
              const key = crypto.createHash('sha256').update(legacyKey.trim()).digest();
              const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
              let decrypted = decipher.update(encrypted, 'hex', 'utf8');
              decrypted += decipher.final('utf8');
              console.warn('Successfully decrypted file path with legacy key. Re-encrypt immediately!');
              return decrypted;
            } catch (e) {
              continue;
            }
          }
        }
      }
    }
  }
  
  // If decryption fails, throw error
  throw new Error(`Unable to decrypt file path: ${encryptedData.substring(0, 50)}...`);
}
