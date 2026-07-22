'use client';

const logos = [
  '1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png',
  '9.png','10.png','11.png','12.png','13.webp','14.png','15.webp','16.png','17.png',
];

const marqueeItems = [...logos, ...logos];

export function DevelopersSection() {
  return (
    <section className="py-16 overflow-hidden border-y" style={{ background: 'var(--white)', borderColor: 'var(--border)' }}>
      <div className="container-luxe mb-10">
        <p className="eyebrow text-center">Trusted by Dubai&apos;s leading developers</p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--white), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--white), transparent)' }} />
        <div className="flex items-center gap-16 animate-marquee">
          {marqueeItems.map((file, i) => (
            <img
              key={i}
              src={`/Developers/${file}`}
              alt={`Developer ${file}`}
              className="h-12 w-auto object-contain flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
