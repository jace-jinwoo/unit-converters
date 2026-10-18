/**
 * 신발·의류 사이즈 참고 변환.
 *
 * 중요: 신발·의류 사이즈는 브랜드마다 다르며, 국가 간 단일 공식 환산표가 없습니다.
 * 이 파일의 값은 "수학적 단위 변환"이 아니라 "근사 참고값"입니다.
 */

// ---------------------------------------------------------------------------
// 신발
// ---------------------------------------------------------------------------

/** 발 길이에 더해 라스트(신골) 길이를 추정하는 여유분(mm). 브랜드마다 다릅니다. */
export const SHOE_ALLOWANCE_MM = 10;
export const SHOE_MIN_MM = 150;
export const SHOE_MAX_MM = 330;

export interface ShoeSizeApprox {
  mm: number;
  eu: number;
  uk: number;
  usMen: number;
  usWomen: number;
}

export function roundHalf(x: number): number {
  return Math.round(x * 2) / 2;
}

/**
 * 한국 사이즈(mm, 몬도포인트 기준 발 길이)를 해외 사이즈로 근사합니다.
 * - EU(파리 포인트): 라스트 길이(cm) × 1.5  (1 파리 포인트 = 2/3 cm)
 * - UK: 3 × 라스트 길이(inch) − 25  (1 사이즈 = 1/3 inch)
 * - US 남성 ≈ UK + 1, US 여성 ≈ US 남성 + 1.5
 * 라스트 길이 = 발 길이(mm) + SHOE_ALLOWANCE_MM
 */
export function approximateShoeSizes(mm: number): ShoeSizeApprox {
  if (!Number.isFinite(mm)) throw new RangeError('숫자를 입력해 주세요.');
  if (mm < SHOE_MIN_MM || mm > SHOE_MAX_MM) {
    throw new RangeError(`${SHOE_MIN_MM}~${SHOE_MAX_MM}mm 범위의 값만 지원합니다.`);
  }
  const last = mm + SHOE_ALLOWANCE_MM;
  const eu = roundHalf((last / 10) * 1.5);
  const uk = roundHalf(3 * (last / 25.4) - 25);
  const usMen = uk + 1;
  const usWomen = usMen + 1.5;
  return { mm, eu, uk, usMen, usWomen };
}

export function shoeTable(fromMm = 220, toMm = 300, step = 5): ShoeSizeApprox[] {
  const rows: ShoeSizeApprox[] = [];
  for (let mm = fromMm; mm <= toMm; mm += step) rows.push(approximateShoeSizes(mm));
  return rows;
}

// ---------------------------------------------------------------------------
// 의류
// ---------------------------------------------------------------------------

export type ClothingGender = 'women' | 'men';

export interface ClothingRow {
  korean: string;
  letter: string;
}

/**
 * 국내에서 널리 쓰이는 관행적 표기입니다. 국가표준이 아니며 브랜드·제품별로 다릅니다.
 * 숫자형 해외 사이즈(US/EU/UK)는 검증 가능한 단일 기준이 없어 포함하지 않았습니다.
 */
export const CLOTHING_TABLE: Record<ClothingGender, ClothingRow[]> = {
  women: [
    { korean: '44', letter: 'XS' },
    { korean: '55', letter: 'S' },
    { korean: '66', letter: 'M' },
    { korean: '77', letter: 'L' },
    { korean: '88', letter: 'XL' },
  ],
  men: [
    { korean: '90', letter: 'S' },
    { korean: '95', letter: 'M' },
    { korean: '100', letter: 'L' },
    { korean: '105', letter: 'XL' },
    { korean: '110', letter: 'XXL' },
  ],
};

export function lookupClothing(gender: ClothingGender, korean: string): ClothingRow | undefined {
  return CLOTHING_TABLE[gender].find((r) => r.korean === korean);
}
