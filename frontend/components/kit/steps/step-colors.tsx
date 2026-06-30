'use client'

import { KitAnswers } from '@/types'
import { ColorSlot } from '../color-slot'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

export function StepColors({ answers, onChange }: StepProps) {
  const handleColorChange = (index: number, hex: string) => {
    const updated = [...answers.colors]
    updated[index] = hex
    onChange({ colors: updated })
  }

  const handleColorRemove = (index: number) => {
    const updated = answers.colors.filter((_, i) => i !== index)
    onChange({ colors: updated })
  }

  const handleAddColor = () => {
    if (answers.colors.length < 3) {
      onChange({ colors: [...answers.colors, '#000000'] })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Screen 5 of 7 — Colors</h2>
      <p className="text-sm text-muted-foreground">
        Pick up to 3 brand colors.
      </p>
      <div className="space-y-2">
        {answers.colors.map((color, index) => (
          <ColorSlot
            key={index}
            value={color}
            onChange={(hex) => handleColorChange(index, hex)}
            onRemove={() => handleColorRemove(index)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleAddColor}
        disabled={answers.colors.length >= 3}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        + Add Color
      </button>
    </div>
  )
}
