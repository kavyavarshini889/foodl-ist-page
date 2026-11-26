import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { fetchHotel, clearCurrent } from '../features/hotels/hotelSlice';
import { API_URL } from '../api/axios';
import { imgSrc } from '../api/axios';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
});

export default function HotelDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: hotel, loading, error } = useSelector((s) => s.hotels);
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    dispatch(fetchHotel(id));
    return () => { dispatch(clearCurrent()); };
  }, [id, dispatch]);

  // Geolocation API: get the user's current position
  const locateMe = () => {
    if (!navigator.geolocation) return alert('Geolocation is not supported');
    navigator.geolocation.getCurrentPosition(
      (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => alert('Unable to get your location')
    );
  };

  if (error) return <p className="error">{error}</p>;
  if (loading || !hotel) return <p>Loading…</p>;

  const pos = [parseFloat(hotel.latitude), parseFloat(hotel.longitude)];

  return (
    <div className="detail">
      <Helmet>
        <title>{hotel.title} | Hotel Manager</title>
        <meta name="description" content={hotel.description.slice(0, 150)} />
        <meta property="og:title" content={hotel.title} />
        <meta property="og:image" content={`${API_URL}/${hotel.image_path}`} />
      </Helmet>

      <Link to="/">← Back</Link>
      <img src={`${API_URL}/${hotel.image_path}`} alt={`${hotel.title} hotel`} className="detail-img" />
      <h1>{hotel.title}</h1>
      <h2 className="price">₹{Number(hotel.price).toLocaleString()}</h2>
      <p>{hotel.description}</p>
      <p>📍 {hotel.latitude}, {hotel.longitude}</p>
      <button className="btn" onClick={locateMe}>Show my location</button>

      <MapContainer center={pos} zoom={13} className="map">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={pos}><Popup>{hotel.title}</Popup></Marker>
        {userPos && <Marker position={userPos}><Popup>You are here</Popup></Marker>}
      </MapContainer>
    </div>
  );
}