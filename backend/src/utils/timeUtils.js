/**
 * Time calculation helpers for salon appointment scheduling
 */

// Convert "HH:MM" string to minutes from midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

// Convert minutes from midnight back to "HH:MM" format
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Add minutes to "HH:MM" string
const addMinutesToTime = (timeStr, minutesToAdd) => {
  const currentMinutes = timeToMinutes(timeStr);
  return minutesToTime(currentMinutes + minutesToAdd);
};

// Check if two time ranges [start1, end1) and [start2, end2) overlap
const isOverlapping = (start1, end1, start2, end2) => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  // Interval overlap condition: max(start1, start2) < min(end1, end2)
  return Math.max(s1, s2) < Math.min(e1, e2);
};

// Get Day of Week name from 'YYYY-MM-DD' string
const getDayOfWeek = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  // Note: month in Date constructor is 0-indexed
  const date = new Date(year, month - 1, day);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

// Check if a time slot is in the past for today's date
const isTimeInPast = (dateString, timeString) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (dateString < todayStr) return true;
  if (dateString > todayStr) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const slotMinutes = timeToMinutes(timeString);

  // Give a small 10 minute buffer
  return slotMinutes <= currentMinutes + 10;
};

module.exports = {
  timeToMinutes,
  minutesToTime,
  addMinutesToTime,
  isOverlapping,
  getDayOfWeek,
  isTimeInPast,
};
