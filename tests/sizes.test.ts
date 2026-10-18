import { describe, expect, it } from 'vitest';
import { approximateShoeSizes, CLOTHING_TABLE, lookupClothing, roundHalf, shoeTable } from '@/lib/sizes';

describe('신발 사이즈 근사', () => {
  it('260mm → EU 40.5 / UK 7 / US 남 8 / US 여 9.5', () => {
    expect(approximateShoeSizes(260)).toEqual({ mm: 260, eu: 40.5, uk: 7, usMen: 8, usWomen: 9.5 });
  });
  it('mm 가 커지면 사이즈도 단조 증가', () => {
    const rows = shoeTable(220, 300, 5);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].eu).toBeGreaterThanOrEqual(rows[i - 1].eu);
      expect(rows[i].uk).toBeGreaterThanOrEqual(rows[i - 1].uk);
    }
  });
  it('모든 값은 0.5 단위', () => {
    for (const r of shoeTable(220, 300, 5)) {
      for (const v of [r.eu, r.uk, r.usMen, r.usWomen]) expect((v * 2) % 1).toBe(0);
    }
  });
  it('범위를 벗어나면 RangeError', () => {
    expect(() => approximateShoeSizes(100)).toThrow(RangeError);
    expect(() => approximateShoeSizes(400)).toThrow(RangeError);
    expect(() => approximateShoeSizes(Number.NaN)).toThrow(RangeError);
  });
  it('roundHalf', () => {
    expect(roundHalf(40.74)).toBe(40.5);
    expect(roundHalf(40.76)).toBe(41);
  });
});

describe('의류 사이즈 관행표', () => {
  it('여성 55 → S, 남성 100 → L', () => {
    expect(lookupClothing('women', '55')?.letter).toBe('S');
    expect(lookupClothing('men', '100')?.letter).toBe('L');
  });
  it('없는 사이즈는 undefined', () => {
    expect(lookupClothing('women', '100')).toBeUndefined();
  });
  it('각 성별 표에 중복 키가 없다', () => {
    for (const rows of Object.values(CLOTHING_TABLE)) {
      expect(new Set(rows.map((r) => r.korean)).size).toBe(rows.length);
    }
  });
});
