import { agent } from './agent'
import { getInactiveUsers } from './db'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
const now = Date.now()
const since = now - ONE_WEEK_MS

export async function muteInactiveUsers() {
  // アクティビティが1週間ないユーザー（null含む）を取得
  const inactiveDids = getInactiveUsers(since)

  console.log(`[mute] Found ${inactiveDids.length} inactive`)

  // すでにミュート済みのDID一覧
  const res = await agent.app.bsky.graph.getMutes()
  const didMuted = res.data.mutes.map(mute => mute.did)

  for (const did of inactiveDids) {
    if (didMuted.includes(did)) {
      console.log(`[mute] already muted: ${did}`)
      continue
    }

    try {
      await agent.app.bsky.graph.muteActor({ actor: did })
      console.log(`[mute] muted: ${did}`)
    } catch (e) {
      console.warn(`[mute] failed: ${did}`, e)
    }
  }
}

export async function unmuteIfMuted(did: string) {
  try {
    const res = await agent.app.bsky.graph.getMutes()
    const didMuted = res.data.mutes.map(m => m.did)

    if (didMuted.includes(did)) {
      await agent.app.bsky.graph.unmuteActor({ actor: did })
      console.log(`[unmute] unmuted: ${did}`)
    }
  } catch (e) {
    console.warn(`[unmute] failed for ${did}`, e)
  }
}
