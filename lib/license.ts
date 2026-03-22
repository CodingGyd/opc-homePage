import crypto from 'crypto';
import { query, queryOne } from './db';

/**
 * Generate a license key in format: XXXX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(): string {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    const segment = crypto.randomBytes(2).toString('hex').toUpperCase();
    segments.push(segment);
  }
  return segments.join('-');
}

/**
 * Create a new license for a product purchase
 */
export async function createLicense(params: {
  userId: string;
  productId: string;
  orderId: string;
  deviceLimit?: number;
  expiresAt?: Date;
}): Promise<string> {
  const licenseKey = generateLicenseKey();

  await query(
    `INSERT INTO licenses (id, license_key, user_id, product_id, order_id, device_limit, expires_at)
     VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
    [
      licenseKey,
      params.userId,
      params.productId,
      params.orderId,
      params.deviceLimit || 1,
      params.expiresAt ? params.expiresAt.toISOString().slice(0, 19).replace('T', ' ') : null,
    ]
  );

  return licenseKey;
}

/**
 * Get licenses for a user
 */
export async function getUserLicenses(userId: string): Promise<any[]> {
  const licenses = await query<any>(
    `SELECT
      l.*,
      p.name as product_name,
      p.download_url,
      p.version
    FROM licenses l
    LEFT JOIN products p ON l.product_id = p.id
    WHERE l.user_id = ? AND l.status = 'active'
    ORDER BY l.created_at DESC`,
    [userId]
  );

  return licenses;
}

/**
 * Activate a license on a device
 */
export async function activateLicense(params: {
  licenseKey: string;
  machineId: string;
}): Promise<{ success: boolean; error?: string }> {
  const license = await queryOne<any>(
    'SELECT * FROM licenses WHERE license_key = ? AND status = ?',
    [params.licenseKey, 'active']
  );

  if (!license) {
    return { success: false, error: 'License not found or inactive' };
  }

  const machineIds = license.machine_ids ? JSON.parse(license.machine_ids) : [];

  // Check if already activated on this machine
  if (machineIds.includes(params.machineId)) {
    return { success: true };
  }

  // Check device limit
  if (machineIds.length >= license.device_limit) {
    return { success: false, error: 'Device limit reached' };
  }

  // Add new machine
  machineIds.push(params.machineId);

  await query(
    `UPDATE licenses SET machine_ids = ?, devices_used = ?, activated_at = COALESCE(activated_at, NOW())
     WHERE id = ?`,
    [JSON.stringify(machineIds), machineIds.length, license.id]
  );

  return { success: true };
}

/**
 * Verify a license
 */
export async function verifyLicense(licenseKey: string): Promise<{
  valid: boolean;
  license?: any;
  error?: string;
}> {
  const license = await queryOne<any>(
    `SELECT l.*, p.name as product_name
     FROM licenses l
     LEFT JOIN products p ON l.product_id = p.id
     WHERE l.license_key = ?`,
    [licenseKey]
  );

  if (!license) {
    return { valid: false, error: 'License not found' };
  }

  if (license.status !== 'active') {
    return { valid: false, error: `License is ${license.status}` };
  }

  if (license.expires_at && new Date(license.expires_at) < new Date()) {
    return { valid: false, error: 'License has expired' };
  }

  return { valid: true, license };
}

/**
 * Revoke a license
 */
export async function revokeLicense(licenseId: string): Promise<void> {
  await query(
    'UPDATE licenses SET status = ? WHERE id = ?',
    ['revoked', licenseId]
  );
}
