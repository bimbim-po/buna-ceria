import React from 'react';
import Image from 'next/image';
import { Heart, Mail, MessageCircle, UserCheck, Users } from 'lucide-react';
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
      className="relative overflow-hidden border-t border-pink-100/80 bg-[#FEF4F3] pt-10 text-ink sm:pt-12"
    >
      {/* Top 2 Cards */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {/* Card Kiri: Identitas Teman Kasih */}
          <div className="flex flex-col justify-between rounded-[28px] border border-pink-100/80 bg-surface p-6 shadow-pink-soft sm:p-7">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-pink-100 bg-surface p-1.5 shadow-2xs">
                  <Image
                    src="/logo.png"
                    alt="Teman Kasih"
                    width={36}
                    height={36}
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <span className="font-heading text-2xl font-bold text-ink sm:text-[26px]">
                  {uiContent.brand.name}
                </span>
              </div>

              <p className="mt-3.5 text-[15px] leading-relaxed text-ink-muted">
                Ruang belajar kehamilan yang hangat, dirancang khusus agar nyaman dibaca
                melalui ponsel oleh Ibu kapan saja.
              </p>
            </div>

            <div className="mt-5 flex items-start gap-3.5 rounded-[20px] bg-[#FCEEF0]/90 p-4">
              <Users
                className="mt-0.5 h-5 w-5 shrink-0 text-[#D46A7E]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-ink-muted sm:text-[13px]">
                {contact.disclaimerText}
              </p>
            </div>
          </div>

          {/* Card Kanan: Narahubung Penanggung Jawab */}
          <div className="flex flex-col justify-between rounded-[28px] border border-pink-100/80 bg-surface p-6 shadow-pink-soft sm:p-7">
            <div>
              <h2 className="font-heading text-xl font-bold text-ink sm:text-[22px]">
                Narahubung Program Teman Kasih
              </h2>

              <div className="mt-4 divide-y divide-pink-100/70 text-sm text-ink-muted">
                {/* Baris 1: Penanggung Jawab */}
                <div className="flex items-start gap-3.5 pb-3.5">
                  <UserCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#D46A7E]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="block text-[15px] font-bold leading-snug text-ink">
                      {contact.personInCharge}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted sm:text-[13px]">
                      {contact.role}
                    </span>
                  </div>
                </div>

                {/* Baris 2: Email */}
                <div className="flex items-center gap-3.5 py-3.5">
                  <Mail
                    className="h-5 w-5 shrink-0 text-[#D46A7E]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center text-[15px] font-medium text-ink transition-colors hover:text-pink-700"
                  >
                    {contact.email}
                  </a>
                </div>

                {/* Baris 3: WhatsApp */}
                <div className="flex items-center gap-3.5 pt-3.5">
                  <MessageCircle
                    className="h-5 w-5 shrink-0 text-[#7E9448]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[15px] font-medium text-ink transition-colors hover:text-green-700"
                  >
                    WhatsApp: {contact.displayWhatsapp}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-pink-100/60 text-xs text-ink-muted">
              <span>Jam Layanan: Senin – Sabtu, 08.00 – 17.00 WIB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scenic Area: Waves + Left/Right Illustrations + Heart & Copyright */}
      <div className="relative mt-6 pt-8 pb-8 sm:mt-8 sm:pt-12 sm:pb-10">
        {/* Layered Soft Pastel Waves */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-28 w-full sm:h-36"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,64 C240,20 480,105 720,88 C960,70 1200,18 1440,52 L1440,160 L0,160 Z"
            fill="#FDE9EA"
          />
          <path
            d="M0,96 C260,132 460,68 720,108 C980,148 1180,76 1440,104 L1440,160 L0,160 Z"
            fill="#FDD6D7"
          />
        </svg>

        {/* Left Pregnant Mother Illustration */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-10 w-[135px] sm:w-[200px] md:w-[235px]">
          <Image
            src="/footer-left.png"
            alt=""
            width={235}
            height={191}
            className="h-auto w-full object-contain object-bottom"
          />
        </div>

        {/* Right Pregnant Mother & Midwife Illustration */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-10 w-[145px] sm:w-[215px] md:w-[254px]">
          <Image
            src="/footer-right.png"
            alt=""
            width={254}
            height={191}
            className="h-auto w-full object-contain object-bottom"
          />
        </div>

        {/* Center Heart Divider & Copyright */}
        <div className="relative z-20 mx-auto max-w-md px-4 text-center sm:max-w-xl">
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <span className="h-[2.5px] w-2.5 rounded-full bg-[#F29AA7]" />
            <Heart
              className="h-5 w-5 fill-[#F29AA7] text-[#F29AA7]"
              aria-hidden="true"
            />
            <span className="h-[2.5px] w-2.5 rounded-full bg-[#F29AA7]" />
          </div>

          <p className="text-xs font-medium leading-relaxed text-ink-muted sm:text-[13px]">
            © 2026 Teman Kasih — Ruang Belajar Kehamilan yang Hangat &amp; Menenangkan.
            <br />
            Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
