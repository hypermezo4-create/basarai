'use client'

import { KitAnswers } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

export function StepName({ brandName }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Screen 1 of 7 — Your Brand</h2>
      <p className="text-lg font-medium">{brandName}</p>
      <p className="text-sm text-muted-foreground">
        This is the brand name you registered. Continue to the next screen.
      </p>
    </div>
  )
}
