'use client'

import { TicketFilter } from '../hooks/useTickets'

interface TicketTabsProps {
  activeFilter: TicketFilter
  onFilterChange: (filter: TicketFilter) => void
  counts: {
    todos: number
    proximos: number
    pasados: number
    usados: number
  }
}

const TABS = [
  { id: 'todos' as TicketFilter, label: 'Todos', icon: '🎫' },
  { id: 'proximos' as TicketFilter, label: 'Próximos', icon: '📅' },
  { id: 'pasados' as TicketFilter, label: 'Pasados', icon: '📝' },
  { id: 'usados' as TicketFilter, label: 'Usados', icon: '✓' },
]

export function TicketTabs({ activeFilter, onFilterChange, counts }: TicketTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-4 overflow-x-auto" aria-label="Tabs">
        {TABS.map((tab) => {
          const isActive = activeFilter === tab.id
          const count = counts[tab.id]

          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`
                whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              <span
                className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
