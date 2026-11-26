import { useEffect } from 'react';

export default function SuccessPopup({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup">
        <span className="tick">✔</span>
        <p>{message}</p>
      </div>
    </div>
  );
}