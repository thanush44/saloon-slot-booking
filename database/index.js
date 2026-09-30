const { connectDB, disconnectDB } = require('./connection');
const Service = require('./models/Service');
const Stylist = require('./models/Stylist');
const Admin = require('./models/Admin');
const Appointment = require('./models/Appointment');
const { seedDatabase } = require('./seed');

module.exports = {
  connectDB,
  disconnectDB,
  Service,
  Stylist,
  Admin,
  Appointment,
  seedDatabase,
};
