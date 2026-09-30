import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, RefreshCw, Ban, CheckCircle, Edit, AlertCircle } from 'lucide-react';
import { getAppointments, updateAppointmentStatus, cancelAppointment, getStylists } from '../services/api';
import RescheduleModal from './RescheduleModal';

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStylist, setFilterStylist] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Reschedule Modal
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError('');
      const [apptRes, stRes] = await Promise.all([
        getAppointments({
          date: filterDate || undefined,
          status: filterStatus || undefined,
          stylistId: filterStylist || undefined,
          search: searchQuery || undefined,
        }),
        getStylists(false),
      ]);
      setAppointments(apptRes.data || []);
      setStylists(stRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [filterDate, filterStatus, filterStylist]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAll();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: 'Cancelled' } : a))
      );
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
            Salon Appointments
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Monitor bookings, manage schedule changes, and update guest statuses.
          </p>
        </div>

        <button onClick={fetchAll} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh List
        </button>
      </div>

      {error && (
        <div className="toast-alert error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="panel-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search by guest or code */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1 1 240px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Guest name, phone, or Ref code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              <Search size={15} />
            </button>
          </form>

          {/* Date filter */}
          <div style={{ minWidth: '150px' }}>
            <input
              type="date"
              className="form-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              title="Filter by specific date"
            />
          </div>

          {/* Status filter */}
          <div style={{ minWidth: '140px' }}>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Stylist filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="form-select"
              value={filterStylist}
              onChange={(e) => setFilterStylist(e.target.value)}
            >
              <option value="">All Stylists</option>
              {stylists.map((st) => (
                <option key={st._id} value={st._id}>{st.name}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {(filterDate || filterStatus || filterStylist || searchQuery) && (
            <button
              onClick={() => {
                setFilterDate('');
                setFilterStatus('');
                setFilterStylist('');
                setSearchQuery('');
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="panel-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Guest Details</th>
                <th>Services</th>
                <th>Stylist</th>
                <th>Date & Time</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                    <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 8px' }} />
                    <p>Loading appointments...</p>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                    No appointments match your search criteria.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>
                      <strong style={{ color: 'var(--accent-gold)', letterSpacing: '0.5px' }}>
                        {appt.bookingReference}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{appt.customerName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{appt.customerPhone}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appt.customerEmail}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {appt.services?.map((s, idx) => (
                          <span key={idx} style={{ fontSize: '0.82rem' }}>
                            • {s.name} ({s.durationMinutes}m)
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <strong>{appt.stylist?.name || 'Any Stylist'}</strong>
                    </td>
                    <td>
                      <div>{appt.date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {appt.startTime} – {appt.endTime}
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#34d399' }}>${appt.totalPrice}</strong>
                    </td>
                    <td>
                      <select
                        className={`status-badge ${appt.status}`}
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                        style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setRescheduleTarget(appt)}
                          className="btn-icon"
                          title="Reschedule Appointment Date / Time"
                        >
                          <Edit size={14} />
                        </button>
                        {appt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleCancel(appt._id)}
                            className="btn-icon"
                            style={{ color: '#f87171' }}
                            title="Cancel Appointment"
                          >
                            <Ban size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          stylists={stylists}
          onClose={() => setRescheduleTarget(null)}
          onSuccess={() => {
            setRescheduleTarget(null);
            fetchAll();
          }}
        />
      )}
    </div>
  );
}
