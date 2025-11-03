import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-dark-surface border-b border-dark-border flex items-center px-6">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-dark-bg rounded transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="ml-4 text-2xl font-bold text-accent">RYZE Pro</h1>
    </header>
  )
}
