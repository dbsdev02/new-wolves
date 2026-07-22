'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services';
import toast from 'react-hot-toast';
import { HiLockClosed, HiArrowLeft } from 'react-icons/hi';

const schema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type FormData = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.resetPassword({ uid, token, new_password: data.new_password });
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'This reset link is invalid or has expired.');
    }
  };

  if (!uid || !token) {
    return (
      <div className="text-center">
        <h2 className="font-display text-xl font-bold text-white mb-3">Invalid Link</h2>
        <p className="text-gray-400 text-sm mb-6">This password reset link is invalid or incomplete.</p>
        <Link href="/forgot-password" className="text-gold hover:underline text-sm">Request a new link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <h2 className="font-display text-xl font-bold text-white mb-3">Password Reset!</h2>
        <p className="text-gray-400 text-sm">Redirecting you to sign in...</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="font-display text-xl font-bold text-white mb-6">Set a New Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register('new_password')}
              type="password"
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          {errors.new_password && <p className="text-red-400 text-xs mt-1">{errors.new_password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register('confirm_password')}
              type="password"
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          {errors.confirm_password && <p className="text-red-400 text-xs mt-1">{errors.confirm_password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gold text-white font-semibold hover:bg-gold-600 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors mt-6">
        <HiArrowLeft className="w-4 h-4" /> Back to Sign In
      </Link>
    </>
  );
}
