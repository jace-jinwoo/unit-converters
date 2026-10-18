export type TempUnit = 'C' | 'F' | 'K';

export const TEMPERATURE_UNITS: { id: TempUnit; label: string }[] = [
  { id: 'C', label: '섭씨 (°C)' },
  { id: 'F', label: '화씨 (°F)' },
  { id: 'K', label: '켈빈 (K)' },
];

const ABSOLUTE_ZERO_C = -273.15;
const EPSILON = 1e-9;

function toCelsius(v: number, unit: TempUnit): number {
  switch (unit) {
    case 'C':
      return v;
    case 'F':
      return ((v - 32) * 5) / 9;
    case 'K':
      return v - 273.15;
  }
}

function fromCelsius(c: number, unit: TempUnit): number {
  switch (unit) {
    case 'C':
      return c;
    case 'F':
      return (c * 9) / 5 + 32;
    case 'K':
      return c + 273.15;
  }
}

/** 온도를 변환합니다. 절대영도(-273.15°C, 0 K) 미만이면 RangeError 를 던집니다. */
export function convertTemperature(value: number, from: TempUnit, to: TempUnit): number {
  if (!Number.isFinite(value)) throw new RangeError('유한한 숫자만 변환할 수 있습니다.');
  const c = toCelsius(value, from);
  if (c < ABSOLUTE_ZERO_C - EPSILON) {
    throw new RangeError('절대영도(-273.15°C, 0 K)보다 낮은 온도는 존재하지 않습니다.');
  }
  return fromCelsius(c, to);
}
