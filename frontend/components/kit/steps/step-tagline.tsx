'use client'

import { KitAnswers } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

export function StepTagline({ answers, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Screen 2 of 7 — Tagline</h2>
      <p className="text-sm text-muted-foreground">
        What is your brand&apos;s tagline or slogan? (optional)
      </p>
      <label htmlFor="kit-tagline" className="text-sm font-medium">
        Tagline (optional)
      </label>
      <input
        id="kit-tagline"
        type="text"
        value={answers.tagline ?? ''}
        maxLength={160}
        onChange={(e) => onChange({ tagline: e.target.value || null })}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        placeholder="Enter your tagline..."
      />
      <p className="text-xs text-muted-foreground">
        {answers.tagline?.length ?? 0}/160
      </p>
    </div>
  )
}
