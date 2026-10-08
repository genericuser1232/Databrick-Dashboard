'use client';

import React from 'react';

type BarProps = {
  value: number; // expected 0-100
  height?: number;
  color?: string;
  trackColor?: string;
};

export default function Bar({
  value,
  height = 12,
  color = '#2563eb',
  trackColor = '#e5e7eb',
}: BarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div style={{ width: '100%' }}>
      <div
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedValue}
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: trackColor,
          borderRadius: `${height / 2}px`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clampedValue}%`,
            height: '100%',
            backgroundColor: color,
          }}
        />
      </div>

      <p style={{ marginTop: 8, fontSize: 14 }}>{clampedValue}%</p>
    </div>
  );
}