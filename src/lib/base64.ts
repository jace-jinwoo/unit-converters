export const MAX_BASE64_CHARS = 5_000_000;

export class Base64Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Base64Error';
  }
}

export interface EncodeOptions {
  /** URL-safe Base64 (+ → -, / → _) */
  urlSafe?: boolean;
  /** '=' 패딩 유지 (기본 true) */
  padding?: boolean;
}

function bytesToBinary(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return binary;
}

/** UTF-8 텍스트를 Base64 로 인코딩합니다. 한글·이모지도 안전하게 처리됩니다. */
export function encodeBase64(text: string, options: EncodeOptions = {}): string {
  const { urlSafe = false, padding = true } = options;
  if (text.length > MAX_BASE64_CHARS) {
    throw new Base64Error(`입력이 너무 깁니다. 최대 ${MAX_BASE64_CHARS.toLocaleString('ko-KR')}자까지 처리할 수 있습니다.`);
  }
  const bytes = new TextEncoder().encode(text);
  let out = btoa(bytesToBinary(bytes));
  if (urlSafe) out = out.replace(/\+/g, '-').replace(/\//g, '_');
  if (!padding) out = out.replace(/=+$/, '');
  return out;
}

/** Base64(표준 또는 URL-safe) 문자열을 UTF-8 텍스트로 디코딩합니다. */
export function decodeBase64(input: string): string {
  if (input.length > MAX_BASE64_CHARS) {
    throw new Base64Error(`입력이 너무 깁니다. 최대 ${MAX_BASE64_CHARS.toLocaleString('ko-KR')}자까지 처리할 수 있습니다.`);
  }
  let s = input.replace(/\s+/g, '');
  if (s === '') return '';
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) {
    throw new Base64Error('Base64에 사용할 수 없는 문자가 포함되어 있습니다.');
  }
  const body = s.replace(/=+$/, '');
  if (body.length % 4 === 1) {
    throw new Base64Error('Base64 길이가 올바르지 않습니다.');
  }
  const padded = body + '='.repeat((4 - (body.length % 4)) % 4);
  let binary: string;
  try {
    binary = atob(padded);
  } catch {
    throw new Base64Error('Base64 디코딩에 실패했습니다.');
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Base64Error('디코딩 결과가 UTF-8 텍스트가 아닙니다. (이미지 등 바이너리 데이터일 수 있습니다.)');
  }
}
