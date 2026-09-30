import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import AppointmentsView from './components/AppointmentsView';
import ServicesView from './components/ServicesView';
import StylistsView from './components/StylistsView';
import { getMe } from './services/api';
import {
  Scissors,
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  Users,
  LogOut,
  User,
  Shield,
} from 'lucide-react';

export default function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('salon_admin_token');
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const res = await getMe();
        setAdminUser(res.admin);
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem('salon_admin_token');
        localStorage.removeItem('salon_admin_user');
        setAdminUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('salon_admin_token');
    localStorage.removeItem('salon_admin_user');
    setAdminUser(null);
  };

  if (loadingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#94a3b8' }}>
        <p>Checking admin authorization...</p>
      </div>
    );
  }

  // Not logged in -> Show Login View
  if (!adminUser) {
    return <LoginView onLoginSuccess={(admin) => setAdminUser(admin)} />;
  }

  // Authenticated Admin Console
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Scissors size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>LuxeGlow</div>
            <div style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 600, letterSpacing: '1px' }}>
              ADMIN CONSOLE
            </div>
          </div>
        </div>

        <ul className="sidebar-nav">
          <li>
            <div
              onClick={() => setCurrentTab('dashboard')}
              className={`sidebar-link ${currentTab === 'dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </div>
          </li>

          <li>
            <div
              onClick={() => setCurrentTab('appointments')}
              className={`sidebar-link ${currentTab === 'appointments' ? 'active' : ''}`}
            >
              <CalendarCheck size={18} />
              <span>Appointments</span>
            </div>
          </li>

          <li>
            <div
              onClick={() => setCurrentTab('services')}
              className={`sidebar-link ${currentTab === 'services' ? 'active' : ''}`}
            >
              <Sparkles size={18} />
              <span>Services</span>
            </div>
          </li>

          <li>
            <div
              onClick={() => setCurrentTab('stylists')}
              className={`sidebar-link ${currentTab === 'stylists' ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Stylists & Hours</span>
            </div>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <Shield size={18} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {adminUser.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {adminUser.role || 'Administrator'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: '#f87171' }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <span style={{ textTransform: 'capitalize' }}>Admin Portal</span>
            <span>/</span>
            <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{currentTab}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.74rem' }}>
              Backend Live &bull; Port 5000
            </span>
          </div>
        </header>

        {/* Tab Content */}
        <div className="admin-content">
          {currentTab === 'dashboard' && (
            <DashboardView onNavigateToAppointments={() => setCurrentTab('appointments')} />
          )}

          {currentTab === 'appointments' && <AppointmentsView />}

          {currentTab === 'services' && <ServicesView />}

          {currentTab === 'stylists' && <StylistsView />}
        </div>
      </main>
    </div>
  );
}
