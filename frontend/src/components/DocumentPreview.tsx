'use client'

import { useRef } from 'react'
import { fillTemplate } from '@/lib/template'
import type { FormData } from '@/lib/types'

type DocumentPreviewProps = {
  form: FormData
}

function DocumentPreview({ form }: DocumentPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  return (
    <div className="xl:sticky xl:top-8 xl:self-start">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Document Preview
          </h2>
          <span className="text-xs text-slate-400">Updates automatically</span>
        </div>
        <div
          ref={previewRef}
          id="pdf-content"
          className="p-8 font-serif text-sm leading-relaxed text-slate-900 whitespace-pre-wrap bg-white"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {fillTemplate(form)}
        </div>
      </div>
    </div>
  )
}

export { DocumentPreview }
