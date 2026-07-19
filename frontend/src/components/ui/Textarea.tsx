import { forwardRef } from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    {...props}
    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm transition-shadow focus:outline-none disabled:opacity-50 disabled:bg-gray-50 resize-y ${className ?? ''}`}
    style={{ borderColor: '#d0d5dd', color: '#1a1a2e' }}
    onFocus={(e) => {
      e.currentTarget.style.borderColor = '#209dd7'
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(32, 157, 215, 0.15)'
    }}
    onBlur={(e) => {
      e.currentTarget.style.borderColor = '#d0d5dd'
      e.currentTarget.style.boxShadow = ''
    }}
  />
))

Textarea.displayName = 'Textarea'

export { Textarea }
