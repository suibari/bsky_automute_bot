import { AppBskyFeedPost, AppBskyFeedLike, AppBskyFeedRepost } from '@atproto/api'
import { saveUserActivity } from './db'
import { CommitCreateEvent } from '@skyware/jetstream'
import { agent } from './agent'
import { getCachedFollows } from './followCache'
import { unmuteIfMuted } from './mute'

const myDid = (await agent.getProfile({ actor: process.env.BLUESKY_HANDLE! })).data.did

export async function handleEvent(evt: CommitCreateEvent<'app.bsky.feed.post' | 'app.bsky.feed.like' | 'app.bsky.feed.repost'>) {
  const record = evt.commit.record;
  const authorDid = String(evt.did);
  if (!record || !authorDid) return;

  const dids = getCachedFollows()
  if (!dids.includes(authorDid)) return;

  if (record.$type === 'app.bsky.feed.post') {
    const post = record as AppBskyFeedPost.Record
    const replyTo = post.reply?.parent.uri
    if (replyTo?.includes(myDid)) {
      console.log(`[reply] from ${authorDid}`)
      saveUserActivity(authorDid)
      unmuteIfMuted(authorDid)
    }
    const embed = post.embed
    if (embed) {
      if (embed.$type === 'app.bsky.embed.record') {
        const recordEmbed = embed as any
        if (recordEmbed.record?.uri?.includes(myDid)) {
          console.log(`[quote] from ${authorDid}`)
          saveUserActivity(authorDid)
          unmuteIfMuted(authorDid)
        }
      } else if (embed.$type === 'app.bsky.embed.recordWithMedia') {
        const recordWithMediaEmbed = embed as any
        if (recordWithMediaEmbed.record?.record?.uri?.includes(myDid)) {
          console.log(`[quote] from ${authorDid}`)
          saveUserActivity(authorDid)
          unmuteIfMuted(authorDid)
        }
      }
    }
  } else if (record.$type === 'app.bsky.feed.like') {
    const like = record as AppBskyFeedLike.Record
    if (like.subject.uri.includes(myDid)) {
      console.log(`[like] from ${authorDid}`)
      saveUserActivity(authorDid)
      unmuteIfMuted(authorDid)
    }
  } else if (record.$type === 'app.bsky.feed.repost') {
    const repost = record as AppBskyFeedRepost.Record
    if (repost.subject.uri.includes(myDid)) {
      console.log(`[repost] from ${authorDid}`)
      saveUserActivity(authorDid)
      unmuteIfMuted(authorDid)
    }
  }
}
