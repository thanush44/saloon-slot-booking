const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getServices = async (category) => {
  const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${API_URL}/services${query}`);
  if (!res.ok) throw new Error('Failed to load salon services');
  return res.json();
};

export const getStylists = async () => {
  const res = await fetch(`${API_URL}/stylists`);
  if (!res.ok) throw new Error('Failed to load stylists');
  return res.json();
};

export const getAvailableSlots = async (date, duration, stylistId) => {
  const params = new URLSearchParams({
    date,
    duration: duration.toString(),
    stylistId: stylistId || 'any',
  });
  const res = await fetch(`${API_URL}/availability?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch available time slots');
  }
  return res.json();
};

export const createAppointment = async (bookingData) => {
  const res = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to complete appointment booking');
  }
  return data;
};

export const getAppointmentByRef = async (refOrId) => {
  const res = await fetch(`${API_URL}/appointments/${encodeURIComponent(refOrId)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Appointment not found');
  }
  return data;
};

export const cancelAppointment = async (id) => {
  const res = await fetch(`${API_URL}/appointments/${id}/cancel`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to cancel appointment');
  }
  return data;
};
