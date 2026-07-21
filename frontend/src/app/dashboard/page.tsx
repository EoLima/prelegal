'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth, authHeaders } from '@/lib/auth-context'
import { fillTemplate } from '@/lib/template'
import { fillGenericTemplate } from '@/lib/template'
import type { FormData } from '@/lib/types'
import { downloadPdf } from '@/lib/pdfGenerator'
import Link from 'next/link'

type Doc = { id: number; title: string; createdAt: string; updatedAt: string }
type Detail = { id: number; title: string; formData: unknown; extraFields: unknown; createdAt: string; updatedAt: string }

export default function DashboardPage() {
  const { user, token, loading, logout } = useAuth()
  const [docs, setDocs] = useState<Doc[]>([])
  const [fetching, setFetching] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!token) { window.location.href = '/login'; return }
    fetch('/api/documents', { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((data: Doc[]) => setDocs(data))
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [loading, token])

  const openDetail = useCallback(async (id: number) => {
    if (selectedId === id) { setSelectedId(null); return }
    setSelectedId(id)
    setLoadingDetail(true)
    try {
      const res = await fetch(`/api/documents/${id}`, { headers: authHeaders(token) })
      const data: Detail = await res.json()
      setDetail(data)
    } catch {} finally { setLoadingDetail(false) }
  }, [token, selectedId])

  const handleDownload = useCallback(async () => {
    if (!detail) return
    const form = detail.formData as FormData
    const extra = detail.extraFields as Record<string, unknown> | undefined
    await downloadPdf(form, extra)
  }, [detail])

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f4fd 100%)' }}>
        <p style={{ color: '#888888' }}>Loading...</p>
      </div>
    )
  }

  const fd = detail?.formData as Record<string, unknown> | undefined
  const extra = detail?.extraFields as Record<string, unknown> | undefined
  const isMnda = fd?.party1 || fd?.party2
  const previewContent = detail
    ? (isMnda ? fillTemplate(fd as unknown as FormData) : fillGenericTemplate(extra || {}))
    : ''

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f4fd 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm" style={{ backgroundColor: '#209dd7', color: '#ffffff' }}>P</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#032147' }}>Documents</h1>
              <p className="text-sm" style={{ color: '#888888' }}>{user?.name}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="rounded-xl px-4 py-2 text-sm font-medium text-white transition-all" style={{ backgroundColor: '#209dd7' }}>New document</Link>
            <button onClick={() => { logout(); window.location.href = '/login' }} className="rounded-xl px-4 py-2 text-sm font-medium border transition-all" style={{ borderColor: '#d0d5dd', color: '#888888' }}>Sign out</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {docs.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>No documents yet</p>
                <p className="text-xs mt-1" style={{ color: '#888888' }}>Create your first legal document with the AI assistant.</p>
              </div>
            ) : (
              docs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => openDetail(doc.id)}
                  className="w-full text-left bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow"
                  style={{ borderColor: selectedId === doc.id ? '#209dd7' : undefined }}
                >
                  <h3 className="font-semibold" style={{ color: '#032147' }}>{doc.title}</h3>
                  <p className="text-xs mt-1" style={{ color: '#888888' }}>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>

          <div>
            {selectedId && detail ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#f0f4f8' }}>
                  <h2 className="text-sm font-semibold" style={{ color: '#032147' }}>{detail.title}</h2>
                  <button
                    onClick={handleDownload}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                    style={{ backgroundColor: '#753991' }}
                  >
                    Download PDF
                  </button>
                </div>
                {loadingDetail ? (
                  <div className="p-8 text-center text-sm" style={{ color: '#888888' }}>Loading...</div>
                ) : (
                  <div className="p-6 font-serif text-xs leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[600px]" style={{ fontFamily: 'Georgia, "Times New Roman", serif', lineHeight: '1.7', color: '#1a1a2e' }}>
                    {previewContent}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center" style={{ color: '#888888' }}>
                <p className="text-sm">Select a document to preview</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 rounded-xl text-xs" style={{ backgroundColor: '#fff8e1', border: '1px solid #ffe082', color: '#795548' }}>
          <strong>Disclaimer:</strong> This document is a draft and has not been reviewed by a legal professional. It is subject to legal review and may require modifications to comply with applicable laws and regulations. Prelegal AI is not a law firm and does not provide legal advice.
        </div>
      </div>
    </div>
  )
}
