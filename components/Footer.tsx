'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, MessageCircle, UserCheck, Users } from 'lucide-react';
import { getFooterContact } from '@/lib/api';

export function Footer() {
  const contact = getFooterContact();
  const whatsappUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    'Halo Kak Faiza (Tim Buna Ceria • Teman Kasih), saya ingin berkonsultasi mengenai program edukasi kehamilan ini.'
  )}`;

  return (
    <footer
      id="narahubung"
      className="relative overflow-hidden border-t border-[#ECE7F2] bg-[#FAF6F4] text-[#2A2D22]"
    >
      {/* Top 2 Clean Cards (Sesuai Referensi Desain PDF) */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {/* Card Kiri: Identitas & Kalimat Penutup */}
          <div className="flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-6 shadow-2xs">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-pink-100 bg-[#FDF2F5] p-2 shadow-2xs">
                  <Image
                    src="/logo.png"
                    alt="Buna Ceria Teman Kasih"
                    width={32}
                    height={32}
                    className="h-7 w-7 object-contain"
                  />
                </span>
                <div>
                  <span className="block font-heading text-xl sm:text-2xl font-bold text-[#2A2D22]">
                    Buna Ceria
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#C84B71]">
                    Teman Kasih • Edukasi Kehamilan
                  </span>
                </div>
              </div>

              <p className="mt-3.5 text-xs sm:text-[13px] leading-relaxed text-[#6E6A6C]">
                Ruang belajar kehamilan yang hangat, dirancang khusus agar nyaman dibaca
                melalui ponsel oleh Ibu kapan saja. Setiap langkah kecil hari ini adalah
                hadiah berharga bagi kesehatan Ibu dan tumbuh kembang buah hati.
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

          {/* Card Kanan: Narahubung Penanggung Jawab (Kak Faiza 085701308514) */}
          <div className="flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-6 shadow-2xs">
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-[#2A2D22]">
                Narahubung Program Buna Ceria
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
                    className="font-bold text-[#2A2D22] transition-colors hover:text-green-700"
                  >
                    WhatsApp: {contact.displayWhatsapp} (085701308514)
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F0ECF5] flex items-center justify-between text-[11px] text-[#767A6E]">
              <span>Jam Layanan: Senin – Sabtu, 08.00 – 17.00 WIB</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#56632A] hover:underline"
              >
                Hubungi Kak Faiza →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Matcha Green Bar (Sesuai Desain PDF pdf_img_3.png) */}
      <div className="bg-[#8E9B5E] text-white">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="font-medium text-white/95">
            {contact.copyrightText}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/90">
            <a href="#top" className="hover:text-white transition-colors">
              Beranda
            </a>
            <span className="text-white/40">|</span>
            <a href="#tips-nifas" className="hover:text-white transition-colors">
              3 Tips Nifas
            </a>
            <span className="text-white/40">|</span>
            <a href="#fitur-webapp" className="hover:text-white transition-colors">
              Fitur Pembelajaran
            </a>
            <span className="text-white/40">|</span>
            <a href="#daftar-pustaka" className="hover:text-white transition-colors">
              Daftar Pustaka
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
