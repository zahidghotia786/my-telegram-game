import crypto from 'crypto';
import querystring from 'querystring';

export function verifyTelegramWebApp(initData, botToken) {
  const parsedData = querystring.parse(initData);
  const { hash, ...dataCheck } = parsedData;

  const sortedKeys = Object.keys(dataCheck).sort();
  const dataString = sortedKeys.map(key => `${key}=${dataCheck[key]}`).join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const checkHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataString)
    .digest('hex');

  return checkHash === hash;
}
