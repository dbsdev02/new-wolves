'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  HiHome, HiOfficeBuilding, HiUsers, HiDocumentText, HiCog,
  HiLogout, HiChartBar, HiGlobe, HiCollection, HiStar,
  HiQuestionMarkCircle, HiMail, HiMenu, HiX
} from 'react-icons/hi';
import { MdBusiness, MdPeople, MdApartment } from 'react-icons/md';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: HiHome },
  { label: 'Properties', href: '/admin/properties', icon: HiOfficeBuilding },
  { label: 'Projects', href: '/admin/projects', icon: MdApartment },
  { label: 'Developers', href: '/admin/developers', icon: MdBusiness },
  { label: 'Communities', href: '/admin/communities', icon: HiGlobe },
  { label: 'Agents', href: '/admin/agents', icon: MdPeople },
  { label: 'Leads', href: '/admin/leads', icon: HiMail },
  { label: 'Blogs', href: '/admin/blogs', icon: HiDocumentText },
  { label: 'Testimonials', href: '/admin/testimonials', icon: HiStar },
  { label: 'FAQs', href: '/admin/faqs', icon: HiQuestionMarkCircle },
  { label: 'SEO', href: '/admin/seo', icon: HiChartBar },
  { label: 'Users', href: '/admin/users', icon: HiUsers },
  { label: 'Settings', href: '/admin/settings', icon: HiCog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth().then(() => {
      const { isAuthenticated: auth, user: u } = useAuthStore.getState();
      if (!auth || !u || !['super_admin', 'admin', 'marketing', 'sales', 'agent', 'editor'].includes(u.role)) {
        router.push('/login');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-light">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-light flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-luxury-black flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-white/10">
          <div className="w-8 h-8 bg-gold flex items-center justify-center">
            <span className="text-white font-bold">W</span>
          </div>
          <div>
            <div className="text-white font-display font-bold text-sm">Wolves RE</div>
            <div className="text-gold text-xs">Admin Panel</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-white">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-6 py-3 text-sm transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-gold text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{user?.first_name?.[0] || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user?.full_name}</div>
              <div className="text-gray-400 text-xs capitalize">{user?.role?.replace('_', ' ')}</div>
            </div>
          </div>
          <button
            onClick={() => logout().then(() => router.push('/login'))}
            className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
          >
            <HiLogout className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-luxury-black">
            <HiMenu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-gold transition-colors">
              View Website →
            </Link>
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{user?.first_name?.[0] || 'A'}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
