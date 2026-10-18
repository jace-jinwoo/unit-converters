'use client';

import { useId, useMemo, useState } from 'react';
import { parseNumberInput } from '@/lib/format';
import {
  approximateShoeSizes,
  CLOTHING_TABLE,
  lookupClothing,
  shoeTable,
  type ClothingGender,
} from '@/lib/sizes';

const NOTICE =
  '이 값은 정확한 단위 변환이 아니라 근사 참고값입니다. 브랜드·모델마다 사이즈가 다르므로 구매 전 해당 브랜드의 공식 사이즈표를 확인하세요.';

function Notice() {
  return (
    <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900" role="note">
      {NOTICE}
    </p>
  );
}

export function ShoeSizeTool() {
  const uid = useId();
  const [value, setValue] = useState('260');

  const view = useMemo(() => {
    const parsed = parseNumberInput(value);
    if (!parsed.ok) return { error: parsed.error, result: null };
    if (parsed.value === null) return { error: null, result: null };
    try {
      return { error: null, result: approximateShoeSizes(parsed.value) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : '계산할 수 없습니다.', result: null };
    }
  }, [value]);

  const table = useMemo(() => shoeTable(220, 300, 5), []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <label htmlFor={`${uid}-mm`} className="mb-1 block text-sm font-medium text-gray-700">
        한국 사이즈 (발 길이, mm)
      </label>
      <input
        id={`${uid}-mm`}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-invalid={view.error !== null}
        aria-describedby={`${uid}-err`}
        className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-lg tabular-nums focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid=true]:border-red-500"
      />
      <p id={`${uid}-err`} role="alert" className="mt-2 min-h-[1.5rem] text-sm text-red-600">
        {view.error}
      </p>

      {view.result && (
        <dl className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['EU (근사)', view.result.eu],
            ['UK (근사)', view.result.uk],
            ['US 남성 (근사)', view.result.usMen],
            ['US 여성 (근사)', view.result.usWomen],
          ].map(([label, v]) => (
            <div key={label as string} className="rounded-lg border border-brand-100 bg-brand-50 p-3">
              <dt className="text-xs text-gray-600">{label}</dt>
              <dd className="text-xl font-semibold text-brand-900 tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      <Notice />

      <h3 className="mt-6 text-base font-semibold text-gray-900">참고표 (220~300mm, 5mm 간격)</h3>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <caption className="sr-only">한국 mm 사이즈별 EU·UK·US 근사 사이즈</caption>
          <thead>
            <tr className="bg-gray-50 text-left">
              <th scope="col" className="border border-gray-200 px-3 py-2">한국(mm)</th>
              <th scope="col" className="border border-gray-200 px-3 py-2">EU</th>
              <th scope="col" className="border border-gray-200 px-3 py-2">UK</th>
              <th scope="col" className="border border-gray-200 px-3 py-2">US 남성</th>
              <th scope="col" className="border border-gray-200 px-3 py-2">US 여성</th>
            </tr>
          </thead>
          <tbody>
            {table.map((r) => (
              <tr key={r.mm} className={view.result?.mm === r.mm ? 'bg-brand-50' : undefined}>
                <th scope="row" className="border border-gray-200 px-3 py-1.5 text-left font-medium">{r.mm}</th>
                <td className="border border-gray-200 px-3 py-1.5 tabular-nums">{r.eu}</td>
                <td className="border border-gray-200 px-3 py-1.5 tabular-nums">{r.uk}</td>
                <td className="border border-gray-200 px-3 py-1.5 tabular-nums">{r.usMen}</td>
                <td className="border border-gray-200 px-3 py-1.5 tabular-nums">{r.usWomen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ClothingSizeTool() {
  const uid = useId();
  const [gender, setGender] = useState<ClothingGender>('women');
  const [korean, setKorean] = useState('55');

  const rows = CLOTHING_TABLE[gender];
  const selected = lookupClothing(gender, korean) ?? rows[0];

  function changeGender(g: ClothingGender) {
    setGender(g);
    setKorean(CLOTHING_TABLE[g][1].korean);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-gray-700">구분</legend>
        <div className="flex gap-4">
          {(['women', 'men'] as const).map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={`${uid}-gender`}
                checked={gender === g}
                onChange={() => changeGender(g)}
                className="h-4 w-4 accent-brand-600"
              />
              {g === 'women' ? '여성' : '남성'}
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor={`${uid}-kr`} className="mb-1 mt-4 block text-sm font-medium text-gray-700">
        한국 숫자 사이즈
      </label>
      <select
        id={`${uid}-kr`}
        value={selected.korean}
        onChange={(e) => setKorean(e.target.value)}
        className="w-full max-w-xs rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
      >
        {rows.map((r) => (
          <option key={r.korean} value={r.korean}>
            {r.korean}
          </option>
        ))}
      </select>

      <p className="mt-4 text-lg" aria-live="polite">
        <span className="font-semibold tabular-nums">{selected.korean}</span> 사이즈는 관행적으로{' '}
        <span className="rounded bg-brand-50 px-2 py-0.5 font-semibold text-brand-900">{selected.letter}</span>에 대응합니다.
      </p>

      <Notice />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[260px] max-w-md border-collapse text-sm">
          <caption className="mb-2 text-left font-semibold text-gray-900">
            {gender === 'women' ? '여성' : '남성'} 사이즈 관행 대응표
          </caption>
          <thead>
            <tr className="bg-gray-50 text-left">
              <th scope="col" className="border border-gray-200 px-3 py-2">한국</th>
              <th scope="col" className="border border-gray-200 px-3 py-2">알파벳</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.korean} className={r.korean === selected.korean ? 'bg-brand-50' : undefined}>
                <th scope="row" className="border border-gray-200 px-3 py-1.5 text-left font-medium">{r.korean}</th>
                <td className="border border-gray-200 px-3 py-1.5">{r.letter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
