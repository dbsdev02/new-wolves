'use client';
import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services';
import { leadService } from '@/services';
import Link from 'next/link';
import {
  HiOfficeBuilding, HiUsers, HiDocumentText, HiChartBar,
  HiTrendingUp, HiEye, HiPlus, HiArrowRight
} from 'react-icons/hi';
import { MdBusiness, MdPeople, MdApartment } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const mockChartData = [
  { month: 'Jan', leads: 45, properties: 12 },
  { month: 'Feb', leads: 62, properties: 18 },
  { month: 'Mar', leads: 78, properties: 24 },
  { month: 'Apr', leads: 55, properties: 15 },
  { month: 'May', leads: 90, properties: 30 },
  { month: 'Jun', leads: 110, properties: 35 },
];

export function AdminDashboardClient() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => settingsService.getDashboard().then(r => r.data),
  });
  const { data: leadStats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: () => leadService.getStats().then(r => r.data),
  });

  const statCards = [
    { label: 'Total Properties', value: stats?.properties.total || 0, icon: HiOfficeBuilding, color: 'bg-blue-500', href: '/admin/properties' },
    { label: 'Published', value: stats?.properties.published || 0, icon: MdApartment, color: 'bg-green-500', href: '/admin/properties?status=published' },
    { label: 'Total Leads', value: stats?.leads.total || 0, icon: HiUsers, color: 'bg-purple-500', href: '/admin/leads' },
    { label: "Today's Leads", value: stats?.leads.today || 0, icon: HiTrendingUp, color: 'bg-gold', href: '/admin/leads' },
    { label: 'Projects', value: stats?.projects || 0, icon: MdBusiness, color: 'bg-orange-500', href: '/admin/projects' },
    { label: 'Agents', value: stats?.agents || 0, icon: MdPeople, color: 'bg-red-500', href: '/admin/agents' },
    { label: 'Blog Posts', value: stats?.blogs || 0, icon: HiDocumentText, color: 'bg-indigo-500', href: '/admin/blogs' },
    { label: 'Communities', value: stats?.communities || 0, icon: HiChartBar, color: 'bg-teal-500', href: '/admin/communities' },
  ];

  const quickActions = [
    { label: 'Add Property', href: '/admin/properties/new', icon: HiPlus },
    { label: 'View Leads', href: '/admin/leads', icon: HiEye },
    { label: 'Add Blog', href: '/admin/blogs/new', icon: HiDocumentText },
    { label: 'Add Agent', href: '/admin/agents/new', icon: HiUsers },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-luxury-black">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="flex items-center gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} className="flex items-center gap-2 px-4 py-2 bg-gold text-white text-sm font-medium hover:bg-gold-600 transition-colors">
              <action.icon className="w-4 h-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white border border-gray-100 p-6 hover:border-gold hover:shadow-gold transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <HiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold transition-colors" />
            </div>
            <div className="font-display text-3xl font-bold text-luxury-black">{card.value.toLocaleString()}</div>
            <div className="text-gray-500 text-sm mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 p-6">
          <h3 className="font-display font-bold text-lg text-luxury-black mb-6">Leads Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="leads" fill="#C9A84C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 p-6">
          <h3 className="font-display font-bold text-lg text-luxury-black mb-6">Properties Added</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="properties" stroke="#C9A84C" strokeWidth={2} dot={{ fill: '#C9A84C' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lead Status Breakdown */}
      {leadStats?.by_status && (
        <div className="bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg text-luxury-black">Lead Status Breakdown</h3>
            <Link href="/admin/leads" className="text-gold text-sm hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {leadStats.by_status.map((item: { status: string; count: number }) => (
              <div key={item.status} className="text-center p-4 bg-luxury-light">
                <div className="font-display text-2xl font-bold text-gold">{item.count}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1 capitalize">{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
