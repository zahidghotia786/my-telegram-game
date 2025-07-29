import axios from 'axios';

const BOT_TOKEN = "8393686691:AAEETEYd-nmt8Dfil4KRxm7kKyPTqHJJEUQ";

axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`)
  .then(res => console.log('✅ Success:', res.data))
  .catch(err => console.error('❌ Failed:', err.message));
