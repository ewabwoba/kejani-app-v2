import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

/* ---------------------------- sample listings ---------------------------- */
const listings = [
  {
    id: 'l1', title: 'Modern Bedsitter - Kayole Spine Road', propertyType: 'BEDSITTER',
    rentAmountKsh: 7500, depositAmountKsh: 7500, serviceChargeKsh: 0,
    estateName: 'Kayole', countyName: 'Nairobi', latitude: -1.2833, longitude: 36.9167,
    addressFull: null, nearestLandmark: 'Kayole Spine Road',
    landlordId: 'ld1', landlordName: 'John Kamau', landlordPhone: '+254712000001',
    landlordVerified: true, landlordVerifiedSince: '2021-03-01',
    amenityTags: ['borehole', 'prepaid_electricity', 'gated'], houseRules: 'No pets',
    photoUrls: [], availabilityStatus: 'AVAILABLE', availableSlots: 2, rating: 4.4, isBoosted: true,
  },
  {
    id: 'l2', title: 'Single Room, Matopeni Estate', propertyType: 'SINGLE_ROOM',
    rentAmountKsh: 6500, depositAmountKsh: 6500, serviceChargeKsh: 0,
    estateName: 'Kayole', countyName: 'Nairobi', latitude: -1.2790, longitude: 36.9210,
    addressFull: null, nearestLandmark: null,
    landlordId: 'ld2', landlordName: 'Mercy Wanjiku', landlordPhone: '+254712000002',
    landlordVerified: true, landlordVerifiedSince: '2022-06-15',
    amenityTags: ['water_included'], houseRules: null,
    photoUrls: [], availabilityStatus: 'AVAILABLE', availableSlots: 1, rating: 4.0, isBoosted: false,
  },
  {
    id: 'l3', title: 'Executive 1-Bedroom, Kilimani', propertyType: 'ONE_BEDROOM',
    rentAmountKsh: 45000, depositAmountKsh: 45000, serviceChargeKsh: 3000,
    estateName: 'Kilimani', countyName: 'Nairobi', latitude: -1.2921, longitude: 36.7833,
    addressFull: null, nearestLandmark: 'Yaya Centre',
    landlordId: 'ld3', landlordName: 'Samuel Otieno', landlordPhone: '+254712000003',
    landlordVerified: true, landlordVerifiedSince: '2020-01-10',
    amenityTags: ['borehole', 'elevator', 'cctv', 'parking'], houseRules: 'Rent due by the 5th',
    photoUrls: [], availabilityStatus: 'AVAILABLE', availableSlots: 1, rating: 4.8, isBoosted: true,
  },
];

/* ------------------------------- listings -------------------------------- */
app.get('/api/listings', (req, res) => {
  let results = listings;
  const { q, county, type, maxRent } = req.query;
  if (q) results = results.filter((l) => l.title.toLowerCase().includes(String(q).toLowerCase()) || l.estateName.toLowerCase().includes(String(q).toLowerCase()));
  if (county) results = results.filter((l) => l.countyName.toLowerCase() === String(county).toLowerCase());
  if (type) results = results.filter((l) => l.propertyType.toLowerCase() === String(type).toLowerCase());
  if (maxRent) results = results.filter((l) => l.rentAmountKsh <= Number(maxRent));
  res.json(results);
});

app.get('/api/listings/:id', (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id);
  listing ? res.json(listing) : res.status(404).end();
});

app.post('/api/listings', (req, res) => {
  const body = req.body;
  const created = {
    id: `l${listings.length + 1}`,
    title: body.title, propertyType: String(body.propertyType).toUpperCase(),
    rentAmountKsh: body.rentKsh, depositAmountKsh: body.depositKsh, serviceChargeKsh: body.serviceChargeKsh ?? 0,
    estateName: body.estate, countyName: body.county, latitude: -1.28, longitude: 36.82,
    addressFull: null, nearestLandmark: body.nearestLandmark ?? null,
    landlordId: 'ld-you', landlordName: 'You', landlordPhone: '+254700000000',
    landlordVerified: true, landlordVerifiedSince: new Date().toISOString(),
    amenityTags: body.amenities ?? [], houseRules: body.houseRules ?? null,
    photoUrls: body.photos ?? [], availabilityStatus: 'AVAILABLE', availableSlots: 1, rating: 0, isBoosted: false,
  };
  listings.push(created);
  res.status(201).json(created);
});

