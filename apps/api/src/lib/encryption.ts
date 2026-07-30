import crypto from 'crypto';

// Encrypts user-supplied AI provider API keys at rest (AES-256-GCM) so a
// database read alone never exposes a usable key. Requires a 32-byte hex
// secret in AI_KEY_ENCRYPTION_SECRET (generate with `openssl rand -hex 32`).
const ALGORITHM = 'aes-256-gcm';

function getKey(): Buffer {
  const secret = process.env.AI_KEY_ENCRYPTION_SECRET;
  if (!secret || secret.length !== 64) {
    throw new Error('AI_KEY_ENCRYPTION_SECRET must be set to a 32-byte hex string (64 hex chars)');
  }
  return Buffer.from(secret, 'hex');
}

export function encryptSecret(plaintext: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':');
}

export function decryptSecret(payload: string): string {
  const [ivHex, authTagHex, dataHex] = payload.split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]).toString('utf8');
}
