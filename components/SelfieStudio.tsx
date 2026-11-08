'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  Download,
  FlipHorizontal,
  Heart,
  Image as ImageIcon,
  Monitor,
  RefreshCw,
  Smartphone,
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
    label: 'Gaya 1: Berdampingan (Bunda & Pasangan)',
    shortLabel: 'Berdampingan',
    instructionPortrait:
      'Mode Portrait (HP): Rapatkan bahu Bunda & Pasangan di tengah bingkai vertikal agar wajah keduanya masuk rapi di dalam garis putus-putus.',
    instructionLandscape:
      'Mode Landscape (Laptop/Lanskap): Duduk atau berdiri berdampingan sejajar bahu mengisi ruang kiri dan kanan bingkai horizontal.',
  },
  {
    id: 'couple-belly',
    label: 'Gaya 2: Merangkul Buah Hati',
    shortLabel: 'Merangkul Perut',
    instructionPortrait:
      'Mode Portrait (HP): Posisikan Bunda sedikit di depan dan Pasangan merangkul hangat dari belakang/samping mengikuti siluet vertikal.',
    instructionLandscape:
      'Mode Landscape (Laptop/Lanskap): Bunda di sisi kiri memegang perut dan Pasangan merangkul hangat dari sisi kanan.',
  },
  {
    id: 'couple-heart',
    label: 'Gaya 3: Senyum Dekat Berdua',
    shortLabel: 'Senyum Dekat',
    instructionPortrait:
      'Mode Portrait (HP): Dekatkan kepala Bunda & Pasangan di bagian tengah bingkai vertikal di bawah ikon hati putus-putus.',
    instructionLandscape:
      'Mode Landscape (Laptop/Lanskap): Dekatkan kepala Bunda & Pasangan di tengah bingkai lebar mengikuti lengkungan garis putus-putus.',
  },
  {
    id: 'single-bunda',
    label: 'Gaya 4: Siluet Bunda Ceria',
    shortLabel: 'Bunda Sendiri',
    instructionPortrait:
      'Mode Portrait (HP): Posisikan kepala dan bahu Bunda tepat di tengah bingkai vertikal mengikuti garis siluet putus-putus.',
    instructionLandscape:
      'Mode Landscape (Laptop/Lanskap): Posisikan kepala dan bahu Bunda tepat di tengah bingkai horizontal dengan latar yang lega.',
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

// Helper menggambar path dua lapis (Halo Putih + Garis Putus-putus Gelap) tanpa CSS filter
// agar jelas di latar gelap maupun terang dan bebas bug GPU mobile Android
function DualDashedPath({
  d,
  innerColor = '#2A2D22',
  dash = '14 12',
}: {
  d: string;
  innerColor?: string;
  dash?: string;
}) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d={d}
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="10"
        strokeDasharray={dash}
      />
      <path
        d={d}
        stroke={innerColor}
        strokeWidth="5.5"
        strokeDasharray={dash}
      />
    </g>
  );
}

function DualDashedCircle({
  cx,
  cy,
  r,
  innerColor = '#2A2D22',
  dash = '14 12',
}: {
  cx: number;
  cy: number;
  r: number;
  innerColor?: string;
  dash?: string;
}) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="10"
        strokeDasharray={dash}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={innerColor}
        strokeWidth="5.5"
        strokeDasharray={dash}
      />
    </g>
  );
}

