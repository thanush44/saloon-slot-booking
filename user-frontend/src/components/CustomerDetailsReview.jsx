import React from 'react';
import { User, Phone, Mail, FileText, Calendar, Clock, Scissors, DollarSign, CheckCircle2 } from 'lucide-react';

export default function CustomerDetailsReview({
  customerData,
  onChangeCustomerData,
  selectedServices,
  selectedStylist,
  selectedDate,
  selectedTime,
  totalDuration,
  totalPrice,
  onConfirmBooking,
  isSubmitting,
  bookingError,
}) {
  return (
    <div id="review-step">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          Step 4: Contact Details & Order Review
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Please fill in your contact information and review the appointment breakdown before confirming.
        </p>
      </div>

      {bookingError && (
        <div className="toast-alert error">
          <span>{bookingError}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {/* Left Column: Contact Form */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#f59e0b" /> Your Information
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Eleanor Vance"
              value={customerData.name}
              onChange={(e) => onChangeCustomerData('name', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              className="form-input"
              placeholder="e.g. +1 (555) 234-5678"
              value={customerData.phone}
              onChange={(e) => onChangeCustomerData('phone', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. eleanor@example.com"
              value={customerData.email}
              onChange={(e) => onChangeCustomerData('email', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Special Requests / Notes (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Any styling preferences, allergies, or questions?"
              value={customerData.notes}
              onChange={(e) => onChangeCustomerData('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Appointment Summary Card */}
        <div className="glass-card" style={{ padding: '24px', background: 'rgba(26, 32, 48, 0.85)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#f59e0b" /> Appointment Summary
          </h3>

          {/* Date, Time & Stylist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={16} color="#f59e0b" />
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Date</span>
                <strong>{selectedDate}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={16} color="#f59e0b" />
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Time Slot</span>
                <strong>{selectedTime} ({totalDuration} mins duration)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Scissors size={16} color="#f59e0b" />
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Stylist</span>
                <strong>{selectedStylist?.name || 'Any Available Stylist'}</strong>
              </div>
            </div>
          </div>

          {/* Selected Services Breakdown */}
          <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
              Selected Services ({selectedServices.length})
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedServices.map((service) => (
                <div key={service._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem' }}>
                  <div>
                    <span>{service.name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                      {service.durationMinutes} mins
                    </span>
                  </div>
                  <strong style={{ color: 'var(--accent-amber)' }}>${service.price}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Total Duration & Price */}
          <div style={{ paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>Total Estimate</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Duration: {totalDuration} mins</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                ${totalPrice}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            onClick={onConfirmBooking}
            disabled={isSubmitting || !customerData.name || !customerData.phone || !customerData.email}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
          >
            {isSubmitting ? (
              <span>Confirming Booking...</span>
            ) : (
              <>
                <CheckCircle2 size={18} /> Confirm Appointment
              </>
            )}
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px' }}>
            No upfront payment required. Pay at the salon after your visit.
          </p>
        </div>
      </div>
    </div>
  );
}
