'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

type PartyInfo = {
  company: string
  name: string
  title: string
  noticeAddress: string
  date: string
}

type FormData = {
  party1: PartyInfo
  party2: PartyInfo
  purpose: string
  effectiveDate: string
  mndaTermType: 'expires' | 'continues'
  mndaTermYears: number
  confidentialityType: 'years' | 'perpetuity'
  confidentialityYears: number
  governingLaw: string
  jurisdiction: string
  modifications: string
}

const defaultForm: FormData = {
  party1: { company: '', name: '', title: '', noticeAddress: '', date: '' },
  party2: { company: '', name: '', title: '', noticeAddress: '', date: '' },
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: new Date().toISOString().split('T')[0],
  mndaTermType: 'expires',
  mndaTermYears: 1,
  confidentialityType: 'years',
  confidentialityYears: 1,
  governingLaw: '',
  jurisdiction: '',
  modifications: '',
}

function fillTemplate(d: FormData): string {
  const c = d.party1
  const p = d.party2
  const purpose = d.purpose
  const effectiveDate = d.effectiveDate
  const governingLaw = d.governingLaw
  const jurisdiction = d.jurisdiction

  const mndaTerm =
    d.mndaTermType === 'expires'
      ? `Expires ${d.mndaTermYears} year(s) from Effective Date.`
      : 'Continues until terminated in accordance with the terms of the MNDA.'

  const confidentialityTerm =
    d.confidentialityType === 'years'
      ? `${d.confidentialityYears} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
      : 'In perpetuity.'

  return `Mutual Non-Disclosure Agreement

Cover Page

This Mutual Non-Disclosure Agreement (the "MNDA") consists of: (1) this Cover Page and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 ("Standard Terms"). Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.

Purpose: ${purpose}

Effective Date: ${effectiveDate}

MNDA Term:
  [${d.mndaTermType === 'expires' ? 'X' : ' '}] ${mndaTerm}
  [${d.mndaTermType === 'continues' ? 'X' : ' '}] Continues until terminated in accordance with the terms of the MNDA.

Term of Confidentiality:
  [${d.confidentialityType === 'years' ? 'X' : ' '}] ${confidentialityTerm}
  [${d.confidentialityType === 'perpetuity' ? 'X' : ' '}] In perpetuity.

Governing Law & Jurisdiction:
  Governing Law: ${governingLaw}
  Jurisdiction: ${jurisdiction}

MNDA Modifications: ${d.modifications || 'None'}

By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.

                              PARTY 1              PARTY 2
Signature:                    __________________   __________________
Print Name:                   ${c.name || '__________________'}   ${p.name || '__________________'}
Title:                        ${c.title || '__________________'}   ${p.title || '__________________'}
Company:                      ${c.company || '__________________'}   ${p.company || '__________________'}
Notice Address:               ${c.noticeAddress || '__________________'}   ${p.noticeAddress || '__________________'}
Date:                         ${c.date || '__________________'}   ${p.date || '__________________'}

---

Standard Terms

1. Introduction. This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page) ("MNDA") allows each party ("Disclosing Party") to disclose or make available information in connection with the ${purpose} which (1) the Disclosing Party identifies to the receiving party ("Receiving Party") as "confidential", "proprietary", or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure ("Confidential Information"). Each party's Confidential Information also includes the existence and status of the parties' discussions and information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms ("Cover Page"). Each party is identified on the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.

2. Use and Protection of Confidential Information. The Receiving Party shall: (a) use Confidential Information solely for the ${purpose}; (b) not disclose Confidential Information to third parties without the Disclosing Party's prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the ${purpose}, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.

3. Exceptions. The Receiving Party's obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.

4. Disclosures Required by Law. The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party's expense, with the Disclosing Party's efforts to obtain confidential treatment for the Confidential Information.

5. Term and Termination. This MNDA commences on the ${effectiveDate} and expires at the end of the MNDA Term. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party's obligations relating to Confidential Information will survive for the Term of Confidentiality, despite any expiration or termination of this MNDA.

6. Return or Destruction of Confidential Information. Upon expiration or termination of this MNDA or upon the Disclosing Party's earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party's written request, destroy all Confidential Information in the Receiving Party's possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.

7. Proprietary Rights. The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.

8. Disclaimer. ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.

9. Governing Law and Jurisdiction. This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the State of ${governingLaw}, without regard to the conflict of laws provisions of such ${governingLaw}. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in ${jurisdiction}. Each party irrevocably submits to the exclusive jurisdiction of such ${jurisdiction} in any such suit, action, or proceeding.

10. Equitable Relief. A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.

11. General. Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party's permitted successors and assigns. Waivers must be signed by the waiving party's authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.

