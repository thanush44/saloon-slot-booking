import React, { useState } from 'react';
import { Search, X, Calendar, Clock, Scissors, AlertCircle, Ban, CheckCircle2 } from 'lucide-react';
import { getAppointmentByRef, cancelAppointment } from '../services/api';

export default function BookingLookupModal({ isOpen, onClose }) {
  const [refInput, setRefInput] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!refInput.trim()) return;

    setLoading(true);
    setError('');
    setCancelSuccess('');
    try {
      const res = await getAppointmentByRef(refInput.trim());
      setAppointment(res.data);
    } catch (err) {
      setError(err.message || 'Appointment not found. Please verify your reference code.');
      setAppointment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!appointment || !window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await cancelAppointment(appointment._id);
      setAppointment({ ...appointment, status: 'Cancelled' });
      setCancelSuccess('Your appointment has been successfully cancelled.');
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        <button onClick={onClose} className="modal-close-btn" aria-label="Close">
          <X size={18} />
        </button>

        <h2 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
          Find Your Appointment
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Enter your 6-digit booking reference (e.g., <code>SLN-512801</code>) to view status or manage your booking.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. SLN-512801"
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            style={{ textTransform: 'uppercase' }}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : <Search size={16} />}
          </button>
        </form>

        {error && (
          <div className="toast-alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {cancelSuccess && (
          <div className="toast-alert success">
            <CheckCircle2 size={16} />
            <span>{cancelSuccess}</span>
          </div>
        )}

        {/* Result view */}
        {appointment && (
          <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>REFERENCE</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                  {appointment.bookingReference}
                </div>
              </div>
              <span
                className={`badge ${
                  appointment.status === 'Confirmed'
                    ? 'badge-success'
                    : appointment.status === 'Cancelled'
                    ? 'badge-danger'
                    : 'badge-gold'
                }`}
              >
                {appointment.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', marginBottom: '16px' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Customer:</strong> {appointment.customerName} ({appointment.customerPhone})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="#f59e0b" />
                <span>{appointment.date}</span>
                <Clock size={14} color="#f59e0b" style={{ marginLeft: '12px' }} />
                <span>{appointment.startTime} - {appointment.endTime}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scissors size={14} color="#f59e0b" />
                <span>Stylist: {appointment.stylist?.name || 'Assigned Stylist'}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Services Booked:
              </span>
              {appointment.services?.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span>{s.name}</span>
                  <strong>${s.price}</strong>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontWeight: 700 }}>
                <span>Total:</span>
                <span style={{ color: 'var(--accent-amber)' }}>${appointment.totalPrice}</span>
              </div>
            </div>

            {appointment.status !== 'Cancelled' && (
              <button
                onClick={handleCancelBooking}
                className="btn btn-secondary btn-sm"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', width: '100%' }}
              >
                <Ban size={14} /> Cancel This Appointment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
