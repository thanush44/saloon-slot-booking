import React from 'react';
import { Calendar, Sparkles, Star, ShieldCheck, Clock } from 'lucide-react';

export default function Hero({ onStartBooking, onOpenLookup }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-pill">
          <Sparkles size={14} /> Luxury Grooming & Holistic Wellness Experience
        </div>

        <h1 className="hero-title font-serif">
          Elevate Your Style with <br />
          <span className="text-gradient-gold">Bespoke Salon Care</span>
        </h1>

        <p className="hero-subtitle">
          Experience precision haircuts, signature coloring, and therapeutic spa rituals
          delivered by master stylists. Seamlessly book your next appointment in minutes.
        </p>

        <div className="hero-actions">
          <button onClick={onStartBooking} className="btn btn-primary btn-lg">
            <Calendar size={18} /> Schedule Your Visit
          </button>
          <button onClick={onOpenLookup} className="btn btn-secondary btn-lg">
            Check Booking Status
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '36px',
          marginTop: '50px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <span>4.9 / 5 Client Rating</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>Certified Master Stylists</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
            <Clock size={16} color="#3b82f6" />
            <span>Guaranteed Zero Wait Time</span>
          </div>
        </div>
      </div>
    </section>
  );
}
