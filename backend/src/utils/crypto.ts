import * as crypto from 'crypto';

export class CryptoUtil {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY = crypto.scryptSync(
    process.env.ENCRYPTION_KEY ||
      'jagobisnis-default-super-secret-key-32-chars!',
    'salt-salt',
    32,
  );

  static encrypt(text: string): string {
    if (!text) return '';
    try {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(this.ALGORITHM, this.KEY, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');
      return `${iv.toString('hex')}:${encrypted}:${authTag}`;
    } catch (e) {
      console.error('Encryption failed:', e);
      return '';
    }
  }

  static decrypt(cipherText: string): string {
    if (!cipherText) return '';
    try {
      const parts = cipherText.split(':');
      if (parts.length !== 3) {
        // Return original if not our encrypted format (e.g. legacy data)
        return cipherText;
      }
      const [ivHex, encryptedHex, authTagHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = crypto.createDecipheriv(this.ALGORITHM, this.KEY, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      console.error('Decryption failed:', e);
      return '';
    }
  }
}
