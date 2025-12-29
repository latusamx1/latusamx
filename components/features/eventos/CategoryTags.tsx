/**
 * Category filter tags para eventos
 */

'use client'

interface CategoryTagsProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { value: '', label: 'Todos' },
  { value: 'concierto', label: 'Conciertos' },
  { value: 'festival', label: 'Festivales' },
  { value: 'deportivo', label: 'Deportes' },
  { value: 'teatro', label: 'Teatro' },
  { value: 'conferencia', label: 'Conferencias' },
  { value: 'feria', label: 'Ferias' },
]

export function CategoryTags({ selectedCategory, onCategoryChange }: CategoryTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.value
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
