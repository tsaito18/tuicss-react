// 複数モーダル同時オープンを想定した参照カウント方式。最後の1つが閉じるまで body を復元しない。
let lockCount = 0;
let savedStyle: { overflow: string; paddingRight: string } | null = null;

export function lockBodyScroll(): void {
  if (typeof document === 'undefined') return;

  lockCount += 1;
  // 外側の lock が既に適用済みなので、再計測・再保存はしない。
  if (lockCount > 1) return;

  savedStyle = {
    overflow: document.body.style.overflow,
    paddingRight: document.body.style.paddingRight,
  };

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';

  // オーバーレイスクロールバー(macOS 等)では幅が 0 になるため padding 補正は不要。
  if (scrollbarWidth > 0) {
    // 既存の padding-right を失わないよう、算出済みの値を基準に加算する。
    const currentPadding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
    document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }
}

export function unlockBodyScroll(): void {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0) return;

  if (savedStyle) {
    // 空文字列だった場合も含めて保存時の値をそのまま復元する。
    document.body.style.overflow = savedStyle.overflow;
    document.body.style.paddingRight = savedStyle.paddingRight;
    savedStyle = null;
  }
}
