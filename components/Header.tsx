'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Camera,
  ChevronDown,
  Globe,
  Heart,
  LogIn,
  LogOut,
  Maximize2,
  Menu,
  Minimize2,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SidebarNav } from '@/components/SidebarNav';

const CUSTOM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface HeaderProps {
  activeSection?: string;
  onSelectSection?: (id: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({
  activeSection = 'beranda',
  onSelectSection,
  searchQuery = '',
  onSearchChange,
}: HeaderProps) {
  const {
    session,
    openLoginDialog,
    openAnxietyDialog,
    handleLogout,
    enterLandingPage,
  } = useApp();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isAppFullscreen, setIsAppFullscreen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    const handleFullscreenChange = () => {
      setIsAppFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleBrowserFullscreen = async () => {
    if (typeof document === 'undefined') return;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      // Abaikan bila tidak didukung
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full shrink-0 border-b border-[#F5DCE4] bg-white/95 backdrop-blur-md px-5 py-3.5 sm:px-8 shadow-[0_4px_20px_rgba(200,75,113,0.05)]">
        <div className="flex items-center justify-between gap-4">
          {/* Sisi Kiri Mobile: Menu Drawer Button + Logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Buka menu navigasi"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F5DCE4] bg-[#FFF5F8] text-[#2A2D22] transition-all active:scale-95 cursor-pointer"
            >
              <Menu className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={() => onSelectSection?.('beranda')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image
                src="/logo.png"
                alt="Buna Ceria"
                width={28}
                height={28}
                className="h-6 w-6 object-contain"
              />
              <span className="font-heading text-base font-bold text-[#2A2D22]">
                Buna Ceria
              </span>
            </button>
          </div>

          {/* Sisi Kiri Desktop: Kolom Pencarian Bersih */}
          <div className="hidden lg:flex lg:flex-1 lg:max-w-md items-center gap-2.5 rounded-full bg-[#FAF8FC] border border-[#F0ECF5] px-4 py-2 transition-all focus-within:border-[#C84B71] focus-within:bg-white focus-within:shadow-2xs">
            <Search className="h-4 w-4 text-[#8C8896] shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Cari materi 4 level, tips harian, atau bidan..."
              className="w-full bg-transparent text-xs text-[#2A2D22] placeholder:text-[#A09CA8] outline-none"
            />
          </div>

          {/* Sisi Kanan: Kembali ke Website + Take Selfie + Fullscreen + Sapa Perasaan + Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Item 22: Tombol cepat Kembali ke Website */}
            <button
              type="button"
              onClick={enterLandingPage}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-1.5 text-xs font-bold text-[#6E6A6C] hover:bg-[#FDF2F5] hover:text-[#C84B71] hover:border-pink-200 transition-colors cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Kembali ke Website</span>
            </button>

            {/* Pintasan Cepat Take Selfie */}
            <button
              type="button"
              onClick={() => onSelectSection?.('selfie')}
              title="Buka Studio Take Selfie Pasangan"
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                activeSection === 'selfie'
                  ? 'border-[#C84B71] bg-[#C84B71] text-white'
                  : 'border-pink-200 bg-[#FDF2F5] text-[#C84B71] hover:bg-[#FCE8EE]'
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Take Selfie</span>
            </button>

            {/* Tombol Fullscreen WebApp */}
            <button
              type="button"
              onClick={toggleBrowserFullscreen}
              title={
                isAppFullscreen
                  ? 'Kecilkan Layar Penuh'
                  : 'Layar Penuh (Fullscreen Focus)'
              }
              aria-label="Toggle Fullscreen"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F0ECF5] bg-[#FAF8FC] text-[#6E6A6C] hover:bg-[#FDF2F5] hover:text-[#C84B71] transition-colors cursor-pointer"
            >
              {isAppFullscreen ? (
                <Minimize2 className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Maximize2 className="h-4 w-4" strokeWidth={2} />
              )}
            </button>

            {/* Tombol Sapa Perasaan / Kuesioner Kecemasan (Heart) */}
            <button
              type="button"
              onClick={() => {
                if (!session) {
                  openLoginDialog();
                } else {
                  openAnxietyDialog();
                }
              }}
              title="Kuesioner Kecemasan & Perasaan Ibu"
              aria-label="Kuesioner Kecemasan & Perasaan Ibu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-100 bg-[#FDF2F5] text-[#C84B71] hover:bg-[#FCE8EE] transition-colors cursor-pointer"
            >
              <Heart className="h-4 w-4 fill-[#C84B71]" strokeWidth={1.5} />
            </button>

            {/* User Profile Dropdown atau Tombol Masuk */}
            {!session ? (
              <button
                type="button"
                onClick={openLoginDialog}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#C84B71] px-5 text-xs font-bold text-white shadow-2xs hover:bg-[#b23b60] transition-colors cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk / Daftar</span>
              </button>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  aria-expanded={accountMenuOpen}
                  className="flex items-center gap-2 rounded-full border border-[#F0ECF5] bg-[#FAF8FC] py-1 pl-1 pr-3 hover:bg-[#F9F8FA] transition-colors cursor-pointer"
                >
                  <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-pink-200 bg-pink-50">
                    <Image
                      src="/ibu-hamil.jpg"
                      alt={session.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate text-xs font-bold text-[#2A2D22]">
                    {session.name}
                  </span>
                  {session.role === 'admin' && (
                    <span className="hidden md:inline rounded-full bg-[#F5F8EB] px-2 py-0.5 text-[10px] font-bold text-[#56632A]">
                      Admin
                    </span>
                  )}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-[#8C8896] transition-transform duration-200 ${
                      accountMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      role="menu"
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 8, scale: 0.98 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: CUSTOM_EASE }}
                      className="absolute right-0 mt-2 w-64 origin-top-right rounded-[22px] border border-gray-100 bg-white p-4 shadow-lg z-40"
                    >
                      <div className="border-b border-gray-100 pb-3 mb-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-[#2A2D22] truncate">
                            {session.name}
                          </p>
                          <span className="rounded-full bg-[#F5F8EB] px-2 py-0.5 text-[10px] font-bold uppercase text-[#56632A]">
                            {session.role === 'admin' ? 'Admin' : 'Terdaftar'}
                          </span>
                        </div>
                        <p className="truncate text-xs text-[#767A6E]">
                          {session.email}
                        </p>
                        {session.trimesterLabel && (
                          <span className="mt-2 inline-block rounded-full bg-pink-50 border border-pink-100 px-2.5 py-0.5 text-[11px] font-bold text-[#C84B71]">
                            {session.trimesterLabel}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        {/* Item 20: Pengaturan & Ubah Profil */}
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            onSelectSection?.('pengaturan');
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#2A2D22] hover:bg-gray-50 cursor-pointer"
                        >
                          <Settings className="h-4 w-4 text-[#8C8896]" />
                          <span>Pengaturan &amp; Ubah Profil</span>
                        </button>

                        {/* Panel Admin jika Admin */}
                        {session.role === 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              setAccountMenuOpen(false);
                              onSelectSection?.('admin');
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#56632A] hover:bg-[#F5F8EB] cursor-pointer"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            <span>Panel Admin</span>
                          </button>
                        )}

                        {/* Item 22: Kembali ke Website */}
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            enterLandingPage();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#2A2D22] hover:bg-gray-50 cursor-pointer"
                        >
                          <Globe className="h-4 w-4 text-[#8C8896]" />
                          <span>Kembali ke Website</span>
                        </button>

                        {/* Item 23: Ganti Akun */}
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            openLoginDialog();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#56632A] hover:bg-[#F5F8EB] cursor-pointer"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Ganti Akun</span>
                        </button>

                        {/* Item 23: Keluar Akun */}
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-pink-700 hover:bg-pink-50 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Keluar Akun</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: CUSTOM_EASE }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/40"
              aria-hidden="true"
            />

            <motion.aside
              initial={
                prefersReducedMotion ? { opacity: 0 } : { x: '-100%' }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { x: '-100%' }}
              transition={{ duration: 0.3, ease: CUSTOM_EASE }}
              className="relative z-10 h-full w-72 max-w-[85vw] overflow-y-auto bg-white shadow-xl"
            >
              <SidebarNav
                activeSection={activeSection}
                onSelectSection={(id) => {
                  onSelectSection?.(id);
                  setMobileDrawerOpen(false);
                }}
                isMobileDrawer
                onCloseMobile={() => setMobileDrawerOpen(false)}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
