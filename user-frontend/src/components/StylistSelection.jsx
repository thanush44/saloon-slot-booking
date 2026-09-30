import React from 'react';
import { UserCheck, Sparkles, Clock, CalendarX, Check } from 'lucide-react';

export default function StylistSelection({
  stylists,
  selectedStylistId,
  onSelectStylist,
  loading,
}) {
  return (
    <div id="stylist-step">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          Step 2: Select Your Preferred Stylist
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Choose your favorite artist or select &ldquo;Any available stylist&rdquo; for the fastest availability.
        </p>
      </div>

      <div className="stylist-grid">
        {/* Any Available Stylist Card */}
        <div
          onClick={() => onSelectStylist('any')}
          className={`glass-card stylist-card ${selectedStylistId === 'any' ? 'selected' : ''}`}
        >
          <div className="any-stylist-avatar">
            <Sparkles size={36} />
          </div>
          <h3 className="stylist-name">Any Available Stylist</h3>
          <p className="stylist-bio">
            Maximum scheduling flexibility! We will automatically assign an experienced specialist free at your chosen time.
          </p>
          <span className="badge badge-gold" style={{ marginTop: 'auto' }}>
            Recommended for Faster Slots
          </span>
          {selectedStylistId === 'any' && (
            <div style={{ position: 'absolute', top: 16, right: 16, color: '#f59e0b' }}>
              <Check size={20} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Individual Stylists */}
        {stylists.map((stylist) => {
          const isSelected = selectedStylistId === stylist._id;
          return (
            <div
              key={stylist._id}
              onClick={() => onSelectStylist(stylist._id)}
              className={`glass-card stylist-card ${isSelected ? 'selected' : ''}`}
            >
              {stylist.avatarUrl ? (
                <img
                  src={stylist.avatarUrl}
                  alt={stylist.name}
                  className="stylist-avatar"
                  loading="lazy"
                />
              ) : (
                <div className="any-stylist-avatar">
                  <UserCheck size={36} />
                </div>
              )}

              <h3 className="stylist-name">{stylist.name}</h3>
              <p className="stylist-bio">{stylist.bio || 'Professional hair & grooming master'}</p>

              <div className="stylist-specs">
                {stylist.specializations?.map((spec, i) => (
                  <span key={i} className="badge badge-gray">{spec}</span>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '10px', width: '100%', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  <span>{stylist.workingHours?.start} - {stylist.workingHours?.end}</span>
                </div>
                {stylist.daysOff && stylist.daysOff.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: '#f87171', marginTop: '4px' }}>
                    <CalendarX size={12} />
                    <span>Off: {stylist.daysOff.join(', ')}</span>
                  </div>
                )}
              </div>

              {isSelected && (
                <div style={{ position: 'absolute', top: 16, right: 16, color: '#f59e0b' }}>
                  <Check size={20} strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