// Komponen SVG Garis Putus-putus Siluet Tubuh yang menyesuaikan Portrait vs Landscape
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
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between p-3 sm:p-4"
    >
      {/* Badge Mode Orientasi di Pojok Atas Viewfinder */}
      <div className="self-center rounded-full bg-black/45 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-white backdrop-blur-xs">
        {isPortrait
          ? 'Panduan Portrait (Vertikal)'
          : 'Panduan Landscape (Horizontal)'}
      </div>

      {/* SVG Siluet Proporsional sesuai Portrait (360x460) atau Landscape (520x380) */}
      <div className="flex-1 w-full flex items-center justify-center min-h-0 py-1">
        {isPortrait ? (
          /* ================= SILUET MODE PORTRAIT (HP VERTIKAL 3:4) ================= */
          <svg
            viewBox="0 0 360 460"
            className="h-full w-full max-h-[340px] max-w-[280px]"
            fill="none"
          >
            {poseId === 'single-bunda' && (
              <>
                <DualDashedPath d="M 128 165 C 125 112, 150 82, 180 82 C 210 82, 235 112, 232 165 C 240 168, 240 186, 230 190 C 224 218, 210 234, 200 242 L 204 262 L 275 288 C 302 300, 316 335, 320 410" />
                <DualDashedPath d="M 128 165 C 120 168, 120 186, 130 190 C 136 218, 150 234, 160 242 L 156 262 L 85 288 C 58 300, 44 335, 40 410" />
              </>
            )}

            {poseId === 'couple-side' && (
              /* Portrait Berdampingan: Bahu lebih rapat agar pas di layar vertikal HP */
              <>
                {/* Bunda (Kiri-Depan) */}
                <DualDashedPath d="M 78 190 C 76 146, 96 120, 124 120 C 152 120, 172 146, 170 190 C 166 218, 152 234, 142 242 L 145 260 L 198 282" />
                <DualDashedPath d="M 78 190 C 82 218, 96 234, 106 242 L 103 260 L 46 284 C 30 296, 22 330, 18 410" />
                {/* Pasangan (Kanan-Belakang) */}
                <DualDashedPath d="M 190 164 C 188 118, 210 90, 238 90 C 266 90, 288 118, 286 164 C 282 194, 268 212, 256 222 L 260 242 L 316 268 C 332 280, 340 318, 344 410" />
                <DualDashedPath d="M 190 164 C 194 194, 208 212, 220 222 L 216 242 L 172 264" />
              </>
            )}

            {poseId === 'couple-belly' && (
              <>
                <DualDashedCircle cx={125} cy={162} r={40} />
                <DualDashedPath d="M 48 410 C 54 318, 80 268, 125 268 C 162 268, 186 300, 194 370" />
                <DualDashedCircle cx={236} cy={138} r={44} />
                <DualDashedPath d="M 172 340 C 182 276, 204 248, 240 248 C 284 248, 310 302, 316 410" />
                <DualDashedPath
                  d="M 180 390 C 180 390, 148 364, 148 344 C 148 330, 160 322, 170 322 C 176 322, 180 327, 180 332 C 180 327, 184 322, 190 322 C 200 322, 212 330, 212 344 C 212 364, 180 390, 180 390 Z"
                  innerColor="#C84B71"
                  dash="9 7"
                />
              </>
            )}

            {poseId === 'couple-heart' && (
              <>
                <DualDashedCircle cx={132} cy={188} r={40} />
                <DualDashedPath d="M 50 410 C 58 322, 88 278, 136 278 C 165 278, 180 296, 186 328" />
                <DualDashedCircle cx={228} cy={180} r={43} />
                <DualDashedPath d="M 176 328 C 186 290, 204 272, 232 272 C 276 272, 304 320, 312 410" />
                <DualDashedPath
                  d="M 180 120 C 180 120, 152 96, 152 78 C 152 64, 164 56, 172 56 C 177 56, 180 60, 180 65 C 180 60, 183 56, 188 56 C 196 56, 208 64, 208 78 C 208 96, 180 120, 180 120 Z"
                  innerColor="#C84B71"
                  dash="9 7"
                />
              </>
            )}
          </svg>
        ) : (
          /* ================= SILUET MODE LANDSCAPE (LAPTOP / HORIZONTAL 4:3) ================= */
          <svg
            viewBox="0 0 520 380"
            className="h-full w-full max-h-[290px] max-w-[420px]"
            fill="none"
          >
            {poseId === 'single-bunda' && (
              <>
                <DualDashedPath d="M 208 140 C 205 88, 230 58, 260 58 C 290 58, 315 88, 312 140 C 320 144, 320 162, 310 166 C 304 196, 290 212, 280 220 L 284 238 L 365 264 C 396 276, 412 308, 418 360" />
                <DualDashedPath d="M 208 140 C 200 144, 200 162, 210 166 C 216 196, 230 212, 240 220 L 236 238 L 155 264 C 124 276, 108 308, 102 360" />
              </>
            )}

            {poseId === 'couple-side' && (
              /* Landscape Berdampingan: Rentang bahu lebar mengisi frame horizontal 4:3 */
              <>
                {/* Bunda (Sisi Kiri) */}
                <DualDashedPath d="M 134 152 C 132 108, 154 84, 182 84 C 210 84, 232 108, 230 152 C 226 180, 212 198, 200 206 L 204 224 L 262 246" />
                <DualDashedPath d="M 134 152 C 138 180, 152 198, 164 206 L 160 224 L 92 248 C 70 258, 56 292, 50 360" />
                {/* Pasangan (Sisi Kanan) */}
                <DualDashedPath d="M 288 134 C 286 88, 310 62, 340 62 C 370 62, 394 88, 392 134 C 388 164, 372 184, 360 194 L 364 214 L 432 240 C 454 252, 468 286, 474 360" />
                <DualDashedPath d="M 288 134 C 292 164, 308 184, 320 194 L 316 214 L 254 240" />
              </>
            )}

            {poseId === 'couple-belly' && (
              <>
                <DualDashedCircle cx={186} cy={126} r={40} />
                <DualDashedPath d="M 98 355 C 106 272, 136 230, 186 230 C 226 230, 252 258, 262 325" />
                <DualDashedCircle cx={334} cy={108} r={44} />
                <DualDashedPath d="M 252 300 C 264 240, 292 214, 338 214 C 390 214, 420 262, 428 355" />
                <DualDashedPath
                  d="M 260 335 C 260 335, 226 308, 226 288 C 226 274, 238 266, 248 266 C 255 266, 260 271, 260 276 C 260 271, 265 266, 272 266 C 282 266, 294 274, 294 288 C 294 308, 260 335, 260 335 Z"
                  innerColor="#C84B71"
                  dash="9 7"
                />
              </>
            )}

            {poseId === 'couple-heart' && (
              <>
                <DualDashedCircle cx={200} cy={152} r={42} />
                <DualDashedPath d="M 108 355 C 118 278, 152 238, 206 238 C 236 238, 254 256, 260 286" />
                <DualDashedCircle cx={320} cy={144} r={45} />
                <DualDashedPath d="M 250 286 C 262 250, 284 232, 322 232 C 374 232, 406 276, 416 355" />
                <DualDashedPath
                  d="M 260 92 C 260 92, 232 70, 232 54 C 232 42, 242 34, 251 34 C 256 34, 260 38, 260 42 C 260 38, 264 34, 269 34 C 278 34, 288 42, 288 54 C 288 70, 260 92, 260 92 Z"
                  innerColor="#C84B71"
                  dash="9 7"
                />
              </>
            )}
          </svg>
        )}
      </div>

      {/* Pill Instruksi Singkat di Bawah Viewfinder */}
      <div className="max-w-full rounded-full bg-white/92 px-3.5 py-1 text-center text-[10px] sm:text-[11px] font-bold text-[#2A2D22] shadow-xs border border-pink-200 truncate">
        Posisikan Bunda &amp; Pasangan mengikuti garis putus-putus
      </div>
    </div>
  );
}

