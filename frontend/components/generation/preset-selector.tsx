'use client'

import { PLATFORM_PRESETS, PRESETS_BY_PLATFORM } from '@/lib/presets'
import type { PlatformPreset } from '@/types'

interface PresetSelectorProps {
  value: PlatformPreset | null
  onChange: (value: PlatformPreset) => void
  disabled?: boolean
}

export function PresetSelector({ value, onChange, disabled }: PresetSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Platform preset</label>
      <select
        value={value ?? ''}
        onChange={(e) => {
          if (e.target.value !== '') onChange(e.target.value as PlatformPreset)
        }}
        disabled={disabled}
        className="w-full rounded-md border border-input bg-background p-2 text-sm disabled:opacity-50"
      >
        <option value="" disabled>Select a preset…</option>
        {Object.entries(PRESETS_BY_PLATFORM).map(([platform, presets]) => (
          <optgroup key={platform} label={platform}>
            {presets.map((preset) => {
              const info = PLATFORM_PRESETS[preset]
              return (
                <option key={preset} value={preset}>
                  {info.label} — {info.width} × {info.height}
                </option>
              )
            })}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
