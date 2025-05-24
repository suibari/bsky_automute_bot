import { AtpAgent } from "@atproto/api"

export const agent = new AtpAgent({
  service: 'https://bsky.social',
})

await agent.login({
  identifier: process.env.BLUESKY_HANDLE!,
  password: process.env.BLUESKY_PASSWORD!,
})
