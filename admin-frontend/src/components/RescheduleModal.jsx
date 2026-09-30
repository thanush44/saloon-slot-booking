import React, { useState } from 'react';
import { X, Calendar, Clock, Scissors, AlertCircle, CheckCircle2 } from 'lucide-react';
import { rescheduleAppointment } from '../services/api';

export default function RescheduleModal({ appointment, stylists, onClose, onSuccess }) {
  const [date, setDate] = useState(appointment?.date || '');
  const [startTime, setStartTime] = useState(appointment?.startTime || '10:00');
  const [stylistId, setStylistId] = useState(appointment?.stylist?._id || appointment?.stylist || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await rescheduleAppointment(appointment._id, {
        date,
        startTime,
        stylistId: stylistId || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to reschedule appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <button onClick={onClose} className="modal-close-btn" aria-label="Close">
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
          Reschedule Appointment
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Update booking slot for <strong>{appointment.customerName}</strong> ({appointment.bookingReference}).
        </p>

        {error && (
          <div className="toast-alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Appointment Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Start Time (HH:MM)</label>
            <input
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Service duration: {appointment.totalDurationMinutes} mins. Overlap is verified automatically.
            </span>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Assigned Stylist</label>
            <select
              className="form-select"
              value={stylistId}
              onChange={(e) => setStylistId(e.target.value)}
            >
              {stylists.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.name} ({st.workingHours?.start} - {st.workingHours?.end})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
