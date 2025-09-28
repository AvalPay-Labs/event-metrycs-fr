'use client';

import { useTheme } from '@/components/providers/theme-provider';

export function ThemeToggle() {
  // Always show dark theme - disabled toggle
  return (
    <div
      className="theme-toggle focus-ring opacity-50 cursor-not-allowed"
      aria-label="Dark mode (locked)"
      title="Dark mode only"
    >
      {/* Moon icon to indicate dark mode is active */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </div>
  );
}