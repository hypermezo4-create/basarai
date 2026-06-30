'use client'

import { useEffect, useState } from 'react'
import { useActiveKeys } from '@/hooks/use-active-keys'
import { useGenerate } from '@/hooks/use-generate'
import { LogoModeSelector } from '@/components/generation/logo-mode-selector'
import { PresetSelector } from '@/components/generation/preset-selector'
import { PromptInput } from '@/components/generation/prompt-input'
import { ProviderSelector } from '@/components/generation/provider-selector'
import { GeneratorResult } from '@/components/generation/generator-result'
import type { LogoMode, PlatformPreset, Provider } from '@/types'

interface GeneratorFormProps {
  brandId: string
  brandName: string
  brandHasLogo: boolean
}

export function GeneratorForm({ brandId, brandName, brandHasLogo }: GeneratorFormProps) {
  const [prompt, setPrompt] = useState('')
  const [provider, setProvider] = useState<Provider>('openai')
  const [preset, setPreset] = useState<PlatformPreset | null>(null)
  const [logoMode, setLogoMode] = useState<LogoMode>('none')
  const [providerInitialized, setProviderInitialized] = useState(false)

  const { activeKeys, loading: keysLoading } = useActiveKeys(brandId)
  const { state, generate } = useGenerate(brandId)

  useEffect(() => {
    setProviderInitialized(false)
  }, [brandId])

  useEffect(() => {
    if (keysLoading || providerInitialized) return
    if (activeKeys.openaiActive && !activeKeys.geminiActive) {
      setProvider('openai')
    } else if (!activeKeys.openaiActive && activeKeys.geminiActive) {
      setProvider('gemini')
    } else if (activeKeys.openaiActive && activeKeys.geminiActive) {
      setProvider('gemini')
    } else {
      setProvider('openai')
    }
    setProviderInitialized(true)
  }, [keysLoading, activeKeys, providerInitialized])

  const trimmedLen = prompt.trim().length
  const submitting = state.status === 'submitting'
  const hasActiveKey =
    (provider === 'openai' && activeKeys.openaiActive) ||
    (provider === 'gemini' && activeKeys.geminiActive)
  const generateDisabled =
    submitting ||
    trimmedLen < 3 ||
    trimmedLen > 4000 ||
    preset === null ||
    !hasActiveKey

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (generateDisabled || preset === null) return
    await generate({
      prompt: prompt.trim(),
      provider,
      platform_preset: preset,
      logo_mode: logoMode,
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Generator — {brandName}</h2>
        <PromptInput value={prompt} onChange={setPrompt} disabled={submitting} />
        <PresetSelector value={preset} onChange={setPreset} disabled={submitting} />
        <ProviderSelector
          value={provider}
          onChange={setProvider}
          activeKeys={activeKeys}
          brandId={brandId}
          disabled={submitting}
        />
        <LogoModeSelector
          value={logoMode}
          onChange={setLogoMode}
          brandHasLogo={brandHasLogo}
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={generateDisabled}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Generating…' : 'Generate'}
        </button>
      </form>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Result</h3>
        <GeneratorResult state={state} brandId={brandId} />
      </div>
    </div>
  )
}
