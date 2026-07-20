'use client'

import { useState, useCallback } from 'react'
import type { FormData } from '@/lib/types'
import { defaultForm } from '@/lib/types'
import { downloadPdf } from '@/lib/pdfGenerator'
import { Header } from '@/components/Header'
import { DocumentPreview } from '@/components/DocumentPreview'
import { ChatArea } from '@/components/ChatArea'
import { Button } from '@/components/ui/Button'

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

export default function Page() {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [extraFields, setExtraFields] = useState<Record<string, unknown>>({})
  const [downloading, setDownloading] = useState(false)

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
  }, [])

  const handleDownload = useCallback(async () => {
    setDownloading(true)
    try {
      await downloadPdf(form, extraFields)
    } catch (err) {
      console.error('PDF generation failed', err)
    } finally {
      setDownloading(false)
    }
  }, [form, extraFields])

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f4fd 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header />

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
          </section>

          <DocumentPreview form={form} extraFields={extraFields} />
        </div>
      </div>
    </div>
  )
}
