import { verifyTelegramWebApp } from '../utils/telegramAuth.js';

export const authenticate = (req, res) => {
    console.log('🔍 Authenticating user with initData:', req.body);
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ error: 'Missing initData' });
  }

  let isValid;
  try {
    isValid = verifyTelegramWebApp(initData, process.env.BOT_TOKEN);
  } catch (err) {
    console.error('❌ Verification error:', err.message);
    return res.status(500).json({ error: 'Verification failed internally' });
  }

  if (!isValid) {
    return res.status(403).json({ error: 'Invalid initData: Verification failed' });
  }

  let user = null;
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    user = userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    console.error('❌ User parse error:', err.message);
    return res.status(400).json({ error: 'Failed to parse user data' });
  }

  console.log('✅ Verified User:', user);

  // TODO: Store or fetch user from DB

  res.json({
    message: 'Login successful',
    user,
  });
};
