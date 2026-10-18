export type UnitCategory = 'length' | 'weight' | 'area';

export interface UnitDef {
  id: string;
  label: string;
  /** 기준 단위(길이 m, 무게 kg, 면적 ㎡) 1단위가 몇 기준 단위인지 */
  factor: number;
}

export interface CategoryDef {
  label: string;
  base: string;
  units: UnitDef[];
}

/**
 * 변환 상수.
 * - 인치·피트·야드·마일, 파운드·온스는 국제 야드·파운드 협정(1959)에 따른 정의값(정확값)입니다.
 * - 1평 = 400/121 ㎡ 는 척관법(1척 = 10/33 m)에서 유래한 관용 환산값입니다.
 *   평은 법정 계량단위가 아니므로 공적 문서에는 ㎡를 사용해야 합니다.
 */
export const UNIT_CATEGORIES: Record<UnitCategory, CategoryDef> = {
  length: {
    label: '길이',
    base: 'm',
    units: [
      { id: 'mm', label: '밀리미터 (mm)', factor: 0.001 },
      { id: 'cm', label: '센티미터 (cm)', factor: 0.01 },
      { id: 'm', label: '미터 (m)', factor: 1 },
      { id: 'km', label: '킬로미터 (km)', factor: 1000 },
      { id: 'in', label: '인치 (in)', factor: 0.0254 },
      { id: 'ft', label: '피트 (ft)', factor: 0.3048 },
      { id: 'yd', label: '야드 (yd)', factor: 0.9144 },
      { id: 'mi', label: '마일 (mi)', factor: 1609.344 },
    ],
  },
  weight: {
    label: '무게',
    base: 'kg',
    units: [
      { id: 'mg', label: '밀리그램 (mg)', factor: 1e-6 },
      { id: 'g', label: '그램 (g)', factor: 0.001 },
      { id: 'kg', label: '킬로그램 (kg)', factor: 1 },
      { id: 't', label: '톤 (t)', factor: 1000 },
      { id: 'oz', label: '온스 (oz)', factor: 0.028349523125 },
      { id: 'lb', label: '파운드 (lb)', factor: 0.45359237 },
    ],
  },
  area: {
    label: '면적',
    base: '㎡',
    units: [
      { id: 'cm2', label: '제곱센티미터 (㎠)', factor: 1e-4 },
      { id: 'm2', label: '제곱미터 (㎡)', factor: 1 },
      { id: 'pyeong', label: '평', factor: 400 / 121 },
      { id: 'ft2', label: '제곱피트 (ft²)', factor: 0.09290304 },
      { id: 'acre', label: '에이커 (ac)', factor: 4046.8564224 },
      { id: 'ha', label: '헥타르 (ha)', factor: 10000 },
      { id: 'km2', label: '제곱킬로미터 (㎢)', factor: 1e6 },
    ],
  },
};

export function getUnit(category: UnitCategory, id: string): UnitDef {
  const unit = UNIT_CATEGORIES[category].units.find((u) => u.id === id);
  if (!unit) throw new Error(`알 수 없는 단위입니다: ${id}`);
  return unit;
}

/** 기준 단위를 거쳐 value 를 from 단위에서 to 단위로 변환합니다. */
export function convert(value: number, from: string, to: string, category: UnitCategory): number {
  if (!Number.isFinite(value)) throw new RangeError('유한한 숫자만 변환할 수 있습니다.');
  const f = getUnit(category, from);
  const t = getUnit(category, to);
  if (f.id === t.id) return value;
  return (value * f.factor) / t.factor;
}
