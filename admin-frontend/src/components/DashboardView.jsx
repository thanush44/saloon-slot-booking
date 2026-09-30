import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, Scissors, CheckCircle, Clock, Ban, RefreshCw, ArrowUpRight } from 'lucide-react';
import { getStats } from '../services/api';

export default function DashboardView({ onNavigateToAppointments }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 12px' }} />
        <p>Loading salon analytics & schedule...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
          Overview Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Real-time metrics, appointment volume, and salon performance overview.
        </p>
      </div>

      {/* Primary KPI Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="metric-value">{stats?.todayAppointmentsCount || 0}</div>
            <div className="metric-label">Appointments Today</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="metric-value">${stats?.totalRevenue || 0}</div>
            <div className="metric-label">Estimated Revenue</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="metric-value">{stats?.totalAppointments || 0}</div>
            <div className="metric-label">Total All-Time Bookings</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Scissors size={24} />
          </div>
          <div>
            <div className="metric-value">{stats?.activeStylistsCount || 0}</div>
            <div className="metric-label">Active Stylists On Roster</div>
          </div>
        </div>
      </div>

      {/* Status Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confirmed</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#34d399' }}>{stats?.countsByStatus?.Confirmed || 0}</div>
          </div>
          <CheckCircle size={20} color="#10b981" />
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#60a5fa' }}>{stats?.countsByStatus?.Completed || 0}</div>
          </div>
          <Clock size={20} color="#3b82f6" />
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rescheduled</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fbbf24' }}>{stats?.countsByStatus?.Rescheduled || 0}</div>
          </div>
          <RefreshCw size={20} color="#f59e0b" />
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cancelled</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f87171' }}>{stats?.countsByStatus?.Cancelled || 0}</div>
          </div>
          <Ban size={20} color="#ef4444" />
        </div>
      </div>

      {/* Recent Appointments Preview */}
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Bookings</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Latest appointments created in the system</p>
          </div>
          <button onClick={onNavigateToAppointments} className="btn btn-secondary btn-sm">
            View All Appointments <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Guest</th>
                <th>Stylist</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
                stats.recentAppointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>
                      <strong style={{ color: 'var(--accent-gold)' }}>{appt.bookingReference}</strong>
                    </td>
                    <td>
                      <div>{appt.customerName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{appt.customerPhone}</div>
                    </td>
                    <td>{appt.stylist?.name || 'Assigned Stylist'}</td>
                    <td>
                      <div>{appt.date}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {appt.startTime} – {appt.endTime}
                      </div>
                    </td>
                    <td>
                      <strong>${appt.totalPrice}</strong>
                    </td>
                    <td>
                      <span className={`status-badge ${appt.status}`}>{appt.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No appointments booked yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
