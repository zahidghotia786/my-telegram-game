import crypto from 'crypto';

export function verifyTelegramAuth(initData) {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const dataToCheck = Array.from(params.entries())
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secret = crypto.createHash('sha256')
      .update(process.env.BOT_TOKEN)
      .digest();
    
    const calculatedHash = crypto
      .createHmac('sha256', secret)
      .update(dataToCheck)
      .digest('hex');

    return calculatedHash === hash;
  } catch (error) {
    console.error('❌ Telegram auth verification error:', error);
    return false;
  }
}