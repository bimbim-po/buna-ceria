'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  ChevronDown,
  Download,
  FlipHorizontal,
  Heart,
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
  id: 'couple-side' | 'none';
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
    id: 'none',
    label: 'Tanpa Petunjuk Gaya (Kamera Bersih)',
    shortLabel: 'Tanpa Siluet',
    instructionPortrait:
      'Kamera tampil bersih tanpa garis siluet. Bunda dan pasangan bebas menentukan gaya foto sendiri.',
    instructionLandscape:
      'Kamera tampil bersih tanpa garis siluet. Bunda dan pasangan bebas menentukan gaya foto sendiri.',
  },
];

// Koordinat jendela foto di dalam bingkai Portrait (816x1021) & Landscape (1200x900)
const FRAME_GEOMETRY = {
  portrait: {
    canvasW: 816,
    canvasH: 1021,
    photoX: 82,
    photoY: 208,
    photoW: 652,
    photoH: 711,
    frameSrc: '/frame-portrait.png',
    frameWebp: '/frame-portrait.webp',
    // Persentase posisi jendela foto terhadap ukuran penuh bingkai
    windowStyle: {
      left: '10.05%',
      top: '20.37%',
      width: '79.90%',
      height: '69.64%',
    },
  },
  landscape: {
    canvasW: 1200,
    canvasH: 900,
    photoX: 128,
    photoY: 158,
    photoW: 946,
    photoH: 635,
    frameSrc: '/frame-landscape.png',
    frameWebp: '/frame-landscape.webp',
    windowStyle: {
      left: '10.67%',
      top: '17.56%',
      width: '78.83%',
      height: '70.56%',
    },
  },
} as const;

function getSilhouetteDrawBox(
  canvasW: number,
  canvasH: number,
  silW: number,
  silH: number,
  orientation: FrameOrientation
) {
  const silAspect = silW / silH;
  if (orientation === 'portrait') {
    const drawH = canvasH * 0.84;
    const drawW = drawH * silAspect;
    const drawX = (canvasW - drawW) / 2;
    const drawY = canvasH - drawH;
    return { drawX, drawY, drawW, drawH };
  }
  const drawH = canvasH * 0.88;
  const drawW = drawH * silAspect;
  const drawX = (canvasW - drawW) / 2;
  const drawY = canvasH - drawH;
  return { drawX, drawY, drawW, drawH };
}

