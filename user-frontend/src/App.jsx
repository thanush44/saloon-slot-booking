import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import StylistSelection from './components/StylistSelection';
import DateTimeSlotPicker from './components/DateTimeSlotPicker';
import CustomerDetailsReview from './components/CustomerDetailsReview';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import BookingLookupModal from './components/BookingLookupModal';
import Footer from './components/Footer';
import { getServices, getStylists, getAvailableSlots, createAppointment } from './services/api';
import { Sparkles, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export default function App() {
  // Data lists
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Stepper state (1: Services, 2: Stylist, 3: Date & Slot, 4: Review & Submit)
  const [currentStep, setCurrentStep] = useState(1);

  // Booking selections
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStylistId, setSelectedStylistId] = useState('any');

  // Tomorrow's date as default
  const getDefaultDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getDefaultDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState('');

  // Customer info
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  // Submission & Modals
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [showLookupModal, setShowLookupModal] = useState(false);

  // 1. Initial Load: Services & Stylists
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingInitial(true);
        const [servicesRes, stylistsRes] = await Promise.all([
          getServices(),
          getStylists(),
        ]);
        setServices(servicesRes.data || []);
        setStylists(stylistsRes.data || []);

        // Pre-select first service by default for great UX
        if (servicesRes.data && servicesRes.data.length > 0) {
          setSelectedServices([servicesRes.data[0]]);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    loadInitialData();
  }, []);

  // Computed values
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const selectedStylist = selectedStylistId === 'any'
    ? { name: 'Any Available Stylist' }
    : stylists.find((s) => s._id === selectedStylistId);

  // 2. Fetch Slots whenever Date, Duration, or Stylist changes
  useEffect(() => {
    if (!selectedDate || totalDuration === 0) return;

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setSlotsMessage('');
        setSelectedTime(''); // Reset chosen time when criteria change

        const res = await getAvailableSlots(selectedDate, totalDuration, selectedStylistId);
        setAvailableSlots(res.slots || []);
        if (res.message) {
          setSlotsMessage(res.message);
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
        setAvailableSlots([]);
        setSlotsMessage(err.message || 'Error loading available slots');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, totalDuration, selectedStylistId]);

  // Handlers
  const handleToggleService = (service) => {
    const exists = selectedServices.some((s) => s._id === service._id);
    if (exists) {
      if (selectedServices.length === 1) {
        alert('You must have at least one service selected.');
        return;
      }
      setSelectedServices(selectedServices.filter((s) => s._id !== service._id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSelectStylist = (id) => {
    setSelectedStylistId(id);
  };

  const handleChangeDate = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };

  const handleChangeCustomerData = (field, value) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = async () => {
    if (!customerData.name || !customerData.phone || !customerData.email) {
      setBookingError('Please enter your name, phone number, and email.');
      return;
    }

    if (!selectedTime) {
      setBookingError('Please choose a time slot.');
      return;
    }

    setBookingError('');
    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerEmail: customerData.email,
        serviceIds: selectedServices.map((s) => s._id),
        stylistId: selectedStylistId,
        date: selectedDate,
        startTime: selectedTime,
        notes: customerData.notes,
      };

      const res = await createAppointment(payload);
      setConfirmedAppointment(res.data);
    } catch (err) {
      setBookingError(err.message || 'Failed to complete appointment booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetBooking = () => {
    setConfirmedAppointment(null);
    setCurrentStep(1);
    setSelectedTime('');
    setCustomerData({ name: '', phone: '', email: '', notes: '' });
  };

  const scrollToBooking = () => {
    document.getElementById('booking-wizard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar
        onOpenLookup={() => setShowLookupModal(true)}
        onScrollToBooking={scrollToBooking}
      />

      <Hero
        onStartBooking={scrollToBooking}
        onOpenLookup={() => setShowLookupModal(true)}
      />

      {/* Main Booking Wizard */}
      <section id="booking-wizard" className="booking-section">
        <div className="container">
          {/* Stepper Progress Bar */}
          <div className="stepper-header">
            <div className="stepper-progress-bar">
              <div
                className="stepper-progress-fill"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>

            {[
              { num: 1, label: 'Services' },
              { num: 2, label: 'Stylist' },
              { num: 3, label: 'Date & Time' },
              { num: 4, label: 'Review & Book' },
            ].map((s) => {
              const isActive = currentStep === s.num;
              const isDone = currentStep > s.num;
              return (
                <div
                  key={s.num}
                  className={`step-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                  onClick={() => isDone && setCurrentStep(s.num)}
                  style={{ cursor: isDone ? 'pointer' : 'default' }}
                >
                  <div className="step-circle">
                    {isDone ? <Check size={20} strokeWidth={3} /> : s.num}
                  </div>
                  <span className="step-title">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Wizard Step Content */}
          {currentStep === 1 && (
            <ServicesSection
              services={services}
              selectedServices={selectedServices}
              onToggleService={handleToggleService}
              loading={loadingInitial}
            />
          )}

          {currentStep === 2 && (
            <StylistSelection
              stylists={stylists}
              selectedStylistId={selectedStylistId}
              onSelectStylist={handleSelectStylist}
              loading={loadingInitial}
            />
          )}

          {currentStep === 3 && (
            <DateTimeSlotPicker
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              availableSlots={availableSlots}
              selectedTime={selectedTime}
              onSelectTime={handleSelectTime}
              loadingSlots={loadingSlots}
              slotsMessage={slotsMessage}
              totalDuration={totalDuration}
            />
          )}

          {currentStep === 4 && (
            <CustomerDetailsReview
              customerData={customerData}
              onChangeCustomerData={handleChangeCustomerData}
              selectedServices={selectedServices}
              selectedStylist={selectedStylist}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              totalDuration={totalDuration}
              totalPrice={totalPrice}
              onConfirmBooking={handleConfirmBooking}
              isSubmitting={isSubmitting}
              bookingError={bookingError}
            />
          )}

          {/* Stepper Navigation / Summary Bar */}
          <div className="booking-summary-bar">
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} Selected ({totalDuration} mins)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                ${totalPrice}
                {selectedTime && (
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '12px' }}>
                    Scheduled for {selectedDate} at {selectedTime}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn btn-secondary"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              )}

              {currentStep < 4 && (
                <button
                  onClick={() => {
                    if (currentStep === 1 && selectedServices.length === 0) {
                      alert('Please select at least one service.');
                      return;
                    }
                    if (currentStep === 3 && !selectedTime) {
                      alert('Please select an available time slot.');
                      return;
                    }
                    setCurrentStep(currentStep + 1);
                  }}
                  disabled={
                    (currentStep === 1 && selectedServices.length === 0) ||
                    (currentStep === 3 && !selectedTime)
                  }
                  className="btn btn-primary"
                >
                  Continue <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {confirmedAppointment && (
        <BookingConfirmationModal
          appointment={confirmedAppointment}
          onClose={() => setConfirmedAppointment(null)}
          onResetBooking={handleResetBooking}
        />
      )}

      {/* Booking Lookup Modal */}
      <BookingLookupModal
        isOpen={showLookupModal}
        onClose={() => setShowLookupModal(false)}
      />

      <Footer />
    </div>
  );
}
