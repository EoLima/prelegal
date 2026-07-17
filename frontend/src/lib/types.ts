export type PartyInfo = {
  company: string
  name: string
  title: string
  noticeAddress: string
  date: string
}

export type FormData = {
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

export const defaultForm: FormData = {
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
