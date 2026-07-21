'use client'

import { useState, useCallback, useRef } from 'react'
import type { FormData } from '@/lib/types'
import { defaultForm } from '@/lib/types'
import { downloadPdf } from '@/lib/pdfGenerator'
import { Header } from '@/components/Header'
import { DocumentPreview } from '@/components/DocumentPreview'
import { ChatArea } from '@/components/ChatArea'
import { Button } from '@/components/ui/Button'
import { useAuth, authHeaders } from '@/lib/auth-context'
import Link from 'next/link'

function extractMnda(data: Record<string, unknown>): Partial<FormData> {
  const out: Partial<FormData> = {}
  const p1 = data.party1 as Record<string, string> | undefined
  const p2 = data.party2 as Record<string, string> | undefined
  if (p1) out.party1 = { company: '', name: '', title: '', noticeAddress: '', date: '', ...p1 }
  if (p2) out.party2 = { company: '', name: '', title: '', noticeAddress: '', date: '', ...p2 }
  if (data.purpose) out.purpose = String(data.purpose)
  if (data.effectiveDate) out.effectiveDate = String(data.effectiveDate)
  if (data.mndaTermType === 'expires' || data.mndaTermType === 'continues') out.mndaTermType = data.mndaTermType
  if (data.mndaTermYears) out.mndaTermYears = Number(data.mndaTermYears)
  if (data.confidentialityType === 'years' || data.confidentialityType === 'perpetuity') out.confidentialityType = data.confidentialityType
  if (data.confidentialityYears) out.confidentialityYears = Number(data.confidentialityYears)
  if (data.governingLaw) out.governingLaw = String(data.governingLaw)
  if (data.jurisdiction) out.jurisdiction = String(data.jurisdiction)
  if (data.modifications) out.modifications = String(data.modifications)
  return out
}

function inferTitle(data: Record<string, unknown>, form: FormData, extraFields: Record<string, unknown>): string {
  if (form.party1.company && form.party2.company) return `MNDA: ${form.party1.company} & ${form.party2.company}`
  if (extraFields.providerCompany && extraFields.customerCompany) return `Agreement: ${extraFields.providerCompany} & ${extraFields.customerCompany}`
  if (form.party1.company) return `MNDA: ${form.party1.company}`
  if (extraFields.providerCompany) return `Agreement: ${extraFields.providerCompany}`
  if (form.purpose) return `MNDA: ${form.purpose.slice(0, 60)}`
  return 'Legal Document'
}

export default function Page() {
  const { user, token, loading: authLoading } = useAuth()
  const [form, setForm] = useState<FormData>(defaultForm)
  const [extraFields, setExtraFields] = useState<Record<string, unknown>>({})
  const [downloading, setDownloading] = useState(false)
  const [saved, setSaved] = useState(false)
  const savedRef = useRef(false)

  const handleFormUpdate = useCallback((data: Record<string, unknown>) => {
    const mnda = extractMnda(data)
    const hasMnda = Object.keys(mnda).length > 0
    if (hasMnda) {
      setForm((prev) => ({
        ...prev,
        ...mnda,
        party1: mnda.party1 ?? prev.party1,
        party2: mnda.party2 ?? prev.party2,
      }))
    }
    const mndaKeys = new Set(Object.keys(mnda))
    const extra: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(data)) {
      if (!mndaKeys.has(k)) extra[k] = v
    }
    if (Object.keys(extra).length > 0) setExtraFields(extra)
    savedRef.current = false
  }, [])

  const handleSave = useCallback(async () => {
    if (!token || savedRef.current) return
    try {
      const title = inferTitle({}, form, extraFields)
      await fetch('/api/documents', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ title, formData: form, extraFields }),
      })
      setSaved(true)
      savedRef.current = true
    } catch {
      // silent
    }
  }, [token, form, extraFields])

  const handleDownload = useCallback(async () => {
    setDownloading(true)
    try {
      handleSave()
      await downloadPdf(form, extraFields)
    } catch (err) {
      console.error('PDF generation failed', err)
    } finally {
      setDownloading(false)
    }
  }, [form, extraFields, handleSave])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f4fd 100%)' }}>
        <p style={{ color: '#888888' }}>Loading...</p>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f4fd 100%)' }}>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-sm text-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mx-auto mb-3" style={{ backgroundColor: '#209dd7', color: '#fff' }}>P</div>
          <h1 className="text-xl font-bold" style={{ color: '#032147' }}>Welcome to Prelegal</h1>
          <p className="text-sm mt-2" style={{ color: '#888888' }}>Sign in to generate legal documents with AI.</p>
          <div className="mt-6 space-y-3">
            <a href="/login" className="block w-full rounded-xl py-2.5 text-sm font-medium text-white" style={{ backgroundColor: '#753991' }}>Sign in</a>
            <a href="/signup" className="block w-full rounded-xl py-2.5 text-sm font-medium border" style={{ borderColor: '#d0d5dd', color: '#1a1a2e' }}>Create account</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f4fd 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <Header />
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium" style={{ color: '#209dd7' }}>My documents</Link>
            <span className="text-xs" style={{ color: '#888888' }}>{user?.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
          <section className="space-y-6">
            <ChatArea onFormUpdate={handleFormUpdate} />

            <Button
              onClick={handleDownload}
              loading={downloading}
              className="w-full"
            >
              Download as PDF
            </Button>

            {saved && (
              <p className="text-xs text-center" style={{ color: '#888888' }}>Document saved to your account</p>
            )}
          </section>

          <DocumentPreview form={form} extraFields={extraFields} />
        </div>

        <div className="mt-8 p-4 rounded-xl text-xs" style={{ backgroundColor: '#fff8e1', border: '1px solid #ffe082', color: '#795548' }}>
          <strong>Disclaimer:</strong> This document is a draft and has not been reviewed by a legal professional. It is subject to legal review and may require modifications to comply with applicable laws and regulations. Prelegal AI is not a law firm and does not provide legal advice.
        </div>
      </div>
    </div>
  )
}
