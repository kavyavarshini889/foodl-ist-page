import { useState, useEffect } from 'react';

const MAX = 15000;
const TYPES = ['Resort', 'Villa', 'Palace', 'Suites', 'Lodge', 'Hotel'];
const RANGES = [
  { label: 'Budget · under ₹3,000', min: '', max: '3000' },
  { label: 'Comfort · ₹3,000 – ₹6,000', min: '3000', max: '6000' },
  { label: 'Premium · ₹6,000 – ₹10,000', min: '6000', max: '10000' },
  { label: 'Luxury · above ₹10,000', min: '10000', max: '' },
];

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="fsec">
      <button type="button" className="fsec-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <i className={open ? 'chev up' : 'chev'} />
      </button>
      {open && <div className="fsec-body">{children}</div>}
    </div>
  );
}

export default function SearchFilter({ q, min, max, onChange, onReset }) {
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);

  useEffect(() => { setLo(min); setHi(max); }, [min, max]);

  const apply = () => {
    let a = lo === '' ? '' : Number(lo);
    let b = hi === '' ? '' : Number(hi);
    if (a !== '' && b !== '' && a > b) [a, b] = [b, a];
    onChange({ min: a === '' ? '' : String(a), max: b === '' ? '' : String(b) });
  };

  return (
    <div className="filters">
      <Section title="Popular types">
        <div className="tags">
          {TYPES.map((t) => (
            <button
              key={t} type="button"
              className={q.toLowerCase() === t.toLowerCase() ? 'tag on' : 'tag'}
              onClick={() => onChange({ q: q.toLowerCase() === t.toLowerCase() ? '' : t })}
            >
              {t}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Price range">
        <input
          type="range" min="0" max={MAX} step="500"
          value={hi === '' ? MAX : hi}
          onChange={(e) => setHi(Number(e.target.value) === MAX ? '' : e.target.value)}
          aria-label="Maximum price"
        />
        <div className="row">
          <div className="form-group">
            <label>Min</label>
            <input type="number" min="0" placeholder="₹0" value={lo} onChange={(e) => setLo(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Max</label>
            <input type="number" min="0" placeholder={`₹${MAX}+`} value={hi} onChange={(e) => setHi(e.target.value)} />
          </div>
        </div>
        <button type="button" className="btn btn-block" onClick={apply}>APPLY</button>
      </Section>

      <Section title="Quick ranges">
        {RANGES.map((r) => {
          const on = min === r.min && max === r.max;
          return (
            <button
              key={r.label} type="button"
              className={on ? 'opt on' : 'opt'}
              onClick={() => onChange({ min: on ? '' : r.min, max: on ? '' : r.max })}
            >
              <span className="dot" /> {r.label}
            </button>
          );
        })}
      </Section>

      <button type="button" className="btn btn-block reset" onClick={onReset}>Reset all filters</button>
    </div>
  );
}