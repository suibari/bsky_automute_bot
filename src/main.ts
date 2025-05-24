import 'dotenv/config';
import { muteInactiveUsers } from './mute'
import cron from 'node-cron'
import { startFirehose } from './firehose';
import { getMyFollows } from './follows';
import { agent } from './agent';

async function start() {
  console.log('[main] Starting Bluesky bot...')
  await getMyFollows(agent);
  await startFirehose();
  console.log('[main] Connected JetStream')

  // 毎日 午前3時にミュートチェック
  cron.schedule('0 3 * * *', async () => {
    console.log('[cron] Running muteInactiveUsers...')
    await muteInactiveUsers()
  })

  console.log('[main] Bot is running.')
}

start()