export function SelfieStudio() {
  const { session } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);

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

  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [selectedPose, setSelectedPose] = useState<PoseGuide>(POSE_GUIDES[0]);
  const [showGuideOnPreview, setShowGuideOnPreview] = useState(true);
  const [includeGuideInDownload, setIncludeGuideInDownload] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<FramePreset>(
    FRAME_PRESETS[0]
  );

  // Item 18: Edit Nama user di bingkai foto
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
        // Fallback ke stream kamera native tanpa pemaksaan dimensi
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
    const targetW = isPortrait ? 900 : 1200;
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
    const W = isPortrait ? 900 : 1200;
    const H = isPortrait ? 1200 : 900;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#FFF5F7');
    grad.addColorStop(0.55, '#FFFAF0');
    grad.addColorStop(1, '#F2F6E4');
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

    const cxLeft = isPortrait ? W * 0.38 : W * 0.39;
    const cxRight = isPortrait ? W * 0.62 : W * 0.61;
    const headYRight = isPortrait ? H * 0.42 : H * 0.41;
    const headYLeft = isPortrait ? H * 0.46 : H * 0.45;
    const bodyY = isPortrait ? H * 0.82 : H * 0.84;

    // Ayah (Kanan)
    ctx.fillStyle = '#A8B371';
    ctx.beginPath();
    ctx.arc(cxRight, bodyY, 195, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#FFE8DC';
    ctx.beginPath();
    ctx.arc(cxRight, headYRight, 88, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2A2D22';
    ctx.beginPath();
    ctx.arc(cxRight, headYRight - 18, 90, Math.PI, 0, false);
    ctx.fill();

    ctx.strokeStyle = '#2A2D22';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cxRight, headYRight + 14, 26, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    // Bunda (Kiri)
    ctx.fillStyle = '#F5AFB9';
    ctx.beginPath();
    ctx.arc(cxLeft, bodyY + 15, 185, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#C84B71';
    ctx.beginPath();
    ctx.arc(cxLeft, headYLeft, 96, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFF0E8';
    ctx.beginPath();
    ctx.arc(cxLeft, headYLeft, 76, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#2A2D22';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cxLeft, headYLeft + 12, 22, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    // Hati di tengah atas
    const hx = W / 2;
    const hy = isPortrait ? H * 0.26 : H * 0.25;
    ctx.fillStyle = '#C84B71';
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.bezierCurveTo(hx, hy - 8, hx - 15, hy - 25, hx - 32, hy - 25);
    ctx.bezierCurveTo(hx - 55, hy - 25, hx - 55, hy + 5, hx - 55, hy + 5);
    ctx.bezierCurveTo(hx - 55, hy + 28, hx, hy + 55, hx, hy + 55);
    ctx.bezierCurveTo(hx, hy + 55, hx + 55, hy + 28, hx + 55, hy + 5);
    ctx.bezierCurveTo(hx + 55, hy + 5, hx + 55, hy - 25, hx + 32, hy - 25);
    ctx.bezierCurveTo(hx + 15, hy - 25, hx, hy - 8, hx, hy);
    ctx.fill();

    setCapturedDataUrl(canvas.toDataURL('image/png'));
  };

  // Item 19: Download hasil foto beserta bingkai & nama sesuai orientasi (Portrait / Landscape)
  const handleDownloadFramedPhoto = async () => {
    const isPortrait = frameOrientation === 'portrait';
    const W = isPortrait ? 1080 : 1360;
    const H = isPortrait ? 1520 : 1220;
    const photoX = 90;
    const photoY = 165;
    const photoW = W - 180; // 900 (Portrait) atau 1180 (Landscape)
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

    // 3. Header Bingkai Atas
    ctx.fillStyle = selectedFrame.accentHex;
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BUNA CERIA • TEMAN KASIH', W / 2, 92);

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
      ctx.strokeStyle = 'rgba(31, 36, 27, 0.65)';
      ctx.lineWidth = 10;
      ctx.setLineDash([24, 18]);
      ctx.beginPath();
      ctx.arc(W / 2 - 140, photoY + photoH * 0.38, 90, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(W / 2 + 140, photoY + photoH * 0.35, 100, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
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
    <div className="space-y-5 sm:space-y-6">
      {/* Header Banner Fitur Take Selfie */}
      <div className="rounded-[24px] border border-[#ECE7F2] bg-[#FAF8F6] p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-heading text-xl sm:text-3xl font-bold text-[#2A2D22]">
              Abadikan Momen Kehamilan Bunda &amp; Pasangan
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#6E6A6C]">
              Pilih orientasi bingkai <strong>Portrait (HP)</strong> atau{' '}
              <strong>Landscape (Laptop/Lanskap)</strong>, ikuti panduan siluet
              garis putus-putus, edit nama Bunda &amp; pasangan, lalu unduh
              fotonya.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={() => startCamera()}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#C84B71] px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#b23b60] transition-all cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <span>Buka Kamera Selfie</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-2 text-xs sm:text-sm font-bold text-[#C84B71] hover:bg-pink-50 transition-all cursor-pointer"
              >
                <span>Matikan Kamera</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#ECE7F2] bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#2A2D22] hover:bg-gray-50 transition-all cursor-pointer"
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
        <div className="rounded-[20px] border border-amber-200 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>{cameraError}</span>
          <button
            type="button"
            onClick={() => generateSampleCouplePhoto()}
            className="shrink-0 rounded-full bg-[#56632A] px-4 py-2 text-xs font-bold text-white hover:bg-[#434e20] cursor-pointer"
          >
            Gunakan Contoh Foto Pasangan
          </button>
        </div>
      )}

      {/* Grid Utama: Kiri = Bingkai & Kamera/Preview, Kanan = Kontrol Gaya, Nama & Download */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* KOLOM KIRI (7 COL): Toggle Orientasi + Kanvas Bingkai Foto + Tombol Kamera */}
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          {/* Switcher Cepat Orientasi Bingkai: Portrait (Mobile) vs Landscape (Laptop/Lanskap) */}
          <div className="mb-3.5 inline-flex items-center rounded-full border border-[#ECE7F2] bg-[#FAF8FC] p-1 shadow-2xs">
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
              <span>Landscape (Laptop / Lanskap)</span>
            </button>
          </div>

          {/* KARTU POLAROID BINGKAI FOTO (Adaptif Portrait vs Landscape) */}
          <div
            className={`w-full rounded-[28px] border-4 p-4 sm:p-6 shadow-md transition-all duration-300 ${
              frameOrientation === 'portrait'
                ? 'max-w-[390px] sm:max-w-[420px]'
                : 'max-w-[580px]'
            } ${selectedFrame.previewClass}`}
          >
            {/* Header Bingkai */}
            <div className="text-center pb-3">
              <span
                className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em]"
                style={{ color: selectedFrame.accentHex }}
              >
                BUNA CERIA • TEMAN KASIH
              </span>
              <span className="text-[11px] text-[#6E6A6C]">
                Momen Bahagia Kehamilan Pertama
              </span>
            </div>

            {/* Area Viewfinder / Foto (Portrait 3:4 atau Landscape 4:3) */}
            <div
              className={`relative w-full overflow-hidden rounded-[20px] border-2 border-white bg-[#FAF8FC] shadow-inner flex items-center justify-center transition-all duration-300 ${
                frameOrientation === 'portrait'
                  ? 'aspect-[3/4]'
                  : 'aspect-[4/3]'
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
                /* IDLE STATE: Bersih, rapi, TIDAK bertabrakan dengan siluet */
                <div className="flex flex-col items-center justify-center p-5 sm:p-6 text-center z-10 max-w-xs mx-auto">
                  <div className="flex h-13 w-13 items-center justify-center rounded-full bg-pink-100/80 text-[#C84B71] mb-3 border border-pink-200/60">
                    <Users className="h-6 w-6" />
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#ECE7F2] px-3 py-0.5 text-[10px] font-bold text-[#56632A] mb-2">
                    {frameOrientation === 'portrait'
                      ? 'Mode Portrait (3:4) • Cocok untuk HP'
                      : 'Mode Landscape (4:3) • Cocok untuk Laptop/Lanskap'}
                  </span>

                  <p className="font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                    Area Foto Bunda &amp; Pasangan
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#6E6A6C]">
                    Nyalakan kamera atau coba contoh foto untuk melihat panduan
                    posisi kepala &amp; bahu dengan{' '}
                    <strong>garis putus-putus</strong>.
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="rounded-full bg-[#C84B71] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#b23b60] cursor-pointer"
                    >
                      Nyalakan Kamera
                    </button>
                    <button
                      type="button"
                      onClick={() => generateSampleCouplePhoto()}
                      className="rounded-full border border-[#A8B371] bg-white px-4 py-2 text-xs font-bold text-[#56632A] hover:bg-[#F5F7EA] cursor-pointer"
                    >
                      Coba Contoh Foto
                    </button>
                  </div>
                </div>
              )}

              {/* OVERLAY GARIS PUTUS-PUTUS: Hanya tampil saat kamera aktif atau foto sedang tampil agar TIDAK bertabrakan dengan teks tombol awal */}
              <DashedSilhouetteOverlay
                poseId={selectedPose.id}
                orientation={frameOrientation}
                visible={
                  showGuideOnPreview &&
                  (isCameraActive || Boolean(capturedDataUrl))
                }
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

            {/* Footer Bingkai: Nama Bunda & Pasangan (Real-time Editable Preview) */}
            <div className="pt-4 text-center space-y-1">
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

          {/* Bar Tombol Aksi Kamera di Bawah Bingkai (Responsif & Nyaman di Mobile) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full max-w-md">
            {isCameraActive && (
              <>
                <button
                  type="button"
                  onClick={captureFromVideo}
                  className="inline-flex min-h-[46px] w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-[#C84B71] px-7 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#b23b60] cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span>Ambil Foto Sekarang</span>
                </button>

                <button
                  type="button"
                  onClick={triggerCountdownCapture}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#56632A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#434e20] cursor-pointer"
                >
                  <span>Timer 3 Detik</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMirrored((prev) => !prev)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#2A2D22] hover:bg-gray-50 cursor-pointer"
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
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#2A2D22] hover:bg-gray-50 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Balik Kamera</span>
                </button>
              </>
            )}

            {!isCameraActive && capturedDataUrl && (
              <button
                type="button"
                onClick={() => startCamera()}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-pink-200 bg-white px-5 py-2 text-xs font-bold text-[#C84B71] hover:bg-pink-50 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Foto Ulang dengan Kamera</span>
              </button>
            )}
          </div>
        </div>

        {/* KOLOM KANAN (5 COL): Pengaturan Orientasi & Gaya Garis Putus-putus, Edit Nama, & Download */}
        <div className="lg:col-span-5 space-y-5 w-full">
          {/* 1. Pilih Arahan Gaya (Garis Putus-putus) sesuai Portrait / Landscape */}
          <div className="rounded-[22px] border border-[#ECE7F2] bg-white p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-heading text-base font-bold text-[#2A2D22]">
                1. Petunjuk Gaya ({frameOrientation === 'portrait' ? 'Portrait' : 'Landscape'})
              </h2>
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#56632A] cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={showGuideOnPreview}
                  onChange={(e) => setShowGuideOnPreview(e.target.checked)}
                  className="rounded accent-[#C84B71]"
                />
                <span>Tampilkan Garis</span>
              </label>
            </div>

            {/* Kotak Instruksi Spesifik Portrait vs Landscape */}
            <div className="rounded-xl border border-[#F0ECF5] bg-[#FAF8FC] p-3 text-xs leading-relaxed text-[#4A4D40]">
              {activePoseInstruction}
            </div>

            <div className="grid grid-cols-1 gap-2">
              {POSE_GUIDES.map((pose) => {
                const active = selectedPose.id === pose.id;
                return (
                  <button
                    key={pose.id}
                    type="button"
                    onClick={() => {
                      setSelectedPose(pose);
                      setShowGuideOnPreview(true);
                    }}
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'border-[#C84B71] bg-[#FDF2F5] text-[#C84B71] font-bold'
                        : 'border-[#ECE7F2] bg-[#FAF8FC] text-[#2A2D22] hover:bg-white'
                    }`}
                  >
                    <span>{pose.label}</span>
                    {active && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pilih Warna Bingkai */}
          <div className="rounded-[22px] border border-[#ECE7F2] bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#56632A]" />
              <h2 className="font-heading text-base font-bold text-[#2A2D22]">
                2. Pilih Tema Bingkai Foto
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {FRAME_PRESETS.map((frame) => {
                const active = selectedFrame.id === frame.id;
                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => setSelectedFrame(frame)}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'border-[#2A2D22] bg-[#FAF8FC] font-bold shadow-2xs'
                        : 'border-[#ECE7F2] bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border"
                      style={{
                        backgroundColor: frame.borderHex,
                        borderColor: frame.accentHex,
                      }}
                    />
                    <span className="truncate">{frame.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Edit Nama User di Bingkai Foto — Item 18 */}
          <div className="rounded-[22px] border border-[#ECE7F2] bg-white p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-[#C84B71]" />
              <h2 className="font-heading text-base font-bold text-[#2A2D22]">
                3. Edit Nama di Bingkai Foto
              </h2>
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
                className="mt-1 w-full rounded-xl border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
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
                className="mt-1 w-full rounded-xl border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-2.5 text-xs sm:text-sm text-[#2A2D22] focus:border-[#C84B71] focus:bg-white outline-none"
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
                className="mt-1 w-full rounded-xl border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-2 text-xs text-[#6E6A6C] focus:border-[#C84B71] focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* 4. Download Hasil Foto — Item 19 */}
          <div className="rounded-[22px] border border-pink-200 bg-[#FFF5F7] p-5 space-y-3">
            <label className="flex items-center gap-2 text-xs text-[#6E6A6C] cursor-pointer">
              <input
                type="checkbox"
                checked={includeGuideInDownload}
                onChange={(e) => setIncludeGuideInDownload(e.target.checked)}
                className="rounded accent-[#C84B71]"
              />
              <span>Sertakan garis siluet putus-putus pada hasil unduhan</span>
            </label>

            <button
              type="button"
              onClick={handleDownloadFramedPhoto}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#C84B71] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#b23b60] transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>
                Download Foto {frameOrientation === 'portrait' ? 'Portrait' : 'Landscape'} (PNG)
              </span>
            </button>

            {downloadSuccess && (
              <p className="text-center text-xs font-bold text-green-700 flex items-center justify-center gap-1">
                <Heart className="h-3.5 w-3.5 fill-green-700" />
                <span>Foto berhasil diunduh ke perangkat Bunda!</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
