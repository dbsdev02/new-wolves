'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiPhone, HiChevronDown, HiOutlineHeart, HiOutlineScale } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { usePropertyListStore } from '@/store/propertyListStore';

const navLinks = [
  { label: 'Properties', href: '/properties', children: [
    { label: 'Buy', href: '/properties?purpose=sale' },
    { label: 'Rent', href: '/properties?purpose=rent' },
    { label: 'Off Plan', href: '/properties?purpose=off_plan' },
    { label: 'Luxury', href: '/properties?is_luxury=true' },
  ]},
  { label: 'Projects', href: '/projects' },
  { label: 'Developers', href: '/developers' },
  { label: 'Communities', href: '/communities' },
  { label: 'Agents', href: '/agents' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Careers', href: '/careers' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { wishlist, compare } = usePropertyListStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    setMounted(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solid = !isHome || isScrolled;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        solid
          ? 'py-4 border-b'
          : 'py-6'
      )}
      style={{
        background: solid ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: solid ? 'blur(20px)' : 'none',
        borderColor: solid ? 'var(--border)' : 'transparent',
      }}
    >
      <div className="container-luxe flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img
            src={solid ? '/logo2.png' : '/logo4.png'}
            alt="Wolves International"
            className="h-10 w-auto transition-all duration-300"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className={cn(
                  'link-underline flex items-center gap-1 text-[0.65rem] font-semibold tracking-[0.15em] uppercase whitespace-nowrap transition-colors duration-200 pb-2',
                  solid ? 'text-[var(--ink)]/75 hover:text-[var(--ink)]' : 'text-white/80 hover:text-white',
                  pathname === link.href && 'text-[var(--gold-deep)]'
                )}
              >
                {link.label}
                {link.children && <HiChevronDown className="w-3 h-3 opacity-60" />}
              </Link>

              {link.children && activeDropdown === link.label && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 w-44 border-t-2 py-2 z-50"
                  style={{
                    background: 'var(--white)',
                    borderTopColor: 'var(--gold)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                    marginTop: '1px',
                  }}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-5 py-2.5 text-[0.65rem] tracking-[0.15em] uppercase font-semibold transition-colors"
                      style={{ color: 'var(--muted)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-deep)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                    >
                      {child.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          {/* Compare */}
          <Link
            href="/compare"
            className="relative p-1.5 transition-colors"
            style={{ color: solid ? 'var(--ink)' : 'var(--white)' }}
            aria-label="Compare properties"
          >
            <HiOutlineScale className="w-[18px] h-[18px]" strokeWidth={1.5} />
            {mounted && compare.length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                style={{ background: 'var(--gold-deep)' }}
              >
                {compare.length}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-1.5 transition-colors"
            style={{ color: solid ? 'var(--ink)' : 'var(--white)' }}
            aria-label="View wishlist"
          >
            <HiOutlineHeart className="w-[18px] h-[18px]" strokeWidth={1.5} />
            {mounted && wishlist.length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                style={{ background: 'var(--gold-deep)' }}
              >
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Phone */}
          <a
            href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
            className="hidden xl:flex items-center gap-2 text-[0.65rem] tracking-[0.2em] uppercase font-semibold whitespace-nowrap transition-colors"
            style={{ color: solid ? 'var(--ink)' : 'var(--white)' }}
          >
            <HiPhone className="w-3.5 h-3.5" />
            {process.env.NEXT_PUBLIC_PHONE}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-2 transition-colors"
          style={{ color: solid ? 'var(--ink)' : 'var(--white)' }}
          aria-label="Menu"
        >
          {isMobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t overflow-hidden"
            style={{ background: 'var(--white)', borderColor: 'var(--border)' }}
          >
            <div className="container-luxe py-6 space-y-0">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block py-3.5 border-b text-[0.7rem] tracking-[0.22em] uppercase font-semibold"
                    style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4 py-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="block py-2 text-[0.65rem] tracking-wider uppercase"
                          style={{ color: 'var(--muted)' }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-5 flex items-center gap-6">
                <Link href="/wishlist" onClick={() => setIsMobileOpen(false)} className="text-[0.65rem] tracking-[0.2em] uppercase font-semibold" style={{ color: 'var(--ink)' }}>
                  Wishlist {mounted && wishlist.length > 0 && `(${wishlist.length})`}
                </Link>
                <Link href="/compare" onClick={() => setIsMobileOpen(false)} className="text-[0.65rem] tracking-[0.2em] uppercase font-semibold" style={{ color: 'var(--ink)' }}>
                  Compare {mounted && compare.length > 0 && `(${compare.length})`}
                </Link>
              </div>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
                className="block pt-4 text-sm font-semibold"
                style={{ color: 'var(--gold-deep)' }}
              >
                {process.env.NEXT_PUBLIC_PHONE}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
