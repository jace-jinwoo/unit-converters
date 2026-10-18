export const MAX_JSON_CHARS = 5_000_000;

export type JsonIndent = 2 | 4 | 'tab';

export type JsonResult =
  | { ok: true; output: string }
  | { ok: false; error: string; line?: number; column?: number };

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(obj)
        .sort()
        .map((k) => [k, sortKeysDeep(obj[k])]),
    );
  }
  return value;
}

function positionToLineColumn(text: string, position: number) {
  const before = text.slice(0, Math.max(0, position));
  const lines = before.split('\n');
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

/** 엔진별 JSON.parse 오류 메시지에서 위치 정보를 추출합니다. 실패하면 undefined. */
export function parseErrorLocation(message: string, text: string) {
  const pos = /position (\d+)/i.exec(message);
  if (pos) return positionToLineColumn(text, Number(pos[1]));
  const lc = /line (\d+) column (\d+)/i.exec(message);
  if (lc) return { line: Number(lc[1]), column: Number(lc[2]) };
  return undefined;
}

function parse(text: string): { ok: true; value: unknown } | Extract<JsonResult, { ok: false }> {
  if (text.trim() === '') return { ok: false, error: 'JSON을 입력해 주세요.' };
  if (text.length > MAX_JSON_CHARS) {
    return {
      ok: false,
      error: `입력이 너무 깁니다. 최대 ${MAX_JSON_CHARS.toLocaleString('ko-KR')}자까지 처리할 수 있습니다.`,
    };
  }
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const loc = parseErrorLocation(message, text);
    return {
      ok: false,
      error: loc
        ? `JSON 문법 오류: ${loc.line}행 ${loc.column}열 부근을 확인해 주세요.`
        : 'JSON 문법 오류: 쉼표, 따옴표, 괄호를 확인해 주세요.',
      ...loc,
    };
  }
}

export function formatJson(text: string, indent: JsonIndent = 2, sortKeys = false): JsonResult {
  const parsed = parse(text);
  if (!parsed.ok) return parsed;
  const value = sortKeys ? sortKeysDeep(parsed.value) : parsed.value;
  return { ok: true, output: JSON.stringify(value, null, indent === 'tab' ? '\t' : indent) };
}

export function minifyJson(text: string, sortKeys = false): JsonResult {
  const parsed = parse(text);
  if (!parsed.ok) return parsed;
  const value = sortKeys ? sortKeysDeep(parsed.value) : parsed.value;
  return { ok: true, output: JSON.stringify(value) };
}
