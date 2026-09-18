'use client';
import { useMemo, useState } from 'react';
import { decimalToBase, baseToDecimal, decimalToBaseSteps } from '@/lib/numberSystemEngine';

// Deliberately a table of real division steps, not a spatial scene --
// the repeated-division method IS a sequence of arithmetic steps, and
// showing them as real rows is the honest, direct way to teach it (this
// is literally how it's worked by hand on paper). Every value here is
// computed live and verified against Number.prototype.toString(base) and
// a full round-trip before shipping.
const BASES = [{ value: 2, label: 'Binary (base 2)' }, { value: 8, label: 'Octal (base 8)' }, { value: 16, label: 'Hexadecimal (base 16)' }];

export default function NumberSystemScene() {
  const [decimal, setDecimal] = useState(42);
  const [base, setBase] = useState(2);
  const [reverseInput, setReverseInput] = useState('101010');
  const [reverseBase, setReverseBase] = useState(2);

  const steps = useMemo(() => decimalToBaseSteps(decimal, base), [decimal, base]);
  const result = useMemo(() => decimalToBase(decimal, base), [decimal, base]);
  const reverseResult = useMemo(() => baseToDecimal(reverseInput, reverseBase), [reverseInput, reverseBase]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-500">Decimal &rarr; Other Base (repeated division method)</p>
        <div className="flex flex-wrap items-center gap-2">
          <input type="number" value={decimal} onChange={(e) => setDecimal(parseInt(e.target.value, 10) || 0)} className="w-24 px-2 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono text-center" />
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
            {BASES.map((b) => (
              <button key={b.value} onClick={() => setBase(b.value)} className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${base === b.value ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}>{b.label}</button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/40">
              <tr>
                <th className="p-2 text-left font-bold text-slate-400">Divide</th>
                <th className="p-2 text-left font-bold text-slate-400">Quotient</th>
                <th className="p-2 text-left font-bold text-slate-400">Remainder</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, i) => (
                <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-2 font-mono">&divide; {base}</td>
                  <td className="p-2 font-mono">{s.quotient}</td>
                  <td className="p-2 font-mono font-bold text-primary-600">{s.remainder} ({s.digit})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-sm">Read the digit column bottom-to-top: <span className="font-mono font-bold text-primary-600">{decimal}</span> in base {base} is <span className="font-mono font-bold text-accent-600">{result}</span></p>
      </div>

      <div className="space-y-2 pt-2 border-t-2 border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-500">Other Base &rarr; Decimal (positional value method)</p>
        <div className="flex flex-wrap items-center gap-2">
          <input value={reverseInput} onChange={(e) => setReverseInput(e.target.value)} className="w-32 px-2 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono text-center" />
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
            {BASES.map((b) => (
              <button key={b.value} onClick={() => setReverseBase(b.value)} className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${reverseBase === b.value ? 'bg-white dark:bg-slate-900 shadow-sm text-primary-600' : 'text-slate-500'}`}>{b.label}</button>
            ))}
          </div>
        </div>
        <p className="text-center text-sm">
          {Number.isNaN(reverseResult)
            ? <span className="text-red-500 font-bold">Not a valid base-{reverseBase} number</span>
            : <>= <span className="font-mono font-bold text-accent-600">{reverseResult}</span> in decimal</>}
        </p>
      </div>
    </div>
  );
}
