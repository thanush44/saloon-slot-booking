import React from 'react';
import { CheckCircle2, Calendar, Clock, Scissors, Phone, Mail, User, Printer, X, Sparkles } from 'lucide-react';

export default function BookingConfirmationModal({ appointment, onClose, onResetBooking }) {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <button onClick={onClose} className="modal-close-btn" aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <span className="badge badge-success" style={{ marginBottom: '8px' }}>
            Appointment Confirmed
          </span>

          <h2 className="font-serif" style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '6px' }}>
            We Look Forward to Seeing You!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Your salon reservation is confirmed. Keep your booking reference handy.
          </p>
        </div>

        {/* Reference Number Banner */}
        <div
          style={{
            background: 'rgba(217, 119, 6, 0.1)',
            border: '1px dashed var(--accent-amber)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Booking Reference ID
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)', letterSpacing: '2px' }}>
            {appointment.bookingReference}
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontSize: '0.85rem', marginBottom: '4px' }}>
              <Calendar size={14} /> Scheduled Date
            </div>
            <strong>{appointment.date}</strong>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontSize: '0.85rem', marginBottom: '4px' }}>
              <Clock size={14} /> Time Window
            </div>
            <strong>{appointment.startTime} - {appointment.endTime}</strong>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontSize: '0.85rem', marginBottom: '4px' }}>
              <Scissors size={14} /> Stylist
            </div>
            <strong>{appointment.stylist?.name || 'Assigned Specialist'}</strong>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontSize: '0.85rem', marginBottom: '4px' }}>
              <User size={14} /> Guest
            </div>
            <strong>{appointment.customerName}</strong>
          </div>
        </div>

        {/* Services List */}
        <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
            Booked Services
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {appointment.services?.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>{s.name} ({s.durationMinutes} mins)</span>
                <strong>${s.price}</strong>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', fontWeight: 800 }}>
            <span>Total Payable at Salon:</span>
            <span style={{ color: 'var(--accent-amber)', fontSize: '1.2rem' }}>${appointment.totalPrice}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={16} /> Print Confirmation
          </button>
          <button onClick={onResetBooking} className="btn btn-primary">
            <Sparkles size={16} /> Book Another Visit
          </button>
        </div>
      </div>
    </div>
  );
}
