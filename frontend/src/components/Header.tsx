function Header() {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-1.5">
        <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
          P
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Mutual NDA Creator
          </h1>
          <p className="text-sm text-slate-500">
            Generate a professional Mutual Non-Disclosure Agreement
          </p>
        </div>
      </div>
    </header>
  )
}

export { Header }
