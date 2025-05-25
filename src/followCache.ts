import { AtpAgent } from '@atproto/api'

let followCache: string[] = []
let lastUpdated = 0

export function getCachedFollows(): string[] {
  return followCache
}

export async function updateFollows(agent: AtpAgent, myDid: string) {
  const myFollows: string[] = []
  let cursor: string | undefined = undefined

  while (true) {
    const res = await agent.api.app.bsky.graph.getFollows({
      actor: myDid,
      limit: 100,
      cursor,
    })

    const page = res.data.follows.map((f) => f.did)
    myFollows.push(...page)

    if (!res.data.cursor || page.length === 0) break
    cursor = res.data.cursor
  }

  followCache = myFollows
  lastUpdated = Date.now()
  console.log(`[followCache] Follows updated: ${myFollows.length} users`)
}

export function startFollowUpdater(agent: AtpAgent, myDid: string, intervalMs = 1000 * 60 * 10) {
  updateFollows(agent, myDid) // 起動時に1回
  setInterval(() => updateFollows(agent, myDid), intervalMs)
}
