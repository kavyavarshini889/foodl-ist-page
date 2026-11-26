import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import HotelForm from '../components/HotelForm';
import { createHotel, updateHotel, fetchHotel, clearCurrent } from '../features/hotels/hotelSlice';

export default function HotelFormPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((s) => s.hotels);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (id) dispatch(fetchHotel(id));
    return () => { dispatch(clearCurrent()); };
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setServerError('');
    const action = id ? updateHotel({ id, formData }) : createHotel(formData);
    const res = await dispatch(action);
    setSubmitting(false);
    if (res.error) setServerError(res.payload);
    else navigate('/');
  };

  return (
    <>
      <Helmet><title>{id ? 'Edit Hotel' : 'Add Hotel'} | Hotel Manager</title></Helmet>
      <HotelForm
        key={id || 'new'}
        initialData={id ? current : null}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={serverError}
      />
    </>
  );
}