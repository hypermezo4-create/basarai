'use client'

import { KitAnswers, KitStatus } from '@/types'

interface StepReviewProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
  savedSummary: string | null
  savedStatus: KitStatus
  isDirty: boolean
  onSave: () => void
  saving: boolean
  saveError: string | null
}

export function StepReview({
  answers,
  brandName,
  savedSummary,
  savedStatus,
  isDirty,
  onSave,
  saving,
  saveError,
}: StepReviewProps) {
  const missingRequired: string[] = []
  if (!answers.tone) missingRequired.push('Tone')
  if (!answers.audience || answers.audience.trim().length < 2) missingRequired.push('Audience')
  if (!answers.colors || answers.colors.length === 0) missingRequired.push('Colors (at least one)')

  const hasSaved = !isDirty && saveError === null && savedStatus !== 'not_started'

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Screen 7 of 7 — Review &amp; Save</h2>

      <div className="space-y-2 rounded-md border border-gray-200 p-4 text-sm">
        <p><span className="font-medium">Brand:</span> {brandName}</p>
        <p><span className="font-medium">Tagline:</span> {answers.tagline || '— not specified —'}</p>
        <p><span className="font-medium">Tone:</span> {answers.tone || '— not specified —'}</p>
        <p><span className="font-medium">Audience:</span> {answers.audience || '— not specified —'}</p>
        <p><span className="font-medium">Colors:</span> {answers.colors.length > 0 ? answers.colors.join(', ') : '— not specified —'}</p>
        <p><span className="font-medium">Avoid words:</span> {answers.avoid_words || '— not specified —'}</p>
      </div>

      {missingRequired.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900"
        >
          <p className="font-medium">Required fields still missing:</p>
          <ul className="mt-1 list-disc pl-5">
            {missingRequired.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-2">
            You can still save now — your kit will be stored as{' '}
            <span className="font-medium">&quot;In progress&quot;</span> until all required fields are filled.
          </p>
        </div>
      )}

      {hasSaved && savedStatus === 'complete' && (
        <div role="status" aria-live="polite" className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-900">
          &#10003; Brand kit saved — status: Complete.
        </div>
      )}

      {hasSaved && savedStatus === 'in_progress' && (
        <div role="status" aria-live="polite" className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
          Brand kit saved — status: In progress. Fill in the remaining required fields to reach Complete.
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Brand Context Summary (what the AI will use)</h3>
        {savedSummary ? (
          <>
            <pre className="whitespace-pre-wrap rounded bg-gray-50 p-3 text-sm">{savedSummary}</pre>
            {isDirty && (
              <p className="text-xs italic text-muted-foreground">You have unsaved changes — the summary will update after Save.</p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Summary will be generated after you save.</p>
        )}
      </div>

      {saveError && (
        <p className="text-sm text-red-600">{saveError}</p>
      )}

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Brand Kit'}
      </button>
    </div>
  )
}
