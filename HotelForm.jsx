import { useState, useEffect } from 'react';
import { API_URL } from '../api/axios';

const empty = { title: '', description: '', latitude: '', longitude: '', price: '' };

export default function HotelForm({ initialData, onSubmit, submitting, serverError }) {
  const isEdit = !!initialData;
  const [values, setValues] = useState(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setValues({
        title: initialData.title,
        description: initialData.description,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        price: initialData.price,
      });
      setPreview(`${API_URL}/${initialData.image_path}`);
    }
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!isEdit && !file) e.image = 'Image is required';
    if (!String(values.title).trim()) e.title = 'Title is required';
    if (!String(values.description).trim()) e.description = 'Description is required';
    const lat = parseFloat(values.latitude);
    const lng = parseFloat(values.longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) e.latitude = 'Latitude must be between -90 and 90';
    if (isNaN(lng) || lng < -180 || lng > 180) e.longitude = 'Longitude must be between -180 and 180';
    if (!(parseFloat(values.price) > 0)) e.price = 'Price must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return setErrors({ ...errors, image: 'Only images allowed' });
    if (f.size > 2 * 1024 * 1024) return setErrors({ ...errors, image: 'Max size is 2MB' });
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setErrors({ ...errors, image: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    onSubmit(fd);
  };

  const field = (name, label, props = {}) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        value={values[name]}
        onChange={(e) => setValues({ ...values, [name]: e.target.value })}
        {...props}
      />
      {errors[name] && <small className="error">{errors[name]}</small>}
    </div>
  );

  return (
    <form className="hotel-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEdit ? 'Edit Hotel' : 'Add Hotel'}</h2>
      {serverError && <div className="error-box">{serverError}</div>}

      <div className="form-group">
        <label>Image</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {preview && <img src={preview} alt="Hotel preview" className="preview" />}
        {errors.image && <small className="error">{errors.image}</small>}
      </div>

      {field('title', 'Title', { type: 'text' })}

      <div className="form-group">
        <label>Description</label>
        <textarea
          rows="4"
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />
        {errors.description && <small className="error">{errors.description}</small>}
      </div>

      <div className="row">
        {field('latitude', 'Latitude', { type: 'number', step: 'any' })}
        {field('longitude', 'Longitude', { type: 'number', step: 'any' })}
      </div>

      {field('price', 'Price', { type: 'number', min: '0', step: '0.01' })}

      <button className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Saving…' : isEdit ? 'Update Hotel' : 'Add Hotel'}
      </button>
    </form>
  );
}