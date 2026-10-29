'use client';

import React from 'react';
import Image from 'next/image';
import {
  BookOpen,
  Globe,
  HeartHandshake,
  Home,
  LogIn,
  Power,
  Settings,
  Sun,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SidebarNavProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export function SidebarNav({
  activeSection,
  onSelectSection,
  isMobileDrawer = false,
  onCloseMobile,
}: SidebarNavProps) {
  const { session, openLoginDialog, handleLogout, enterLandingPage } = useApp();

  const menuItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'materi', label: 'Materi Kehamilan', icon: BookOpen },
    { id: 'tips', label: 'Tips Kehamilan', icon: Sun },
    { id: 'kontak-ahli', label: 'Kontak Ahli', icon: HeartHandshake },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onSelectSection(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      aria-label="Navigasi WebApp Teman Kasih"
      className="flex h-full flex-col justify-between bg-white text-[#2A2D22] select-none p-5"
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 pt-1">
          <button
            type="button"
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FDF2F5] border border-pink-100 p-1.5 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Teman Kasih"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
            </span>
            <div>
              <span className="block font-heading text-lg font-bold leading-tight text-[#2A2D22]">
                Teman Kasih
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C84B71]">
                WebApp Belajar
              </span>
            </div>
          </button>

          {isMobileDrawer && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Tutup menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-[#2A2D22] hover:bg-gray-200 cursor-pointer"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Menu Navigasi Utama */}
        <nav aria-label="Menu WebApp" className="space-y-1.5 pt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`group relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FDF2F5] text-[#C84B71] font-bold shadow-2xs'
                    : 'text-[#6E6A6C] hover:bg-[#F9F8FA] hover:text-[#2A2D22]'
                }`}
              >
                {/* Active Pill Indicator di sisi kiri */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-r-full bg-[#C84B71]"
                  />
                )}
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? 'text-[#C84B71]' : 'text-[#8C8896] group-hover:text-[#2A2D22]'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.75}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bagian Bawah: Aksi Website Utama & Keluar/Masuk */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        {/* Link Kembali ke Website Utama (Landing Page) */}
        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            enterLandingPage();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-[#6E6A6C] hover:bg-gray-50 hover:text-[#2A2D22] transition-colors cursor-pointer"
        >
          <Globe className="h-4 w-4 text-[#8C8896]" />
          <span>Lihat Website Utama</span>
        </button>

        {/* Tombol Masuk / Keluar */}
        {session ? (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              handleLogout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-pink-700 hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <Power className="h-4 w-4" />
            <span>Keluar dari Akun</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              openLoginDialog();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-bold text-[#C84B71] hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Masuk Akun</span>
          </button>
        )}
      </div>
    </aside>
  );
}
