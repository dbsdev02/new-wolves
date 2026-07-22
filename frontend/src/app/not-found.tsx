import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
      <div className="text-center">
        <div className="font-display text-[120px] md:text-[200px] font-bold text-gold/20 leading-none select-none">
          404
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white -mt-8 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn-gold px-8 py-4">
            Go Home
          </Link>
          <Link href="/properties" className="btn-outline-gold px-8 py-4">
            Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
