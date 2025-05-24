import Database from 'better-sqlite3'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// SQLiteファイル保存先
const DB_PATH = path.join(__dirname, '../data/user_activity.db')
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new Database(DB_PATH)

// テーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS user_activity (
    did TEXT PRIMARY KEY,
    last_action_at INTEGER
  );
`)

// ユーザーのアクション時刻を保存・更新
export function saveUserActivity(did: string) {
  const now = Date.now()
  const stmt = db.prepare(`
    INSERT INTO user_activity (did, last_action_at)
    VALUES (?, ?)
    ON CONFLICT(did) DO UPDATE SET last_action_at=excluded.last_action_at
  `)
  stmt.run(did, now)
}

// 指定日時以降にアクションがないユーザー一覧を取得
export function getInactiveUsers(since: number): string[] {
  const stmt = db.prepare(`
    SELECT did FROM user_activity
    WHERE last_activity IS NULL OR last_activity < ?
  `)
  const rows = stmt.all(since) as { did: string }[]
  return rows.map(r => r.did)
}
