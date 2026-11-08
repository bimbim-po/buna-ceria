'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  ChevronDown,
  Download,
  FlipHorizontal,
  Heart,
  Image as ImageIcon,
  Monitor,
  RefreshCw,
  Smartphone,
  Sparkles,
  Type,
  Upload,
  Users,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export type FrameOrientation = 'portrait' | 'landscape';

interface PoseGuide {
  id: 'couple-side' | 'couple-belly' | 'couple-heart' | 'single-bunda';
  label: string;
  shortLabel: string;
  instructionPortrait: string;
  instructionLandscape: string;
}

const POSE_GUIDES: PoseGuide[] = [
  {
    id: 'couple-side',
    label: 'Gaya 1: Bersandar Hangat (Bunda & Pasangan)',
    shortLabel: 'Bersandar Hangat',
    instructionPortrait:
      'Mode Portrait (HP): Posisikan Ayah di sisi kiri dan Bunda bersandar hangat di bahu kanan mengikuti garis siluet putus-putus pink.',
    instructionLandscape:
      'Mode Landscape (Full Layar): Posisikan Ayah dan Bunda berdampingan hangat di tengah bingkai mengikuti garis siluet putus-putus pink.',
  },
  {
    id: 'couple-heart',
    label: 'Gaya 2: Senyum Dekat Berdua + Hati',
    shortLabel: 'Senyum Berdua',
    instructionPortrait:
      'Mode Portrait (HP): Dekatkan kepala Bunda & Pasangan mengikuti siluet garis putus-putus pink di bawah ikon hati.',
    instructionLandscape:
      'Mode Landscape (Full Layar): Dekatkan kepala Bunda & Pasangan di tengah bingkai lebar mengikuti siluet garis putus-putus pink.',
  },
  {
    id: 'couple-belly',
    label: 'Gaya 3: Kasih Sayang untuk Si Kecil',
    shortLabel: 'Sayang Si Kecil',
    instructionPortrait:
      'Mode Portrait (HP): Bunda di sisi kiri dan Pasangan di sisi kanan merangkul hangat mengikuti siluet garis putus-putus pink.',
    instructionLandscape:
      'Mode Landscape (Full Layar): Bunda di sisi kiri dan Pasangan di sisi kanan saling bersandar hangat mengikuti siluet putus-putus.',
  },
  {
    id: 'single-bunda',
    label: 'Gaya 4: Siluet Bunda Ceria',
    shortLabel: 'Bunda Sendiri',
    instructionPortrait:
      'Mode Portrait (HP): Posisikan kepala, rambut, dan bahu Bunda tepat di tengah bingkai mengikuti garis putus-putus pink.',
    instructionLandscape:
      'Mode Landscape (Full Layar): Posisikan kepala dan bahu Bunda tepat di tengah bingkai landscape yang lega.',
  },
];

interface FramePreset {
  id: 'cherry-blossom' | 'matcha-green' | 'floral-white' | 'sweet-harmony';
  name: string;
  borderHex: string;
  accentHex: string;
  bgBadgeHex: string;
  textHex: string;
  previewClass: string;
}

const FRAME_PRESETS: FramePreset[] = [
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom Pink',
    borderHex: '#F5AFB9',
    accentHex: '#C84B71',
    bgBadgeHex: '#FFF5F7',
    textHex: '#2A2D22',
    previewClass: 'border-[#F5AFB9] bg-[#FFF5F7]',
  },
  {
    id: 'matcha-green',
    name: 'Matcha Green',
    borderHex: '#A8B371',
    accentHex: '#56632A',
    bgBadgeHex: '#F7F9EE',
    textHex: '#2A2D22',
    previewClass: 'border-[#A8B371] bg-[#F7F9EE]',
  },
  {
    id: 'floral-white',
    name: 'Floral White Elegance',
    borderHex: '#E6DEC8',
    accentHex: '#9C6B30',
    bgBadgeHex: '#FFFAF0',
    textHex: '#2A2D22',
    previewClass: 'border-[#E6DEC8] bg-[#FFFAF0]',
  },
  {
    id: 'sweet-harmony',
    name: 'Sakura & Matcha',
    borderHex: '#C84B71',
    accentHex: '#56632A',
    bgBadgeHex: '#FFF9FB',
    textHex: '#2A2D22',
    previewClass: 'border-[#C84B71] bg-[#FFF9FB]',
  },
];

function PinkDashedPath({
  d,
  dash = '12 9',
}: {
  d: string;
  dash?: string;
}) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d={d}
        stroke="rgba(156, 48, 86, 0.55)"
        strokeWidth="7.5"
        strokeDasharray={dash}
      />
      <path
        d={d}
        stroke="#F9A8CC"
        strokeWidth="4.2"
        strokeDasharray={dash}
      />
    </g>
  );
}

