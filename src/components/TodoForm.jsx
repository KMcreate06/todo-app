import { useState } from 'react'

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Que faut-il faire ?"
        aria-label="Nouvelle tâche"
        autoFocus
      />
      <button type="submit" disabled={!text.trim()}>
        Ajouter
      </button>
    </form>
  )
}
