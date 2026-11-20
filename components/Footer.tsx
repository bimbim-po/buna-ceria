'use client';

import React from 'react';
import Image from 'next/image';
import { Globe, Mail, Phone, User } from 'lucide-react';
import { getFooterContact } from '@/lib/api';

export function Footer() {
  const contact = getFooterContact();
  const whatsappUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    'Halo Kak Faiza (Tim Buna Ceria), saya ingin berkonsultasi mengenai program edukasi kehamilan ini.'
  )}`;

  return (
    <footer
      id="narahubung"
      className="mx-auto w-full max-w-[1480px] 2xl:max-w-[1680px] px-5 pb-8 pt-6 sm:px-8 lg:px-12 xl:px-16 text-[#2A2D22]"
    >
      <div className="overflow-hidden rounded-[28px] border border-[#F5DCE4] shadow-[0_12px_36px_rgba(200,75,113,0.06)] transition-all duration-300 hover:shadow-[0_16px_42px_rgba(200,75,113,0.1)]">
        {/* Top Unified Editorial Surface (Sesuai Referensi pdf_img_3.png) */}
        <div className="bg-gradient-to-r from-[#F5F7EC] via-[#FFF6F9] to-[#FCEBEF] px-7 py-9 sm:px-10 sm:py-11">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
            {/* Left Column: Brand & Kalimat Penutup */}
            <div className="md:col-span-5 space-y-3.5 flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Buna Ceria"
                  width={38}
                  height={38}
                  className="h-9 w-9 object-contain"
                />
                <div className="text-left">
                  <span className="block font-heading text-xl font-bold text-[#2A2D22] leading-tight">
                    Buna Ceria
                  </span>
                  <span className="block text-xs text-[#6E6A6C]">
                    Buna Ceria • Edukasi Masa Nifas
                  </span>
                </div>
              </div>

              <p className="max-w-xs text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                Belajar hari ini untuk kesehatan Ibu dan kebahagiaan buah hati esok nanti.
              </p>

              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Buna Ceria"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8E9B5E] text-white transition-opacity hover:opacity-85"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Buna Ceria"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8E9B5E] text-white transition-opacity hover:opacity-85"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                  </svg>
                </a>
                <a
                  href="#top"
                  aria-label="Website Buna Ceria"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8E9B5E] text-white transition-opacity hover:opacity-85"
                >
                  <Globe className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Center Vertical Divider */}
            <div className="hidden md:flex md:col-span-1 justify-center">
              <div className="h-28 w-px bg-[#DFDBD4]" />
            </div>

            {/* Right Column: Narahubung Program */}
            <div className="md:col-span-6 space-y-3 flex flex-col items-center text-center sm:items-start sm:text-left">
              <h2 className="font-sans text-sm font-bold text-[#2A2D22]">
                Narahubung Program Buna Ceria
              </h2>

              <div className="space-y-2.5 text-xs sm:text-[13px] text-[#4A4748] flex flex-col items-center sm:items-start">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-[#DF6B8D]" />
                  <div>
                    <span className="block font-bold text-[#2A2D22]">
                      {contact.personInCharge}
                    </span>
                    <span className="text-[11px] text-[#767A6E]">
                      {contact.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-[#DF6B8D]" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-[#C84B71] transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-[#DF6B8D]" />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#2A2D22] hover:text-[#56632A] transition-colors"
                  >
                    {contact.displayWhatsapp}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Matcha Bar (Sesuai Referensi pdf_img_3.png) */}
        <div className="bg-[#8E9B5E] px-7 py-3.5 text-white sm:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs">
            <p className="text-white/95 text-center sm:text-left">
              {contact.copyrightText}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-white/90">
              <a href="#top" className="hover:text-white transition-colors">
                Tentang Kami
              </a>
              <span className="text-white/40">|</span>
              <a href="#fitur-webapp" className="hover:text-white transition-colors">
                Bantuan
              </a>
              <span className="text-white/40">|</span>
              <a href="#daftar-pustaka" className="hover:text-white transition-colors">
                Kebijakan Privasi
              </a>
              <span className="text-white/40">|</span>
              <a href="#narahubung" className="hover:text-white transition-colors">
                Syarat &amp; Ketentuan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
