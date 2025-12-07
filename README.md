# bsky-automute-bot

BlueskyのJetStreamを使用してユーザーのアクティビティを監視し、一定期間（デフォルトで1週間）自分に対するアクティビティがないユーザーを自動的にミュートするBotです。

## 概要

このBotは以下の機能を持っています：
- JetStreamに接続し、フォローしているユーザーのアクティビティを監視します。
- 毎日午前3時にチェックを実行し、1週間以上自分に対するアクティビティがないユーザー（投稿、いいね、リポストなどがないユーザー）を自動的にミュートします。
- すでにミュート済みのユーザーはスキップされます。
- ミュート済みのユーザーがBotに対してリアクション（リプライ、いいね、リポスト）を行った場合、自動的にミュートを解除します。

## 必要な環境

- Node.js (v18以上推奨)
- Blueskyアカウント

## 環境設定 (.env)

プロジェクトルートに `.env` ファイルを作成し、以下の変数を設定してください。

```env
BLUESKY_IDENTIFIER=your-handle.bsky.social
BLUESKY_PASSWORD=your-app-password
BLUESKY_DID=your-did
URL_JETSTREAM=wss://jetstream1.us-east.bsky.network/subscribe
```

## 実行方法

1. 依存関係をインストールします。

```bash
npm install
```

2. Botを起動します。

```bash
npm start
```

## ライセンス

MIT License

Copyright (c) 2025 bsky-automute-bot authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
