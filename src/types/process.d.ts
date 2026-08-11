// ライブラリ本体は Node 環境を前提にしないため @types/node を引き込まず、
// 開発時判定 (process.env.NODE_ENV) に使う分だけをここで型付けする。
// 各コンポーネントに declare を重複させないための共有宣言。
// 注意: 将来 @types/node が依存に入ると同名の global 宣言と衝突し得るため、
// そのときはこのファイルを削除して @types/node 側の型に寄せる。
declare const process: { env: { NODE_ENV?: string } } | undefined;
