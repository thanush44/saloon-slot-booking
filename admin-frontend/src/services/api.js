const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('salon_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Auth
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const getMe = async () => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Session expired');
  return data;
};

// Stats
export const getStats = async () => {
  const res = await fetch(`${API_URL}/stats`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch statistics');
  return data;
};

// Appointments
export const getAppointments = async (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.date) query.append('date', filters.date);
  if (filters.status) query.append('status', filters.status);
  if (filters.stylistId) query.append('stylistId', filters.stylistId);
  if (filters.search) query.append('search', filters.search);

  const res = await fetch(`${API_URL}/appointments?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch appointments');
  return data;
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/appointments/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update status');
  return data;
};

export const rescheduleAppointment = async (id, rescheduleData) => {
  const res = await fetch(`${API_URL}/appointments/${id}/reschedule`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(rescheduleData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to reschedule appointment');
  return data;
};

export const cancelAppointment = async (id) => {
  const res = await fetch(`${API_URL}/appointments/${id}/cancel`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to cancel appointment');
  return data;
};

// Services CRUD
export const getServices = async (includeInactive = true) => {
  const res = await fetch(`${API_URL}/services?includeInactive=${includeInactive}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch services');
  return data;
};

export const createService = async (serviceData) => {
  const res = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(serviceData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create service');
  return data;
};

export const updateService = async (id, serviceData) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(serviceData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update service');
  return data;
};

export const deleteService = async (id) => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete service');
  return data;
};

// Stylists CRUD & Working Hours / Days Off
export const getStylists = async (includeInactive = true) => {
  const res = await fetch(`${API_URL}/stylists?includeInactive=${includeInactive}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch stylists');
  return data;
};

export const createStylist = async (stylistData) => {
  const res = await fetch(`${API_URL}/stylists`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(stylistData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create stylist');
  return data;
};

export const updateStylist = async (id, stylistData) => {
  const res = await fetch(`${API_URL}/stylists/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(stylistData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update stylist');
  return data;
};

export const deleteStylist = async (id) => {
  const res = await fetch(`${API_URL}/stylists/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete stylist');
  return data;
};
