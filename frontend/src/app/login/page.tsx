'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      window.location.href = '/'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f4fd 100%)' }}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mx-auto mb-3" style={{ backgroundColor: '#209dd7', color: '#fff' }}>P</div>
          <h1 className="text-xl font-bold" style={{ color: '#032147' }}>Welcome back</h1>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>Sign in to your Prelegal account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#888888' }}>Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm focus:outline-none transition-shadow"
              style={{ borderColor: '#d0d5dd', color: '#1a1a2e' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#209dd7'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(32, 157, 215, 0.15)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#d0d5dd'; e.currentTarget.style.boxShadow = '' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#888888' }}>Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm focus:outline-none transition-shadow"
              style={{ borderColor: '#d0d5dd', color: '#1a1a2e' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#209dd7'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(32, 157, 215, 0.15)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#d0d5dd'; e.currentTarget.style.boxShadow = '' }}
            />
          </div>

          {error && <p className="text-sm" style={{ color: '#d32f2f' }}>{error}</p>}

          <button
            type="submit" disabled={busy}
            className="w-full rounded-xl py-2.5 text-sm font-medium text-white disabled:opacity-50 transition-all"
            style={{ backgroundColor: '#753991' }}
          >
            {busy ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: '#888888' }}>
          Don&apos;t have an account?{' '}
           <a href="/signup/" style={{ color: '#209dd7' }} className="font-medium">Sign up</a>
        </p>
      </div>
    </div>
  )
}
