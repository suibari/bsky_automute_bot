import { Jetstream } from '@skyware/jetstream'
import { handleEvent } from './activity'
import ws from "ws"

export async function startFirehose() {
  const jetstream = new Jetstream({
    wantedCollections: ["app.bsky.feed.post", "app.bsky.feed.like", "app.bsky.feed.repost"],
    endpoint: process.env.URL_JETSTREAM,
    ws,
  });

  jetstream.onCreate('app.bsky.feed.post', async (evt) => {
    await handleEvent(evt);
  });
  jetstream.onCreate('app.bsky.feed.like', async (evt) => {
    await handleEvent(evt);
  });
  jetstream.onCreate('app.bsky.feed.repost', async (evt) => {
    await handleEvent(evt);
  });

  jetstream.start()
}
