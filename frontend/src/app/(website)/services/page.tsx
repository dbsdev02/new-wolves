import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';

export const metadata: Metadata = {
  title: 'Our Services - Wolves International',
  description: 'Comprehensive real estate services including buying, selling, renting, property management, and investment advisory.',
};

const services = [
  {
    id: 'buying',
    title: 'Buying Property',
    subtitle: 'Find Your Dream Home',
    description: 'Our expert agents guide you through every step of the property buying process in Dubai.',
    features: ['Personalized property search', 'Market analysis & valuation', 'Negotiation support', 'Legal & documentation assistance', 'Post-purchase support'],
    cta: { label: 'Explore Our Properties', href: '/properties?purpose=sale' },
    image: '/services/buying.jpg',
  },
  {
    id: 'selling',
    title: 'Selling Property',
    subtitle: 'Maximize Your Returns',
    description: 'Get the best value for your property with our proven marketing strategies and expert negotiation.',
    features: ['Free property valuation', 'Professional photography', 'Multi-channel marketing', 'Qualified buyer network', 'Seamless transaction management'],
    cta: { label: 'List Your Property', href: '/list-your-property' },
    image: '/services/selling.jpg',
  },
  {
    id: 'renting',
    title: 'Renting Property',
    subtitle: 'Premium Rental Solutions',
    description: 'Find the perfect rental property or maximize your rental income with our comprehensive services.',
    features: ['Extensive rental listings', 'Tenant screening', 'Lease management', 'Maintenance coordination', 'Rental market insights'],
    cta: { label: 'Browse Rentals', href: '/properties?purpose=rent' },
    image: '/services/renting.jpg',
  },
  {
    id: 'management',
    title: 'Property Management',
    subtitle: 'Hassle-Free Ownership',
    description: 'Let us manage your investment property while you enjoy the returns.',
    features: ['Tenant management', 'Rent collection', 'Maintenance & repairs', 'Financial reporting', 'Legal compliance'],
    cta: { label: 'Learn More', href: '/contact?type=management' },
    image: '/services/management.jpg',
  },
  {
    id: 'golden-visa',
    title: 'Golden Visa',
    subtitle: 'UAE Residency Through Investment',
    description: 'Secure your UAE Golden Visa through strategic real estate investment with our expert guidance.',
    features: ['Eligibility assessment', 'Property selection for visa', 'Application assistance', 'Legal documentation', 'Post-visa support'],
    cta: { label: 'Get Consultation', href: '/contact?type=golden_visa' },
    image: '/services/golden-visa.jpg',
  },
  {
    id: 'mortgage',
    title: 'Mortgage Advisory',
    subtitle: 'Smart Financing Solutions',
    description: 'Navigate the mortgage landscape with our expert advisors and secure the best financing for your property.',
    features: ['Mortgage eligibility check', 'Bank comparison', 'Application support', 'Pre-approval assistance', 'Refinancing options'],
    cta: { label: 'Calculate Mortgage', href: '/#mortgage' },
    image: '/services/mortgage.jpg',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-20 bg-luxury-light">
      <div className="bg-luxury-black py-16">
        <div className="container-luxe text-center">
          <span className="section-subtitle">What We Offer</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">Our Services</h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">Comprehensive real estate solutions tailored to your needs</p>
        </div>
      </div>

      <div className="container-luxe py-16">
        <div className="space-y-8">
          {services.map((service, i) => (
            <div key={service.id} id={service.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <span className="section-subtitle">{service.subtitle}</span>
                <h2 className="section-title mt-2 mb-4">{service.title}</h2>
                <div className="divider-gold mb-6" />
                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
                      <HiCheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={service.cta.href} className="btn-gold group">
                  {service.cta.label}
                  <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className={`${i % 2 === 1 ? 'lg:order-1' : ''} relative overflow-hidden min-h-[300px]`}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="font-display text-5xl font-bold text-gold/40 mb-2">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="font-display text-2xl font-bold text-white">{service.title}</h3>
                  <p className="text-gray-300 mt-1 text-sm">{service.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
