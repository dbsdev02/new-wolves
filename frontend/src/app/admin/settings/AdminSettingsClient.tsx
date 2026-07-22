'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { settingsService } from '@/services';
import toast from 'react-hot-toast';

export function AdminSettingsClient() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => settingsService.get().then(r => r.data),
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => settingsService.update(data),
    onSuccess: () => toast.success('Settings saved!'),
    onError: () => toast.error('Failed to save settings.'),
  });

  if (isLoading) return <div className="animate-pulse space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-gray-100" />)}</div>;

  const fieldClass = 'input-luxury text-sm';
  const labelClass = 'label-luxury';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-luxury-black">Site Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your website configuration</p>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        {/* Company */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={labelClass}>Company Name</label><input {...register('company_name')} className={fieldClass} /></div>
            <div><label className={labelClass}>Tagline</label><input {...register('tagline')} className={fieldClass} /></div>
          </div>
          <div><label className={labelClass}>Description</label><textarea {...register('description')} rows={3} className={`${fieldClass} resize-none`} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={labelClass}>RERA Number</label><input {...register('rera_number')} className={fieldClass} /></div>
            <div><label className={labelClass}>Trade License</label><input {...register('trade_license')} className={fieldClass} /></div>
          </div>
          <div><label className={labelClass}>Working Hours</label><input {...register('working_hours')} className={fieldClass} placeholder="Mon - Sat: 9:00 AM - 7:00 PM" /></div>
        </div>

        {/* Contact */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={labelClass}>Email</label><input {...register('email')} type="email" className={fieldClass} /></div>
            <div><label className={labelClass}>Phone</label><input {...register('phone')} className={fieldClass} /></div>
            <div><label className={labelClass}>WhatsApp</label><input {...register('whatsapp')} className={fieldClass} /></div>
            <div><label className={labelClass}>City</label><input {...register('city')} className={fieldClass} /></div>
          </div>
          <div><label className={labelClass}>Address</label><textarea {...register('address')} rows={2} className={`${fieldClass} resize-none`} /></div>
          <div><label className={labelClass}>Google Maps URL</label><input {...register('google_maps_url')} className={fieldClass} /></div>
        </div>

        {/* Social */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'].map(s => (
              <div key={s}><label className={labelClass}>{s.charAt(0).toUpperCase() + s.slice(1)}</label><input {...register(s)} className={fieldClass} placeholder={`https://${s}.com/...`} /></div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white border border-gray-100 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Analytics & Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={labelClass}>Google Analytics ID</label><input {...register('google_analytics_id')} className={fieldClass} placeholder="G-XXXXXXXXXX" /></div>
            <div><label className={labelClass}>Google Tag Manager ID</label><input {...register('google_tag_manager_id')} className={fieldClass} placeholder="GTM-XXXXXXX" /></div>
            <div><label className={labelClass}>Facebook Pixel ID</label><input {...register('facebook_pixel_id')} className={fieldClass} /></div>
          </div>
        </div>

        <button type="submit" disabled={mutation.isPending} className="btn-gold px-10 py-4 disabled:opacity-60">
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
