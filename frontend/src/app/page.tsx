'use client'

import { useState, useCallback } from 'react'
import type { FormData } from '@/lib/types'
import { defaultForm } from '@/lib/types'
import { downloadPdf } from '@/lib/pdfGenerator'
import { Header } from '@/components/Header'
import { PartyCard } from '@/components/PartyCard'
import { AgreementTerms } from '@/components/AgreementTerms'
import { DocumentPreview } from '@/components/DocumentPreview'
import { Button } from '@/components/ui/Button'

export default function Page() {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [downloading, setDownloading] = useState(false)

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateParty = useCallback(
    (party: 'party1' | 'party2', field: string, value: string) => {
      setForm((prev) => ({
        ...prev,
        [party]: { ...prev[party], [field]: value },
      }))
    },
    []
  )

  const handleDownload = useCallback(async () => {
    setDownloading(true)
    try {
      await downloadPdf(form)
    } catch (err) {
      console.error('PDF generation failed', err)
    } finally {
      setDownloading(false)
    }
  }, [form])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
          <section className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <PartyCard
                title="Party 1"
                index={1}
                party={form.party1}
                onChange={(f, v) => updateParty('party1', f, v)}
              />
              <PartyCard
                title="Party 2"
                index={2}
                party={form.party2}
                onChange={(f, v) => updateParty('party2', f, v)}
              />
            </div>

            <AgreementTerms form={form} onUpdate={update} />

            <Button
              onClick={handleDownload}
              loading={downloading}
              className="w-full"
            >
              Download as PDF
            </Button>
          </section>

          <DocumentPreview form={form} />
        </div>
      </div>
    </div>
  )
}
