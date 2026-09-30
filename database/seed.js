const { connectDB, disconnectDB } = require('./connection');
const Service = require('./models/Service');
const Stylist = require('./models/Stylist');
const Admin = require('./models/Admin');
const Appointment = require('./models/Appointment');

const seedServices = [
  {
    name: 'Classic Haircut & Blowdry',
    category: 'Haircut & Styling',
    description: 'Precision scissor and clipper cut customized to your face shape, finished with luxury wash and blowout styling.',
    price: 35,
    durationMinutes: 45,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Deluxe Beard Grooming & Hot Towel',
    category: 'Beard & Grooming',
    description: 'Artisan beard sculpt and line up with essential warm oil infusion, hot towel treatment, and balm hydration.',
    price: 25,
    durationMinutes: 30,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Balayage & Gloss Finish',
    category: 'Hair Coloring',
    description: 'Hand-painted dimensional lightening creating soft, natural sun-kissed gradients, sealed with high-shine gloss toner.',
    price: 110,
    durationMinutes: 90,
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Hydra-Glow Facial Treatment',
    category: 'Skin & Facial',
    description: 'Multi-step skin resurfacing that gently exfoliates, cleanses pores with vortex extraction, and infuses antioxidant serums.',
    price: 65,
    durationMinutes: 50,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Aromatherapy Scalp & Shoulder Spa',
    category: 'Spa & Massage',
    description: 'Relaxing botanical oil massage targeting pressure points across scalp, neck, and shoulders to melt tension and stimulate hair growth.',
    price: 45,
    durationMinutes: 40,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Keratin Smoothing Therapy',
    category: 'Haircut & Styling',
    description: 'Intense Brazilian keratin infusion formula that eliminates 95% frizz and leaves hair silky smooth for up to 12 weeks.',
    price: 130,
    durationMinutes: 90,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Signature Haircut & Beard Combo',
    category: 'Haircut & Styling',
    description: 'The ultimate grooming experience including haircut, taper fade, beard sculpting, razor finish, and peppermint hair rinse.',
    price: 55,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Activated Charcoal Deep Detox Facial',
    category: 'Skin & Facial',
    description: 'Deep pore purification treatment using bamboo activated charcoal mask, steam extraction, and soothing aloe finish.',
    price: 50,
    durationMinutes: 45,
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f4142d7634f?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
];

const seedStylists = [
  {
    name: 'Sophia Martinez',
    email: 'sophia@salon.com',
    phone: '+1 (555) 234-5678',
    bio: 'Senior stylist with 8+ years experience specializing in modern textured cuts and balayage color transformations.',
    specializations: ['Haircut & Styling', 'Hair Coloring'],
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
    daysOff: ['Sunday'],
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'David Chen',
    email: 'david@salon.com',
    phone: '+1 (555) 345-6789',
    bio: 'Master barber recognized for razor fades, precision line-ups, and bespoke gentleman beard sculpting.',
    specializations: ['Beard & Grooming', 'Haircut & Styling'],
    workingHours: {
      start: '10:00',
      end: '19:00',
    },
    daysOff: ['Monday'],
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Emma Watson',
    email: 'emma@salon.com',
    phone: '+1 (555) 456-7890',
    bio: 'Certified esthetician and colorist with passion for radiant skin treatments, gentle peels, and natural hair tones.',
    specializations: ['Skin & Facial', 'Hair Coloring'],
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
    daysOff: ['Saturday', 'Sunday'],
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@salon.com',
    phone: '+1 (555) 567-8901',
    bio: 'Holistic hair & scalp therapy expert focusing on stress-relieving head spa rituals and bespoke styling.',
    specializations: ['Spa & Massage', 'Haircut & Styling'],
    workingHours: {
      start: '10:00',
      end: '18:00',
    },
    daysOff: ['Tuesday'],
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Service.deleteMany({});
    await Stylist.deleteMany({});
    await Admin.deleteMany({});
    await Appointment.deleteMany({});

    console.log('[Seed] Inserting services...');
    const insertedServices = await Service.insertMany(seedServices);
    console.log(`[Seed] Inserted ${insertedServices.length} services.`);

    console.log('[Seed] Inserting stylists...');
    const insertedStylists = await Stylist.insertMany(seedStylists);
    console.log(`[Seed] Inserted ${insertedStylists.length} stylists.`);

    console.log('[Seed] Creating default admin account...');
    const defaultAdmin = new Admin({
      name: 'Salon Administrator',
      email: 'admin@salon.com',
      password: 'admin123',
      role: 'admin',
    });
    await defaultAdmin.save();
    console.log('[Seed] Created default admin: admin@salon.com (password: admin123)');

    // Generate upcoming dates for demo appointments
    const today = new Date();
    const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];

    const dateToday = formatDate(today);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dateTomorrow = formatDate(tomorrow);

    console.log('[Seed] Creating sample appointments for demonstration...');
    const sampleAppointments = [
      {
        bookingReference: 'SLN-512801',
        customerName: 'Alex Rivera',
        customerPhone: '+1 (555) 111-2233',
        customerEmail: 'alex.rivera@example.com',
        services: [
          {
            serviceId: insertedServices[0]._id,
            name: insertedServices[0].name,
            price: insertedServices[0].price,
            durationMinutes: insertedServices[0].durationMinutes,
          },
        ],
        stylist: insertedStylists[0]._id,
        date: dateToday,
        startTime: '10:00',
        endTime: '10:45',
        totalDurationMinutes: 45,
        totalPrice: 35,
        status: 'Confirmed',
        notes: 'First time visit. Looking for modern taper.',
      },
      {
        bookingReference: 'SLN-784192',
        customerName: 'Jessica Miller',
        customerPhone: '+1 (555) 444-5566',
        customerEmail: 'jess.miller@example.com',
        services: [
          {
            serviceId: insertedServices[2]._id,
            name: insertedServices[2].name,
            price: insertedServices[2].price,
            durationMinutes: insertedServices[2].durationMinutes,
          },
          {
            serviceId: insertedServices[3]._id,
            name: insertedServices[3].name,
            price: insertedServices[3].price,
            durationMinutes: insertedServices[3].durationMinutes,
          },
        ],
        stylist: insertedStylists[2]._id,
        date: dateTomorrow,
        startTime: '11:00',
        endTime: '13:20',
        totalDurationMinutes: 140,
        totalPrice: 175,
        status: 'Confirmed',
        notes: 'Attending wedding this weekend.',
      },
      {
        bookingReference: 'SLN-993214',
        customerName: 'Liam Johnson',
        customerPhone: '+1 (555) 777-8899',
        customerEmail: 'liam.j@example.com',
        services: [
          {
            serviceId: insertedServices[1]._id,
            name: insertedServices[1].name,
            price: insertedServices[1].price,
            durationMinutes: insertedServices[1].durationMinutes,
          },
        ],
        stylist: insertedStylists[1]._id,
        date: dateToday,
        startTime: '14:00',
        endTime: '14:30',
        totalDurationMinutes: 30,
        totalPrice: 25,
        status: 'Completed',
        notes: 'Regular customer.',
      },
    ];

    await Appointment.insertMany(sampleAppointments);
    console.log('[Seed] Inserted sample appointments successfully.');

    console.log('[Seed] Database seeding completed successfully! ✨');
    return { insertedServices, insertedStylists };
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    throw error;
  }
};

// If run directly from terminal
if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await disconnectDB();
      process.exit(1);
    });
}

module.exports = {
  seedDatabase,
  seedServices,
  seedStylists,
};