app.post('/api/users/:userId/saved-listings/:listingId', (_req, res) => res.status(200).end());

/* ------------------------------ appointments/escrow ----------------------------- */
const appointments = [];
app.post('/api/appointments', (req, res) => {
  const listing = listings.find((l) => l.id === req.body.listingId);
  const appointment = {
    id: `apt${appointments.length + 1}`, listingId: req.body.listingId,
    listingTitle: listing?.title ?? 'Listing', rentKsh: listing?.rentAmountKsh ?? 0,
    preferredDate: req.body.preferredDate, preferredTime: req.body.preferredTime, status: 'pending',
    escrow: { deposited: false, amountKsh: 2030, status: 'HELD' },
    landlord: { name: listing?.landlordName ?? '', phone: listing?.landlordPhone ?? '' },
  };
  appointments.push(appointment);
  res.status(201).json(appointment);
});
app.post('/api/escrow/mpesa/stk-push', (_req, res) => res.json({ requestSent: true }));
app.get('/api/appointments/:id', (req, res) => {
  const a = appointments.find((x) => x.id === req.params.id);
  a ? res.json(a) : res.status(404).end();
});
app.get('/api/users/:userId/appointments', (_req, res) => res.json(appointments));

/* --------------------------------- admin --------------------------------- */
app.get('/api/admin/regions/:regionId/stats', (_req, res) => res.json({
  pendingVerifications: 428, pendingVerificationsTrendPct: 12,
  flaggedListings: 56, flaggedListingsTrendPct: -4,
  totalActiveUsers: 12842, totalActiveUsersTrend: 2100,
  revenueKsh: 1_240_000, revenueTrendPct: 18,
}));

app.get('/api/admin/regions/:regionId/moderation-queue', (_req, res) => res.json([
  { id: 't1', listingId: 'l1', propertyTitle: 'Lavington Studio Apts', unitDetail: 'Block B, Unit 12', reason: 'misleading_price', landlordName: 'Samuel Kamau', flaggedAt: '2026-07-24' },
  { id: 't2', listingId: 'l2', propertyTitle: 'Westlands Modern 3BR', unitDetail: 'Skyline Heights', reason: 'duplicate', landlordName: 'Mercy Wanjiku', flaggedAt: '2026-07-24' },
  { id: 't3', listingId: 'l3', propertyTitle: 'Kilimani Cozy Suites', unitDetail: 'Argwings Rd', reason: 'poor_images', landlordName: 'John Omondi', flaggedAt: '2026-07-23' },
]));

app.get('/api/admin/regions/:regionId/kyc-submissions', (_req, res) => res.json([
  { id: 'k1', applicantName: 'Sarah Nekesa', role: 'landlord', submittedContext: 'Landlord since 2021' },
  { id: 'k2', applicantName: 'David Kiprotich', role: 'agent', submittedContext: 'Agent · 12 listings' },
  { id: 'k3', applicantName: 'Fatuma Ali', role: 'landlord', submittedContext: 'New landlord' },
]));

app.get('/api/admin/regions/:regionId/market-velocity', (_req, res) => res.json([
  { label: 'Mon', newListings: 40, bookings: 22 }, { label: 'Tue', newListings: 65, bookings: 18 },
  { label: 'Wed', newListings: 80, bookings: 30 }, { label: 'Thu', newListings: 35, bookings: 40 },
  { label: 'Fri', newListings: 60, bookings: 20 }, { label: 'Sat', newListings: 20, bookings: 10 },
]));

app.post('/api/admin/moderation-queue/:id/approve', (_req, res) => res.status(200).end());
app.post('/api/admin/moderation-queue/:id/reject', (_req, res) => res.status(200).end());
app.post('/api/admin/kyc-submissions/:id/approve', (_req, res) => res.status(200).end());

app.listen(PORT, () => console.log(`Mock Kejani/NyumbaConnect API running at http://localhost:${PORT}`));
