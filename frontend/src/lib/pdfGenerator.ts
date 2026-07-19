import type { FormData } from './types'

function addFooter(doc: import('jspdf').jsPDF) {
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(140, 140, 140)
  doc.line(22, pageH - 12, pageW - 22, pageH - 12)
  doc.text('Prelegal — Mutual Non-Disclosure Agreement', 22, pageH - 7)
  const pageNum = doc.getCurrentPageInfo().pageNumber
  doc.text(`Page ${pageNum}`, pageW - 22, pageH - 7, { align: 'right' })
}

export async function downloadPdf(form: FormData): Promise<void> {
  const jsPDF = (await import('jspdf')).default

  const doc = new jsPDF('p', 'mm', 'a4')
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 22
  const maxW = pageW - margin * 2
  let y = margin

  function addLine(text: string, style?: 'bold' | 'italic' | 'normal', size?: number, color?: [number, number, number]) {
    const lines = doc.splitTextToSize(text, maxW)
    const lineH = (size ?? 10) * 0.3528
    lines.forEach((line: string) => {
      if (y + lineH > pageH - margin - 10) {
        addFooter(doc)
        doc.addPage()
        y = margin
      }
      if (style === 'bold') doc.setFont('helvetica', 'bold')
      else if (style === 'italic') doc.setFont('helvetica', 'italic')
      else doc.setFont('helvetica', 'normal')

      doc.setFontSize(size ?? 10)
      if (color) doc.setTextColor(color[0], color[1], color[2])
      else doc.setTextColor(30, 30, 30)
      doc.text(line, margin, y)
      y += lineH * 1.5
    })
  }

  function addEmptyLine(h?: number) {
    y += h ?? 4
  }

  function drawHR() {
    doc.setDrawColor(180, 180, 180)
    doc.line(margin, y, pageW - margin, y)
    y += 5
  }

  const d = form
  const navy: [number, number, number] = [3, 33, 71]
  const gray: [number, number, number] = [136, 136, 136]

  addFooter(doc)

  addLine('PREPARED BY PRELEGAL', 'normal', 8, gray)
  drawHR()

  addLine('Mutual Non-Disclosure Agreement', 'bold', 20, navy)
  addLine('Cover Page', 'bold', 12, gray)
  drawHR()

  addLine(
    'This Mutual Non-Disclosure Agreement (the "MNDA") consists of: (1) this Cover Page and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 ("Standard Terms"). Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.',
    'normal',
    9,
    [80, 80, 80]
  )
  addEmptyLine(6)

  doc.setDrawColor(180, 180, 180)
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(margin, y, maxW, 54, 2, 2, 'FD')
  const boxY = y + 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(navy[0], navy[1], navy[2])
  doc.text('AGREEMENT SUMMARY', margin + 4, boxY)
  doc.setDrawColor(200, 200, 200)
  doc.line(margin + 4, boxY + 2, pageW - margin - 4, boxY + 2)
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(8.5)
  const rowH = 6
  doc.text(`Purpose:              ${d.purpose || '(not specified)'}`, margin + 4, boxY + rowH + 4)
  doc.text(`Effective Date:       ${d.effectiveDate || '(not specified)'}`, margin + 4, boxY + rowH * 2 + 4)
  doc.text(`Governing Law:        ${d.governingLaw || '(not specified)'}`, margin + 4, boxY + rowH * 3 + 4)
  doc.text(`Jurisdiction:         ${d.jurisdiction || '(not specified)'}`, margin + 4, boxY + rowH * 4 + 4)
  doc.text(`MNDA Term:            ${d.mndaTermType === 'expires' ? `Expires ${d.mndaTermYears} year(s) from Effective Date` : 'Continues until terminated'}`, margin + 4, boxY + rowH * 5 + 4)
  doc.text(`Confidentiality Term: ${d.confidentialityType === 'years' ? `${d.confidentialityYears} year(s)` : 'In perpetuity'}`, margin + 4, boxY + rowH * 6 + 4)
  y += 60

  addLine('By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.', 'italic', 9)
  addEmptyLine(8)

  addLine('SIGNATURE PAGE', 'bold', 11, navy)
  drawHR()

  const gap = 4
  const labelW = 24
  const colW = (maxW - labelW - gap * 2) / 2
  const labelX = margin
  const p1Left = margin + labelW + gap
  const p2Left = margin + labelW + gap + colW + gap

  doc.setDrawColor(180, 180, 180)
  doc.rect(margin, y, maxW, 48)
  doc.setFillColor(248, 250, 252)
  doc.rect(margin, y, maxW, 8.5, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(navy[0], navy[1], navy[2])
  doc.text('', labelX, y + 6)
  doc.text('PARTY 1', p1Left, y + 6)
  doc.text('PARTY 2', p2Left, y + 6)
  y += 11.5

  const sigRows: { label: string; v1: string; v2: string }[] = [
    { label: 'Signature', v1: '', v2: '' },
    { label: 'Print Name', v1: d.party1.name, v2: d.party2.name },
    { label: 'Title', v1: d.party1.title, v2: d.party2.title },
    { label: 'Company', v1: d.party1.company, v2: d.party2.company },
    { label: 'Notice Address', v1: d.party1.noticeAddress, v2: d.party2.noticeAddress },
    { label: 'Date', v1: d.party1.date, v2: d.party2.date },
  ]

  for (const row of sigRows) {
    if (y + 8.5 > pageH - margin - 10) {
      addFooter(doc)
      doc.addPage()
      y = margin
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(100, 100, 100)
    doc.text(row.label, labelX, y)

    doc.setTextColor(30, 30, 30)
    doc.text(row.v1 || '(sign here)', p1Left, y)
    doc.text(row.v2 || '(sign here)', p2Left, y)

    doc.setDrawColor(200, 200, 200)
    doc.line(p1Left + 1, y + 1, p1Left + colW - 1, y + 1)
    doc.line(p2Left + 1, y + 1, p2Left + colW - 1, y + 1)

    y += 8.5
  }

  addFooter(doc)
  doc.addPage()
  y = margin

  addLine('STANDARD TERMS', 'bold', 15, navy)
  drawHR()
  addEmptyLine(5)

  const standardTerms = [
    {
      num: '1',
      title: 'INTRODUCTION',
      text: `This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page) ("MNDA") allows each party ("Disclosing Party") to disclose or make available information in connection with the ${d.purpose} which (1) the Disclosing Party identifies to the receiving party ("Receiving Party") as "confidential", "proprietary", or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure ("Confidential Information"). Each party's Confidential Information also includes the existence and status of the parties' discussions and information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms ("Cover Page"). Each party is identified on the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.`,
    },
    {
      num: '2',
      title: 'USE AND PROTECTION OF CONFIDENTIAL INFORMATION',
      text: `The Receiving Party shall: (a) use Confidential Information solely for the ${d.purpose}; (b) not disclose Confidential Information to third parties without the Disclosing Party's prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the ${d.purpose}, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.`,
    },
    {
      num: '3',
      title: 'EXCEPTIONS',
      text: "The Receiving Party's obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.",
    },
    {
      num: '4',
      title: 'DISCLOSURES REQUIRED BY LAW',
      text: "The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party's expense, with the Disclosing Party's efforts to obtain confidential treatment for the Confidential Information.",
    },
    {
      num: '5',
      title: 'TERM AND TERMINATION',
      text: `This MNDA commences on the ${d.effectiveDate} and expires at the end of the MNDA Term. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party's obligations relating to Confidential Information will survive for the Term of Confidentiality, despite any expiration or termination of this MNDA.`,
    },
    {
      num: '6',
      title: 'RETURN OR DESTRUCTION OF CONFIDENTIAL INFORMATION',
      text: "Upon expiration or termination of this MNDA or upon the Disclosing Party's earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party's written request, destroy all Confidential Information in the Receiving Party's possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.",
    },
    {
      num: '7',
      title: 'PROPRIETARY RIGHTS',
      text: "The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.",
    },
    {
      num: '8',
      title: 'DISCLAIMER',
      text: 'ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.',
    },
    {
      num: '9',
      title: 'GOVERNING LAW AND JURISDICTION',
      text: `This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the State of ${d.governingLaw}, without regard to the conflict of laws provisions of such ${d.governingLaw}. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in ${d.jurisdiction}. Each party irrevocably submits to the exclusive jurisdiction of such ${d.jurisdiction} in any such suit, action, or proceeding.`,
    },
    {
      num: '10',
      title: 'EQUITABLE RELIEF',
      text: 'A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.',
    },
    {
      num: '11',
      title: 'GENERAL',
      text: "Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party's permitted successors and assigns. Waivers must be signed by the waiving party's authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.",
    },
  ]

  for (const s of standardTerms) {
    addLine(`${s.num}. ${s.title}.`, 'bold', 11, navy)
    addEmptyLine(2)
    addLine(s.text, 'normal', 9.5)
    addEmptyLine(6)
  }

  addFooter(doc)
  addEmptyLine(4)
  doc.setTextColor(140, 140, 140)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.text('Common Paper Mutual Non-Disclosure Agreement Version 1.0 — Free to use under CC BY 4.0', margin, y)

  doc.save('Mutual-NDA.pdf')
}
