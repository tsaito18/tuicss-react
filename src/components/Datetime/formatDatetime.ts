// 本家 TuiCss (v2.1.2) datetimeController のトークン解釈を忠実に再現する純関数。
// 本家仕様の再現ポイント:
// - 各トークンは 2 桁ゼロ埋め。ただし年 (y) は 4 桁そのまま、12時間表記 (h) は非ゼロ埋め。
// - 曜日 (e) は getDay()+1 の数値 (日曜=01 ... 土曜=07)。曜日名・月名は扱わない。
// - 置換は String.prototype.replace を文字列引数で呼ぶため「最初の 1 箇所のみ」。
//   同一トークンを複数書いても 2 個目以降は置換されない（本家挙動）。
const pad2 = (value: number): string => value.toString().padStart(2, '0');

export function formatDatetime(date: Date, format: string): string {
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const dayOfWeek = pad2(date.getDay() + 1);
  const year = date.getFullYear().toString();
  const hour = pad2(date.getHours());
  // 本家は (hours + 24) % 12 || 12。0時/12時を 12 に丸める 12時間表記（ゼロ埋めなし）。
  const hour12 = ((date.getHours() + 24) % 12 || 12).toString();
  const minute = pad2(date.getMinutes());
  const second = pad2(date.getSeconds());
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  return format
    .replace('M', month)
    .replace('d', day)
    .replace('e', dayOfWeek)
    .replace('y', year)
    .replace('H', hour)
    .replace('h', hour12)
    .replace('m', minute)
    .replace('s', second)
    .replace('a', ampm);
}
