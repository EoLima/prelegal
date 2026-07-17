import { forwardRef } from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    {...props}
    className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-shadow resize-y ${className ?? ''}`}
  />
))

Textarea.displayName = 'Textarea'

export { Textarea }
