import { describe, expect, it } from 'vitest';
import { convert, UNIT_CATEGORIES } from '@/lib/units';
import { formatNumber, parseNumberInput } from '@/lib/format';
import { convertTemperature } from '@/lib/temperature';

describe('면적 변환', () => {
  it('1평은 400/121 ㎡', () => {
    expect(convert(1, 'pyeong', 'm2', 'area')).toBeCloseTo(400 / 121, 12);
  });
  it('30평 ≈ 99.1736㎡', () => {
    expect(formatNumber(convert(30, 'pyeong', 'm2', 'area'), 4)).toBe('99.1736');
  });
  it('84㎡ = 25.41평', () => {
    expect(formatNumber(convert(84, 'm2', 'pyeong', 'area'), 4)).toBe('25.41');
  });
  it('1ha = 10000㎡, 1㎢ = 100ha', () => {
    expect(convert(1, 'ha', 'm2', 'area')).toBe(10000);
    expect(convert(1, 'km2', 'ha', 'area')).toBe(100);
  });
  it('왕복 변환 시 원래 값으로 돌아온다', () => {
    const v = convert(convert(37.5, 'pyeong', 'ft2', 'area'), 'ft2', 'pyeong', 'area');
    expect(v).toBeCloseTo(37.5, 10);
  });
});

describe('길이 변환', () => {
  it('1in = 2.54cm', () => {
    expect(convert(1, 'in', 'cm', 'length')).toBeCloseTo(2.54, 12);
  });
  it('180cm ≈ 70.8661in', () => {
    expect(formatNumber(convert(180, 'cm', 'in', 'length'), 4)).toBe('70.8661');
  });
  it('1mi = 1.609344km, 1ft = 12in', () => {
    expect(convert(1, 'mi', 'km', 'length')).toBeCloseTo(1.609344, 12);
    expect(convert(1, 'ft', 'in', 'length')).toBeCloseTo(12, 12);
  });
});

describe('무게 변환', () => {
  it('1lb = 453.59237g, 1lb = 16oz', () => {
    expect(convert(1, 'lb', 'g', 'weight')).toBeCloseTo(453.59237, 9);
    expect(convert(1, 'lb', 'oz', 'weight')).toBeCloseTo(16, 9);
  });
  it('70kg ≈ 154.3236lb', () => {
    expect(formatNumber(convert(70, 'kg', 'lb', 'weight'), 4)).toBe('154.3236');
  });
  it('1t = 1000kg', () => {
    expect(convert(1, 't', 'kg', 'weight')).toBe(1000);
  });
});

describe('변환 오류 처리', () => {
  it('알 수 없는 단위는 예외', () => {
    expect(() => convert(1, 'xx', 'm', 'length')).toThrow();
  });
  it('NaN/Infinity 는 예외', () => {
    expect(() => convert(Number.NaN, 'm', 'cm', 'length')).toThrow(RangeError);
    expect(() => convert(Infinity, 'm', 'cm', 'length')).toThrow(RangeError);
  });
  it('모든 단위 id 는 카테고리 내에서 유일하고 factor 는 양수', () => {
    for (const cat of Object.values(UNIT_CATEGORIES)) {
      const ids = cat.units.map((u) => u.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(cat.units.every((u) => u.factor > 0)).toBe(true);
    }
  });
});

describe('온도 변환', () => {
  it('0°C = 32°F, 100°C = 212°F', () => {
    expect(convertTemperature(0, 'C', 'F')).toBeCloseTo(32, 10);
    expect(convertTemperature(100, 'C', 'F')).toBeCloseTo(212, 10);
  });
  it('-40°C = -40°F', () => {
    expect(convertTemperature(-40, 'C', 'F')).toBeCloseTo(-40, 10);
  });
  it('36.5°C = 97.7°F', () => {
    expect(formatNumber(convertTemperature(36.5, 'C', 'F'), 2)).toBe('97.7');
  });
  it('0K = -273.15°C', () => {
    expect(convertTemperature(0, 'K', 'C')).toBeCloseTo(-273.15, 10);
  });
  it('절대영도 미만은 RangeError', () => {
    expect(() => convertTemperature(-300, 'C', 'F')).toThrow(RangeError);
    expect(() => convertTemperature(-1, 'K', 'C')).toThrow(RangeError);
    expect(() => convertTemperature(-460, 'F', 'C')).toThrow(RangeError);
  });
  it('절대영도 자체는 허용', () => {
    expect(() => convertTemperature(-273.15, 'C', 'K')).not.toThrow();
  });
});

describe('입력 파싱·포맷', () => {
  it('빈 입력은 null', () => {
    expect(parseNumberInput('  ')).toEqual({ ok: true, value: null });
  });
  it('천 단위 쉼표와 부호, 지수 표기를 허용', () => {
    expect(parseNumberInput('1,234.5')).toEqual({ ok: true, value: 1234.5 });
    expect(parseNumberInput('-3')).toEqual({ ok: true, value: -3 });
    expect(parseNumberInput('1e3')).toEqual({ ok: true, value: 1000 });
  });
  it('숫자가 아닌 입력은 오류', () => {
    expect(parseNumberInput('abc').ok).toBe(false);
    expect(parseNumberInput('1.2.3').ok).toBe(false);
    expect(parseNumberInput('--1').ok).toBe(false);
  });
  it('formatNumber: 불필요한 0 제거와 -0 처리', () => {
    expect(formatNumber(2.5, 4)).toBe('2.5');
    expect(formatNumber(100, 2)).toBe('100');
    expect(formatNumber(3.305785, 4)).toBe('3.3058');
    expect(formatNumber(-0.00001, 4)).toBe('0');
    expect(formatNumber(0, 4)).toBe('0');
  });
  it('formatNumber: 매우 큰/작은 값은 지수 표기', () => {
    expect(formatNumber(1e25, 4)).toMatch(/e\+25$/);
    expect(formatNumber(1e-15, 4)).toMatch(/e-15$/);
  });
});
