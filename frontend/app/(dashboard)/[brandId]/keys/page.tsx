'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useKeys } from '@/hooks/use-keys'
import { ProviderTabs } from '@/components/keys/provider-tabs'
import { KeyCard } from '@/components/keys/key-card'
import { AddKeyModal } from '@/components/keys/add-key-modal'
import { apiRequest } from '@/lib/api'
import { ProviderKey, ValidateKeyResponse } from '@/types'

export default function KeysPage() {
  const params = useParams()
  const brandId = Array.isArray(params.brandId) ? params.brandId[0] : params.brandId ?? ''
  const { keys, loading, error, refetch } = useKeys(brandId)

  const [showAddModal, setShowAddModal] = useState(false)
  const [addModalProvider, setAddModalProvider] = useState<'openai' | 'gemini'>('openai')
  const [validatingKeyId, setValidatingKeyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const handleValidate = async (keyId: string) => {
    setValidatingKeyId(keyId)
    setActionError(null)
    try {
      await apiRequest<ValidateKeyResponse>(`/brands/${brandId}/keys/${keyId}/validate`, {
        method: 'POST',
      })
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Validation failed')
    } finally {
      setValidatingKeyId(null)
    }
  }

  const handleActivate = async (keyId: string) => {
    setActionError(null)
    try {
      await apiRequest<ProviderKey>(`/brands/${brandId}/keys/${keyId}/activate`, {
        method: 'PATCH',
      })
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Activation failed')
    }
  }

  const handleDelete = async (keyId: string) => {
    setActionError(null)
    try {
      await apiRequest(`/brands/${brandId}/keys/${keyId}`, { method: 'DELETE' })
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Deletion failed')
    }
  }

  const handleAddClick = (provider: 'openai' | 'gemini') => {
    setAddModalProvider(provider)
    setShowAddModal(true)
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (error) {
    return <p className="text-red-600">Failed to load keys.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">API Keys</h2>
        <button
          type="button"
          onClick={() => handleAddClick('openai')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Add Key
        </button>
      </div>

      {actionError && (
        <p className="text-sm text-red-600">{actionError}</p>
      )}

      <ProviderTabs keys={keys}>
        {(filteredKeys, activeProvider) => (
          <div className="space-y-3">
            {filteredKeys.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No {activeProvider} keys yet. Add your first key to start generating images.
                </p>
                <button
                  type="button"
                  onClick={() => handleAddClick(activeProvider)}
                  className="mt-3 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Add {activeProvider === 'openai' ? 'OpenAI' : 'Gemini'} Key
                </button>
              </div>
            ) : (
              filteredKeys.map((k) => (
                <KeyCard
                  key={k.id}
                  keyData={k}
                  onValidate={handleValidate}
                  onActivate={handleActivate}
                  onDelete={handleDelete}
                  isValidating={validatingKeyId === k.id}
                />
              ))
            )}
          </div>
        )}
      </ProviderTabs>

      <AddKeyModal
        brandId={brandId}
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onKeyAdded={refetch}
        defaultProvider={addModalProvider}
      />
    </div>
  )
}
