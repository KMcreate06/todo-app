import { useEffect, useRef, useState } from 'react'

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const startEdit = () => {
    setDraft(todo.text)
    setEditing(true)
  }

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed) onEdit(todo.id, trimmed)
    else onDelete(todo.id)
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <li className={todo.done ? 'todo-item done' : 'todo-item'}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={todo.done ? 'Marquer comme à faire' : 'Marquer comme terminée'}
      />
      {editing ? (
        <input
          ref={inputRef}
          className="edit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          aria-label="Modifier la tâche"
        />
      ) : (
        <span className="todo-text" onDoubleClick={startEdit} title="Double-cliquez pour modifier">
          {todo.text}
        </span>
      )}
      {!editing && (
        <div className="actions">
          <button className="icon" onClick={startEdit} aria-label="Modifier">✏️</button>
          <button className="icon" onClick={() => onDelete(todo.id)} aria-label="Supprimer">🗑️</button>
        </div>
      )}
    </li>
  )
}
