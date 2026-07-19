'use client'

import { useRef } from 'react'
import { fillTemplate } from '@/lib/template'
import type { FormData } from '@/lib/types'

type DocumentPreviewProps = {
  form: FormData
}

function DocumentPreview({ form }: DocumentPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  const hasData = Object.values(form.party1).some(Boolean) || Object.values(form.party2).some(Boolean) || form.purpose || form.governingLaw

  return (
    <div className="xl:sticky xl:top-8 xl:self-start">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-3 flex items-center justify-between" style={{ backgroundColor: '#f0f4f8' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: '#032147' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Document Preview
          </h2>
          <span className="text-xs" style={{ color: '#888888' }}>Updates automatically</span>
        </div>
        {hasData ? (
          <div
            ref={previewRef}
            id="pdf-content"
            className="p-6 sm:p-8 font-serif text-sm leading-relaxed whitespace-pre-wrap bg-white"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1a1a2e', lineHeight: '1.8' }}
          >
            {fillTemplate(form)}
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center" style={{ color: '#888888' }}>
            <svg className="w-12 h-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm">Chat with the AI assistant to generate your document.</p>
            <p className="text-xs mt-1">The preview will update as you provide information.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export { DocumentPreview }
