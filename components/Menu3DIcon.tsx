'use client';

import React, { useId } from 'react';

export type Menu3DIconName =
  | 'beranda'
  | 'materi'
  | 'tips'
  | 'hasil'
  | 'selfie'
  | 'pengaturan'
  | 'admin';

interface Menu3DIconProps {
  name: Menu3DIconName;
  className?: string;
}

/**
 * Ikon 3D Clay / Glossy Realistis sesuai referensi desain menu Buna Ceria.
 * Menggunakan multi-layer SVG gradients, specular highlight, dan drop shadow lembut.
 */
export function Menu3DIcon({ name, className = 'h-6 w-6' }: Menu3DIconProps) {
  const uid = useId().replace(/:/g, '');

  if (name === 'beranda') {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={`shadow-${uid}`}
            x="2"
            y="4"
            width="44"
            height="44"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="2.5"
              stdDeviation="2"
              floodColor="#C83E6B"
              floodOpacity="0.28"
            />
          </filter>
          <linearGradient
            id={`house-body-${uid}`}
            x1="12"
            y1="14"
            x2="34"
            y2="42"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF8FB1" />
            <stop offset="45%" stopColor="#FF5E8E" />
            <stop offset="100%" stopColor="#E03A6C" />
          </linearGradient>
          <linearGradient
            id={`house-roof-${uid}`}
            x1="10"
            y1="6"
            x2="36"
            y2="26"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFA8C3" />
            <stop offset="50%" stopColor="#FF6695" />
            <stop offset="100%" stopColor="#E63E70" />
          </linearGradient>
          <linearGradient
            id={`house-door-${uid}`}
            x1="20"
            y1="24"
            x2="28"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFEAF0" />
          </linearGradient>
        </defs>

        <g filter={`url(#shadow-${uid})`}>
          {/* 3D Bottom Base Extrusion */}
          <rect
            x="10"
            y="21"
            width="28"
            height="20"
            rx="6.5"
            fill="#C92A5B"
          />
          {/* Main Chubby House Body */}
          <rect
            x="10"
            y="19"
            width="28"
            height="20"
            rx="6.5"
            fill={`url(#house-body-${uid})`}
          />
          {/* Roof Under-Shadow */}
          <path
            d="M21.2 8.2C22.8 6.8 25.2 6.8 26.8 8.2L40.4 20.1C42.5 21.9 41.2 25.4 38.4 25.4H9.6C6.8 25.4 5.5 21.9 7.6 20.1L21.2 8.2Z"
            fill="#D43062"
          />
          {/* 3D Chubby Roof */}
          <path
            d="M21.2 7.1C22.8 5.7 25.2 5.7 26.8 7.1L40.4 18.8C42.5 20.6 41.2 24 38.4 24H9.6C6.8 24 5.5 20.6 7.6 18.8L21.2 7.1Z"
            fill={`url(#house-roof-${uid})`}
          />
          {/* Glossy Specular Highlight on Roof */}
          <path
            d="M22.2 8.6C23.3 7.6 24.8 7.6 25.8 8.5L35.5 16.8C36.3 17.5 35.8 18.8 34.8 18.8H13.5C12.4 18.8 11.9 17.5 12.8 16.8L22.2 8.6Z"
            fill="white"
            fillOpacity="0.22"
          />
          {/* Center White Rounded Window / Door */}
          <rect
            x="19.5"
            y="24"
            width="9"
            height="10.5"
            rx="3.2"
            fill="#C92A5B"
            fillOpacity="0.25"
          />
          <rect
            x="19.5"
            y="23.2"
            width="9"
            height="10.2"
            rx="3.2"
            fill={`url(#house-door-${uid})`}
          />
        </g>
      </svg>
    );
  }

  if (name === 'materi') {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={`shadow-${uid}`}
            x="2"
            y="4"
            width="44"
            height="44"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="2.5"
              stdDeviation="2"
              floodColor="#C83E6B"
              floodOpacity="0.26"
            />
          </filter>
          <linearGradient
            id={`book-left-${uid}`}
            x1="6"
            y1="9"
            x2="24"
            y2="39"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF85AA" />
            <stop offset="50%" stopColor="#FF5588" />
            <stop offset="100%" stopColor="#DF3166" />
          </linearGradient>
          <linearGradient
            id={`book-right-${uid}`}
            x1="24"
            y1="9"
            x2="42"
            y2="39"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFC2D4" />
            <stop offset="55%" stopColor="#FF94B4" />
            <stop offset="100%" stopColor="#F26D96" />
          </linearGradient>
        </defs>

        <g filter={`url(#shadow-${uid})`}>
          {/* 3D Book Bottom Thickness / Pages Base */}
          <path
            d="M7 14C7 11.2 9.2 9 12 9H22.2C23.2 9 24 9.8 24 10.8V39.5C24 38.4 23.1 37.5 22 37.5H11.5C9 37.5 7 35.5 7 33V14Z"
            fill="#C22555"
            transform="translate(0, 2.2)"
          />
          <path
            d="M41 14C41 11.2 38.8 9 36 9H25.8C24.8 9 24 9.8 24 10.8V39.5C24 38.4 24.9 37.5 26 37.5H36.5C39 37.5 41 35.5 41 33V14Z"
            fill="#D94B78"
            transform="translate(0, 2.2)"
          />

          {/* Left Page (Vibrant 3D Rose Pink) */}
          <path
            d="M7 13.5C7 10.7 9.2 8.5 12 8.5H21.8C23 8.5 24 9.5 24 10.7V38.2C24 37 23 36 21.8 36H11.5C9 36 7 34 7 31.5V13.5Z"
            fill={`url(#book-left-${uid})`}
          />
          {/* Left Page Specular Sheen */}
          <path
            d="M9.5 13C9.5 11.3 10.8 10 12.5 10H20.5C21.3 10 22 10.7 22 11.5V18C17 18 12.5 20 9.5 23V13Z"
            fill="white"
            fillOpacity="0.22"
          />

          {/* Right Page (Soft Pastel 3D Pink) */}
          <path
            d="M41 13.5C41 10.7 38.8 8.5 36 8.5H26.2C25 8.5 24 9.5 24 10.7V38.2C24 37 25 36 26.2 36H36.5C39 36 41 34 41 31.5V13.5Z"
            fill={`url(#book-right-${uid})`}
          />

          {/* Center Spine Crease */}
          <rect
            x="23.1"
            y="9"
            width="1.8"
            height="28.5"
            rx="0.9"
            fill="#C92B5B"
            fillOpacity="0.35"
          />

          {/* 3 Rounded Text Lines on Right Page */}
          <rect
            x="28"
            y="15.5"
            width="8.5"
            height="2.6"
            rx="1.3"
            fill="#FFFFFF"
            fillOpacity="0.92"
          />
          <rect
            x="28"
            y="20.8"
            width="8.5"
            height="2.6"
            rx="1.3"
            fill="#FFFFFF"
            fillOpacity="0.92"
          />
          <rect
            x="28"
            y="26.1"
            width="6.5"
            height="2.6"
            rx="1.3"
            fill="#FFFFFF"
            fillOpacity="0.92"
          />
        </g>
      </svg>
    );
  }

  if (name === 'tips') {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={`shadow-${uid}`}
            x="1"
            y="2"
            width="46"
            height="46"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="1.8"
              floodColor="#B45309"
              floodOpacity="0.28"
            />
          </filter>
          <linearGradient
            id={`star-main-${uid}`}
            x1="8"
            y1="10"
            x2="30"
            y2="38"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFF6B7" />
            <stop offset="40%" stopColor="#FFD447" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient
            id={`star-sub-${uid}`}
            x1="28"
            y1="6"
            x2="42"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFF8C9" />
            <stop offset="50%" stopColor="#FFD859" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        <g filter={`url(#shadow-${uid})`}>
          {/* Main Large 3D 4-Point Sparkle */}
          <path
            d="M19.5 9.5C20.1 7.6 22.7 7.6 23.3 9.5L25.4 16.4C25.9 18 27.1 19.2 28.7 19.7L35.6 21.8C37.5 22.4 37.5 25 35.6 25.6L28.7 27.7C27.1 28.2 25.9 29.4 25.4 31L23.3 37.9C22.7 39.8 20.1 39.8 19.5 37.9L17.4 31C16.9 29.4 15.7 28.2 14.1 27.7L7.2 25.6C5.3 25 5.3 22.4 7.2 21.8L14.1 19.7C15.7 19.2 16.9 18 17.4 16.4L19.5 9.5Z"
            fill={`url(#star-main-${uid})`}
          />
          {/* Inner 3D Specular Facet on Main Sparkle */}
          <path
            d="M21.4 11.2L23.1 17.2C23.6 18.8 24.8 20 26.4 20.5L32.4 22.2L26.4 23.2C24.4 23.5 22.8 22.2 21.4 21V11.2Z"
            fill="#FFFFFF"
            fillOpacity="0.45"
          />

          {/* Top-Right Medium 3D Sparkle */}
          <path
            d="M35.2 6.8C35.5 5.7 37.1 5.7 37.4 6.8L38.4 10.1C38.7 11 39.4 11.7 40.3 12L43.6 13C44.7 13.3 44.7 14.9 43.6 15.2L40.3 16.2C39.4 16.5 38.7 17.2 38.4 18.1L37.4 21.4C37.1 22.5 35.5 22.5 35.2 21.4L34.2 18.1C33.9 17.2 33.2 16.5 32.3 16.2L29 15.2C27.9 14.9 27.9 13.3 29 13L32.3 12C33.2 11.7 33.9 11 34.2 10.1L35.2 6.8Z"
            fill={`url(#star-sub-${uid})`}
          />

          {/* Bottom-Right Small 3D Sparkle */}
          <path
            d="M33.2 29.8C33.5 28.9 34.7 28.9 35 29.8L35.7 32.1C35.9 32.8 36.5 33.4 37.2 33.6L39.5 34.3C40.4 34.6 40.4 35.8 39.5 36.1L37.2 36.8C36.5 37 35.9 37.6 35.7 38.3L35 40.6C34.7 41.5 33.5 41.5 33.2 40.6L32.5 38.3C32.3 37.6 31.7 37 31 36.8L28.7 36.1C27.8 35.8 27.8 34.6 28.7 34.3L31 33.6C31.7 33.4 32.3 32.8 32.5 32.1L33.2 29.8Z"
            fill={`url(#star-sub-${uid})`}
          />
        </g>
      </svg>
    );
  }

  if (name === 'hasil') {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={`shadow-${uid}`}
            x="2"
            y="2"
            width="44"
            height="45"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="2.5"
              stdDeviation="1.8"
              floodColor="#C83E6B"
              floodOpacity="0.26"
            />
          </filter>
          <linearGradient
            id={`medal-outer-${uid}`}
            x1="12"
            y1="6"
            x2="36"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFC4D6" />
            <stop offset="55%" stopColor="#FF8EB0" />
            <stop offset="100%" stopColor="#F05F8C" />
          </linearGradient>
          <linearGradient
            id={`medal-inner-${uid}`}
            x1="15"
            y1="10"
            x2="33"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF6B98" />
            <stop offset="100%" stopColor="#D92B5E" />
          </linearGradient>
          <linearGradient
            id={`medal-ribbon-${uid}`}
            x1="14"
            y1="28"
            x2="34"
            y2="43"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF5E8E" />
            <stop offset="100%" stopColor="#C82556" />
          </linearGradient>
          <linearGradient
            id={`medal-star-${uid}`}
            x1="19"
            y1="12"
            x2="29"
            y2="25"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFF5B8" />
            <stop offset="50%" stopColor="#FFD24C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        <g filter={`url(#shadow-${uid})`}>
          {/* Left Ribbon Tail */}
          <path
            d="M17.5 27.5L12.5 39.2C12 40.4 13.3 41.5 14.4 40.8L18.2 38.5L20.4 41.8C21.1 42.9 22.8 42.5 23.1 41.3L24.8 29.5L17.5 27.5Z"
            fill={`url(#medal-ribbon-${uid})`}
          />
          {/* Right Ribbon Tail */}
          <path
            d="M30.5 27.5L35.5 39.2C36 40.4 34.7 41.5 33.6 40.8L29.8 38.5L27.6 41.8C26.9 42.9 25.2 42.5 24.9 41.3L23.2 29.5L30.5 27.5Z"
            fill={`url(#medal-ribbon-${uid})`}
          />

          {/* 3D Medal Outer Ring Base Shadow */}
          <circle cx="24" cy="20.2" r="13.5" fill="#D13B6B" />
          {/* 3D Medal Outer Ring */}
          <circle cx="24" cy="19" r="13.5" fill={`url(#medal-outer-${uid})`} />

          {/* 3D Medal Inner Circle */}
          <circle cx="24" cy="19" r="9.3" fill={`url(#medal-inner-${uid})`} />

          {/* 3D Gold Star in Center */}
          <path
            d="M23.1 12.6C23.5 11.8 24.5 11.8 24.9 12.6L26.2 15.1C26.3 15.4 26.6 15.6 26.9 15.7L29.7 16.1C30.5 16.2 30.8 17.2 30.2 17.8L28.2 19.8C28 20 27.9 20.3 27.9 20.6L28.4 23.4C28.5 24.2 27.7 24.8 27 24.4L24.5 23.1C24.2 23 23.8 23 23.5 23.1L21 24.4C20.3 24.8 19.5 24.2 19.6 23.4L20.1 20.6C20.1 20.3 20 20 19.8 19.8L17.8 17.8C17.2 17.2 17.5 16.2 18.3 16.1L21.1 15.7C21.4 15.6 21.7 15.4 21.8 15.1L23.1 12.6Z"
            fill={`url(#medal-star-${uid})`}
          />

          {/* Glossy Top Highlight */}
          <path
            d="M15 13C17.2 9.8 20.5 8 24 8C27.5 8 30.8 9.8 33 13"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  if (name === 'selfie') {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={`shadow-${uid}`}
            x="2"
            y="4"
            width="44"
            height="42"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="2.5"
              stdDeviation="2"
              floodColor="#C83E6B"
              floodOpacity="0.26"
            />
          </filter>
          <linearGradient
            id={`cam-body-${uid}`}
            x1="6"
            y1="13"
            x2="40"
            y2="39"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF94B4" />
            <stop offset="48%" stopColor="#FF5E8E" />
            <stop offset="100%" stopColor="#DF3166" />
          </linearGradient>
          <linearGradient
            id={`cam-top-${uid}`}
            x1="14"
            y1="9"
            x2="34"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFC4D6" />
            <stop offset="100%" stopColor="#FF85AA" />
          </linearGradient>
          <linearGradient
            id={`cam-lens-${uid}`}
            x1="18"
            y1="19"
            x2="30"
            y2="33"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F5DCE4" />
          </linearGradient>
        </defs>

        <g filter={`url(#shadow-${uid})`}>
          {/* Shutter Button on Top Left */}
          <rect
            x="10.5"
            y="10.5"
            width="6"
            height="4"
            rx="2"
            fill="#FF85AA"
          />
          {/* Top Camera Bump */}
          <path
            d="M17.5 11.2C18.1 9.8 19.5 9 21 9H27C28.5 9 29.9 9.8 30.5 11.2L32 14.5H16L17.5 11.2Z"
            fill={`url(#cam-top-${uid})`}
          />

          {/* 3D Bottom Base Extrusion */}
          <rect
            x="6.5"
            y="15"
            width="35"
            height="24.5"
            rx="8"
            fill="#C42556"
          />

          {/* Main Chubby Camera Body */}
          <rect
            x="6.5"
            y="13"
            width="35"
            height="24.5"
            rx="8"
            fill={`url(#cam-body-${uid})`}
          />

          {/* Top Glossy Band Highlight */}
          <path
            d="M14.5 13H33.5C37.9 13 41.5 16.6 41.5 21V21.5H6.5V21C6.5 16.6 10.1 13 14.5 13Z"
            fill="white"
            fillOpacity="0.18"
          />

          {/* Outer Lens Shadow */}
          <circle
            cx="24"
            cy="26.5"
            r="8.2"
            fill="#B81F4E"
            fillOpacity="0.35"
          />
          {/* 3D White Circular Lens */}
          <circle
            cx="24"
            cy="25.5"
            r="7.8"
            fill={`url(#cam-lens-${uid})`}
          />
          {/* Inner Soft Lens Core */}
          <circle
            cx="24"
            cy="25.5"
            r="5"
            fill="#FFEFF4"
          />
          {/* Flash Dot Top Right */}
          <circle
            cx="35"
            cy="18.5"
            r="2"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
        </g>
      </svg>
    );
  }

  if (name === 'pengaturan') {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={`shadow-${uid}`}
            x="2"
            y="3"
            width="44"
            height="44"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="2.5"
              stdDeviation="1.8"
              floodColor="#C83E6B"
              floodOpacity="0.28"
            />
          </filter>
          <linearGradient
            id={`gear-grad-${uid}`}
            x1="10"
            y1="8"
            x2="38"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF96B6" />
            <stop offset="48%" stopColor="#FF598B" />
            <stop offset="100%" stopColor="#D9295D" />
          </linearGradient>
        </defs>

        <g filter={`url(#shadow-${uid})`}>
          {/* 3D Bottom Extrusion of Gear */}
          <g transform="translate(0, 2)">
            <circle cx="24" cy="24" r="12.5" fill="#BD204F" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <rect
                key={`b-${angle}`}
                x="20"
                y="5.5"
                width="8"
                height="37"
                rx="4"
                fill="#BD204F"
                transform={`rotate(${angle} 24 24)`}
              />
            ))}
          </g>

          {/* Main 3D Chubby Gear Teeth & Body */}
          <g>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <rect
                key={`t-${angle}`}
                x="20"
                y="5.5"
                width="8"
                height="37"
                rx="4"
                fill={`url(#gear-grad-${uid})`}
                transform={`rotate(${angle} 24 24)`}
              />
            ))}
            <circle cx="24" cy="24" r="13.2" fill={`url(#gear-grad-${uid})`} />
          </g>

          {/* Soft 3D Inner Ring Bevel */}
          <circle
            cx="24"
            cy="24"
            r="9.8"
            stroke="white"
            strokeOpacity="0.28"
            strokeWidth="1.5"
          />

          {/* Center White Hole */}
          <circle cx="24" cy="24.6" r="6.2" fill="#BD204F" fillOpacity="0.3" />
          <circle cx="24" cy="24" r="6" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // Fallback / 'admin' — 3D Glossy Shield Check
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter
          id={`shadow-${uid}`}
          x="3"
          y="3"
          width="42"
          height="44"
          filterUnits="userSpaceOnUse"
        >
          <feDropShadow
            dx="0"
            dy="2.5"
            stdDeviation="1.8"
            floodColor="#C83E6B"
            floodOpacity="0.26"
          />
        </filter>
        <linearGradient
          id={`shield-grad-${uid}`}
          x1="10"
          y1="7"
          x2="38"
          y2="41"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF96B6" />
          <stop offset="50%" stopColor="#FF598B" />
          <stop offset="100%" stopColor="#D9295D" />
        </linearGradient>
      </defs>
      <g filter={`url(#shadow-${uid})`}>
        <path
          d="M24 7L37 12.2C38.2 12.7 39 13.8 39 15.1V23.8C39 32.1 32.8 39.3 24.8 41.4C24.3 41.5 23.7 41.5 23.2 41.4C15.2 39.3 9 32.1 9 23.8V15.1C9 13.8 9.8 12.7 11 12.2L24 7Z"
          fill={`url(#shield-grad-${uid})`}
        />
        <path
          d="M18.5 24.2L22.3 28L30 20.2"
          stroke="white"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
