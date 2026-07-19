function Header() {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-1.5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm"
             style={{ backgroundColor: '#209dd7', color: '#ffffff' }}>
          P
        </div>
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#032147' }}>
            Prelegal
          </h1>
          <p className="text-sm" style={{ color: '#888888' }}>
            AI-powered legal document generation
          </p>
        </div>
      </div>
    </header>
  )
}

export { Header }
