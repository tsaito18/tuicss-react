import {
  createContext,
  useContext,
  useMemo,
} from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode, Ref } from 'react';
import { cx } from '../../utils/cx';
import { tuiColor } from '../../utils/color';
import type { TuiColorToken } from '../../types/colors';

export type ChartOrientation = 'vertical' | 'horizontal';

// orientation と軸表示の有無を配下へ供給する。ChartValue は縦/横で
// インライン style を height/width に出し分け、ChartDisplay は本家 SCSS が
// 期待する位置(.tui-chart-display.no-x-axis/.no-y-axis)に modifier を付ける。
interface ChartContextValue {
  orientation: ChartOrientation;
  noXAxis: boolean;
  noYAxis: boolean;
}

const ChartContext = createContext<ChartContextValue | null>(null);

function useChartContext(): ChartContextValue | null {
  return useContext(ChartContext);
}

export interface ChartProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  // 'vertical' → tui-chart-vertical / 'horizontal' → tui-chart-horizontal。
  orientation?: ChartOrientation;
  // 配下の ChartDisplay に no-x-axis / no-y-axis modifier を付与する。
  noXAxis?: boolean;
  noYAxis?: boolean;
  children?: ReactNode;
}

// ルート要素。tui-chart-vertical / tui-chart-horizontal は CSS で position:relative の
// 基準枠となり、配下の display/x-axis/y-axis を absolute 配置するため width/height 指定が前提。
export function Chart({
  orientation = 'vertical',
  noXAxis = false,
  noYAxis = false,
  className,
  children,
  ref,
  ...divProps
}: ChartProps) {
  const contextValue = useMemo<ChartContextValue>(
    () => ({ orientation, noXAxis, noYAxis }),
    [orientation, noXAxis, noYAxis],
  );

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cx(`tui-chart-${orientation}`, className)}
        {...divProps}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

export interface ChartDisplayProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  // 明示指定時は Context より優先。未指定なら親 Chart の値を引き継ぐ。
  noXAxis?: boolean;
  noYAxis?: boolean;
  children?: ReactNode;
}

// バー描画領域。本家 SCSS は .tui-chart-display.no-x-axis / .no-y-axis を
// この要素に対して定義しているため、modifier はここに付与する。
export function ChartDisplay({
  noXAxis,
  noYAxis,
  className,
  children,
  ref,
  ...divProps
}: ChartDisplayProps) {
  const ctx = useChartContext();
  const resolvedNoXAxis = noXAxis ?? ctx?.noXAxis ?? false;
  const resolvedNoYAxis = noYAxis ?? ctx?.noYAxis ?? false;

  return (
    <div
      ref={ref}
      className={cx(
        'tui-chart-display',
        resolvedNoXAxis && 'no-x-axis',
        resolvedNoYAxis && 'no-y-axis',
        className,
      )}
      {...divProps}
    >
      {children}
    </div>
  );
}

export interface ChartValueProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  // 0-100 のパーセント。縦は style.height、横は style.width に反映する。範囲外はクランプ。
  value: number;
  // バーの色。tui-chart-value に背景色クラス(例: red-168)を付与する。
  color?: TuiColorToken;
  // 明示指定時は Context より優先。
  orientation?: ChartOrientation;
  children?: ReactNode;
}

// 個々のバー。縦棒は height%、横棒は width% で長さを表す(本家 chart.scss の
// flex レイアウト前提)。color は背景色クラスとして付与される。
export function ChartValue({
  value,
  color,
  orientation,
  className,
  style,
  children,
  ref,
  ...divProps
}: ChartValueProps) {
  const ctx = useChartContext();
  const resolvedOrientation = orientation ?? ctx?.orientation ?? 'vertical';

  const clamped = Math.min(100, Math.max(0, value));
  const sizeStyle: CSSProperties =
    resolvedOrientation === 'horizontal'
      ? { width: `${clamped}%` }
      : { height: `${clamped}%` };

  return (
    <div
      ref={ref}
      className={cx('tui-chart-value', color && tuiColor.bg(color), className)}
      style={{ ...sizeStyle, ...style }}
      {...divProps}
    >
      {children}
    </div>
  );
}

export interface ChartXAxisProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

// X 軸領域。配下に ChartLegend を並べる。
export function ChartXAxis({ className, children, ref, ...divProps }: ChartXAxisProps) {
  return (
    <div ref={ref} className={cx('tui-chart-x-axis', className)} {...divProps}>
      {children}
    </div>
  );
}

export interface ChartYAxisProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

// Y 軸領域。配下に ChartLegend を並べる。
export function ChartYAxis({ className, children, ref, ...divProps }: ChartYAxisProps) {
  return (
    <div ref={ref} className={cx('tui-chart-y-axis', className)} {...divProps}>
      {children}
    </div>
  );
}

export interface ChartLegendProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

// 軸の目盛りラベル。x-axis / y-axis の子として配置され、CSS は親軸との
// 組み合わせ(.tui-chart-x-axis .tui-chart-legend 等)でレイアウトが決まる。
export function ChartLegend({ className, children, ref, ...divProps }: ChartLegendProps) {
  return (
    <div ref={ref} className={cx('tui-chart-legend', className)} {...divProps}>
      {children}
    </div>
  );
}

// データ駆動の簡易 API。1 本のバーを表す。
export interface ChartBar {
  // 0-100 のパーセント。
  value: number;
  color?: TuiColorToken;
  // バー内に表示するラベル。未指定時は children を出さない。
  label?: ReactNode;
}

export interface ChartDataProps extends Omit<ChartProps, 'children'> {
  // 描画するバーの配列。配列順に ChartValue を生成する。
  data: ChartBar[];
  // X 軸の目盛りラベル。指定時のみ tui-chart-x-axis を描画する。
  xAxis?: ReactNode[];
  // Y 軸の目盛りラベル。指定時のみ tui-chart-y-axis を描画する。
  yAxis?: ReactNode[];
}

// (A) の低レベル API を内部で組み立てる便利 API。本家の入れ子
// (display > value*, y-axis > legend*, x-axis > legend*)をそのまま再現する。
export function ChartData({ data, xAxis, yAxis, ...chartProps }: ChartDataProps) {
  return (
    <Chart {...chartProps}>
      <ChartDisplay>
        {data.map((bar, index) => (
          <ChartValue key={index} value={bar.value} color={bar.color}>
            {bar.label}
          </ChartValue>
        ))}
      </ChartDisplay>
      {yAxis && (
        <ChartYAxis>
          {yAxis.map((label, index) => (
            <ChartLegend key={index}>{label}</ChartLegend>
          ))}
        </ChartYAxis>
      )}
      {xAxis && (
        <ChartXAxis>
          {xAxis.map((label, index) => (
            <ChartLegend key={index}>{label}</ChartLegend>
          ))}
        </ChartXAxis>
      )}
    </Chart>
  );
}