function DashedSilhouetteOverlay({
  poseId,
  orientation,
}: {
  poseId: PoseGuide['id'];
  orientation: FrameOrientation;
}) {
  if (poseId === 'none') return null;

  const isPortrait = orientation === 'portrait';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center overflow-hidden"
    >
      <svg
        viewBox={isPortrait ? '85 0 717 671' : '0 0 887 671'}
        preserveAspectRatio="xMidYMax meet"
        className={
          isPortrait
            ? 'h-[86%] w-full object-contain object-bottom'
            : 'h-[88%] w-[82%] object-contain object-bottom'
        }
      >
        <image
          href="/silhouette-bunda-dashed.webp"
          width="887"
          height="671"
          preserveAspectRatio="xMidYMax meet"
        />
      </svg>
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

  const [openDropdown, setOpenDropdown] = useState<'pose' | 'text' | null>(
    null
  );

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
  const [includeGuideInDownload, setIncludeGuideInDownload] = useState(false);

  const [customUserName, setCustomUserName] = useState<string>(
    session?.name ? `${session.name} & Pasangan` : 'Bunda & Ayah'
  );
  const [customCaption, setCustomCaption] = useState<string>(
    session?.trimesterLabel
      ? `Momen Bahagia Lahirnya Si Buah Hati • ${session.trimesterLabel}`
      : 'Momen Bahagia Lahirnya Si Buah Hati'
  );
  const [customDate, setCustomDate] = useState<string>(() =>
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  );
  const [showCustomFooterText, setShowCustomFooterText] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (session?.name) {
      setCustomUserName(`${session.name} & Pasangan`);
    }
    if (session?.trimesterLabel) {
      setCustomCaption(
        `Momen Bahagia Lahirnya Si Buah Hati • ${session.trimesterLabel}`
      );
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
        'Kamera tidak ditemukan atau izin kamera belum diberikan. Bunda tetap dapat mengunggah foto dari galeri perangkat.'
      );
    }
  };

  const captureFromVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const geom = FRAME_GEOMETRY[frameOrientation];
    const targetW = geom.photoW * 2;
    const targetH = geom.photoH * 2;
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

  // Download hasil foto beserta bingkai resmi Portrait / Landscape
  const handleDownloadFramedPhoto = async () => {
    const isPortrait = frameOrientation === 'portrait';
    const geom = FRAME_GEOMETRY[frameOrientation];
    const W = geom.canvasW;
    const H = geom.canvasH;
    const { photoX, photoY, photoW, photoH, frameSrc } = geom;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background Dasar
    ctx.fillStyle = '#FFF9FB';
    ctx.fillRect(0, 0, W, H);

    // 2. Gambar Foto Pengguna di Area Jendela Dalam
    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, photoW, photoH);
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

    if (includeGuideInDownload && selectedPose.id !== 'none') {
      const silImg = new window.Image();
      silImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        silImg.onload = () => resolve();
        silImg.onerror = () => resolve();
        silImg.src = '/silhouette-bunda-dashed.webp';
      });
      if (silImg.width > 0) {
        const { drawX, drawY, drawW, drawH } = getSilhouetteDrawBox(
          photoW,
          photoH,
          isPortrait ? 717 : silImg.width,
          silImg.height,
          frameOrientation
        );
        if (isPortrait) {
          ctx.drawImage(
            silImg,
            85,
            0,
            717,
            silImg.height,
            photoX + drawX,
            photoY + drawY,
            drawW,
            drawH
          );
        } else {
          ctx.drawImage(
            silImg,
            0,
            0,
            silImg.width,
            silImg.height,
            photoX + drawX,
            photoY + drawY,
            drawW,
            drawH
          );
        }
      }
    }
    ctx.restore();

    // 3. Gambar Overlay Bingkai Bunga & Renda Resmi di Atas Foto
    const frameImg = new window.Image();
    frameImg.crossOrigin = 'anonymous';
    await new Promise<void>((resolve) => {
      frameImg.onload = () => resolve();
      frameImg.onerror = () => resolve();
      frameImg.src = frameSrc;
    });
    if (frameImg.width > 0) {
      ctx.drawImage(frameImg, 0, 0, W, H);
    }

    // 4. Gambar Nama Bunda & Pasangan + Tanggal di Bagian Bawah Tengah (Antara Rangkaian Bunga)
    if (showCustomFooterText && (customUserName.trim() || customDate.trim())) {
      const badgeW = isPortrait ? 330 : 440;
      const badgeH = isPortrait ? 64 : 66;
      const badgeX = (W - badgeW) / 2;
      const badgeY = isPortrait ? H - 82 : H - 84;

      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.strokeStyle = 'rgba(200, 75, 113, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 32);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#2A2D22';
      ctx.font = isPortrait ? 'bold 20px serif' : 'bold 22px serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        customUserName.trim() || 'Bunda & Pasangan',
        W / 2,
        badgeY + 28
      );

      ctx.fillStyle = '#C84B71';
      ctx.font = isPortrait ? 'bold 13px sans-serif' : 'bold 14px sans-serif';
      ctx.fillText(customDate.trim(), W / 2, badgeY + 49);
      ctx.restore();
    }

    // 5. Trigger Download File PNG
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

  const activeGeom = FRAME_GEOMETRY[frameOrientation];

  return (
    <div className="space-y-5 sm:space-y-6 w-full">
      {/* Header Banner Fitur Take Selfie */}
      <div className="rounded-[24px] border border-[#F5DCE4] bg-white p-5 sm:p-7 shadow-[0_8px_28px_rgba(200,75,113,0.06)] transition-all duration-300 hover:shadow-[0_12px_34px_rgba(200,75,113,0.1)]">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE8EE] px-3 py-0.5 text-[11px] font-bold text-[#C84B71] mb-1.5">
              <span>Dukungan Suami &bull; Take Selfie</span>
            </span>
            <h1 className="font-heading text-xl sm:text-3xl font-bold text-[#2A2D22]">
              Abadikan Momen Nifas Bersama Pasangan
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#6E6A6C]">
              Pilih orientasi bingkai <strong>Portrait (HP)</strong> atau{' '}
              <strong>Landscape (Full Layar)</strong> dengan bingkai khusus{' '}
              <em>BUNA CERIA — Momen Bahagia Lahirnya Si Buah Hati</em>, atur
              petunjuk gaya siluet serta nama, lalu unduh fotonya.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-sm lg:w-auto lg:max-w-none shrink-0">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={() => startCamera()}
                className="inline-flex min-h-[42px] w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C84B71] to-[#E46C8E] px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-[0_6px_18px_rgba(200,75,113,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(200,75,113,0.38)] active:scale-95 cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <span>Buka Kamera Selfie</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex min-h-[42px] w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-2 text-xs sm:text-sm font-bold text-[#C84B71] hover:bg-pink-50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>Matikan Kamera</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[42px] w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#F5DCE4] bg-white px-5 py-2 text-xs sm:text-sm font-bold text-[#2A2D22] hover:bg-[#FFF5F8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm active:scale-95 cursor-pointer"
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
        <div className="rounded-[20px] border border-amber-200 bg-amber-50/90 p-4 text-xs sm:text-sm text-amber-900 text-center">
          <span>{cameraError}</span>
        </div>
      )}

      {/* TOP DROPDOWN CONTROL BAR */}
      <div
        ref={toolbarRef}
        className="relative z-40 rounded-[22px] border border-[#F5DCE4] bg-white p-3 sm:p-3.5 shadow-[0_6px_24px_rgba(200,75,113,0.06)]"
      >
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-2.5 sm:gap-3 w-full">
          {/* 1. Switcher Orientasi: Portrait (HP) vs Landscape (Full Layar) */}
          <div className="grid grid-cols-2 w-full sm:w-auto inline-flex items-center rounded-full border border-[#F5DCE4] bg-[#FFF5F8] p-1 shrink-0">
            <button
              type="button"
              onClick={() => setFrameOrientation('portrait')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                frameOrientation === 'portrait'
                  ? 'bg-[#C84B71] text-white shadow-2xs'
                  : 'text-[#6E6A6C] hover:text-[#2A2D22]'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5 shrink-0" />
              <span>Bingkai Portrait (HP)</span>
            </button>
            <button
              type="button"
              onClick={() => setFrameOrientation('landscape')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                frameOrientation === 'landscape'
                  ? 'bg-[#56632A] text-white shadow-2xs'
                  : 'text-[#6E6A6C] hover:text-[#2A2D22]'
              }`}
            >
              <Monitor className="h-3.5 w-3.5 shrink-0" />
              <span>Bingkai Landscape (Full Layar)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto">
            {/* 2. DROPDOWN PETUNJUK GAYA */}
            <div className="relative w-full sm:w-[245px] shrink-0">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'pose' ? null : 'pose'))
                }
                aria-expanded={openDropdown === 'pose'}
                className={`inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 sm:gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                  openDropdown === 'pose'
                    ? 'border-[#C84B71] bg-[#FDF2F5] text-[#C84B71] shadow-sm'
                    : 'border-[#F5DCE4] bg-[#FFF9FB] text-[#2A2D22] hover:border-pink-300'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#C84B71] shrink-0" />
                <span className="truncate">
                  Petunjuk Gaya: {selectedPose.shortLabel}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                    openDropdown === 'pose' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'pose' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-[calc(100vw-2.5rem)] sm:w-[320px] rounded-[22px] border border-[#F5DCE4] bg-white p-4 shadow-[0_18px_42px_rgba(200,75,113,0.22)] z-50 space-y-3 text-left">
                  <span className="block font-heading text-sm font-bold text-[#2A2D22]">
                    Pilih Petunjuk Gaya Siluet
                  </span>

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
                            setOpenDropdown(null);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-all cursor-pointer ${
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

            {/* 3. DROPDOWN EDIT NAMA DI BINGKAI FOTO */}
            <div className="relative w-full sm:w-[235px] shrink-0">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'text' ? null : 'text'))
                }
                aria-expanded={openDropdown === 'text'}
                className={`inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 sm:gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                  openDropdown === 'text'
                    ? 'border-[#C84B71] bg-[#FDF2F5] text-[#C84B71] shadow-sm'
                    : 'border-[#F5DCE4] bg-[#FFF9FB] text-[#2A2D22] hover:border-pink-300'
                }`}
              >
                <Type className="h-3.5 w-3.5 text-[#C84B71] shrink-0" />
                <span className="truncate">Edit Nama di Bingkai Foto</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                    openDropdown === 'text' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'text' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 sm:right-0 sm:left-auto sm:translate-x-0 mt-2 w-[calc(100vw-2.5rem)] sm:w-[340px] rounded-[22px] border border-[#F5DCE4] bg-white p-4 shadow-[0_18px_42px_rgba(200,75,113,0.22)] z-50 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-bold text-[#2A2D22]">
                      Edit Nama &amp; Tanggal di Bingkai
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(null)}
                      className="text-[11px] font-bold text-[#C84B71] hover:underline cursor-pointer"
                    >
                      Selesai
                    </button>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-semibold text-[#2A2D22] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCustomFooterText}
                      onChange={(e) =>
                        setShowCustomFooterText(e.target.checked)
                      }
                      className="rounded accent-[#C84B71]"
                    />
                    <span>Tampilkan nama &amp; tanggal di bagian bawah bingkai</span>
                  </label>

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
          PRATINJAU BINGKAI FOTO PORTRAIT & LANDSCAPE SESUAI DESAIN BUNGA & RENDA
         ===================================================================== */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div
          className={`relative w-full overflow-hidden rounded-[26px] border border-[#F5DCE4] bg-[#FFF9FB] shadow-[0_14px_40px_rgba(200,75,113,0.12)] transition-all duration-300 ${
            frameOrientation === 'portrait'
              ? 'max-w-[440px] sm:max-w-[480px] aspect-[816/1021] mx-auto'
              : 'max-w-[920px] aspect-[4/3] mx-auto'
          }`}
        >
          {/* LAYER 1: Jendela Kamera / Foto di Dalam Bingkai */}
          <div
            style={activeGeom.windowStyle}
            className="absolute z-10 overflow-hidden bg-[#181517] flex items-center justify-center"
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
              /* IDLE STATE: Tombol Nyalakan Kamera di Tengah */
              <div className="relative z-20 flex flex-col items-center justify-center p-4 text-center">
                <div className="flex items-center justify-center bg-black/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-lg">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C84B71] to-[#E46C8E] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Nyalakan Kamera</span>
                  </button>
                </div>
              </div>
            )}

            {/* OVERLAY GARIS PUTUS-PUTUS PINK */}
            <DashedSilhouetteOverlay
              poseId={selectedPose.id}
              orientation={frameOrientation}
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

          {/* LAYER 2: Overlay Bingkai Bunga, Pita Hijau & Renda Resmi (Portrait / Landscape) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeGeom.frameWebp}
            alt={`Bingkai foto ${frameOrientation} Buna Ceria`}
            className="pointer-events-none absolute inset-0 z-20 h-full w-full object-fill select-none"
          />

          {/* LAYER 3: Badge Nama Bunda & Pasangan di Bagian Bawah Bingkai */}
          {showCustomFooterText &&
            (customUserName.trim() || customDate.trim()) && (
              <div className="pointer-events-none absolute bottom-[1.5%] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center justify-center rounded-full border border-pink-300/70 bg-white/90 backdrop-blur-xs px-4 sm:px-6 py-1 sm:py-1.5 shadow-sm text-center max-w-[68%]">
                <span className="font-heading text-xs sm:text-sm font-bold text-[#2A2D22] truncate w-full">
                  {customUserName || 'Bunda & Pasangan'}
                </span>
                <span className="text-[9px] sm:text-[11px] font-bold text-[#C84B71] truncate w-full">
                  {customDate}
                </span>
              </div>
            )}
        </div>

        {/* Keterangan Panduan di Bawah Bingkai */}
        {selectedPose.id !== 'none' && (
          <p className="mt-3 text-center text-[11px] sm:text-xs font-semibold text-[#6E6A6C] flex items-center justify-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#C84B71]" />
            <span>
              Posisikan Bunda &amp; Pasangan mengikuti garis siluet putus-putus
              pink di dalam bingkai
            </span>
          </p>
        )}

        {/* BAR TOMBOL AKSI KAMERA & UNDUH FOTO DI BAWAH BINGKAI */}
        <div className="mt-4 w-full rounded-[24px] border border-[#F5DCE4] bg-white p-4 sm:p-5 shadow-[0_8px_28px_rgba(200,75,113,0.06)] flex flex-col lg:flex-row items-center justify-between gap-4">
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
                {selectedPose.id !== 'none' && (
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
                )}
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
