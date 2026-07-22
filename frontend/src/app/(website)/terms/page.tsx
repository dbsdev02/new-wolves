import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Wolves International',
  description: 'Read our terms of service and conditions for using Wolves International platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 bg-luxury-light">
      <div className="bg-luxury-black py-12">
        <div className="container-luxury">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Terms of Service</h1>
          <p className="text-gray-400 mt-2">Last updated: January 2024</p>
        </div>
      </div>
      <div className="container-luxury py-12 max-w-4xl">
        <div className="bg-white border border-gray-100 p-8 md:p-12 space-y-8 text-gray-600 leading-relaxed">
          <div>
            <h2 className="font-display font-bold text-xl text-luxury-black mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the Wolves International website and services, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-luxury-black mb-3">2. Use of Services</h2>
            <p>Our services are intended for lawful purposes only. You agree not to use our platform for any unlawful purpose or in any way that could damage, disable, or impair our services.</p>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-luxury-black mb-3">3. Property Listings</h2>
            <p>All property listings on our platform are provided for informational purposes. While we strive for accuracy, we cannot guarantee the completeness or accuracy of all listing information. Prices and availability are subject to change.</p>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-luxury-black mb-3">4. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, and images, is the property of Wolves International and is protected by applicable intellectual property laws.</p>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-luxury-black mb-3">5. Limitation of Liability</h2>
            <p>Wolves International shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-luxury-black mb-3">6. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the United Arab Emirates.</p>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-luxury-black mb-3">7. Contact</h2>
            <p>For any questions regarding these terms, contact us at <a href="mailto:legal@wolvesintl.com" className="text-gold hover:underline">legal@wolvesintl.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
