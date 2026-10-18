import { describe, expect, it } from 'vitest';
import { formatJson, MAX_JSON_CHARS, minifyJson, parseErrorLocation } from '@/lib/json';

describe('JSON 정렬', () => {
  it('들여쓰기 2칸', () => {
    const r = formatJson('{"a":1,"b":[1,2]}', 2);
    expect(r).toEqual({ ok: true, output: '{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}' });
  });
  it('들여쓰기 4칸과 탭', () => {
    expect(formatJson('{"a":1}', 4)).toEqual({ ok: true, output: '{\n    "a": 1\n}' });
    expect(formatJson('{"a":1}', 'tab')).toEqual({ ok: true, output: '{\n\t"a": 1\n}' });
  });
  it('키 정렬은 객체 키만 정렬하고 배열 순서는 유지', () => {
    const r = formatJson('{"b":[3,1,2],"a":{"z":1,"y":2}}', 2, true);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(Object.keys(JSON.parse(r.output))).toEqual(['a', 'b']);
      expect(Object.keys(JSON.parse(r.output).a)).toEqual(['y', 'z']);
      expect(JSON.parse(r.output).b).toEqual([3, 1, 2]);
    }
  });
  it('한글과 유니코드를 그대로 유지', () => {
    expect(formatJson('{"이름":"홍길동"}', 2)).toEqual({ ok: true, output: '{\n  "이름": "홍길동"\n}' });
  });
});

describe('JSON 압축', () => {
  it('공백 제거', () => {
    expect(minifyJson('{\n  "a": 1,\n  "b": [1, 2]\n}')).toEqual({ ok: true, output: '{"a":1,"b":[1,2]}' });
  });
});

describe('JSON 오류 처리', () => {
  it('빈 입력', () => {
    const r = formatJson('   ');
    expect(r.ok).toBe(false);
  });
  it('문법 오류는 ok:false 와 한국어 메시지', () => {
    const r = formatJson("{'a':1}");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('JSON 문법 오류');
  });
  it('trailing comma 는 오류', () => {
    expect(formatJson('{"a":1,}').ok).toBe(false);
  });
  it('입력 크기 제한', () => {
    const r = formatJson('1'.repeat(MAX_JSON_CHARS + 1));
    expect(r.ok).toBe(false);
  });
  it('오류 위치 파싱 (position N)', () => {
    expect(parseErrorLocation('Unexpected token at position 4', 'ab\ncdef')).toEqual({ line: 2, column: 2 });
  });
  it('오류 위치 파싱 (line X column Y)', () => {
    expect(parseErrorLocation('JSON.parse: bad at line 3 column 7 of the JSON data', '')).toEqual({ line: 3, column: 7 });
  });
  it('위치 정보가 없으면 undefined', () => {
    expect(parseErrorLocation('Unexpected end of JSON input', '{')).toBeUndefined();
  });
});
