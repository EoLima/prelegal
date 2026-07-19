'use client'

import { useState, useCallback } from 'react'
import type { FormData } from '@/lib/types'
import { defaultForm } from '@/lib/types'
import { downloadPdf } from '@/lib/pdfGenerator'
import { Header } from '@/components/Header'
import { DocumentPreview } from '@/components/DocumentPreview'
import { ChatArea } from '@/components/ChatArea'
import { Button } from '@/components/ui/Button'

export default function Page() {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [downloading, setDownloading] = useState(false)

  const handleFormUpdate = useCallback((data: FormData) => {
    setForm(data)
  }, [])

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

          <DocumentPreview form={form} />
        </div>
      </div>
    </div>
  )
}
