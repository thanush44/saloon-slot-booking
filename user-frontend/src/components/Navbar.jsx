import React from 'react';
import { Scissors, Search, Calendar, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenLookup, onScrollToBooking }) {
  return (
    <header className="navbar">
      <div className="container nav-container">
        <a href="#" className="brand">
          <div className="brand-icon">
            <Scissors size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-serif">LuxeGlow</span>
            <span style={{ fontSize: '0.8rem', color: '#f59e0b', display: 'block', fontWeight: 500, letterSpacing: '2px' }}>
              SALON & SPA
            </span>
          </div>
        </a>

        <nav>
          <ul className="nav-links">
            <li>
              <a href="#services" className="nav-link">Services</a>
            </li>
            <li>
              <a href="#stylists" className="nav-link">Stylists</a>
            </li>
            <li>
              <a href="#about" className="nav-link">About Us</a>
            </li>
            <li>
              <button
                onClick={onOpenLookup}
                className="btn btn-secondary btn-sm"
                title="Lookup existing appointment by reference"
              >
                <Search size={14} /> Find My Booking
              </button>
            </li>
            <li>
              <button
                onClick={onScrollToBooking}
                className="btn btn-primary btn-sm"
              >
                <Calendar size={14} /> Book Now
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
