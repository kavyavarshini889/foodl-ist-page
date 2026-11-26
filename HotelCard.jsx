import { Link } from 'react-router-dom';
import { imgSrc } from '../api/axios';

export default function HotelCard({ hotel, onDelete, index = 0 }) {
  const snippet =
    hotel.description.length > 130 ? hotel.description.slice(0, 130) + '…' : hotel.description;

  return (
    <article className="card" style={{ '--i': index }}>
      <Link to={`/hotels/${hotel.id}`} className="card-img">
        <img src={imgSrc(hotel.image_path)} alt={`${hotel.title} hotel`} loading="lazy" />
      </Link>

      <div className="card-body">
        <Link to={`/hotels/${hotel.id}`}><h3>{hotel.title}</h3></Link>
        <span className="coords">◎ {Number(hotel.latitude).toFixed(3)}, {Number(hotel.longitude).toFixed(3)}</span>
        <p>{snippet}</p>
      </div>

      <div className="card-side">
        <div className="price">₹{Number(hotel.price).toLocaleString()}<small>per night</small></div>
        <Link to={`/hotels/${hotel.id}`} className="btn btn-primary btn-block">View details</Link>
        <div className="icon-row">
          <Link to={`/hotels/${hotel.id}/edit`} className="btn btn-sm">✎ Edit</Link>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(hotel.id)}>🗑 Delete</button>
        </div>
      </div>
    </article>
  );
}