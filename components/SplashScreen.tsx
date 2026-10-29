'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useApp } from '@/context/AppContext';

// Layar loading dengan logo bergerak.
// Tampil saat pertama kali dibuka dan setiap kali pengguna masuk ke WebApp.
export function SplashScreen() {
  const { isHydrated, appMode } = useApp();
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const prevMode = useRef(appMode);

  useEffect(() => {
    if (!isHydrated) return;
    const t = window.setTimeout(() => setVisible(false), reduceMotion ? 600 : 1400);
    return () => window.clearTimeout(t);
  }, [isHydrated, reduceMotion]);

  useEffect(() => {
    const enteringWebApp = prevMode.current !== 'webapp' && appMode === 'webapp';
    prevMode.current = appMode;
    if (!enteringWebApp) return;
    const show = window.setTimeout(() => setVisible(true), 0);
    const hide = window.setTimeout(() => setVisible(false), reduceMotion ? 600 : 1300);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [appMode, reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          role="status"
          aria-live="polite"
          aria-label="Memuat Teman Kasih"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white"
        >
          <div className="relative flex h-32 w-32 items-center justify-center">
            {!reduceMotion && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[#FCE8EE]"
                animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.9, 0.3, 0.9] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <motion.img
              src="/logo.png"
              alt=""
              className="relative h-20 w-20 select-none object-contain"
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { y: [0, -10, 0], rotate: [0, -6, 6, 0] }
              }
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <p className="mt-4 font-heading text-lg font-bold text-[#2A2D22]">
            Teman Kasih
          </p>

          <div className="mt-3 flex gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#C84B71]"
                animate={reduceMotion ? {} : { opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
