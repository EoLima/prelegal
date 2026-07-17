import type { FormData } from './types'

export async function downloadPdf(form: FormData): Promise<void> {
  const jsPDF = (await import('jspdf')).default

  const doc = new jsPDF('p', 'mm', 'a4')
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxW = pageW - margin * 2
  let y = margin

  function addLine(text: string, style?: 'bold' | 'italic' | 'normal', size?: number) {
    const lines = doc.splitTextToSize(text, maxW)
    const lineH = (size ?? 10) * 0.3528
    lines.forEach((line: string) => {
      if (y + lineH > pageH - margin) {
        doc.addPage()
        y = margin
      }
      if (style === 'bold') doc.setFont('helvetica', 'bold')
      else if (style === 'italic') doc.setFont('helvetica', 'italic')
      else doc.setFont('helvetica', 'normal')

      doc.setFontSize(size ?? 10)
      doc.text(line, margin, y)
      y += lineH * 1.4
    })
  }

  function addEmptyLine(h?: number) {
    y += h ?? 4
  }

  const d = form

  addLine('Mutual Non-Disclosure Agreement', 'bold', 18)
  addEmptyLine(6)
  addLine('Cover Page', 'bold', 13)
  addEmptyLine(4)

  addLine(
    `This Mutual Non-Disclosure Agreement (the "MNDA") consists of: (1) this Cover Page and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 ("Standard Terms"). Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.`
  )
  addEmptyLine()

  addLine(`Purpose: ${d.purpose}`)
  addEmptyLine()
  addLine(`Effective Date: ${d.effectiveDate}`)
  addEmptyLine(6)

  const mndaTerm =
    d.mndaTermType === 'expires'
      ? `Expires ${d.mndaTermYears} year(s) from Effective Date.`
      : 'Continues until terminated in accordance with the terms of the MNDA.'
  const confidentialityTerm =
    d.confidentialityType === 'years'
      ? `${d.confidentialityYears} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
      : 'In perpetuity.'

  addLine('MNDA Term:', 'bold')
  addLine(`  [${d.mndaTermType === 'expires' ? 'X' : ' '}] ${mndaTerm}`)
  addLine(
    `  [${d.mndaTermType === 'continues' ? 'X' : ' '}] Continues until terminated in accordance with the terms of the MNDA.`
  )
  addEmptyLine(4)

  addLine('Term of Confidentiality:', 'bold')
  addLine(`  [${d.confidentialityType === 'years' ? 'X' : ' '}] ${confidentialityTerm}`)
  addLine(`  [${d.confidentialityType === 'perpetuity' ? 'X' : ' '}] In perpetuity.`)
  addEmptyLine(4)

  addLine('Governing Law & Jurisdiction:', 'bold')
  addLine(`  Governing Law: ${d.governingLaw || '(not specified)'}`)
  addLine(`  Jurisdiction: ${d.jurisdiction || '(not specified)'}`)
  addEmptyLine()

  addLine(`MNDA Modifications: ${d.modifications || 'None'}`)
  addEmptyLine(6)

  addLine(
    'By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.'
  )
  addEmptyLine(8)

  const gap = 4
  const labelW = 30
  const colW = (maxW - labelW - gap * 2) / 2
  const labelX = margin
  const p1Center = margin + labelW + gap + colW / 2
  const p2Center = margin + labelW + gap + colW + gap + colW / 2
  const rowH = 7

  const sigRows: { label: string; v1: string; v2: string }[] = [
    { label: 'Signature', v1: '', v2: '' },
    { label: 'Print Name', v1: d.party1.name, v2: d.party2.name },
    { label: 'Title', v1: d.party1.title, v2: d.party2.title },
    { label: 'Company', v1: d.party1.company, v2: d.party2.company },
    { label: 'Notice Address', v1: d.party1.noticeAddress, v2: d.party2.noticeAddress },
    { label: 'Date', v1: d.party1.date, v2: d.party2.date },
  ]

  function drawUnderline(cx: number, textW: number) {
    const w = textW > 0 ? textW : 40
    doc.setDrawColor(180)
    doc.line(cx - w / 2, y + 1.5, cx + w / 2, y + 1.5)
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('', labelX, y)
  doc.text('PARTY 1', p1Center, y, { align: 'center' })
  doc.text('PARTY 2', p2Center, y, { align: 'center' })
  y += rowH + 3

  for (const row of sigRows) {
    if (y + rowH > pageH - margin) {
      doc.addPage()
      y = margin
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)

    doc.text(row.label, labelX, y)

    const v1 = row.v1 || ''
    const v2 = row.v2 || ''

    doc.text(v1 || ' ', p1Center, y, { align: 'center' })
    doc.text(v2 || ' ', p2Center, y, { align: 'center' })

    drawUnderline(p1Center, doc.getTextWidth(v1))
    drawUnderline(p2Center, doc.getTextWidth(v2))

    y += rowH + 2
  }

  doc.addPage()
  y = margin
  addLine('Standard Terms', 'bold', 15)
  addEmptyLine(6)

  const standardTerms = [
    {
      num: '1',
      title: 'Introduction',
      text: `This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page) ("MNDA") allows each party ("Disclosing Party") to disclose or make available information in connection with the ${d.purpose} which (1) the Disclosing Party identifies to the receiving party ("Receiving Party") as "confidential", "proprietary", or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure ("Confidential Information"). Each party's Confidential Information also includes the existence and status of the parties' discussions and information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms ("Cover Page"). Each party is identified on the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.`,
    },
    {
      num: '2',
      title: 'Use and Protection of Confidential Information',
      text: `The Receiving Party shall: (a) use Confidential Information solely for the ${d.purpose}; (b) not disclose Confidential Information to third parties without the Disclosing Party's prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the ${d.purpose}, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.`,
    },
    {
      num: '3',
      title: 'Exceptions',
      text: "The Receiving Party's obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.",
    },
    {
      num: '4',
      title: 'Disclosures Required by Law',
      text: "The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party's expense, with the Disclosing Party's efforts to obtain confidential treatment for the Confidential Information.",
    },
    {
      num: '5',
      title: 'Term and Termination',
      text: `This MNDA commences on the ${d.effectiveDate} and expires at the end of the MNDA Term. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party's obligations relating to Confidential Information will survive for the Term of Confidentiality, despite any expiration or termination of this MNDA.`,
    },
    {
      num: '6',
      title: 'Return or Destruction of Confidential Information',
      text: "Upon expiration or termination of this MNDA or upon the Disclosing Party's earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party's written request, destroy all Confidential Information in the Receiving Party's possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.",
    },
    {
      num: '7',
      title: 'Proprietary Rights',
      text: "The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.",
    },
    {
      num: '8',
      title: 'Disclaimer',
      text: 'ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.',
    },
    {
      num: '9',
      title: 'Governing Law and Jurisdiction',
      text: `This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the State of ${d.governingLaw}, without regard to the conflict of laws provisions of such ${d.governingLaw}. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in ${d.jurisdiction}. Each party irrevocably submits to the exclusive jurisdiction of such ${d.jurisdiction} in any such suit, action, or proceeding.`,
    },
    {
      num: '10',
      title: 'Equitable Relief',
      text: 'A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.',
    },
    {
      num: '11',
      title: 'General',
      text: "Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party's permitted successors and assigns. Waivers must be signed by the waiving party's authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.",
    },
  ]

  for (const s of standardTerms) {
    addLine(`${s.num}. ${s.title}.`, 'bold')
    addLine(s.text)
    addEmptyLine(4)
  }

  addEmptyLine()
  addLine(
    'Common Paper Mutual Non-Disclosure Agreement Version 1.0 - Free to use under CC BY 4.0.',
    'italic',
    9
  )

  doc.save('Mutual-NDA.pdf')
}
