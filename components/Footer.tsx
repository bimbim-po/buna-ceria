'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, MessageCircle, UserCheck, Users } from 'lucide-react';
import { getFooterContact } from '@/lib/api';
import { uiContent } from '@/data/uiContent';

export function Footer() {
  const contact = getFooterContact();
  const whatsappUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    'Halo Tim Teman Kasih, saya ingin berkonsultasi mengenai program edukasi kehamilan ini.'
  )}`;

  return (
    <footer
      id="narahubung"
      className="relative overflow-hidden border-t border-[#ECE7F2] bg-gradient-to-r from-white via-white to-[#FDF2F5]/50 pt-10 pb-8 text-[#2A2D22]"
    >
      {/* Top 2 Clean Cards */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {/* Card Kiri: Identitas Teman Kasih */}
          <div className="flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-6 shadow-2xs">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-pink-100 bg-[#FDF2F5] p-2 shadow-2xs">
                  <Image
                    src="/logo.png"
                    alt="Teman Kasih"
                    width={32}
                    height={32}
                    className="h-7 w-7 object-contain"
                  />
                </span>
                <span className="font-heading text-xl sm:text-2xl font-bold text-[#2A2D22]">
                  {uiContent.brand.name}
                </span>
              </div>

              <p className="mt-3.5 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                Ruang belajar kehamilan yang hangat, dirancang khusus agar nyaman dibaca
                melalui ponsel oleh Ibu kapan saja.
              </p>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-[16px] bg-[#FDF2F5]/90 border border-pink-100/70 p-3.5">
              <Users
                className="mt-0.5 h-4 w-4 shrink-0 text-[#C84B71]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <p className="text-[11px] sm:text-xs leading-relaxed text-[#767A6E]">
                {contact.disclaimerText}
              </p>
            </div>
          </div>

          {/* Card Kanan: Narahubung Penanggung Jawab */}
          <div className="flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-6 shadow-2xs">
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-[#2A2D22]">
                Narahubung Program Teman Kasih
              </h2>

              <div className="mt-4 space-y-3 text-xs sm:text-[13px] text-[#6E6A6C]">
                {/* Baris 1: Penanggung Jawab */}
                <div className="flex items-start gap-3">
                  <UserCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#C84B71]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="block font-bold leading-snug text-[#2A2D22]">
                      {contact.personInCharge}
                    </span>
                    <span className="text-[11px] text-[#767A6E]">
                      {contact.role}
                    </span>
                  </div>
                </div>

                {/* Baris 2: Email */}
                <div className="flex items-center gap-3">
                  <Mail
                    className="h-4 w-4 shrink-0 text-[#C84B71]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-medium text-[#2A2D22] transition-colors hover:text-[#C84B71]"
                  >
                    {contact.email}
                  </a>
                </div>

                {/* Baris 3: WhatsApp */}
                <div className="flex items-center gap-3">
                  <MessageCircle
                    className="h-4 w-4 shrink-0 text-green-600"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#2A2D22] transition-colors hover:text-green-700"
                  >
                    WhatsApp: {contact.displayWhatsapp}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F0ECF5] text-[11px] text-[#767A6E]">
              <span>Jam Layanan: Senin – Sabtu, 08.00 – 17.00 WIB</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright on Left + Navigation Links on Right (Sesuai Referensi) */}
        <div className="mt-8 pt-5 border-t border-[#F0ECF5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C8896]">
          <p>© 2026 Teman Kasih — Ruang Belajar Kehamilan yang Hangat &amp; Menenangkan.</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#767A6E]">
            <a href="#tentang-kami" className="hover:text-[#C84B71] transition-colors">
              Tentang Kami
            </a>
            <span className="text-[#D0CCD6]">|</span>
            <a href="#bantuan" className="hover:text-[#C84B71] transition-colors">
              Bantuan
            </a>
            <span className="text-[#D0CCD6]">|</span>
            <a href="#kebijakan-privasi" className="hover:text-[#C84B71] transition-colors">
              Kebijakan Privasi
            </a>
            <span className="text-[#D0CCD6]">|</span>
            <a href="#syarat-ketentuan" className="hover:text-[#C84B71] transition-colors">
              Syarat &amp; Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
