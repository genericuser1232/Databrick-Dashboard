'use client';

import React from 'react';

type BarProps = {
  /** Progress value from 0 to 100 */
  value: number;
  /** Optional height in px */
  height?: number;
  /** Optional color for the filled part */
  color?: string;
  /** Optional background color for the track */
  trackColor?: string;
};

export default function Bar({
  value,
  height = 12,
  color = '#2563eb', // blue-600
  trackColor = '#e5e7eb', // gray-200
}: BarProps) {
  // Keep value safely between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div style={{ width: '100%' }}>
      <div
        aria-label="Progress"
        role="progressbar"
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
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p style={{ marginTop: '8px', fontSize: '14px', color: '#374151' }}>
        {clampedValue}%
      </p>
    </div>
  );
}