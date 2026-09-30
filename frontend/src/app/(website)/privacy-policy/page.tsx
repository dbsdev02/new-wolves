import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Wolves International',
  description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-20 bg-cream">
      <div className="bg-ink py-16 md:py-20">
        <div className="container-luxe text-center">
          <h1 className="serif text-4xl md:text-5xl text-white">Privacy Policy</h1>
          <p className="text-white/50 mt-3">Last updated: January 2024</p>
        </div>
      </div>
      <div className="container-luxe py-16">
        <div className="max-w-3xl mx-auto bg-white border border-border p-8 md:p-12 space-y-8 text-muted-foreground leading-relaxed text-center">
          <div>
            <h2 className="serif text-xl text-ink mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you submit an inquiry, register for an account, or contact us. This may include your name, email address, phone number, and property preferences.</p>
          </div>
          <div>
            <h2 className="serif text-xl text-ink mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>
          </div>
          <div>
            <h2 className="serif text-xl text-ink mb-3">3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except to provide services you have requested or as required by law.</p>
          </div>
          <div>
            <h2 className="serif text-xl text-ink mb-3">4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </div>
          <div>
            <h2 className="serif text-xl text-ink mb-3">5. Cookies</h2>
            <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information to improve your experience.</p>
          </div>
          <div>
            <h2 className="serif text-xl text-ink mb-3">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@wolvesint.ae" className="text-gold-deep hover:underline">privacy@wolvesint.ae</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
