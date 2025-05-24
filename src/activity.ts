// src/activity.ts
import { AppBskyFeedPost, AppBskyFeedLike, AppBskyFeedRepost } from '@atproto/api'
import { saveUserActivity } from './db'
import { CommitCreateEvent } from '@skyware/jetstream'
import { agent } from './agent'
import { getMyFollows } from './follows'

const myDid = (await agent.getProfile({ actor: process.env.BLUESKY_HANDLE! })).data.did

export async function handleEvent(evt: CommitCreateEvent<'app.bsky.feed.post' | 'app.bsky.feed.like' | 'app.bsky.feed.repost'>) {
  const record = evt.commit.record;
  const authorDid = String(evt.did);

  if (!record || !authorDid) return;

  // 非フォロイーは早期リターン
  const dids = await getMyFollows(agent);
  if (!dids.includes(authorDid)) return;

  // 🔹 リプライ判定
  if (evt.commit.record.$type === 'app.bsky.feed.post') {
    const post = record as AppBskyFeedPost.Record
    const replyTo = post.reply?.parent.uri
    if (replyTo?.includes(myDid)) {
      console.log(`[reply] from ${authorDid}`)
      saveUserActivity(authorDid)
    }
  }

  // 🔹 いいね判定
  else if (evt.commit.record.$type === 'app.bsky.feed.like') {
    const like = record as AppBskyFeedLike.Record
    if (like.subject.uri.includes(myDid)) {
      console.log(`[like] from ${authorDid}`)
      saveUserActivity(authorDid)
    }
  }

  // 🔹 リポスト判定
  else if (evt.commit.record.$type === 'app.bsky.feed.repost') {
    const repost = record as AppBskyFeedRepost.Record
    if (repost.subject.uri.includes(myDid)) {
      console.log(`[repost] from ${authorDid}`)
      saveUserActivity(authorDid)
    }
  }
}
