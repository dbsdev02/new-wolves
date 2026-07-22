import { Suspense } from 'react';
import { ResetPasswordForm } from './ResetPasswordForm';

export default function ResetPasswordPage() {
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
          <Suspense fallback={<div className="text-gray-400 text-sm text-center">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