// Komponen Overlay Siluet Garis Putus-Putus Pink sesuai Referensi Client
function DashedSilhouetteOverlay({
  poseId,
  orientation,
  visible,
}: {
  poseId: PoseGuide['id'];
  orientation: FrameOrientation;
  visible: boolean;
}) {
  if (!visible) return null;

  const isPortrait = orientation === 'portrait';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between pt-3 px-3 pb-0"
    >
      {/* Badge Mode Orientasi di Pojok Atas Viewfinder */}
      <div className="self-center rounded-full bg-black/50 px-3.5 py-1 text-[10px] sm:text-[11px] font-semibold text-pink-100 backdrop-blur-xs border border-pink-300/30">
        {isPortrait
          ? 'Panduan Siluet Portrait (HP)'
          : 'Panduan Siluet Landscape (Full Layar)'}
      </div>

      {/* Area Siluet Utama Menempel Rapi di Bagian Bawah Bingkai */}
      <div className="relative flex-1 w-full flex items-end justify-center min-h-0 overflow-hidden">
        {poseId === 'single-bunda' ? (
          /* Gaya 4: Siluet Detail Bunda Sendiri (Rambut Bergelombang, Telinga, Rahang, Kerah, & Bahu) */
          <svg
            viewBox="0 0 500 460"
            className={`w-full object-contain object-bottom ${
              isPortrait ? 'h-[86%] max-w-[380px]' : 'h-[90%] max-w-[520px]'
            }`}
            fill="none"
          >
            {/* Kontur Atas Rambut Bergelombang & Belahan Tengah */}
            <PinkDashedPath d="M 178 142 C 174 96, 206 62, 248 64 C 254 56, 266 58, 272 65 C 314 66, 342 100, 336 148" />
            {/* Helaian Rambut Kiri Mengalir ke Bahu */}
            <PinkDashedPath d="M 178 142 C 164 176, 154 226, 144 276 C 136 312, 148 342, 162 365" />
            <PinkDashedPath d="M 192 178 C 182 214, 174 252, 176 294" />
            {/* Helaian Rambut Kanan Mengalir ke Bahu */}
            <PinkDashedPath d="M 336 148 C 352 182, 362 230, 370 280 C 376 314, 364 344, 348 368" />
            <PinkDashedPath d="M 320 180 C 330 216, 338 254, 334 296" />
            {/* Wajah, Telinga, Pipi & Dagu Bunda */}
            <PinkDashedPath d="M 196 154 C 186 158, 186 180, 198 184 C 204 218, 224 242, 256 244 C 288 242, 308 218, 314 184 C 326 180, 326 158, 316 154" />
            {/* Leher & Kerah Baju Crew-Neck */}
            <PinkDashedPath d="M 226 238 L 222 276 C 238 294, 274 294, 290 276 L 286 238" />
            <PinkDashedPath d="M 210 282 C 234 308, 278 308, 302 282" />
            {/* Bahu & Lengan Kiri-Kanan */}
            <PinkDashedPath d="M 144 290 C 102 306, 74 346, 62 456" />
            <PinkDashedPath d="M 368 290 C 410 306, 438 346, 450 456" />
          </svg>
        ) : (
          /* Gaya 1, 2, 3: Siluet Garis Putus-Putus Pink Persis Referensi Client (silhouette-bunda-dashed.webp) */
          <div className="relative flex h-full w-full items-end justify-center">
            {poseId === 'couple-heart' && (
              <svg
                viewBox="0 0 120 100"
                className="absolute top-2 left-1/2 -translate-x-1/2 h-14 w-16 sm:h-16 sm:w-20 z-10"
                fill="none"
              >
                <PinkDashedPath
                  d="M 60 86 C 60 86, 18 56, 18 32 C 18 16, 32 6, 46 6 C 54 6, 60 12, 60 18 C 60 12, 66 6, 74 6 C 88 6, 102 16, 102 32 C 102 56, 60 86, 60 86 Z"
                  dash="9 7"
                />
              </svg>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/silhouette-bunda-dashed.webp"
              alt="Panduan siluet garis putus-putus pink"
              className={`w-full select-none object-contain object-bottom transition-transform duration-300 ${
                isPortrait
                  ? 'max-h-[85%] max-w-[95%]'
                  : 'max-h-[92%] max-w-[78%]'
              } ${poseId === 'couple-belly' ? 'scale-x-[-1]' : ''}`}
            />
          </div>
        )}
      </div>

      {/* Pill Instruksi Singkat di Bawah Viewfinder */}
      <div className="mb-3 max-w-full rounded-full bg-black/55 px-4 py-1 text-center text-[10px] sm:text-[11px] font-semibold text-pink-100 backdrop-blur-xs border border-pink-300/30 truncate">
        Posisikan Bunda &amp; Pasangan mengikuti garis siluet putus-putus pink
      </div>
    </div>
  );
}

export function SelfieStudio() {
  const { session } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);

  // Dropdown aktif: 'pose' | 'frame' | 'text' | null (agar tidak memenuhi layar)
  const [openDropdown, setOpenDropdown] = useState<
    'pose' | 'frame' | 'text' | null
  >(null);

  // Orientasi Bingkai: otomatis Portrait di HP (<768px) & Landscape di Laptop (>=768px), namun bebas diubah user
  const [frameOrientation, setFrameOrientation] =
    useState<FrameOrientation>('landscape');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        setFrameOrientation('portrait');
      } else {
        setFrameOrientation('landscape');
      }
    }
  }, []);

  // Tutup dropdown saat klik di luar toolbar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [selectedPose, setSelectedPose] = useState<PoseGuide>(POSE_GUIDES[0]);
  const [showGuideOnPreview, setShowGuideOnPreview] = useState(true);
  const [includeGuideInDownload, setIncludeGuideInDownload] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<FramePreset>(
    FRAME_PRESETS[0]
  );

  // Edit Nama user di bingkai foto
  const [customUserName, setCustomUserName] = useState<string>(
    session?.name ? `${session.name} & Pasangan` : 'Bunda & Ayah'
  );
  const [customCaption, setCustomCaption] = useState<string>(
    session?.trimesterLabel
      ? `Bahagia Menanti Buah Hati • ${session.trimesterLabel}`
      : 'Bahagia Menanti Buah Hati Tercinta'
  );
  const [customDate, setCustomDate] = useState<string>(() =>
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  );
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (session?.name) {
      setCustomUserName(`${session.name} & Pasangan`);
    }
    if (session?.trimesterLabel) {
      setCustomCaption(`Bahagia Menanti Buah Hati • ${session.trimesterLabel}`);
    }
  }, [session?.name, session?.trimesterLabel]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Attach stream to video element safely whenever camera becomes active
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      const videoEl = videoRef.current;
      videoEl.srcObject = streamRef.current;
      videoEl.play().catch(() => {});
    }
  }, [isCameraActive]);

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    stopCamera();
    try {
      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error('Browser tidak mendukung akses kamera langsung.');
      }

      // Gunakan resolusi standar kelipatan 16 (1280x720) agar decoder hardware YUV420
      // di kamera HP Android tidak mengalami glitch layar separuh hijau (stride mismatch)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: false,
        });
      }

      streamRef.current = stream;
      setCapturedDataUrl(null);
      setIsCameraActive(true);
    } catch {
      setCameraError(
        'Kamera tidak ditemukan atau izin kamera belum diberikan. Bunda tetap dapat mengunggah foto dari galeri atau mencoba contoh foto.'
      );
    }
  };

  const captureFromVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const isPortrait = frameOrientation === 'portrait';
    const targetW = isPortrait ? 900 : 1440;
    const targetH = isPortrait ? 1200 : 900;
    const targetAspect = targetW / targetH;

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 720;
    const videoAspect = vw / vh;

    let sx = 0;
    let sy = 0;
    let sw = vw;
    let sh = vh;

    if (videoAspect > targetAspect) {
      sw = vh * targetAspect;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / targetAspect;
      sy = (vh - sh) / 2;
    }

    ctx.save();
    if (isMirrored) {
      ctx.translate(targetW, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, targetW, targetH);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedDataUrl(dataUrl);
    stopCamera();
  }, [frameOrientation, isMirrored, stopCamera]);

  const triggerCountdownCapture = () => {
    if (!isCameraActive) return;
    setCountdown(3);
    let current = 3;
    const interval = window.setInterval(() => {
      current -= 1;
      if (current <= 0) {
        window.clearInterval(interval);
        setCountdown(null);
        captureFromVideo();
      } else {
        setCountdown(current);
      }
    }, 850);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCapturedDataUrl(reader.result);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  // Buat foto simulasi hangat Bunda & Pasangan sesuai orientasi (Portrait / Landscape)
  const generateSampleCouplePhoto = (
    targetOrientation: FrameOrientation = frameOrientation
  ) => {
    stopCamera();
    const isPortrait = targetOrientation === 'portrait';
    const W = isPortrait ? 900 : 1440;
    const H = isPortrait ? 1200 : 900;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#FFF4F8');
    grad.addColorStop(0.55, '#FFFAF4');
    grad.addColorStop(1, '#F2F6E6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(245, 175, 185, 0.25)';
    ctx.beginPath();
    ctx.arc(W * 0.2, H * 0.22, 130, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(168, 179, 113, 0.22)';
    ctx.beginPath();
    ctx.arc(W * 0.82, H * 0.25, 150, 0, Math.PI * 2);
    ctx.fill();

    const cxLeft = isPortrait ? W * 0.38 : W * 0.4;
    const cxRight = isPortrait ? W * 0.62 : W * 0.6;
    const headYLeft = isPortrait ? H * 0.42 : H * 0.41;
    const headYRight = isPortrait ? H * 0.48 : H * 0.47;
    const bodyY = isPortrait ? H * 0.84 : H * 0.86;

    // Ayah (Kiri)
    ctx.fillStyle = '#A8B371';
    ctx.beginPath();
    ctx.arc(cxLeft, bodyY, 200, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#FFE8DC';
    ctx.beginPath();
    ctx.arc(cxLeft, headYLeft, 88, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2A2D22';
    ctx.beginPath();
    ctx.arc(cxLeft, headYLeft - 18, 90, Math.PI, 0, false);
    ctx.fill();

    ctx.strokeStyle = '#2A2D22';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cxLeft, headYLeft + 14, 26, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    // Bunda (Kanan bersandar)
    ctx.fillStyle = '#F5AFB9';
    ctx.beginPath();
    ctx.arc(cxRight, bodyY + 15, 190, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#C84B71';
    ctx.beginPath();
    ctx.arc(cxRight, headYRight, 96, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFF0E8';
    ctx.beginPath();
    ctx.arc(cxRight, headYRight, 76, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#2A2D22';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cxRight, headYRight + 12, 22, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    setCapturedDataUrl(canvas.toDataURL('image/png'));
  };

  // Download hasil foto beserta bingkai & nama sesuai orientasi (Portrait / Landscape)
  const handleDownloadFramedPhoto = async () => {
    const isPortrait = frameOrientation === 'portrait';
    const W = isPortrait ? 1080 : 1480;
    const H = isPortrait ? 1520 : 1220;
    const photoX = 90;
    const photoY = 165;
    const photoW = W - 180;
    const photoH = isPortrait ? 1120 : 810;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background Bingkai Utama
    ctx.fillStyle = selectedFrame.bgBadgeHex;
    ctx.fillRect(0, 0, W, H);

    // 2. Border Dekoratif Luar
    ctx.strokeStyle = selectedFrame.borderHex;
    ctx.lineWidth = 28;
    ctx.strokeRect(24, 24, W - 48, H - 48);

    // 3. Header Bingkai Atas (BUNA CERIA)
    ctx.fillStyle = selectedFrame.accentHex;
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BUNA CERIA', W / 2, 92);

    ctx.fillStyle = '#6E6A6C';
    ctx.font = '22px sans-serif';
    ctx.fillText('Momen Bahagia Kehamilan Pertama', W / 2, 128);

    // 4. Area Foto Utama (Sesuai Portrait / Landscape)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoW, photoH, 32);
    ctx.clip();

    if (capturedDataUrl) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = capturedDataUrl;
      });
      const iw = img.width || photoW;
      const ih = img.height || photoH;
      const imgAspect = iw / ih;
      const targetAspect = photoW / photoH;

      let sx = 0;
      let sy = 0;
      let sw = iw;
      let sh = ih;
      if (imgAspect > targetAspect) {
        sw = ih * targetAspect;
        sx = (iw - sw) / 2;
      } else {
        sh = iw / targetAspect;
        sy = (ih - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
    } else {
      ctx.fillStyle = '#FDF2F5';
      ctx.fillRect(photoX, photoY, photoW, photoH);
    }

    if (includeGuideInDownload) {
      const silImg = new window.Image();
      silImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        silImg.onload = () => resolve();
        silImg.onerror = () => resolve();
        silImg.src = '/silhouette-bunda-dashed.webp';
      });
      if (silImg.width > 0) {
        const silAspect = silImg.width / silImg.height;
        const drawH = photoH * 0.85;
        const drawW = drawH * silAspect;
        const drawX = photoX + (photoW - drawW) / 2;
        const drawY = photoY + photoH - drawH;
        ctx.drawImage(silImg, drawX, drawY, drawW, drawH);
      }
    }
    ctx.restore();

    ctx.strokeStyle = selectedFrame.borderHex;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoW, photoH, 32);
    ctx.stroke();

    // 5. Area Bawah Bingkai: Nama User & Pasangan + Caption + Tanggal
    ctx.fillStyle = selectedFrame.textHex;
    ctx.font = 'bold 44px serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      customUserName.trim() || 'Bunda & Pasangan',
      W / 2,
      photoY + photoH + 78
    );

    ctx.fillStyle = selectedFrame.accentHex;
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(
      customCaption.trim() || 'Bahagia Menanti Buah Hati',
      W / 2,
      photoY + photoH + 124
    );

    ctx.fillStyle = '#767A6E';
    ctx.font = '21px sans-serif';
    ctx.fillText(customDate, W / 2, photoY + photoH + 166);

    // 6. Trigger Download File PNG
    const finalUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeFileName = (customUserName || 'buna-ceria')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    link.download = `foto-selfie-${frameOrientation}-${safeFileName}.png`;
    link.href = finalUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    window.setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const activePoseInstruction =
    frameOrientation === 'portrait'
      ? selectedPose.instructionPortrait
      : selectedPose.instructionLandscape;

  return (
    <div className="space-y-5 sm:space-y-6 w-full">
      {/* Header Banner Fitur Take Selfie */}
      <div className="rounded-[24px] border border-[#F5DCE4] bg-white p-5 sm:p-7 shadow-[0_8px_28px_rgba(200,75,113,0.06)] transition-all duration-300 hover:shadow-[0_12px_34px_rgba(200,75,113,0.1)]">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-heading text-xl sm:text-3xl font-bold text-[#2A2D22]">
              Abadikan Momen Kehamilan Bunda &amp; Pasangan
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#6E6A6C]">
              Pilih orientasi bingkai <strong>Portrait (HP)</strong> atau{' '}
              <strong>Landscape (Full Layar)</strong>, atur gaya siluet, tema
              bingkai, serta nama melalui menu dropdown di bawah, lalu unduh
              fotonya.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 shrink-0">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={() => startCamera()}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-gradient-to-r from-[#C84B71] to-[#E46C8E] px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-[0_6px_18px_rgba(200,75,113,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(200,75,113,0.38)] active:scale-95 cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <span>Buka Kamera Selfie</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-2 text-xs sm:text-sm font-bold text-[#C84B71] hover:bg-pink-50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>Matikan Kamera</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#F5DCE4] bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#2A2D22] hover:bg-[#FFF5F8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 cursor-pointer"
            >
              <Upload className="h-4 w-4 text-[#56632A]" />
              <span>Unggah Foto</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {cameraError && (
        <div className="rounded-[20px] border border-amber-200 bg-amber-50/90 p-4 text-xs sm:text-sm text-amber-900 flex flex-col sm:flex-row items-center text-center sm:text-left justify-between gap-3">
          <span>{cameraError}</span>
          <button
            type="button"
            onClick={() => generateSampleCouplePhoto()}
            className="shrink-0 rounded-full bg-[#56632A] px-4 py-2 text-xs font-bold text-white hover:bg-[#434e20] transition-all active:scale-95 cursor-pointer"
          >
            Gunakan Contoh Foto Pasangan
          </button>
        </div>
      )}

      {/* =====================================================================
          TOP DROPDOWN CONTROL BAR (Menghemat Tempat agar Frame Landscape Full 1 Layar)
         ===================================================================== */}
      <div
        ref={toolbarRef}
        className="relative z-30 rounded-[22px] border border-[#F5DCE4] bg-white p-3.5 sm:p-4 shadow-[0_6px_24px_rgba(200,75,113,0.06)]"
      >
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-2.5">
          {/* Switcher Orientasi: Portrait vs Landscape (Full Layar) */}
          <div className="inline-flex items-center rounded-full border border-[#F5DCE4] bg-[#FFF5F8] p-1">
            <button
              type="button"
              onClick={() => setFrameOrientation('portrait')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                frameOrientation === 'portrait'
                  ? 'bg-[#C84B71] text-white shadow-2xs'
                  : 'text-[#6E6A6C] hover:text-[#2A2D22]'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Portrait (HP)</span>
            </button>
            <button
              type="button"
              onClick={() => setFrameOrientation('landscape')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                frameOrientation === 'landscape'
                  ? 'bg-[#56632A] text-white shadow-2xs'
                  : 'text-[#6E6A6C] hover:text-[#2A2D22]'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Landscape (Full Layar)</span>
            </button>
          </div>

          {/* 3 Dropdown Pengaturan: Petunjuk Gaya, Tema Bingkai Foto, Edit Nama di Bingkai Foto */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {/* DROPDOWN 1: PETUNJUK GAYA */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'pose' ? null : 'pose'))
                }
                aria-expanded={openDropdown === 'pose'}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                  openDropdown === 'pose'
                    ? 'border-[#C84B71] bg-[#FDF2F5] text-[#C84B71] shadow-sm'
                    : 'border-[#F5DCE4] bg-[#FFF9FB] text-[#2A2D22] hover:border-pink-300'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#C84B71]" />
                <span>Petunjuk Gaya: {selectedPose.shortLabel}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    openDropdown === 'pose' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'pose' && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[310px] sm:w-[350px] rounded-[22px] border border-[#F5DCE4] bg-white p-4 shadow-[0_18px_42px_rgba(200,75,113,0.18)] z-50 space-y-3 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-sm font-bold text-[#2A2D22]">
                      Pilih Petunjuk Gaya Siluet
                    </span>
                    <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#56632A] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showGuideOnPreview}
                        onChange={(e) =>
                          setShowGuideOnPreview(e.target.checked)
                        }
                        className="rounded accent-[#C84B71]"
                      />
                      <span>Tampilkan Siluet</span>
                    </label>
                  </div>

                  <p className="rounded-xl border border-pink-100 bg-[#FFF5F8] p-2.5 text-[11px] leading-relaxed text-[#4A4D40]">
                    {activePoseInstruction}
                  </p>

                  <div className="space-y-1.5">
                    {POSE_GUIDES.map((pose) => {
                      const active = selectedPose.id === pose.id;
                      return (
                        <button
                          key={pose.id}
                          type="button"
                          onClick={() => {
                            setSelectedPose(pose);
                            setShowGuideOnPreview(true);
                            setOpenDropdown(null);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                            active
                              ? 'border-[#C84B71] bg-[#FDF2F5] text-[#C84B71] font-bold'
                              : 'border-[#F5DCE4] bg-white text-[#2A2D22] hover:bg-[#FFF5F8]'
                          }`}
                        >
                          <span>{pose.label}</span>
                          {active && <Check className="h-4 w-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* DROPDOWN 2: TEMA BINGKAI FOTO */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'frame' ? null : 'frame'))
                }
                aria-expanded={openDropdown === 'frame'}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                  openDropdown === 'frame'
                    ? 'border-[#C84B71] bg-[#FDF2F5] text-[#C84B71] shadow-sm'
                    : 'border-[#F5DCE4] bg-[#FFF9FB] text-[#2A2D22] hover:border-pink-300'
                }`}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border shrink-0"
                  style={{
                    backgroundColor: selectedFrame.borderHex,
                    borderColor: selectedFrame.accentHex,
                  }}
                />
                <span>Tema Bingkai: {selectedFrame.name}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    openDropdown === 'frame' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'frame' && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[290px] sm:w-[320px] rounded-[22px] border border-[#F5DCE4] bg-white p-4 shadow-[0_18px_42px_rgba(200,75,113,0.18)] z-50 space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-[#56632A]" />
                    <span className="font-heading text-sm font-bold text-[#2A2D22]">
                      Pilih Tema Bingkai Foto
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {FRAME_PRESETS.map((frame) => {
                      const active = selectedFrame.id === frame.id;
                      return (
                        <button
                          key={frame.id}
                          type="button"
                          onClick={() => {
                            setSelectedFrame(frame);
                            setOpenDropdown(null);
                          }}
                          className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs font-semibold transition-all cursor-pointer ${
                            active
                              ? 'border-[#C84B71] bg-[#FDF2F5] text-[#C84B71] font-bold'
                              : 'border-[#F5DCE4] bg-white hover:bg-[#FFF5F8]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="h-5 w-5 shrink-0 rounded-full border"
                              style={{
                                backgroundColor: frame.borderHex,
                                borderColor: frame.accentHex,
                              }}
                            />
                            <span>{frame.name}</span>
                          </div>
                          {active && <Check className="h-4 w-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* DROPDOWN 3: EDIT NAMA DI BINGKAI FOTO */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'text' ? null : 'text'))
                }
                aria-expanded={openDropdown === 'text'}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                  openDropdown === 'text'
                    ? 'border-[#C84B71] bg-[#FDF2F5] text-[#C84B71] shadow-sm'
                    : 'border-[#F5DCE4] bg-[#FFF9FB] text-[#2A2D22] hover:border-pink-300'
                }`}
              >
                <Type className="h-3.5 w-3.5 text-[#C84B71]" />
                <span>Edit Nama di Bingkai Foto</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    openDropdown === 'text' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'text' && (
                <div className="absolute right-0 mt-2 w-[300px] sm:w-[340px] rounded-[22px] border border-[#F5DCE4] bg-white p-4 shadow-[0_18px_42px_rgba(200,75,113,0.18)] z-50 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-bold text-[#2A2D22]">
                      Edit Nama &amp; Pesan di Bingkai
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(null)}
                      className="text-[11px] font-bold text-[#C84B71] hover:underline cursor-pointer"
                    >
                      Selesai
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="selfie-user-name"
                      className="block text-xs font-bold text-[#2A2D22]"
                    >
                      Nama Bunda &amp; Pasangan
                    </label>
                    <input
                      id="selfie-user-name"
                      type="text"
                      value={customUserName}
                      onChange={(e) => setCustomUserName(e.target.value)}
                      placeholder="Contoh: Bunda Nadia & Ayah Reza"
                      className="mt-1 w-full rounded-xl border border-[#F5DCE4] bg-[#FFF5F8] px-3 py-2 text-xs font-semibold text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="selfie-caption"
                      className="block text-xs font-bold text-[#2A2D22]"
                    >
                      Pesan / Usia Kehamilan
                    </label>
                    <input
                      id="selfie-caption"
                      type="text"
                      value={customCaption}
                      onChange={(e) => setCustomCaption(e.target.value)}
                      placeholder="Contoh: Bahagia Menanti Buah Hati • Trimester 2"
                      className="mt-1 w-full rounded-xl border border-[#F5DCE4] bg-[#FFF5F8] px-3 py-2 text-xs text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="selfie-date"
                      className="block text-xs font-bold text-[#2A2D22]"
                    >
                      Tanggal Momen
                    </label>
                    <input
                      id="selfie-date"
                      type="text"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#F5DCE4] bg-[#FFF5F8] px-3 py-2 text-xs text-[#6E6A6C] focus:border-[#C84B71] focus:bg-white outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          KARTU POLAROID BINGKAI FOTO:
          - Mode Landscape: FULL SATU LAYAR (w-full max-w-none)
          - Mode Portrait: Proporsional Vertikal di Tengah (max-w-[440px])
         ===================================================================== */}
      <div className="flex flex-col items-center w-full">
        <div
          className={`w-full rounded-[30px] border-4 p-4 sm:p-7 shadow-[0_14px_40px_rgba(200,75,113,0.1)] transition-all duration-300 ${
            frameOrientation === 'portrait'
              ? 'max-w-[400px] sm:max-w-[440px] mx-auto'
              : 'max-w-none'
          } ${selectedFrame.previewClass}`}
        >
          {/* Header Bingkai */}
          <div className="text-center pb-3.5">
            <span
              className="block text-xs sm:text-sm font-extrabold uppercase tracking-[0.22em]"
              style={{ color: selectedFrame.accentHex }}
            >
              BUNA CERIA
            </span>
            <span className="text-[11px] sm:text-xs text-[#6E6A6C]">
              Momen Bahagia Kehamilan Pertama
            </span>
          </div>

          {/* Area Viewfinder / Foto (Portrait 3:4 atau Landscape Full 16:10 / 16:9) */}
          <div
            className={`relative w-full overflow-hidden rounded-[22px] border-2 border-white bg-[#1F1B1D] shadow-inner flex items-center justify-center transition-all duration-300 ${
              frameOrientation === 'portrait'
                ? 'aspect-[3/4]'
                : 'aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9]'
            }`}
          >
            {isCameraActive ? (
              <div
                className="h-full w-full overflow-hidden bg-black"
                style={{
                  transform: isMirrored ? 'scaleX(-1)' : 'none',
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  disablePictureInPicture
                  className="h-full w-full object-cover"
                />
              </div>
            ) : capturedDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={capturedDataUrl}
                alt="Pratinjau foto selfie Bunda dan pasangan"
                className="h-full w-full object-cover"
              />
            ) : (
              /* IDLE STATE: Menampilkan Siluet Garis Putus-Putus Pink Seperti Contoh Client + Tombol Mulai */
              <div className="relative h-full w-full flex flex-col items-center justify-between p-4 sm:p-6 text-center bg-[#181517]">
                <div className="z-30 mt-1 flex flex-col items-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md border border-pink-300/30 px-3.5 py-1 text-[11px] font-bold text-pink-200 mb-2">
                    <Users className="h-3.5 w-3.5 text-pink-300" />
                    <span>
                      {frameOrientation === 'portrait'
                        ? 'Bingkai Portrait (HP)'
                        : 'Bingkai Landscape (Full Satu Layar)'}
                    </span>
                  </span>
                  <p className="font-heading text-sm sm:text-lg font-bold text-white drop-shadow-xs">
                    Ikuti Garis Putus-Putus Pink untuk Posisi Foto Terbaik
                  </p>
                </div>

                {/* Tombol Mulai Kamera / Contoh Foto di Tengah Atas */}
                <div className="z-30 my-auto flex flex-wrap justify-center gap-2.5 bg-black/45 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C84B71] to-[#E46C8E] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Nyalakan Kamera</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => generateSampleCouplePhoto()}
                    className="inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-white/95 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#2A2D22] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-95 cursor-pointer"
                  >
                    <span>Coba Contoh Foto</span>
                  </button>
                </div>

                <div className="h-4" />
              </div>
            )}

            {/* OVERLAY GARIS PUTUS-PUTUS PINK: Tampil di Kamera, Preview, maupun Idle Viewfinder */}
            <DashedSilhouetteOverlay
              poseId={selectedPose.id}
              orientation={frameOrientation}
              visible={showGuideOnPreview}
            />

            {/* Hitung Mundur Kamera */}
            {countdown !== null && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
                <span className="font-heading text-7xl font-extrabold text-white drop-shadow-lg animate-ping">
                  {countdown}
                </span>
              </div>
            )}
          </div>

          {/* Footer Bingkai: Nama Bunda & Pasangan */}
          <div className="pt-4 sm:pt-5 text-center space-y-1">
            <h3 className="font-heading text-lg sm:text-2xl font-bold text-[#2A2D22] break-words leading-snug">
              {customUserName || 'Bunda & Pasangan'}
            </h3>
            <p
              className="text-xs sm:text-sm font-bold"
              style={{ color: selectedFrame.accentHex }}
            >
              {customCaption || 'Bahagia Menanti Buah Hati'}
            </p>
            <p className="text-[11px] text-[#767A6E]">{customDate}</p>
          </div>
        </div>

        {/* =====================================================================
            BAR TOMBOL AKSI KAMERA & UNDUH FOTO DI BAWAH BINGKAI
           ===================================================================== */}
        <div className="mt-5 w-full rounded-[24px] border border-[#F5DCE4] bg-white p-4 sm:p-5 shadow-[0_8px_28px_rgba(200,75,113,0.06)] flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Kiri: Tombol Kontrol Kamera */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {isCameraActive ? (
              <>
                <button
                  type="button"
                  onClick={captureFromVideo}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-[#C84B71] to-[#E46C8E] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span>Ambil Foto Sekarang</span>
                </button>

                <button
                  type="button"
                  onClick={triggerCountdownCapture}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#56632A] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#434e20] active:scale-95 cursor-pointer"
                >
                  <span>Timer 3 Detik</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMirrored((prev) => !prev)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-[#F5DCE4] bg-[#FFF5F8] px-3.5 py-2 text-xs font-semibold text-[#2A2D22] hover:bg-white transition-all active:scale-95 cursor-pointer"
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  <span>Mirror</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextMode =
                      facingMode === 'user' ? 'environment' : 'user';
                    setFacingMode(nextMode);
                    startCamera(nextMode);
                  }}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-[#F5DCE4] bg-[#FFF5F8] px-3.5 py-2 text-xs font-semibold text-[#2A2D22] hover:bg-white transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Balik Kamera</span>
                </button>
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-pink-200 bg-[#FFF5F8] px-4 py-2 text-xs font-bold text-[#C84B71] hover:bg-pink-100/60 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>
                    {capturedDataUrl ? 'Foto Ulang Kamera' : 'Nyalakan Kamera'}
                  </span>
                </button>
                <label className="inline-flex items-center gap-2 text-xs font-medium text-[#6E6A6C] cursor-pointer px-2">
                  <input
                    type="checkbox"
                    checked={includeGuideInDownload}
                    onChange={(e) =>
                      setIncludeGuideInDownload(e.target.checked)
                    }
                    className="rounded accent-[#C84B71]"
                  />
                  <span>Sertakan siluet putus-putus saat unduh</span>
                </label>
              </div>
            )}
          </div>

          {/* Kanan: Tombol Download Hasil Foto */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {downloadSuccess && (
              <p className="text-xs font-bold text-green-700 flex items-center gap-1">
                <Heart className="h-3.5 w-3.5 fill-green-700" />
                <span>Foto berhasil diunduh!</span>
              </p>
            )}

            <button
              type="button"
              onClick={handleDownloadFramedPhoto}
              className="flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C84B71] to-[#E46C8E] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_8px_22px_rgba(200,75,113,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(200,75,113,0.38)] active:scale-95 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>
                Download Foto{' '}
                {frameOrientation === 'portrait' ? 'Portrait' : 'Landscape'}{' '}
                (PNG)
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
