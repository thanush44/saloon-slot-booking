import React from 'react';
import { Scissors, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Brand Col */}
          <div>
            <div className="brand" style={{ marginBottom: '14px' }}>
              <div className="brand-icon">
                <Scissors size={20} strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-serif">LuxeGlow</span>
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'block', fontWeight: 500, letterSpacing: '2px' }}>
                  SALON & SPA
                </span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.7' }}>
              Premium grooming and sanctuary wellness designed to help you look radiant and feel revitalized every day.
            </p>
          </div>

          {/* Hours Col */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#f59e0b" /> Salon Working Hours
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>Monday – Friday: <strong style={{ color: '#f8fafc' }}>09:00 – 19:00</strong></div>
              <div>Saturday: <strong style={{ color: '#f8fafc' }}>09:00 – 18:00</strong></div>
              <div>Sunday: <strong style={{ color: '#f8fafc' }}>10:00 – 16:00</strong></div>
            </div>
          </div>

          {/* Location & Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#f8fafc' }}>
              Visit & Contact
            </h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color="#f59e0b" />
                <span>450 Beverly Hills Boulevard, Suite 200</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#f59e0b" />
                <span>+1 (555) 234-5678</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#f59e0b" />
                <span>appointments@luxeglowsalon.com</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            &copy; {new Date().getFullYear()} LuxeGlow Salon. All rights reserved. MERN Stack College Project.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Modern Web Development
          </div>
        </div>
      </div>
    </footer>
  );
}
