'use client'

interface ColorSlotProps {
  value: string
  onChange: (hex: string) => void
  onRemove: () => void
}

export function ColorSlot({ value, onChange, onRemove }: ColorSlotProps) {
  const isValid = /^#[0-9A-Fa-f]{6}$/.test(value)

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        aria-label="Color picker"
        className="h-8 w-8 cursor-pointer border-0 p-0"
      />
      <input
        type="text"
        value={value.toUpperCase()}
        onChange={(e) => onChange(e.target.value)}
        maxLength={7}
        placeholder="#RRGGBB"
        aria-label="Hex color value"
        className={`w-24 rounded-md border px-2 py-1 text-sm ${
          !isValid ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove color"
        className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  )
}
