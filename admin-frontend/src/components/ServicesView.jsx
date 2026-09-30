import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, Clock, Sparkles, AlertCircle, X } from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../services/api';

const CATEGORIES = [
  'Haircut & Styling',
  'Hair Coloring',
  'Skin & Facial',
  'Spa & Massage',
  'Beard & Grooming',
  'Other',
];

export default function ServicesView() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Haircut & Styling',
    description: '',
    price: 35,
    durationMinutes: 30,
    imageUrl: '',
    isActive: true,
  });

  const fetchServicesList = async () => {
    try {
      setLoading(true);
      const res = await getServices(true);
      setServices(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesList();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category: 'Haircut & Styling',
      description: '',
      price: 35,
      durationMinutes: 30,
      imageUrl: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description || '',
      price: service.price,
      durationMinutes: service.durationMinutes,
      imageUrl: service.imageUrl || '',
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingService) {
        await updateService(editingService._id, formData);
      } else {
        await createService(formData);
      }
      setModalOpen(false);
      fetchServicesList();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete service "${name}"?`)) return;
    try {
      await deleteService(id);
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete service');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
            Salon Services
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Configure treatments, pricing tiers, and service durations.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {error && (
        <div className="toast-alert error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Services Table */}
      <div className="panel-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Loading services catalog...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No services configured yet.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{service.name}</div>
                      {service.description && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '340px' }}>
                          {service.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-gray">{service.category}</span>
                    </td>
                    <td>
                      <strong style={{ color: '#34d399', fontSize: '1.05rem' }}>${service.price}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                        <Clock size={13} />
                        <span>{service.durationMinutes} mins</span>
                      </div>
                    </td>
                    <td>
                      {service.isActive ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-danger">Inactive</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(service)}
                          className="btn-icon"
                          title="Edit Service"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id, service.name)}
                          className="btn-icon"
                          style={{ color: '#f87171' }}
                          title="Delete Service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setModalOpen(false)} className="modal-close-btn">
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
              {editingService ? 'Edit Salon Service' : 'Add New Salon Service'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Define service details, duration in minutes, and price.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Service Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Balayage & Gloss Finish"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Minutes) *</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    className="form-input"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the experience, products used, or steps..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <label htmlFor="isActive" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                  Active & Available for Customer Booking
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
