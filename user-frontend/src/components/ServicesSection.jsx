import React, { useState } from 'react';
import { Clock, Check, Plus, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Haircut & Styling',
  'Hair Coloring',
  'Skin & Facial',
  'Spa & Massage',
  'Beard & Grooming',
];

export default function ServicesSection({
  services,
  selectedServices,
  onToggleService,
  loading,
}) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter((s) => s.category === activeCategory);

  const isSelected = (serviceId) => {
    return selectedServices.some((s) => s._id === serviceId);
  };

  return (
    <div id="services-step">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-serif" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          Step 1: Choose Your Services
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Select one or multiple services. Duration and pricing will automatically be calculated for your time slot.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Sparkles className="animate-spin" size={32} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
          <p>Loading curated salon services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No services found in this category.
        </div>
      ) : (
        <div className="service-grid">
          {filteredServices.map((service) => {
            const selected = isSelected(service._id);
            return (
              <div
                key={service._id}
                onClick={() => onToggleService(service)}
                className={`glass-card service-card ${selected ? 'selected' : ''}`}
              >
                {service.imageUrl && (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="service-card-image"
                    loading="lazy"
                  />
                )}

                <div className="service-card-header">
                  <span className="badge badge-gold">{service.category}</span>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: selected ? 'var(--accent-amber)' : 'rgba(255,255,255,0.1)',
                      color: selected ? '#0c0e14' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selected ? <Check size={16} strokeWidth={3} /> : <Plus size={16} />}
                  </div>
                </div>

                <h3 className="service-card-title">{service.name}</h3>
                <p className="service-card-desc">{service.description}</p>

                <div className="service-card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Clock size={14} />
                    <span>{service.durationMinutes} mins</span>
                  </div>
                  <div className="service-price">${service.price}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
