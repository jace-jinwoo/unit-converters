'use client';

import { useDeferredValue, useId, useMemo, useState } from 'react';
import CopyButton from './CopyButton';
import { Base64Error, decodeBase64, encodeBase64 } from '@/lib/base64';

type Mode = 'encode' | 'decode';

export default function Base64Tool() {
  const uid = useId();
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [padding, setPadding] = useState(true);

  const deferred = useDeferredValue(input);
  const pending = deferred !== input;

  const result = useMemo(() => {
    if (deferred === '') return { output: '', error: null as string | null };
    try {
      const output = mode === 'encode' ? encodeBase64(deferred, { urlSafe, padding }) : decodeBase64(deferred);
      return { output, error: null as string | null };
    } catch (e) {
      const msg = e instanceof Base64Error ? e.message : '변환 중 오류가 발생했습니다.';
      return { output: '', error: msg };
    }
  }, [deferred, mode, urlSafe, padding]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-gray-700">모드</legend>
        <div className="flex gap-4">
          {(['encode', 'decode'] as const).map((m) => (
            <label key={m} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={`${uid}-mode`}
                checked={mode === m}
                onChange={() => setMode(m)}
                className="h-4 w-4 accent-brand-600"
              />
              {m === 'encode' ? '인코딩' : '디코딩'}
            </label>
          ))}
        </div>
      </fieldset>

      {mode === 'encode' && (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="h-4 w-4 accent-brand-600" />
            URL-safe (+ → -, / → _)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={padding} onChange={(e) => setPadding(e.target.checked)} className="h-4 w-4 accent-brand-600" />
            패딩(=) 유지
          </label>
        </div>
      )}

      <label htmlFor={`${uid}-in`} className="mb-1 mt-4 block text-sm font-medium text-gray-700">
        {mode === 'encode' ? '입력 텍스트' : 'Base64 문자열'}
      </label>
      <textarea
        id={`${uid}-in`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        spellCheck={false}
        aria-invalid={result.error !== null}
        aria-describedby={`${uid}-status`}
        className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid=true]:border-red-500"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setInput(mode === 'encode' ? 'Hello, 안녕하세요!' : 'SGVsbG8=')}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          예제 불러오기
        </button>
        <button type="button" onClick={() => setInput('')} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
          지우기
        </button>
      </div>

      <p id={`${uid}-status`} role="alert" className="mt-3 min-h-[1.5rem] text-sm text-red-600">
        {result.error}
      </p>
      <p className="min-h-[1.25rem] text-sm text-gray-500" aria-live="polite">
        {pending ? '처리 중…' : ''}
      </p>

      <label htmlFor={`${uid}-out`} className="mb-1 block text-sm font-medium text-gray-700">
        결과
      </label>
      <textarea
        id={`${uid}-out`}
        value={result.output}
        readOnly
        rows={6}
        spellCheck={false}
        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm"
      />
      <div className="mt-2">
        <CopyButton text={result.output} label="결과 복사" />
      </div>
      <p className="mt-3 text-xs text-gray-500">입력한 내용은 서버로 전송되지 않고 이 브라우저 안에서만 처리됩니다.</p>
    </div>
  );
}
