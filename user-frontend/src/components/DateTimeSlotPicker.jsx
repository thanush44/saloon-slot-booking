import React from 'react';
import { Calendar, Clock, AlertCircle, Sparkles } from 'lucide-react';

export default function DateTimeSlotPicker({
  selectedDate,
  onChangeDate,
  availableSlots,
  selectedTime,
  onSelectTime,
  loadingSlots,
  slotsMessage,
  totalDuration,
}) {
  // Generate quick pick date chips for the next 10 days
  const getNextDays = (count = 10) => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push({ iso, dayName, monthDay, isToday: i === 0 });
    }
    return dates;
  };

  const nextDays = getNextDays();

  // Group slots into Morning (before 12), Afternoon (12-16), Evening (16+)
  const morningSlots = availableSlots.filter((s) => parseInt(s.time.split(':')[0], 10) < 12);
  const afternoonSlots = availableSlots.filter((s) => {
    const hr = parseInt(s.time.split(':')[0], 10);
    return hr >= 12 && hr < 16;
  });
  const eveningSlots = availableSlots.filter((s) => parseInt(s.time.split(':')[0], 10) >= 16);

  return (
    <div id="datetime-step">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          Step 3: Select Date & Available Time Slot
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Total service duration: <strong style={{ color: '#f59e0b' }}>{totalDuration} minutes</strong>. Real-time slot availability is checked against working hours and existing appointments.
        </p>
      </div>

      {/* Date Selector Row */}
      <div style={{ marginBottom: '24px' }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} /> Choose Date:
        </label>

        {/* Quick Date Chips */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '16px',
          scrollbarWidth: 'none',
        }}>
          {nextDays.map((d) => {
            const isSelected = selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                onClick={() => onChangeDate(d.iso)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--accent-amber)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#0c0e14' : 'var(--text-primary)',
                  border: isSelected ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '85px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <span style={{ fontSize: '0.75rem', opacity: isSelected ? 0.9 : 0.6, textTransform: 'uppercase' }}>
                  {d.isToday ? 'Today' : d.dayName}
                </span>
                <span style={{ fontSize: '1rem', marginTop: '2px' }}>{d.monthDay}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Date Input */}
        <div style={{ maxWidth: '280px' }}>
          <input
            type="date"
            className="form-input"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => onChangeDate(e.target.value)}
          />
        </div>
      </div>

      {/* Time Slots Area */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Available Slots for {selectedDate}</h3>
          </div>
          {availableSlots.length > 0 && (
            <span className="badge badge-gold">{availableSlots.length} Slots Open</span>
          )}
        </div>

        {loadingSlots ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <Sparkles className="animate-spin" size={28} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
            <p>Checking live stylist availability and salon schedule...</p>
          </div>
        ) : availableSlots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <AlertCircle size={32} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {slotsMessage || 'No available slots found for this date.'}
            </p>
            <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>
              Try selecting another date or switching to &ldquo;Any available stylist&rdquo;.
            </p>
          </div>
        ) : (
          <div>
            {/* Morning */}
            {morningSlots.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                  Morning
                </span>
                <div className="slots-grid">
                  {morningSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => onSelectTime(slot.time)}
                      className={`slot-button ${selectedTime === slot.time ? 'selected' : ''}`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {afternoonSlots.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                  Afternoon
                </span>
                <div className="slots-grid">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => onSelectTime(slot.time)}
                      className={`slot-button ${selectedTime === slot.time ? 'selected' : ''}`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Evening */}
            {eveningSlots.length > 0 && (
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                  Evening
                </span>
                <div className="slots-grid">
                  {eveningSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => onSelectTime(slot.time)}
                      className={`slot-button ${selectedTime === slot.time ? 'selected' : ''}`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
