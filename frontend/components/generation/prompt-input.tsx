'use client'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const MIN = 3
const MAX = 4000

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  const trimmedLength = value.trim().length
  const tooShort = trimmedLength > 0 && trimmedLength < MIN
  const tooLong = trimmedLength > MAX

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Prompt</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={5}
        placeholder="Describe the image you want…"
        className="w-full rounded-md border border-input bg-background p-2 text-sm disabled:opacity-50"
        maxLength={MAX + 200}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {tooShort && `Minimum ${MIN} characters`}
          {tooLong && `Maximum ${MAX} characters`}
        </span>
        <span>{trimmedLength} / {MAX}</span>
      </div>
    </div>
  )
}
