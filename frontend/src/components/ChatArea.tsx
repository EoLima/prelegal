'use client'
import { useState, useRef, useEffect } from 'react'
import type { FormData } from '@/lib/types'

type Message = {
  role: 'assistant' | 'user'
  content: string
}

type ChatAreaProps = {
  onFormUpdate: (data: FormData) => void
}

function ChatArea({ onFormUpdate }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m Prelegal AI. I can help you create a Mutual Non-Disclosure Agreement. What would you like to include in your NDA?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })

      if (!res.ok) {
        throw new Error(`Chat error: ${res.status}`)
      }

      const data = await res.json()

      const aiMsg: Message = { role: 'assistant', content: data.message ?? '' }
      setMessages((prev) => [...prev, aiMsg])

      if (data.formData) {
        onFormUpdate(data.formData as FormData)
      }
    } catch {
      const errMsg: Message = {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again.',
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px] xl:h-[750px]">
      <div className="border-b border-slate-200 px-5 py-3" style={{ backgroundColor: '#f0f4f8' }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#032147' }}>
          AI Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'text-white'
                  : 'border'
              }`}
              style={
                msg.role === 'user'
                  ? { backgroundColor: '#753991' }
                  : { borderColor: '#e0e0e0', backgroundColor: '#f8f9fb', color: '#1a1a2e' }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="border rounded-xl px-4 py-2.5 text-sm" style={{ borderColor: '#e0e0e0', backgroundColor: '#f8f9fb' }}>
              <span className="text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200 px-4 py-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{ borderColor: '#e0e0e0' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#209dd7'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(32, 157, 215, 0.2)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ backgroundColor: '#209dd7' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export { ChatArea }
