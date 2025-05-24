import AtpAgent from '@atproto/api'

let cachedFollows: string[] | null = null
let lastFetched = 0
const CACHE_TTL = 1000 * 60 * 10 // 10分

export async function getMyFollows(agent: AtpAgent): Promise<string[]> {
  const now = Date.now()
  if (cachedFollows && now - lastFetched < CACHE_TTL) {
    return cachedFollows
  }

  const myFollows: string[] = []

  const self = await agent.getProfile({ actor: agent.session!.did })
  let cursor: string | undefined = undefined

  while (true) {
    const res = await agent.api.app.bsky.graph.getFollows({
      actor: self.data.did,
      limit: 100,
      cursor,
    })

    const page = res.data.follows.map((f) => f.did)
    myFollows.push(...page)

    if (!res.data.cursor || page.length === 0) break
    cursor = res.data.cursor
  }

  cachedFollows = myFollows
  lastFetched = now

  return myFollows
}