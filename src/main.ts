import 'dotenv/config';
import { muteInactiveUsers } from './mute'
import cron from 'node-cron'
import { startFirehose } from './firehose';
import { agent } from './agent';
import { startFollowUpdater } from './followCache';

async function start() {
  console.log('[main] Starting Bluesky bot...')
  startFollowUpdater(agent, process.env.BLUESKY_DID!);
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
