export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Property {
  id: number;
  title: string;
  slug: string;
  reference_number: string;
  description: string;
  property_type: string;
  purpose: 'sale' | 'rent' | 'off_plan';
  status: 'draft' | 'published' | 'archived' | 'sold' | 'rented';
  completion_status: 'ready' | 'off_plan' | 'under_construction';
  price: number;
  currency: string;
  price_per_sqft: number | null;
  address: string;
  city: string;
  community_name: string | null;
  community_slug: string | null;
  developer_name: string | null;
  developer_slug: string | null;
  developer_logo: string | null;
  agent_name: string | null;
  agent_phone: string | null;
  agent_data: AgentData | null;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  parking_spaces: number;
  floor_number: number | null;
  total_floors: number | null;
  year_built: number | null;
  service_charge: number | null;
  furnishing: string;
  featured_image: string | null;
  primary_image: string | null;
  images: PropertyImage[];
  floor_plans: FloorPlan[];
  payment_plans: PaymentPlan[];
  nearby_places: NearbyPlace[];
  amenities: Amenity[];
  is_featured: boolean;
  is_hot: boolean;
  is_luxury: boolean;
  is_new_launch: boolean;
  is_exclusive: boolean;
  video_url: string;
  virtual_tour_url: string;
  brochure: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string;
  country: string;
  meta_title: string;
  meta_description: string;
  views_count: number;
  inquiries_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: number;
  image: string;
  caption: string;
  is_primary: boolean;
  order: number;
}

export interface FloorPlan {
  id: number;
  title: string;
  image: string;
  bedrooms: number | null;
  area_sqft: number | null;
}

export interface PaymentPlan {
  id: number;
  title: string;
  percentage: number;
  milestone: string;
  due_date: string | null;
}

export interface NearbyPlace {
  id: number;
  name: string;
  category: string;
  distance_km: number;
  duration_minutes: number | null;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
  category: string;
}

export interface AgentData {
  id: number;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  photo: string | null;
  designation: string;
}

export interface Agent {
  id: number;
  first_name: string;
  last_name: string;
  designation: string;
  photo: string | null;
  email: string;
  phone: string;
  whatsapp: string;
  languages: string;
  experience_years: number;
  specializations: string;
  total_properties: number;
  total_deals: number;
  is_featured: boolean;
  is_active: boolean;
  rera_number: string;
  bio: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  reviews?: AgentReview[];
  average_rating?: number | null;
}

export interface AgentReview {
  id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  cover_image: string | null;
  description: string;
  short_description: string;
  founded_year: number | null;
  headquarters: string;
  website: string;
  total_projects: number;
  total_units: number;
  is_featured: boolean;
  is_active: boolean;
  meta_title: string;
  meta_description: string;
}

export interface Community {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  cover_image: string | null;
  description: string;
  short_description: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  total_properties: number;
  is_featured: boolean;
  is_active: boolean;
  nearby_schools: string;
  nearby_hospitals: string;
  nearby_malls: string;
  nearby_metro: string;
  meta_title: string;
  meta_description: string;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  developer_name: string | null;
  developer_logo: string | null;
  community_name: string | null;
  featured_image: string | null;
  cover_image: string | null;
  description: string;
  short_description: string;
  status: string;
  completion_date: string | null;
  launch_date: string | null;
  min_price: number | null;
  max_price: number | null;
  currency: string;
  total_units: number;
  available_units: number;
  is_featured: boolean;
  is_active: boolean;
  images: { id: number; image: string; caption: string; order: number }[];
  latitude: number | null;
  longitude: number | null;
  address: string;
  video_url: string;
  virtual_tour_url: string;
  brochure: string | null;
  meta_title: string;
  meta_description: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  author_name: string;
  author_avatar: string | null;
  category_name: string | null;
  category_slug: string | null;
  tags: { id: number; name: string; slug: string }[];
  is_featured: boolean;
  views_count: number;
  read_time: number;
  published_at: string;
  created_at: string;
  meta_title: string;
  meta_description: string;
  comments?: BlogComment[];
}

export interface BlogComment {
  id: number;
  name: string;
  comment: string;
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  photo: string | null;
  content: string;
  rating: number;
  is_featured: boolean;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface SiteSettings {
  company_name: string;
  tagline: string;
  logo: string | null;
  logo_dark: string | null;
  favicon: string | null;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  google_maps_url: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  google_maps_embed: string;
  tiktok: string;
  rera_number: string;
  trade_license: string;
  working_hours: string;
  google_analytics_id: string;
  google_tag_manager_id: string;
  facebook_pixel_id: string;
  header_scripts: string;
  footer_scripts: string;
}

export interface Lead {
  name: string;
  email: string;
  phone?: string;
  nationality?: string;
  message?: string;
  lead_type: string;
  property?: number;
  project?: number;
  preferred_date?: string;
  preferred_time?: string;
  loan_amount?: number;
  down_payment?: number;
  employment_type?: string;
  position?: string;
  experience_years?: number;
  is_newsletter?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface PropertyFilters {
  purpose?: string;
  property_type?: string;
  community?: string;
  developer?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_area?: number;
  max_area?: number;
  completion_status?: string;
  furnishing?: string;
  is_featured?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  phone: string;
  avatar: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface DashboardStats {
  properties: { total: number; published: number; featured: number };
  leads: { total: number; today: number; this_month: number; new: number };
  projects: number;
  developers: number;
  communities: number;
  agents: number;
  blogs: number;
}
