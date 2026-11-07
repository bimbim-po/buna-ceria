'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  Download,
  FlipHorizontal,
  Heart,
  Image as ImageIcon,
  RefreshCw,
  Sparkles,
  Type,
  Upload,
  Users,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface PoseGuide {
  id: 'couple-side' | 'couple-belly' | 'couple-heart' | 'single-bunda';
  label: string;
  instruction: string;
}

const POSE_GUIDES: PoseGuide[] = [
  {
    id: 'couple-side',
    label: 'Gaya 1: Berdampingan (Bunda & Pasangan)',
    instruction:
      'Arahkan kepala dan bahu Bunda bersama pasangan tepat di dalam garis putus-putus kiri dan kanan.',
  },
  {
    id: 'couple-belly',
    label: 'Gaya 2: Merangkul Buah Hati',
    instruction:
      'Bunda di sisi kiri dan pasangan merangkul hangat dari sisi kanan sambil menyentuh perut.',
  },
  {
    id: 'couple-heart',
    label: 'Gaya 3: Senyum Dekat Berdua',
    instruction:
      'Dekatkan kepala Bunda dan pasangan di tengah bingkai mengikuti lengkungan garis putus-putus.',
  },
  {
    id: 'single-bunda',
    label: 'Gaya 4: Siluet Bunda Ceria',
    instruction:
      'Posisikan kepala dan bahu Bunda tepat di tengah mengikuti garis siluet putus-putus.',
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

// Komponen SVG Garis Putus-putus Siluet Tubuh (Sesuai Referensi Client Brief No. 17)
function DashedSilhouetteOverlay({
  poseId,
  visible,
}: {
  poseId: PoseGuide['id'];
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center p-4"
    >
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full max-h-[340px] max-w-[340px] drop-shadow-[0_2px_6px_rgba(255,255,255,0.9)]"
        fill="none"
      >
        {poseId === 'single-bunda' && (
          /* Siluet 1 Orang Persis Referensi Gambar Garis Putus-putus */
          <g
            stroke="#1F241B"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="16 14"
          >
            {/* Kepala & Telinga */}
            <path d="M 145 145 C 142 92, 168 62, 200 62 C 232 62, 258 92, 255 145 C 263 148, 263 168, 253 172 C 246 202, 232 218, 222 226 L 225 245 L 295 268 C 322 278, 336 308, 340 365" />
            <path d="M 145 145 C 137 148, 137 168, 147 172 C 154 202, 168 218, 178 226 L 175 245 L 105 268 C 78 278, 64 308, 60 365" />
          </g>
        )}

        {poseId === 'couple-side' && (
          /* Siluet Bunda & Pasangan Berdampingan */
          <g
            stroke="#1F241B"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="14 12"
          >
            {/* Siluet Kiri (Bunda) */}
            <path d="M 92 160 C 90 118, 110 95, 136 95 C 162 95, 182 118, 180 160 C 176 188, 162 204, 152 212 L 155 228 L 205 248" />
            <path d="M 92 160 C 96 188, 110 204, 120 212 L 117 228 L 58 250 C 40 260, 30 290, 26 360" />
            {/* Siluet Kanan (Pasangan) */}
            <path d="M 220 142 C 218 98, 240 72, 268 72 C 296 72, 318 98, 316 142 C 312 172, 298 190, 286 200 L 290 220 L 348 244 C 366 254, 376 286, 380 360" />
            <path d="M 220 142 C 224 172, 238 190, 250 200 L 246 220 L 195 244" />
          </g>
        )}

        {poseId === 'couple-belly' && (
          /* Siluet Bunda & Pasangan Merangkul Perut + Hati Putus-putus */
          <g
            stroke="#1F241B"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="14 12"
          >
            {/* Bunda */}
            <circle cx="140" cy="128" r="38" />
            <path d="M 72 355 C 76 275, 98 235, 140 235 C 175 235, 196 262, 204 320" />
            {/* Pasangan */}
            <circle cx="264" cy="112" r="42" />
            <path d="M 196 295 C 206 242, 230 220, 268 220 C 312 220, 336 265, 342 355" />
            {/* Hati di tengah bawah */}
            <path
              d="M 200 335 C 200 335, 168 310, 168 290 C 168 276, 180 268, 190 268 C 196 268, 200 273, 200 278 C 200 273, 204 268, 210 268 C 220 268, 232 276, 232 290 C 232 310, 200 335, 200 335 Z"
              stroke="#C84B71"
              strokeWidth="5"
              strokeDasharray="8 8"
            />
          </g>
        )}

        {poseId === 'couple-heart' && (
          /* Siluet Dekat Berdua + Hati di Atas */
          <g
            stroke="#1F241B"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="14 12"
          >
            <circle cx="152" cy="155" r="40" />
            <path d="M 75 355 C 82 280, 112 242, 158 242 C 185 242, 200 258, 205 285" />
            <circle cx="248" cy="148" r="43" />
            <path d="M 195 285 C 204 252, 222 236, 252 236 C 296 236, 322 278, 330 355" />
            <path
              d="M 200 96 C 200 96, 174 74, 174 58 C 174 46, 184 38, 192 38 C 197 38, 200 42, 200 46 C 200 42, 203 38, 208 38 C 216 38, 226 46, 226 58 C 226 74, 200 96, 200 96 Z"
              stroke="#C84B71"
              strokeWidth="5"
              strokeDasharray="9 7"
            />
          </g>
        )}
      </svg>

      <div className="mt-2 rounded-full bg-white/90 px-3.5 py-1 text-[11px] font-bold text-[#2A2D22] shadow-xs border border-pink-200">
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1080 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setCapturedDataUrl(null);
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 60);
    } catch {
      setCameraError(
        'Kamera tidak ditemukan atau izin kamera belum diberikan. Bunda tetap dapat mengunggah foto dari galeri atau menggunakan contoh foto di bawah.'
      );
    }
  };

  const captureFromVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    const size = 900;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 640;
    const minDim = Math.min(vw, vh);
    const sx = (vw - minDim) / 2;
    const sy = (vh - minDim) / 2;

    ctx.save();
    if (isMirrored) {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, size, size);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedDataUrl(dataUrl);
    stopCamera();
  }, [isMirrored, stopCamera]);

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

  // Buat foto simulasi hangat Bunda & Pasangan bila pengguna ingin langsung mencoba tanpa kamera
  const generateSampleCouplePhoto = () => {
    stopCamera();
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background lembut Cherry Blossom & Matcha
    const grad = ctx.createLinearGradient(0, 0, 900, 900);
    grad.addColorStop(0, '#FFF5F7');
    grad.addColorStop(0.55, '#FFFAF0');
    grad.addColorStop(1, '#F2F6E4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 900);

    // Dekorasi lingkaran pastel
    ctx.fillStyle = 'rgba(245, 175, 185, 0.25)';
    ctx.beginPath();
    ctx.arc(160, 180, 140, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(168, 179, 113, 0.22)';
    ctx.beginPath();
    ctx.arc(760, 220, 160, 0, Math.PI * 2);
    ctx.fill();

    // Ilustrasi Pasangan Hangat (Bunda & Ayah)
    // Ayah (Kanan)
    ctx.fillStyle = '#A8B371';
    ctx.beginPath();
    ctx.arc(540, 690, 195, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#FFE8DC';
    ctx.beginPath();
    ctx.arc(535, 360, 92, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2A2D22';
    ctx.beginPath();
    ctx.arc(535, 340, 94, Math.PI, 0, false);
    ctx.fill();

    // Senyum Ayah
    ctx.strokeStyle = '#2A2D22';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(535, 375, 28, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    // Bunda (Kiri)
    ctx.fillStyle = '#F5AFB9';
    ctx.beginPath();
    ctx.arc(360, 710, 185, Math.PI, 0, false);
    ctx.fill();

    // Hijab / Rambut Bunda
    ctx.fillStyle = '#C84B71';
    ctx.beginPath();
    ctx.arc(360, 395, 102, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFF0E8';
    ctx.beginPath();
    ctx.arc(360, 395, 80, 0, Math.PI * 2);
    ctx.fill();

    // Senyum Bunda
    ctx.strokeStyle = '#2A2D22';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(360, 408, 24, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    // Hati di tengah
    ctx.fillStyle = '#C84B71';
    ctx.beginPath();
    ctx.moveTo(450, 250);
    ctx.bezierCurveTo(450, 242, 435, 225, 418, 225);
    ctx.bezierCurveTo(395, 225, 395, 255, 395, 255);
    ctx.bezierCurveTo(395, 278, 450, 305, 450, 305);
    ctx.bezierCurveTo(450, 305, 505, 278, 505, 255);
    ctx.bezierCurveTo(505, 255, 505, 225, 482, 225);
    ctx.bezierCurveTo(465, 225, 450, 242, 450, 250);
    ctx.fill();

    setCapturedDataUrl(canvas.toDataURL('image/png'));
  };

  // Item 19: Download hasil foto beserta bingkai & nama yang sudah diedit
  const handleDownloadFramedPhoto = async () => {
    const canvas = document.createElement('canvas');
    const W = 1080;
    const H = 1350;
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

    // 4. Area Foto Utama (Square 900x900 di tengah)
    const photoX = 90;
    const photoY = 165;
    const photoSize = 900;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoSize, photoSize, 36);
    ctx.clip();

    if (capturedDataUrl) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = capturedDataUrl;
      });
      // Center-crop image
      const iw = img.width || photoSize;
      const ih = img.height || photoSize;
      const minDim = Math.min(iw, ih);
      const sx = (iw - minDim) / 2;
      const sy = (ih - minDim) / 2;
      ctx.drawImage(
        img,
        sx,
        sy,
        minDim,
        minDim,
        photoX,
        photoY,
        photoSize,
        photoSize
      );
    } else {
      ctx.fillStyle = '#FDF2F5';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
    }

    // Jika opsi sertakan garis siluet putus-putus diaktifkan
    if (includeGuideInDownload) {
      ctx.strokeStyle = 'rgba(31, 36, 27, 0.65)';
      ctx.lineWidth = 10;
      ctx.setLineDash([24, 18]);
      ctx.beginPath();
      ctx.arc(W / 2 - 140, photoY + 340, 95, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(W / 2 + 140, photoY + 320, 105, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();

    // Border keliling foto
    ctx.strokeStyle = selectedFrame.borderHex;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoSize, photoSize, 36);
    ctx.stroke();

    // 5. Area Bawah Bingkai: Nama User & Pasangan + Caption + Tanggal
    ctx.fillStyle = selectedFrame.textHex;
    ctx.font = 'bold 46px serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      customUserName.trim() || 'Bunda & Pasangan',
      W / 2,
      photoY + photoSize + 82
    );

    ctx.fillStyle = selectedFrame.accentHex;
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(
      customCaption.trim() || 'Bahagia Menanti Buah Hati',
      W / 2,
      photoY + photoSize + 132
    );

    ctx.fillStyle = '#767A6E';
    ctx.font = '22px sans-serif';
    ctx.fillText(customDate, W / 2, photoY + photoSize + 178);

    // 6. Trigger Download File PNG
    const finalUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeFileName = (customUserName || 'buna-ceria')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    link.download = `foto-selfie-${safeFileName}.png`;
    link.href = finalUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    window.setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Fitur Take Selfie */}
      <div className="rounded-[24px] border border-[#ECE7F2] bg-gradient-to-r from-[#FFF5F7] via-[#FFFAF0] to-[#F4F7EA] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-white px-3.5 py-1 text-xs font-bold text-[#C84B71]">
              <Camera className="h-3.5 w-3.5" />
              <span>Fitur Take Selfie Bersama Pasangan</span>
            </span>
            <h1 className="mt-2.5 font-heading text-2xl sm:text-3xl font-bold text-[#2A2D22]">
              Abadikan Momen Kehamilan Bunda &amp; Pasangan
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#6E6A6C]">
              Ikuti arahan gaya <strong>garis putus-putus (siluet)</strong> pada
              layar, pilih bingkai favorit, edit nama Bunda &amp; pasangan pada
              bingkai, lalu unduh hasil fotonya sebagai kenangan indah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={() => startCamera()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#C84B71] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#b23b60] transition-all cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <span>Buka Kamera Selfie</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#C84B71] hover:bg-pink-50 transition-all cursor-pointer"
              >
                <span>Matikan Kamera</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#ECE7F2] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#2A2D22] hover:bg-gray-50 transition-all cursor-pointer"
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
            onClick={generateSampleCouplePhoto}
            className="shrink-0 rounded-full bg-[#56632A] px-4 py-2 text-xs font-bold text-white hover:bg-[#434e20] cursor-pointer"
          >
            Gunakan Contoh Foto Pasangan
          </button>
        </div>
      )}

      {/* Grid Utama: Kiri = Bingkai & Kamera/Preview, Kanan = Kontrol Gaya, Nama & Download */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* KOLOM KIRI (7 COL): Kanvas Bingkai Foto + Garis Putus-putus */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            className={`w-full max-w-[500px] rounded-[28px] border-4 p-5 sm:p-6 shadow-md transition-colors ${selectedFrame.previewClass}`}
          >
            {/* Header Bingkai */}
            <div className="text-center pb-3">
              <span
                className="block text-[11px] font-extrabold uppercase tracking-[0.2em]"
                style={{ color: selectedFrame.accentHex }}
              >
                BUNA CERIA • TEMAN KASIH
              </span>
              <span className="text-[11px] text-[#6E6A6C]">
                Momen Bahagia Kehamilan Pertama
              </span>
            </div>

            {/* Area Viewfinder / Foto Square dengan Overlay Garis Putus-putus */}
            <div className="relative aspect-square w-full overflow-hidden rounded-[22px] border-2 border-white bg-[#FAF8FC] shadow-inner flex items-center justify-center">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${
                    isMirrored ? 'scale-x-[-1]' : ''
                  }`}
                />
              ) : capturedDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedDataUrl}
                  alt="Pratinjau foto selfie Bunda dan pasangan"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100/80 text-[#C84B71] mb-3">
                    <Users className="h-7 w-7" />
                  </div>
                  <p className="font-heading text-base font-bold text-[#2A2D22]">
                    Area Foto Bunda &amp; Pasangan
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-[#6E6A6C]">
                    Garis putus-putus di atas membantu mengarahkan posisi kepala
                    dan bahu saat berfoto.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 relative z-30">
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="rounded-full bg-[#C84B71] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#b23b60] cursor-pointer"
                    >
                      Nyalakan Kamera
                    </button>
                    <button
                      type="button"
                      onClick={generateSampleCouplePhoto}
                      className="rounded-full border border-[#A8B371] bg-white px-4 py-2 text-xs font-bold text-[#56632A] hover:bg-[#F5F7EA] cursor-pointer"
                    >
                      Coba Contoh Foto
                    </button>
                  </div>
                </div>
              )}

              {/* OVERLAY GARIS PUTUS-PUTUS (DASHED SILHOUETTE GUIDE) */}
              <DashedSilhouetteOverlay
                poseId={selectedPose.id}
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

            {/* Footer Bingkai: Nama Bunda & Pasangan (Real-time Editable Preview) */}
            <div className="pt-4 text-center space-y-1">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#2A2D22] break-words">
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

          {/* Bar Tombol Aksi Kamera di Bawah Bingkai */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {isCameraActive && (
              <>
                <button
                  type="button"
                  onClick={captureFromVideo}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#C84B71] px-7 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#b23b60] cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span>Ambil Foto Sekarang</span>
                </button>

                <button
                  type="button"
                  onClick={triggerCountdownCapture}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#56632A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#434e20] cursor-pointer"
                >
                  <span>Timer 3 Detik</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMirrored((prev) => !prev)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#2A2D22] hover:bg-gray-50 cursor-pointer"
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
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#2A2D22] hover:bg-gray-50 cursor-pointer"
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
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-pink-200 bg-white px-4 py-2 text-xs font-bold text-[#C84B71] hover:bg-pink-50 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Foto Ulang</span>
              </button>
            )}
          </div>
        </div>

        {/* KOLOM KANAN (5 COL): Pengaturan Gaya Garis Putus-putus, Edit Nama di Bingkai, & Download */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Pilih Arahan Gaya (Garis Putus-putus) — Item 17 */}
          <div className="rounded-[22px] border border-[#ECE7F2] bg-white p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C84B71]" />
                <h2 className="font-heading text-base font-bold text-[#2A2D22]">
                  1. Arahan Gaya (Garis Putus-putus)
                </h2>
              </div>
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#56632A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGuideOnPreview}
                  onChange={(e) => setShowGuideOnPreview(e.target.checked)}
                  className="rounded accent-[#C84B71]"
                />
                <span>Tampilkan Garis</span>
              </label>
            </div>

            <p className="text-xs text-[#6E6A6C] leading-relaxed">
              {selectedPose.instruction}
            </p>

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
              <span>Download Hasil Foto (PNG)</span>
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
