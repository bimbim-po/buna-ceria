'use client';

import React from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Globe,
  LogIn,
  Power,
  RefreshCw,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Menu3DIcon, Menu3DIconName } from '@/components/Menu3DIcon';

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

  const menuItems: {
    id: Menu3DIconName;
    label: string;
    badge?: string;
  }[] = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'materi', label: 'Tahapan & Materi' },
    { id: 'tips', label: 'Kebun Buah Delima' },
    { id: 'hasil', label: 'Hasil Saya' },
    { id: 'selfie', label: 'Take Selfie', badge: 'Foto' },
    { id: 'pengaturan', label: 'Pengaturan' },
    ...(session?.role === 'admin'
      ? [{ id: 'admin' as Menu3DIconName, label: 'Panel Admin', badge: 'Admin' }]
      : []),
  ];

  const handleNavClick = (id: string) => {
    onSelectSection(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      aria-label="Navigasi WebApp Buna Ceria"
      className={`flex min-h-full flex-col justify-between bg-white text-[#2A2D22] select-none transition-all duration-300 ${
        isMobileDrawer
          ? 'p-4 pb-24 rounded-none border-l border-[#F5DCE4]'
          : `h-full rounded-[24px] border border-[#F5DCE4] shadow-[0_6px_26px_rgba(200,75,113,0.06)] ${
              isCollapsed ? 'p-2.5 items-center' : 'p-3.5'
            }`
      }`}
    >
      <div className="w-full">
        {/* ===================================================================
            1. BRAND HEADER + TOGGLE BUTTON (BISA DIBUKA TUTUP)
           =================================================================== */}
        <div
          className={`flex items-center pb-4 pt-1 ${
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
            title="Buna Ceria - Beranda"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FDF2F5] border border-pink-100 p-1.5 transition-transform group-hover:scale-105 shadow-2xs">
              <Image
                src="/logo.png"
                alt="Buna Ceria"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
            </span>

            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <span className="block font-heading text-base font-bold leading-tight text-[#2A2D22] truncate">
                  Buna Ceria
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C84B71] truncate block">
                  Buna Ceria App
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
            2. MENU NAVIGASI UTAMA DENGAN IKON 3D REALISTIS
           =================================================================== */}
        <nav
          aria-label="Menu WebApp"
          className={`space-y-1.5 pt-1 ${
            isCollapsed ? 'flex flex-col items-center' : ''
          }`}
        >
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;

            if (isCollapsed) {
              return (
                <button
                  key={item.id}
                  type="button"
                  data-tour-id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F06292] to-[#E55381] text-white shadow-[0_6px_16px_rgba(229,83,129,0.35)] scale-105 font-bold'
                      : 'text-[#5E5A5C] hover:bg-[#FDF2F5]/75 hover:text-[#2A2D22]'
                  }`}
                >
                  <Menu3DIcon name={item.id} className="h-6 w-6 shrink-0" />
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                data-tour-id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex min-h-[44px] w-full items-center justify-between gap-2 rounded-full px-3.5 py-2 text-left text-[13px] sm:text-[13.5px] transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F06292] to-[#E55381] text-white font-bold shadow-[0_6px_16px_rgba(229,83,129,0.32)]'
                    : 'text-[#5E5A5C] font-medium hover:bg-[#FDF2F5]/75 hover:text-[#2A2D22]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Menu3DIcon
                    name={item.id}
                    className="h-7 w-7 shrink-0 transition-transform duration-200 group-hover:scale-105"
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold shrink-0 ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : item.id === 'admin'
                        ? 'bg-[#F5F8EB] text-[#56632A]'
                        : 'bg-[#FDEBF1] text-[#D84B78]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ===================================================================
          3. BAGIAN BAWAH: KEMBALI KE WEBSITE, KUESIONER, GANTI AKUN & KELUAR
             (Items 22 & 23 Client Brief)
         =================================================================== */}
      <div
        className={`w-full pt-2.5 border-t border-[#F0ECF5] ${
          isCollapsed
            ? 'flex flex-col items-center gap-1'
            : 'space-y-1'
        }`}
      >
        {/* Kuesioner Kecemasan */}
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (!session) openLoginDialog();
              else openAnxietyDialog();
            }}
            title="Kuesioner Kecemasan"
            aria-label="Kuesioner Kecemasan"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#C84B71] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
          >
            <ClipboardCheck className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (!session) openLoginDialog();
              else openAnxietyDialog();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-left text-xs font-semibold text-[#6E6A6C] hover:bg-[#FDF2F5] hover:text-[#C84B71] transition-colors cursor-pointer"
          >
            <ClipboardCheck className="h-4 w-4 text-[#C84B71] shrink-0" />
            <span className="truncate">Kuesioner Kecemasan</span>
          </button>
        )}

        {/* Item 22: Tombol Kembali ke Website */}
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              enterLandingPage();
            }}
            title="Kembali ke Website"
            aria-label="Kembali ke Website"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6E6A6C] hover:bg-[#FAF8FC] hover:text-[#2A2D22] transition-colors cursor-pointer"
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
            className="flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-left text-xs font-semibold text-[#6E6A6C] hover:bg-gray-50 hover:text-[#2A2D22] transition-colors cursor-pointer"
          >
            <Globe className="h-4 w-4 text-[#8C8896] shrink-0" />
            <span className="truncate">Kembali ke Website</span>
          </button>
        )}

        {/* Item 23: Tombol Ganti Akun / Keluar Akun */}
        {session ? (
          <>
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => {
                  if (onCloseMobile) onCloseMobile();
                  openLoginDialog();
                }}
                title="Ganti Akun"
                aria-label="Ganti Akun"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#56632A] hover:bg-[#F5F8EB] transition-colors cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onCloseMobile) onCloseMobile();
                  openLoginDialog();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-left text-xs font-semibold text-[#56632A] hover:bg-[#F5F8EB] transition-colors cursor-pointer"
              >
                <RefreshCw className="h-4 w-4 shrink-0" />
                <span className="truncate">Ganti Akun</span>
              </button>
            )}

            {isCollapsed ? (
              <button
                type="button"
                onClick={() => {
                  if (onCloseMobile) onCloseMobile();
                  handleLogout();
                }}
                title="Keluar dari Akun"
                aria-label="Keluar dari Akun"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-pink-700 hover:bg-pink-50 transition-colors cursor-pointer"
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
                className="flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-left text-xs font-semibold text-pink-700 hover:bg-pink-50 transition-colors cursor-pointer"
              >
                <Power className="h-4 w-4 shrink-0" />
                <span className="truncate">Keluar Akun</span>
              </button>
            )}
          </>
        ) : isCollapsed ? (
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              openLoginDialog();
            }}
            title="Masuk / Daftar Akun"
            aria-label="Masuk / Daftar Akun"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#C84B71] hover:bg-pink-50 transition-colors cursor-pointer"
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
            className="flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-left text-xs font-bold text-[#C84B71] hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <LogIn className="h-4 w-4 shrink-0" />
            <span className="truncate">Masuk / Daftar Akun</span>
          </button>
        )}
      </div>
    </aside>
  );
}
