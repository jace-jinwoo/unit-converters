'use client';

import { useId, useMemo, useState } from 'react';
import CopyButton from './CopyButton';
import { formatNumber, parseNumberInput } from '@/lib/format';
import { convert, UNIT_CATEGORIES, type UnitCategory } from '@/lib/units';
import { convertTemperature, TEMPERATURE_UNITS, type TempUnit } from '@/lib/temperature';

interface Option {
  id: string;
  label: string;
}

interface CoreProps {
  options: Option[];
  defaultFrom: string;
  defaultTo: string;
  defaultValue: string;
  run: (value: number, from: string, to: string) => number;
}

type Side = 'a' | 'b';

function ConverterCore({ options, defaultFrom, defaultTo, defaultValue, run }: CoreProps) {
  const uid = useId();
  const [units, setUnits] = useState<Record<Side, string>>({ a: defaultFrom, b: defaultTo });
  const [typed, setTyped] = useState(defaultValue);
  const [src, setSrc] = useState<Side>('a');
  const [decimals, setDecimals] = useState(4);

  const other: Side = src === 'a' ? 'b' : 'a';

  const view = useMemo(() => {
    const parsed = parseNumberInput(typed);
    if (!parsed.ok) return { computed: '', error: parsed.error };
    if (parsed.value === null) return { computed: '', error: null as string | null };
    try {
      const r = run(parsed.value, units[src], units[other]);
      return { computed: formatNumber(r, decimals), error: null as string | null };
    } catch (e) {
      return { computed: '', error: e instanceof Error ? e.message : '변환할 수 없습니다.' };
    }
  }, [typed, src, other, units, decimals, run]);

  const text: Record<Side, string> = {
    a: src === 'a' ? typed : view.computed,
    b: src === 'b' ? typed : view.computed,
  };

  const errorId = `${uid}-error`;

  function field(side: Side, title: string) {
    const invalid = view.error !== null && src === side;
    return (
      <div className="flex-1">
        <label htmlFor={`${uid}-${side}-value`} className="mb-1 block text-sm font-medium text-gray-700">
          {title}
        </label>
        <input
          id={`${uid}-${side}-value`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text[side]}
          onChange={(e) => {
            setSrc(side);
            setTyped(e.target.value);
          }}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg tabular-nums focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid=true]:border-red-500"
        />
        <label htmlFor={`${uid}-${side}-unit`} className="sr-only">
          {title} 단위
        </label>
        <select
          id={`${uid}-${side}-unit`}
          value={units[side]}
          onChange={(e) => setUnits((u) => ({ ...u, [side]: e.target.value }))}
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="mt-2">
          <CopyButton text={text[side]} label="이 값 복사" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-start">
        {field('a', '변환할 값')}
        <div className="flex items-center justify-center sm:pt-7">
          <button
            type="button"
            aria-label="두 단위 맞바꾸기"
            onClick={() => {
              setUnits((u) => ({ a: u.b, b: u.a }));
              setSrc(other);
            }}
            className="rounded-full border border-gray-300 px-3 py-2 text-lg text-brand-700 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
          >
            ⇄
          </button>
        </div>
        {field('b', '변환 결과')}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
        <label htmlFor={`${uid}-decimals`} className="text-sm text-gray-700">
          소수점 자리수
        </label>
        <select
          id={`${uid}-decimals`}
          value={decimals}
          onChange={(e) => setDecimals(Number(e.target.value))}
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
        >
          {[0, 1, 2, 3, 4, 6, 8, 10].map((d) => (
            <option key={d} value={d}>
              {d}자리
            </option>
          ))}
        </select>
      </div>

      <p id={errorId} role="alert" className="mt-3 min-h-[1.5rem] text-sm text-red-600">
        {view.error}
      </p>
    </div>
  );
}

const runUnit = (category: UnitCategory) => (v: number, from: string, to: string) => convert(v, from, to, category);
const RUNNERS: Record<UnitCategory, CoreProps['run']> = {
  length: runUnit('length'),
  weight: runUnit('weight'),
  area: runUnit('area'),
};

const DEFAULTS: Record<UnitCategory, { from: string; to: string; value: string }> = {
  area: { from: 'pyeong', to: 'm2', value: '30' },
  length: { from: 'cm', to: 'in', value: '180' },
  weight: { from: 'kg', to: 'lb', value: '70' },
};

export function UnitConverterTool({ category }: { category: UnitCategory }) {
  const d = DEFAULTS[category];
  return (
    <ConverterCore
      options={UNIT_CATEGORIES[category].units.map((u) => ({ id: u.id, label: u.label }))}
      defaultFrom={d.from}
      defaultTo={d.to}
      defaultValue={d.value}
      run={RUNNERS[category]}
    />
  );
}

const runTemperature: CoreProps['run'] = (v, from, to) => convertTemperature(v, from as TempUnit, to as TempUnit);

export function TemperatureTool() {
  return (
    <ConverterCore
      options={TEMPERATURE_UNITS}
      defaultFrom="C"
      defaultTo="F"
      defaultValue="36.5"
      run={runTemperature}
    />
  );
}