Common Paper Mutual Non-Disclosure Agreement Version 1.0 - Free to use under CC BY 4.0.`
}

function FormField({ label, children, optional }: { label: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}{optional && <span className="text-gray-400 font-normal lowercase ml-1">(optional)</span>}
      </label>
      {children}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${props.className ?? ''}`}
    />
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y ${props.className ?? ''}`}
    />
  )
}

function PartyCard({ title, party, onChange }: { title: string; party: PartyInfo; onChange: (f: string, v: string) => void }) {
  const fields: { label: string; key: keyof PartyInfo; type?: string }[] = [
    { label: 'Company', key: 'company' },
    { label: 'Print Name', key: 'name' },
    { label: 'Title', key: 'title' },
    { label: 'Notice Address', key: 'noticeAddress' },
    { label: 'Date', key: 'date', type: 'date' },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3.5 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-base flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{title === 'Party 1' ? '1' : '2'}</span>
        {title}
      </h3>
      {fields.map(f => (
        <FormField key={f.key} label={f.label}>
          <Input
            type={f.type ?? 'text'}
            placeholder={f.label}
            value={party[f.key]}
            onChange={e => onChange(f.key, e.target.value)}
          />
        </FormField>
      ))}
    </div>
  )
}

export default function Page() {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const update = useCallback(<K extends keyof FormData>(section: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [section]: value }))
  }, [])

  const updateParty = useCallback((party: 'party1' | 'party2', field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [party]: { ...prev[party], [field]: value },
    }))
  }, [])

  const downloadPdf = useCallback(async () => {
    if (!previewRef.current) return
    setDownloading(true)

    try {
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const usableWidth = pdfWidth - margin * 2

      const imgProps = pdf.getImageProperties(imgData)
      const imgHeight = (imgProps.height * usableWidth) / imgProps.width

      let heightLeft = imgHeight
      let position = margin

      pdf.addImage(imgData, 'PNG', margin, position, usableWidth, imgHeight)
      heightLeft -= pdfHeight - margin * 2

      while (heightLeft > 0) {
        position = -(pdfHeight - margin * 2 - position) - margin
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, position, usableWidth, imgHeight)
        heightLeft -= pdfHeight - margin * 2
      }

      pdf.save('Mutual-NDA.pdf')
    } catch (err) {
      console.error('PDF generation failed', err)
    } finally {
      setDownloading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">P</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mutual NDA Creator</h1>
              <p className="text-sm text-gray-500">Generate a professional Mutual Non-Disclosure Agreement</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <PartyCard title="Party 1" party={form.party1} onChange={(f, v) => updateParty('party1', f, v)} />
              <PartyCard title="Party 2" party={form.party2} onChange={(f, v) => updateParty('party2', f, v)} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 text-base">Agreement Terms</h3>

              <FormField label="Purpose">
                <Textarea
                  rows={2}
                  value={form.purpose}
                  onChange={e => update('purpose', e.target.value)}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Effective Date">
                  <Input type="date" value={form.effectiveDate} onChange={e => update('effectiveDate', e.target.value)} />
                </FormField>

                <FormField label="Governing Law (State)">
                  <Input placeholder="e.g. Delaware" value={form.governingLaw} onChange={e => update('governingLaw', e.target.value)} />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Jurisdiction">
                  <Input placeholder="e.g. New Castle, DE" value={form.jurisdiction} onChange={e => update('jurisdiction', e.target.value)} />
                </FormField>
              </div>

              <fieldset className="border border-gray-100 rounded-lg p-4 space-y-3">
                <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">MNDA Term</legend>
                <label className="flex items-center gap-3 text-sm cursor-pointer group">
                  <input
                    type="radio"
                    name="mndaTerm"
                    checked={form.mndaTermType === 'expires'}
                    onChange={() => update('mndaTermType', 'expires')}
                    className="accent-blue-600"
                  />
                  <span>Expires</span>
                  <input
                    type="number"
                    min={1}
                    className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.mndaTermYears}
                    onChange={e => update('mndaTermYears', Number(e.target.value))}
                  />
                  <span>year(s) from Effective Date</span>
                </label>
                <label className="flex items-center gap-3 text-sm cursor-pointer group">
                  <input
                    type="radio"
                    name="mndaTerm"
                    checked={form.mndaTermType === 'continues'}
                    onChange={() => update('mndaTermType', 'continues')}
                    className="accent-blue-600"
                  />
                  <span>Continues until terminated</span>
                </label>
              </fieldset>

              <fieldset className="border border-gray-100 rounded-lg p-4 space-y-3">
                <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Term of Confidentiality</legend>
                <label className="flex items-center gap-3 text-sm cursor-pointer group">
                  <input
                    type="radio"
                    name="confidentiality"
                    checked={form.confidentialityType === 'years'}
                    onChange={() => update('confidentialityType', 'years')}
                    className="accent-blue-600"
                  />
                  <input
                    type="number"
                    min={1}
                    className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.confidentialityYears}
                    onChange={e => update('confidentialityYears', Number(e.target.value))}
                  />
                  <span>year(s) from Effective Date</span>
                </label>
                <label className="flex items-center gap-3 text-sm cursor-pointer group">
                  <input
                    type="radio"
                    name="confidentiality"
                    checked={form.confidentialityType === 'perpetuity'}
                    onChange={() => update('confidentialityType', 'perpetuity')}
                    className="accent-blue-600"
                  />
                  <span>In perpetuity</span>
                </label>
              </fieldset>

              <FormField label="Modifications" optional>
                <Textarea
                  rows={2}
                  value={form.modifications}
                  onChange={e => update('modifications', e.target.value)}
                />
              </FormField>
            </div>

            <button
              onClick={downloadPdf}
              disabled={downloading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>Generating PDF...</>
              ) : (
                <>Download as PDF</>
              )}
            </button>
          </section>

          {/* Live Preview */}
          <section className="xl:sticky xl:top-8 xl:self-start">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Document Preview</h2>
                <span className="text-xs text-gray-400">Updates automatically</span>
              </div>
              <div
                ref={previewRef}
                id="pdf-content"
                className="p-8 font-serif text-sm leading-relaxed text-gray-900 whitespace-pre-wrap bg-white"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {fillTemplate(form)}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
