'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface CountUpNumberProps {
  value: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

export function CountUpNumber({
  value,
  suffix = '',
  durationMs = 800,
  className = '',
}: CountUpNumberProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(
    prefersReducedMotion ? value : 0
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      const t = window.setTimeout(() => setDisplayValue(value), 0);
      return () => window.clearTimeout(t);
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Easing cubic-bezier(0.22, 1, 0.36, 1) pendekatan keluar halus
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, durationMs, prefersReducedMotion]);

  return (
    <span className={className}>
      {displayValue}
      {suffix}
    </span>
  );
}

interface ProgressRingProps {
  percentage: number; // 0 sampai 100
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  label?: string;
}

export function ProgressRing({
  percentage,
  size = 56,
  strokeWidth = 6,
  trackColor = '#FBDDE3',
  progressColor = '#56632A',
  label,
}: ProgressRingProps) {
  const prefersReducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const [offset, setOffset] = useState(
    prefersReducedMotion
      ? circumference - (clamped / 100) * circumference
      : circumference
  );

  useEffect(() => {
    const targetOffset = circumference - (clamped / 100) * circumference;
    const timer = window.setTimeout(
      () => {
        setOffset(targetOffset);
      },
      prefersReducedMotion ? 0 : 80
    );
    return () => window.clearTimeout(timer);
  }, [clamped, circumference, prefersReducedMotion]);

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `Progres ${clamped}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: prefersReducedMotion
              ? 'none'
              : 'stroke-dashoffset 850ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
      <span className="absolute font-heading text-xs font-bold text-ink">
        {clamped}%
      </span>
    </div>
  );
}
