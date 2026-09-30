// Mirrors backend/apps/properties/models.py Property.TYPE_CHOICES /
// NEARBY_AREA_CHOICES — keep both sides in sync when adding options.

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'studio', label: 'Studio' },
  { value: 'office', label: 'Office' },
  { value: 'retail', label: 'Retail' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'land', label: 'Land' },
  { value: 'building', label: 'Building' },
  { value: 'office_space', label: 'Office Space' },
  { value: 'mansion', label: 'Mansion' },
  { value: 'residential', label: 'Residential' },
  { value: 'office_units', label: 'Office Units' },
  { value: 'commercial', label: 'Commercial' },
] as const;

export const NEARBY_AREAS = [
  { value: 'rak_international_airport', label: 'RAK International Airport' },
  { value: 'al_maktoum_international_airport', label: 'Al Maktoum International Airport' },
  { value: 'miracle_garden', label: 'Miracle Garden' },
  { value: 'sharjah_international_airport', label: 'Sharjah International Airport' },
  { value: 'dubai_international_airport', label: 'Dubai International Airport' },
  { value: 'dubai_hills_mall', label: 'Dubai Hills Mall' },
  { value: 'rak_central', label: 'RAK Central' },
  { value: 'burj_khalifa', label: 'Burj Khalifa' },
  { value: 'deira', label: 'Deira' },
  { value: 'yas_island', label: 'Yas Island' },
  { value: 'saadiyat_island', label: 'Saadiyat Island' },
  { value: 'zayed_international_airport', label: 'Zayed International Airport' },
  { value: 'abu_dhabi_city', label: 'Abu Dhabi City' },
  { value: 'dubai', label: 'Dubai' },
  { value: 'maritime_city', label: 'Maritime City' },
  { value: 'jvc', label: 'JVC' },
  { value: 'business_bay', label: 'Business Bay' },
  { value: 'downtown', label: 'Downtown' },
  { value: 'palm_jumeirah', label: 'Palm Jumeirah' },
  { value: 'dubai_islands', label: 'Dubai Islands' },
  { value: 'dubai_creek_harbour', label: 'Dubai Creek Harbour' },
  { value: 'city_walk', label: 'City Walk' },
  { value: 'dubai_south', label: 'Dubai South' },
  { value: 'palm_jebel_ali', label: 'Palm Jebel Ali' },
] as const;

export const CITIES = [
  'Abu Dhabi',
  'Ajman',
  'Dubai',
  'Dubailand',
  'Palm Jumeirah',
  'Ras Al Khaimah, UAE',
  'Sharjah',
  'Umm Al Quwain, UAE',
];

// Separate, shorter list for Projects (Project.CITY_CHOICES in
// apps/projects/models.py) — used for both the "New Launches" page city
// filter and the admin project form's City dropdown.
export const PROJECT_CITIES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah', 'Ajman'];

export const PURPOSES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'off_plan', label: 'Off Plan' },
  { value: 'resale', label: 'Resale/Ready to Move' },
  { value: 'rental', label: 'Rental' },
] as const;

const propertyTypeLabels: Record<string, string> = Object.fromEntries(PROPERTY_TYPES.map((t) => [t.value, t.label]));
const nearbyAreaLabels: Record<string, string> = Object.fromEntries(NEARBY_AREAS.map((a) => [a.value, a.label]));
const purposeLabels: Record<string, string> = Object.fromEntries(PURPOSES.map((p) => [p.value, p.label]));

export const propertyTypeLabel = (value: string) => propertyTypeLabels[value] || value;
export const nearbyAreaLabel = (value: string) => nearbyAreaLabels[value] || value;
export const purposeLabel = (value: string) => purposeLabels[value] || value;
