import { describe, expect, it } from 'vitest';
import { Base64Error, decodeBase64, encodeBase64, MAX_BASE64_CHARS } from '@/lib/base64';

describe('Base64 인코딩', () => {
  it('Hello → SGVsbG8=', () => {
    expect(encodeBase64('Hello')).toBe('SGVsbG8=');
  });
  it('빈 문자열', () => {
    expect(encodeBase64('')).toBe('');
  });
  it('한글(UTF-8)은 Buffer 결과와 일치', () => {
    const text = '안녕하세요 😀';
    expect(encodeBase64(text)).toBe(Buffer.from(text, 'utf-8').toString('base64'));
  });
  it('URL-safe 와 패딩 제거', () => {
    const text = '??>>~~';
    const std = Buffer.from(text).toString('base64');
    expect(encodeBase64(text, { urlSafe: true, padding: false })).toBe(
      std.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
    );
  });
  it('너무 긴 입력은 오류', () => {
    expect(() => encodeBase64('a'.repeat(MAX_BASE64_CHARS + 1))).toThrow(Base64Error);
  });
});

describe('Base64 디코딩', () => {
  it('SGVsbG8= → Hello', () => {
    expect(decodeBase64('SGVsbG8=')).toBe('Hello');
  });
  it('패딩이 없어도 디코딩', () => {
    expect(decodeBase64('SGVsbG8')).toBe('Hello');
  });
  it('공백·줄바꿈은 무시', () => {
    expect(decodeBase64('SGVs\nbG8=')).toBe('Hello');
  });
  it('인코딩→디코딩 왕복 (한글, 이모지, URL-safe)', () => {
    const text = '단위·규격 변환기 😀 ??>>';
    expect(decodeBase64(encodeBase64(text))).toBe(text);
    expect(decodeBase64(encodeBase64(text, { urlSafe: true, padding: false }))).toBe(text);
  });
  it('잘못된 문자는 오류', () => {
    expect(() => decodeBase64('SGV$bG8=')).toThrow(Base64Error);
  });
  it('불가능한 길이는 오류', () => {
    expect(() => decodeBase64('A')).toThrow(Base64Error);
  });
  it('UTF-8 이 아닌 바이너리는 오류', () => {
    // 0xFF 0xFE 는 유효하지 않은 UTF-8 시퀀스
    expect(() => decodeBase64(Buffer.from([0xff, 0xfe]).toString('base64'))).toThrow(Base64Error);
  });
  it('빈 입력은 빈 문자열', () => {
    expect(decodeBase64('   ')).toBe('');
  });
});
