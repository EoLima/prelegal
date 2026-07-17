import { forwardRef } from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    {...props}
    className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-shadow resize-y ${className ?? ''}`}
    onFocus={(e) => {
      e.currentTarget.style.borderColor = '#209dd7'
      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(32, 157, 215, 0.2)'
    }}
    onBlur={(e) => {
      e.currentTarget.style.borderColor = ''
      e.currentTarget.style.boxShadow = ''
    }}
  />
))

Textarea.displayName = 'Textarea'

export { Textarea }
