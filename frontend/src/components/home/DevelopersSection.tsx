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
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--white), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--white), transparent)' }} />
        {/* w-max: this div's parent (.relative above) is a plain block, not a
            flex container, so without an explicit width this track would
            default to filling the parent's (viewport) width like any normal
            block box — and translateX(-50%) is computed against *this
            element's own* box, not its overflowing content. On a narrow
            mobile viewport that mismatch is severe: -50% of ~375px is only a
            couple of logos' worth of travel, so the loop snapped back long
            before scrolling through the actual (much wider, off-screen)
            second half of the track. w-max sizes the track to its real
            content width so -50% correctly means "exactly one full copy". */}
        <div className="flex w-max items-center gap-4 md:gap-16 animate-marquee-mobile md:animate-marquee-fast">
          {marqueeItems.map((file, i) => (
            <img
              key={i}
              src={`/Developers/${file}`}
              alt={`Developer ${file}`}
              className="h-8 md:h-12 w-auto object-contain flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
