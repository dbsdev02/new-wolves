'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services';
import toast from 'react-hot-toast';
import { HiMail, HiArrowLeft } from 'react-icons/hi';

const schema = z.object({
  email: z.string().email('Valid email required'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gold flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-display font-bold text-2xl">W</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Wolves International</h1>
          <p className="text-gray-400 text-sm mt-1">Reset your password</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8">
          {sent ? (
            <div className="text-center">
              <h2 className="font-display text-xl font-bold text-white mb-3">Check your email</h2>
              <p className="text-gray-400 text-sm">
                If an account exists with that email address, we have sent a link to reset your password.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold text-white mb-2">Forgot Password</h2>
              <p className="text-gray-400 text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="admin@wolvesintl.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gold text-white font-semibold hover:bg-gold-600 transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
          <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors mt-6">
            <HiArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
