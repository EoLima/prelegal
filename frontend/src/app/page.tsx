'use client'

import { useState, useCallback } from 'react'

type FormData = {
  party1: { company: string; name: string; title: string; noticeAddress: string; date: string }
  party2: { company: string; name: string; title: string; noticeAddress: string; date: string }
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

function buildCoverPage(d: FormData): string {
  const party1 = d.party1
  const party2 = d.party2

  const mndaTermText =
    d.mndaTermType === 'expires'
      ? `Expires ${d.mndaTermYears} year(s) from Effective Date.`
      : 'Continues until terminated in accordance with the terms of the MNDA.'

  const confidentialityText =
    d.confidentialityType === 'years'
      ? `${d.confidentialityYears} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
      : 'In perpetuity.'

  return `# Mutual Non-Disclosure Agreement

## USING THIS MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "MNDA") consists of: (1) this Cover Page ("Cover Page") and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 ("Standard Terms") identical to those posted at commonpaper.com/standards/mutual-nda/1.0. Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.

### Purpose
${d.purpose}

### Effective Date
${d.effectiveDate}

### MNDA Term
- ${d.mndaTermType === 'expires' ? '[x]' : '[ ]'} ${mndaTermText}
- ${d.mndaTermType === 'continues' ? '[x]' : '[ ]'} Continues until terminated in accordance with the terms of the MNDA.

### Term of Confidentiality
- ${d.confidentialityType === 'years' ? '[x]' : '[ ]'} ${confidentialityText}
- ${d.confidentialityType === 'perpetuity' ? '[x]' : '[ ]'} In perpetuity.

### Governing Law & Jurisdiction
Governing Law: ${d.governingLaw}

Jurisdiction: ${d.jurisdiction}

### MNDA Modifications
${d.modifications || 'None'}

By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.

|  | PARTY 1 | PARTY 2 |
| :--- | :----: | :----: |
| Signature | | |
| Print Name | ${party1.name} | ${party2.name} |
| Title | ${party1.title} | ${party2.title} |
| Company | ${party1.company} | ${party2.company} |
| Notice Address | ${party1.noticeAddress} | ${party2.noticeAddress} |
| Date | ${party1.date} | ${party2.date} |

Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.
`
}

function buildStandardTerms(d: FormData): string {
  const purpose = d.purpose
  const governingLaw = d.governingLaw
  const jurisdiction = d.jurisdiction
  const effectiveDate = d.effectiveDate

  return `# Standard Terms

1. **Introduction**. This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page (defined below)) ("MNDA") allows each party ("Disclosing Party") to disclose or make available information in connection with the ${purpose} which (1) the Disclosing Party identifies to the receiving party ("Receiving Party") as "confidential", "proprietary", or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure ("Confidential Information"). Each party's Confidential Information also includes the existence and status of the parties' discussions and information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms ("Cover Page"). Each party is identified on the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.

2. **Use and Protection of Confidential Information**. The Receiving Party shall: (a) use Confidential Information solely for the ${purpose}; (b) not disclose Confidential Information to third parties without the Disclosing Party's prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the ${purpose}, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.

3. **Exceptions**. The Receiving Party's obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.

4. **Disclosures Required by Law**. The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party's expense, with the Disclosing Party's efforts to obtain confidential treatment for the Confidential Information.

5. **Term and Termination**. This MNDA commences on the ${effectiveDate} and expires at the end of the MNDA Term. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party's obligations relating to Confidential Information will survive for the Term of Confidentiality, despite any expiration or termination of this MNDA.

6. **Return or Destruction of Confidential Information**. Upon expiration or termination of this MNDA or upon the Disclosing Party's earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party's written request, destroy all Confidential Information in the Receiving Party's possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.

7. **Proprietary Rights**. The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.

8. **Disclaimer**. ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.

9. **Governing Law and Jurisdiction**. This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the State of ${governingLaw}, without regard to the conflict of laws provisions of such ${governingLaw}. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in ${jurisdiction}. Each party irrevocably submits to the exclusive jurisdiction of such ${jurisdiction} in any such suit, action, or proceeding.

10. **Equitable Relief**. A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.

11. **General**. Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party's permitted successors and assigns. Waivers must be signed by the waiving party's authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.

Common Paper Mutual Non-Disclosure Agreement Version 1.0 free to use under CC BY 4.0.
`
}

function buildFullDocument(d: FormData): string {
  return buildCoverPage(d) + '\n\n---\n\n' + buildStandardTerms(d)
}

type FieldProps = {
  label: string
  children: React.ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

export default function Page() {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [preview, setPreview] = useState(false)

  const update = useCallback(<K extends keyof FormData>(section: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [section]: value }))
  }, [])

  const updateParty = useCallback((party: 'party1' | 'party2', field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [party]: { ...prev[party], [field]: value },
    }))
  }, [])

  const download = useCallback(() => {
    const content = buildFullDocument(form)
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Mutual-NDA.md'
    a.click()
    URL.revokeObjectURL(url)
  }, [form])

  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Mutual NDA Creator</h1>
        <p className="text-gray-600 mt-1">
          Fill in the details below to generate a Mutual Non-Disclosure Agreement.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Party 1 */}
            <div className="space-y-4 border rounded-lg p-4 bg-white">
              <h2 className="font-semibold text-lg">Party 1</h2>
              <Field label="Company">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.party1.company}
                  onChange={e => updateParty('party1', 'company', e.target.value)}
                />
              </Field>
              <Field label="Print Name">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.party1.name}
                  onChange={e => updateParty('party1', 'name', e.target.value)}
                />
              </Field>
              <Field label="Title">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.party1.title}
                  onChange={e => updateParty('party1', 'title', e.target.value)}
                />
              </Field>
              <Field label="Notice Address">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.party1.noticeAddress}
                  onChange={e => updateParty('party1', 'noticeAddress', e.target.value)}
                />
              </Field>
              <Field label="Date">
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.party1.date}
                  onChange={e => updateParty('party1', 'date', e.target.value)}
                />
              </Field>
            </div>

            {/* Party 2 */}
            <div className="space-y-4 border rounded-lg p-4 bg-white">
              <h2 className="font-semibold text-lg">Party 2</h2>
              <Field label="Company">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.party2.company}
                  onChange={e => updateParty('party2', 'company', e.target.value)}
                />
              </Field>
              <Field label="Print Name">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.party2.name}
                  onChange={e => updateParty('party2', 'name', e.target.value)}
                />
              </Field>
              <Field label="Title">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.party2.title}
                  onChange={e => updateParty('party2', 'title', e.target.value)}
                />
              </Field>
              <Field label="Notice Address">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.party2.noticeAddress}
                  onChange={e => updateParty('party2', 'noticeAddress', e.target.value)}
                />
              </Field>
              <Field label="Date">
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.party2.date}
                  onChange={e => updateParty('party2', 'date', e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* Agreement Fields */}
          <div className="space-y-4 border rounded-lg p-4 bg-white">
            <h2 className="font-semibold text-lg">Agreement Details</h2>

            <Field label="Purpose">
              <textarea
                className="w-full border rounded px-3 py-2 text-sm"
                rows={3}
                value={form.purpose}
                onChange={e => update('purpose', e.target.value)}
              />
            </Field>

            <Field label="Effective Date">
              <input
                type="date"
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.effectiveDate}
                onChange={e => update('effectiveDate', e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="MNDA Term">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="mndaTerm"
                      checked={form.mndaTermType === 'expires'}
                      onChange={() => update('mndaTermType', 'expires')}
                    />
                    Expires{' '}
                    <input
                      type="number"
                      min={1}
                      className="w-16 border rounded px-2 py-1 text-sm"
                      value={form.mndaTermYears}
                      onChange={e => update('mndaTermYears', Number(e.target.value))}
                    />{' '}
                    year(s) from Effective Date
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="mndaTerm"
                      checked={form.mndaTermType === 'continues'}
                      onChange={() => update('mndaTermType', 'continues')}
                    />
                    Continues until terminated
                  </label>
                </div>
              </Field>

              <Field label="Term of Confidentiality">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="confidentiality"
                      checked={form.confidentialityType === 'years'}
                      onChange={() => update('confidentialityType', 'years')}
                    />
                    <input
                      type="number"
                      min={1}
                      className="w-16 border rounded px-2 py-1 text-sm"
                      value={form.confidentialityYears}
                      onChange={e => update('confidentialityYears', Number(e.target.value))}
                    />{' '}
                    year(s) from Effective Date
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="confidentiality"
                      checked={form.confidentialityType === 'perpetuity'}
                      onChange={() => update('confidentialityType', 'perpetuity')}
                    />
                    In perpetuity
                  </label>
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Governing Law (State)">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.governingLaw}
                  onChange={e => update('governingLaw', e.target.value)}
                />
              </Field>

              <Field label="Jurisdiction">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g. New Castle, DE"
                  value={form.jurisdiction}
                  onChange={e => update('jurisdiction', e.target.value)}
                />
              </Field>
            </div>

            <Field label="MNDA Modifications (optional)">
              <textarea
                className="w-full border rounded px-3 py-2 text-sm"
                rows={3}
                value={form.modifications}
                onChange={e => update('modifications', e.target.value)}
              />
            </Field>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPreview(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Preview NDA
            </button>
            <button
              onClick={download}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700"
            >
              Download as Markdown
            </button>
          </div>
        </section>

        {/* Preview */}
        <section>
          {preview ? (
            <div className="border rounded-lg p-6 bg-white space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Preview</h2>
                <button
                  onClick={() => setPreview(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Hide
                </button>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {buildFullDocument(form)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-6 bg-gray-50 text-center text-gray-400 h-full flex items-center justify-center">
              Fill in the form and click "Preview NDA" to see the generated document.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
