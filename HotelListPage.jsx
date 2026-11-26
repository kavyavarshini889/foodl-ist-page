import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import SearchFilter from '../components/SearchFilter';
import SuccessPopup from '../components/SuccessPopup';
import { fetchHotels, deleteHotel, clearDeleteSuccess } from '../features/hotels/hotelSlice';

const LIMIT = 6;

export default function HotelListPage() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const { items, total, loading, error, deleteSuccess } = useSelector((s) => s.hotels);
  const [view, setView] = useState('list');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get('q') || '';
  const min = params.get('min') || '';
  const max = params.get('max') || '';
  const sort = params.get('sort') || 'newest';
  const page = parseInt(params.get('page')) || 1;

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in changes)) next.delete('page'); // any filter change goes back to page 1
    setParams(next);
  };

  const load = useCallback(() => {
    dispatch(fetchHotels({
      title: q, minPrice: min, maxPrice: max, sort,
      limit: LIMIT, offset: (page - 1) * LIMIT,
    }));
  }, [dispatch, q, min, max, sort, page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    const res = await dispatch(deleteHotel(id));
    if (!res.error) {
      if (items.length === 1 && page > 1) update({ page: String(page - 1) });
      else load();
    }
  };

  const closePopup = useCallback(() => dispatch(clearDeleteSuccess()), [dispatch]);

  const chips = [];
  if (q) chips.push({ label: `Title: “${q}”`, clear: { q: '' } });
  if (min || max) chips.push({ label: `₹${min || 0} – ${max ? '₹' + max : 'any'}`, clear: { min: '', max: '' } });

  return (
    <>
      <Helmet>
        <title>{q ? `${q} – Hotels` : 'Hotels'} | NexaStay</title>
        <meta name="description" content="Search, filter and explore hotels by title and price." />
      </Helmet>

      <section className="banner">
        <h1>Hotels</h1>
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>›</span><span>Stays</span><span>›</span><b>Listings</b>
        </nav>
      </section>

      <div className="layout">
        <aside className={filtersOpen ? 'side open' : 'side'}>
          <SearchFilter
            q={q} min={min} max={max}
            onChange={update}
            onReset={() => setParams({})}
          />
        </aside>

        <section>
          <div className="toolbar">
            <p className="found"><strong>{total}</strong> items found</p>
            <div className="tools">
              <button className="btn btn-sm filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
                ⚙ Filters
              </button>
              <select value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort">
                <option value="newest">Newest first</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="title">Title: A–Z</option>
              </select>
              <div className="toggle">
                <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')} aria-label="List view">☰</button>
                <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')} aria-label="Grid view">▦</button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="chips">
              {chips.map((c) => (
                <button key={c.label} className="chip" onClick={() => update(c.clear)}>{c.label} ✕</button>
              ))}
            </div>
          )}

          {error && <p className="error">{error}</p>}

          {loading && items.length === 0 ? (
            <div className={`cards ${view}`}>
              {Array.from({ length: LIMIT }).map((_, i) => <div key={i} className="card skeleton" />)}
            </div>
          ) : (
            <div className={`cards ${view} ${loading ? 'dim' : ''}`}>
              {items.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} onDelete={handleDelete} />)}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="empty">
              <h3>No hotels found</h3>
              <p className="muted">Try a different title or price range.</p>
              <button className="btn btn-primary" onClick={() => setParams({})}>Clear filters</button>
            </div>
          )}

          <Pagination
            page={page}
            totalPages={Math.ceil(total / LIMIT)}
            onChange={(p) => update({ page: String(p) })}
          />
        </section>
      </div>

      {deleteSuccess && <SuccessPopup message="Hotel deleted successfully!" onClose={closePopup} />}
    </>
  );
}