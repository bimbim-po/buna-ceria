'use client';

import React from 'react';
import Image from 'next/image';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Globe,
  Heart,
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SidebarNav({
  activeSection,
  onSelectSection,
  isMobileDrawer = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarNavProps) {
  const {
    session,
    openLoginDialog,
    openAnxietyDialog,
    handleLogout,
    enterLandingPage,
  } = useApp();

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
      className={`flex h-full flex-col justify-between rounded-[28px] sm:rounded-[32px] bg-white border border-[#ECE7F2] shadow-[0_8px_30px_rgba(40,40,60,0.06)] text-[#2A2D22] select-none transition-all duration-300 ${
        isCollapsed ? 'p-2.5 sm:p-3 items-center' : 'p-4 sm:p-5'
      }`}
    >
      <div className="w-full">
        {/* ===================================================================
            1. BRAND HEADER + TOGGLE BUTTON (BISA DIBUKA TUTUP)
           =================================================================== */}
        <div
          className={`flex items-center pb-5 pt-1 ${
            isCollapsed
              ? 'flex-col gap-3 justify-center'
              : 'justify-between gap-2'
          }`}
        >
          {/* Brand Logo & Name */}
          <button
            type="button"
            onClick={() => handleNavClick('beranda')}
            className={`flex items-center gap-3 text-left cursor-pointer group ${
              isCollapsed ? 'justify-center' : 'min-w-0'
            }`}
            title="Teman Kasih - Beranda"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FDF2F5] border border-pink-100 p-1.5 transition-transform group-hover:scale-105 shadow-2xs">
              <Image
                src="/logo.png"
                alt="Teman Kasih"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
            </span>

            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <span className="block font-heading text-base font-bold leading-tight text-[#2A2D22] truncate">
                  Teman Kasih
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C84B71] truncate block">
                  WebApp Belajar
                </span>
              </div>
            )}
          </button>

          {/* Tombol Buka / Tutup Sidebar (Chevron Desktop) */}
          {!isMobileDrawer && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Buka sidebar' : 'Tutup sidebar'}
              title={isCollapsed ? 'Perluas sidebar (Buka)' : 'Ciutkan sidebar (Tutup)'}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FAF8FC] border border-[#ECE7F2] text-[#6E6A6C] hover:bg-[#FDF2F5] hover:text-[#C84B71] hover:border-pink-200 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Tombol Tutup Mobile Drawer */}
          {isMobileDrawer && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Tutup menu"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[#2A2D22] hover:bg-gray-200 cursor-pointer"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* ===================================================================
            2. MENU NAVIGASI UTAMA
           =================================================================== */}
        <nav
          aria-label="Menu WebApp"
          className={`space-y-1.5 pt-2 ${
            isCollapsed ? 'flex flex-col items-center' : ''
          }`}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            if (isCollapsed) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C84B71] text-white shadow-md shadow-pink-500/25 scale-105 font-bold'
                      : 'text-[#6E6A6C] hover:bg-[#FAF8FC] hover:text-[#2A2D22]'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.2 : 1.75} />
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex w-full items-center gap-3.5 rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C84B71] text-white font-bold shadow-md shadow-pink-500/25'
                    : 'text-[#6E6A6C] hover:bg-[#FAF8FC] hover:text-[#2A2D22]'
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-[#8C8896] group-hover:text-[#2A2D22]'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.75}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ===================================================================
          3. BAGIAN BAWAH: WEBSITE UTAMA, KUESIONER, & MASUK/KELUAR
         =================================================================== */}
      <div
        className={`w-full pt-3 border-t border-[#F0ECF5] ${
          isCollapsed
            ? 'flex flex-col items-center gap-2'
            : 'space-y-1.5'
        }`}
      >
        {/* Kuesioner Perasaan (Mood Check) */}
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (!session) openLoginDialog();
              else openAnxietyDialog();
            }}
            title="Kuesioner Perasaan"
            aria-label="Kuesioner Perasaan"
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-pink-600 hover:bg-[#FDF2F5] transition-colors cursor-pointer"
          >
            <Heart className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (!session) openLoginDialog();
              else openAnxietyDialog();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#6E6A6C] hover:bg-[#FDF2F5] hover:text-[#C84B71] transition-colors cursor-pointer"
          >
            <Heart className="h-4 w-4 text-pink-500" />
            <span className="truncate">Kuesioner Perasaan</span>
          </button>
        )}

        {/* Link Kembali ke Website Utama (Landing Page) */}
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              enterLandingPage();
            }}
            title="Lihat Website Utama"
            aria-label="Lihat Website Utama"
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#6E6A6C] hover:bg-[#FAF8FC] hover:text-[#2A2D22] transition-colors cursor-pointer"
          >
            <Globe className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              enterLandingPage();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#6E6A6C] hover:bg-gray-50 hover:text-[#2A2D22] transition-colors cursor-pointer"
          >
            <Globe className="h-4 w-4 text-[#8C8896]" />
            <span className="truncate">Website Utama</span>
          </button>
        )}

        {/* Tombol Masuk / Keluar */}
        {session ? (
          isCollapsed ? (
            <button
              type="button"
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
                handleLogout();
              }}
              title="Keluar dari Akun"
              aria-label="Keluar dari Akun"
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-pink-700 hover:bg-pink-50 transition-colors cursor-pointer"
            >
              <Power className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
                handleLogout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-pink-700 hover:bg-pink-50 transition-colors cursor-pointer"
            >
              <Power className="h-4 w-4" />
              <span className="truncate">Keluar Akun</span>
            </button>
          )
        ) : isCollapsed ? (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              openLoginDialog();
            }}
            title="Masuk Akun"
            aria-label="Masuk Akun"
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#C84B71] hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              openLoginDialog();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold text-[#C84B71] hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span className="truncate">Masuk Akun</span>
          </button>
        )}
      </div>
    </aside>
  );
}
