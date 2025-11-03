import { PageType } from '../App'

interface NavItem {
  id: PageType
  label: string
  icon: React.ReactNode
}

interface SidebarProps {
  navItems: NavItem[]
  currentPage: PageType
  onPageChange: (page: PageType) => void
  isOpen: boolean
}

export default function Sidebar({ navItems, currentPage, onPageChange, isOpen }: SidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } bg-dark-surface border-r border-dark-border overflow-hidden transition-all duration-300 flex flex-col`}
    >
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
              currentPage === item.id
                ? 'bg-accent text-dark-bg font-semibold'
                : 'text-dark-text hover:bg-dark-bg'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
