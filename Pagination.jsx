export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>«</button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`d${i}`} className="dots">…</span>
        ) : (
          <button key={p} className={p === page ? 'active' : ''} onClick={() => onChange(p)}>{p}</button>
        )
      )}
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)}>»</button>
    </nav>
  );
}