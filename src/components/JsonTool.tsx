'use client';

import { useDeferredValue, useId, useMemo, useState } from 'react';
import CopyButton from './CopyButton';
import { formatJson, minifyJson, type JsonIndent } from '@/lib/json';

type Mode = 'format' | 'minify';

const SAMPLE = '{"name":"단위·규격 변환기","tools":["area","json-formatter"],"meta":{"version":1,"free":true}}';

export default function JsonTool() {
  const uid = useId();
  const [mode, setMode] = useState<Mode>('format');
  const [indent, setIndent] = useState<'2' | '4' | 'tab'>('2');
  const [sortKeys, setSortKeys] = useState(false);
  const [input, setInput] = useState('');

  const deferred = useDeferredValue(input);
  const pending = deferred !== input;

  const result = useMemo(() => {
    if (deferred.trim() === '') return null;
    if (mode === 'minify') return minifyJson(deferred, sortKeys);
    const ind: JsonIndent = indent === 'tab' ? 'tab' : indent === '4' ? 4 : 2;
    return formatJson(deferred, ind, sortKeys);
  }, [deferred, mode, indent, sortKeys]);

  const output = result && result.ok ? result.output : '';
  const error = result && !result.ok ? result.error : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <fieldset>
          <legend className="mb-1 text-sm font-medium text-gray-700">모드</legend>
          <div className="flex gap-4">
            {(['format', 'minify'] as const).map((m) => (
              <label key={m} className="flex items-center gap-2 text-sm">
                <input type="radio" name={`${uid}-mode`} checked={mode === m} onChange={() => setMode(m)} className="h-4 w-4 accent-brand-600" />
                {m === 'format' ? '정렬(Beautify)' : '압축(Minify)'}
              </label>
            ))}
          </div>
        </fieldset>

        {mode === 'format' && (
          <div>
            <label htmlFor={`${uid}-indent`} className="mb-1 block text-sm font-medium text-gray-700">
              들여쓰기
            </label>
            <select
              id={`${uid}-indent`}
              value={indent}
              onChange={(e) => setIndent(e.target.value as '2' | '4' | 'tab')}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
            >
              <option value="2">2칸</option>
              <option value="4">4칸</option>
              <option value="tab">탭</option>
            </select>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} className="h-4 w-4 accent-brand-600" />
          객체 키 정렬
        </label>
      </div>

      <label htmlFor={`${uid}-in`} className="mb-1 mt-4 block text-sm font-medium text-gray-700">
        JSON 입력
      </label>
      <textarea
        id={`${uid}-in`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        spellCheck={false}
        aria-invalid={error !== null}
        aria-describedby={`${uid}-status`}
        className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid=true]:border-red-500"
      />

      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => setInput(SAMPLE)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
          예제 불러오기
        </button>
        <button type="button" onClick={() => setInput('')} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
          지우기
        </button>
      </div>

      <p id={`${uid}-status`} role="alert" className="mt-3 min-h-[1.5rem] text-sm text-red-600">
        {error}
      </p>
      <p className="min-h-[1.25rem] text-sm text-gray-500" aria-live="polite">
        {pending ? '처리 중…' : result && result.ok ? `완료: 입력 ${deferred.length.toLocaleString('ko-KR')}자 → 출력 ${output.length.toLocaleString('ko-KR')}자` : ''}
      </p>

      <label htmlFor={`${uid}-out`} className="mb-1 block text-sm font-medium text-gray-700">
        결과
      </label>
      <textarea
        id={`${uid}-out`}
        value={output}
        readOnly
        rows={10}
        spellCheck={false}
        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm"
      />
      <div className="mt-2">
        <CopyButton text={output} label="결과 복사" />
      </div>
      <p className="mt-3 text-xs text-gray-500">입력한 JSON은 서버로 전송되지 않고 이 브라우저 안에서만 처리됩니다.</p>
    </div>
  );
}
