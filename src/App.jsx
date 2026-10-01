import { useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from './useLocalStorage.js'
import TodoForm from './components/TodoForm.jsx'
import TodoItem from './components/TodoItem.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

const FILTERS = {
  all: { label: 'Toutes', test: () => true },
  active: { label: 'À faire', test: (t) => !t.done },
  done: { label: 'Terminées', test: (t) => t.done },
}

function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [todos, setTodos] = useLocalStorage('todo-items', [])
  const [theme, setTheme] = useLocalStorage('todo-theme', systemTheme)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const addTodo = (text) =>
    setTodos((prev) => [{ id: crypto.randomUUID(), text, done: false, createdAt: Date.now() }, ...prev])

  const toggleTodo = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const editTodo = (id, text) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)))

  const deleteTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id))

  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done))

  const toggleAll = () => {
    const allDone = todos.every((t) => t.done)
    setTodos((prev) => prev.map((t) => ({ ...t, done: !allDone })))
  }

  const visible = useMemo(() => todos.filter(FILTERS[filter].test), [todos, filter])
  const remaining = todos.filter((t) => !t.done).length
  const doneCount = todos.length - remaining

  return (
    <main className="app">
      <header className="app-header">
        <h1>Mes tâches</h1>
        <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      </header>

      <TodoForm onAdd={addTodo} />

      {todos.length > 0 && (
        <div className="toolbar">
          <div className="filters" role="tablist" aria-label="Filtrer les tâches">
            {Object.entries(FILTERS).map(([key, { label }]) => (
              <button
                key={key}
                role="tab"
                aria-selected={filter === key}
                className={filter === key ? 'filter active' : 'filter'}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="link" onClick={toggleAll}>
            {remaining === 0 ? 'Tout décocher' : 'Tout cocher'}
          </button>
        </div>
      )}

      <ul className="todo-list">
        {visible.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>

      {todos.length === 0 ? (
        <p className="empty">Aucune tâche pour l'instant. Ajoutez-en une ci-dessus !</p>
      ) : visible.length === 0 ? (
        <p className="empty">Aucune tâche dans cette catégorie.</p>
      ) : null}

      {todos.length > 0 && (
        <footer className="app-footer">
          <span>
            {remaining} tâche{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
          </span>
          {doneCount > 0 && (
            <button className="link" onClick={clearDone}>
              Effacer les terminées ({doneCount})
            </button>
          )}
        </footer>
      )}
    </main>
  )
}
