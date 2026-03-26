import { agent } from './agent'
import { getInactiveUsers } from './db'

async function getAllMutedDids(): Promise<string[]> {
  const mutes: string[] = []
  let cursor: string | undefined

  do {
    const res = await agent.app.bsky.graph.getMutes({ cursor })
    mutes.push(...res.data.mutes.map(m => m.did))
    cursor = res.data.cursor
    if (cursor) {
      console.log(`[mute] fetching next page of mutes (current total: ${mutes.length})`)
    }
  } while (cursor)

  return mutes
}

export async function muteInactiveUsers() {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
  const now = Date.now()
  const since = now - ONE_WEEK_MS

  // アクティビティが1週間ないユーザー（null含む）を取得
  const inactiveDids = getInactiveUsers(since)

  console.log(`[mute] Found ${inactiveDids.length} inactive candidates`)

  // すでにミュート済みのDID一覧をページネーションして取得
  const didMuted = await getAllMutedDids()
  console.log(`[mute] Currently muted count: ${didMuted.length}`)

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
    // 個別のアンミュート判定は getProfile の方が効率的
    const { data: profile } = await agent.app.bsky.actor.getProfile({ actor: did })

    if (profile.viewer?.muted) {
      await agent.app.bsky.graph.unmuteActor({ actor: did })
      console.log(`[unmute] unmuted: ${did}`)
    }
  } catch (e) {
    console.warn(`[unmute] failed for ${did}`, e)
  }
}
