import { useState } from 'react'
import { TASK_TEMPLATES } from '../constants/taskTemplates'

interface Props {
  onAdd: (title: string) => void
  isLoading?: boolean
}

export function TaskCreator({ onAdd, isLoading }: Props) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(TASK_TEMPLATES[0].id)
  const [customTitle, setCustomTitle] = useState(TASK_TEMPLATES[0].label)

  const selectedTemplate = TASK_TEMPLATES.find((t) => t.id === selectedTemplateId)

  const handleTemplateChange = (templateId: string) => {
    const template = TASK_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplateId(templateId)
      setCustomTitle(template.label)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customTitle.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setSelectedTemplateId(TASK_TEMPLATES[0].id)
    setCustomTitle(TASK_TEMPLATES[0].label)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="template" className="block text-xs font-semibold gradient-terrific-text mb-1.5">
          Select template
        </label>
        <select
          id="template"
          value={selectedTemplateId}
          onChange={(e) => handleTemplateChange(e.target.value)}
          disabled={isLoading}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus-terrific disabled:opacity-50 bg-white"
        >
          {TASK_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label}
            </option>
          ))}
        </select>
        {selectedTemplate && (
          <p className="text-xs text-gray-500 mt-1">{selectedTemplate.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="title" className="block text-xs font-semibold gradient-terrific-text mb-1.5">
          Task title
        </label>
        <input
          id="title"
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Customize the task title..."
          disabled={isLoading}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus-terrific disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !customTitle.trim()}
        className="w-full gradient-terrific text-white px-4 py-2 rounded text-sm font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  )
}
