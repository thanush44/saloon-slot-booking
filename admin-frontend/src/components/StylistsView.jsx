import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, CalendarX, Sparkles, AlertCircle, X, User } from 'lucide-react';
import { getStylists, createStylist, updateStylist, deleteStylist } from '../services/api';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function StylistsView() {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStylist, setEditingStylist] = useState(null);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    specializations: 'Haircut & Styling',
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    daysOff: ['Sunday'],
    avatarUrl: '',
    isActive: true,
  });

  const fetchStylistsList = async () => {
    try {
      setLoading(true);
      const res = await getStylists(true);
      setStylists(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch stylists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStylistsList();
  }, []);

  const openCreateModal = () => {
    setEditingStylist(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      bio: '',
      specializations: 'Haircut & Styling',
      workingHoursStart: '09:00',
      workingHoursEnd: '18:00',
      daysOff: ['Sunday'],
      avatarUrl: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (st) => {
    setEditingStylist(st);
    setFormData({
      name: st.name,
      email: st.email,
      phone: st.phone,
      bio: st.bio || '',
      specializations: Array.isArray(st.specializations) ? st.specializations.join(', ') : '',
      workingHoursStart: st.workingHours?.start || '09:00',
      workingHoursEnd: st.workingHours?.end || '18:00',
      daysOff: st.daysOff || [],
      avatarUrl: st.avatarUrl || '',
      isActive: st.isActive !== undefined ? st.isActive : true,
    });
    setModalOpen(true);
  };

  const handleToggleDayOff = (day) => {
    if (formData.daysOff.includes(day)) {
      setFormData({
        ...formData,
        daysOff: formData.daysOff.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        daysOff: [...formData.daysOff, day],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      specializations: formData.specializations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      workingHours: {
        start: formData.workingHoursStart,
        end: formData.workingHoursEnd,
      },
      daysOff: formData.daysOff,
      avatarUrl: formData.avatarUrl,
      isActive: formData.isActive,
    };

    try {
      if (editingStylist) {
        await updateStylist(editingStylist._id, payload);
      } else {
        await createStylist(payload);
      }
      setModalOpen(false);
      fetchStylistsList();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove stylist "${name}"?`)) return;
    try {
      await deleteStylist(id);
      setStylists(stylists.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete stylist');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
            Stylists & Working Schedule
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Configure stylist shifts, daily working hours, and designated days off.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Add New Stylist
        </button>
      </div>

      {error && (
        <div className="toast-alert error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Stylists Grid / Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
            Loading stylist roster...
          </div>
        ) : stylists.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
            No stylists configured yet.
          </div>
        ) : (
          stylists.map((st) => (
            <div key={st._id} className="panel-card" style={{ padding: '20px', marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
                {st.avatarUrl ? (
                  <img
                    src={st.avatarUrl}
                    alt={st.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-light)',
                    }}
                  >
                    <User size={28} />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{st.name}</h3>
                    {st.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Inactive</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{st.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{st.phone}</div>
                </div>
              </div>

              {st.bio && (
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  {st.bio}
                </p>
              )}

              {/* Working Hours & Days Off */}
              <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Clock size={14} color="#f59e0b" />
                  <span>Working Hours: <strong>{st.workingHours?.start} – {st.workingHours?.end}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: st.daysOff?.length ? '#f87171' : 'var(--text-muted)' }}>
                  <CalendarX size={14} />
                  <span>Days Off: <strong>{st.daysOff?.length ? st.daysOff.join(', ') : 'None'}</strong></span>
                </div>
              </div>

              {/* Specializations */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {st.specializations?.map((spec, i) => (
                  <span key={i} className="badge badge-gray">{spec}</span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <button
                  onClick={() => openEditModal(st)}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit size={14} /> Edit Schedule
                </button>
                <button
                  onClick={() => handleDelete(st._id, st.name)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Stylist Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setModalOpen(false)} className="modal-close-btn">
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
              {editingStylist ? `Edit Stylist: ${editingStylist.name}` : 'Add New Stylist'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Set up identity, working shifts, and weekly days off.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sophia Martinez"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sophia@salon.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Working Hours Start (HH:MM)</label>
                  <input
                    type="time"
                    className="form-input"
                    value={formData.workingHoursStart}
                    onChange={(e) => setFormData({ ...formData, workingHoursStart: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Working Hours End (HH:MM)</label>
                  <input
                    type="time"
                    className="form-input"
                    value={formData.workingHoursEnd}
                    onChange={(e) => setFormData({ ...formData, workingHoursEnd: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Days Off Checkboxes */}
              <div className="form-group">
                <label className="form-label">Scheduled Days Off (Off Duty)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginTop: '6px' }}>
                  {DAYS_OF_WEEK.map((day) => {
                    const isOff = formData.daysOff.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleToggleDayOff(day)}
                        style={{
                          padding: '8px',
                          borderRadius: 'var(--radius-sm)',
                          background: isOff ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)',
                          border: isOff ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)',
                          color: isOff ? '#fca5a5' : 'var(--text-secondary)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Specializations (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.specializations}
                  onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                  placeholder="Haircut & Styling, Hair Coloring, Balayage"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio / Profile Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Stylist background, credentials, and style focus..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="stylistActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <label htmlFor="stylistActive" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                  Stylist Active on Roster
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStylist ? 'Save Stylist' : 'Register Stylist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
