'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiPlus, HiMinus } from 'react-icons/hi';
import { useFAQs } from '@/hooks/useContent';

export function FAQSection() {
  const { data: faqs, isLoading } = useFAQs();
  const [open, setOpen] = useState<number | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 md:py-32" style={{ background: 'var(--white)' }}>
      <div className="container-luxe">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="eyebrow">Got Questions?</p>
          <h2 className="section-heading mt-4">Frequently asked questions.</h2>
          <span className="gold-rule mx-auto block" />
        </div>

        <div className="max-w-3xl mx-auto">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse h-16 mb-2 rounded" style={{ background: 'var(--cream)' }} />
              ))
            : (faqs || []).map((faq, i) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border-b"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <button
                    onClick={() => setOpen(open === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between py-5 text-left gap-4"
                  >
                    <span
                      className="font-medium text-sm leading-snug"
                      style={{ color: open === faq.id ? 'var(--gold-deep)' : 'var(--ink)' }}
                    >
                      {faq.question}
                    </span>
                    <div
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center border transition-all duration-200"
                      style={{
                        borderColor: open === faq.id ? 'var(--gold)' : 'var(--border)',
                        background: open === faq.id ? 'var(--gold-pale)' : 'transparent',
                      }}
                    >
                      {open === faq.id
                        ? <HiMinus className="w-3.5 h-3.5" style={{ color: 'var(--gold-deep)' }} />
                        : <HiPlus className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} />
                      }
                    </div>
                  </button>
                  <AnimatePresence>
                    {open === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
