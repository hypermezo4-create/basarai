'use client'

import type { LogoMode } from '@/types'

interface LogoModeSelectorProps {
  value: LogoMode
  onChange: (value: LogoMode) => void
  brandHasLogo: boolean
  disabled?: boolean
}

const MODES: { value: LogoMode; label: string; requiresLogo: boolean }[] = [
  { value: 'none',      label: 'None',      requiresLogo: false },
  { value: 'prompt',    label: 'In prompt', requiresLogo: false },
  { value: 'watermark', label: 'Watermark', requiresLogo: true },
  { value: 'both',      label: 'Both',      requiresLogo: true },
]

export function LogoModeSelector({
  value, onChange, brandHasLogo, disabled,
}: LogoModeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Logo mode</label>
      <div className="flex flex-wrap gap-2">
        {MODES.map((mode) => {
          const modeDisabled = disabled || (mode.requiresLogo && !brandHasLogo)
          return (
            <button
              key={mode.value}
              type="button"
              disabled={modeDisabled}
              onClick={() => onChange(mode.value)}
              title={
                mode.requiresLogo && !brandHasLogo
                  ? 'Upload a logo on the Settings page to enable this mode.'
                  : undefined
              }
              className={
                'rounded-md border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ' +
                (value === mode.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background hover:bg-accent')
              }
            >
              {mode.label}
            </button>
          )
        })}
      </div>
      {!brandHasLogo && (
        <p className="text-xs text-muted-foreground">
          Watermark and Both modes require a brand logo. Upload one on the Settings page.
        </p>
      )}
    </div>
  )
}
