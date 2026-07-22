'use client';
import { FaWhatsapp } from 'react-icons/fa';
import { buildWhatsAppUrl } from '@/lib/utils';

export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '971501234567';
  const message = 'Hello! I am interested in your properties. Can you help me?';

  return (
    <a
      href={buildWhatsAppUrl(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 rounded-full"
    >
      <FaWhatsapp className="w-7 h-7" />
    </a>
  );
}
