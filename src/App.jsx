import { useMemo, useState } from 'react'
import './App.css'
import { compileReact2 } from './react2/compiler'

const starterMarkup = `section.panel.hero::React-2
  p.muted::Author UI with a tiny DSL and still render with React.
  p::Boosts unlocked: {{boosts}}
section.panel::Studio Snapshot
  p::Tasks done: {{completed}} / {{total}}`

function App() {
  const [view, setView] = useState('home')
  const [boosts, setBoosts] = useState(1)
  const [markup, setMarkup] = useState(starterMarkup)
  const [todos, setTodos] = useState([
    { id: 1, label: 'Design syntax layer', done: true },
    { id: 2, label: 'Build interactive app shell', done: true },
    { id: 3, label: 'Ship deployment config', done: false },
  ])

  const completed = todos.filter((todo) => todo.done).length

  const preview = useMemo(
    () =>
      compileReact2(markup, {
        boosts,
        completed,
        total: todos.length,
      }),
    [markup, boosts, completed, todos.length],
  )

  const toggleTodo = (id) => {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>React-2</h1>
        <nav>
          {['home', 'studio', 'stats'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={view === tab ? 'active' : ''}
              onClick={() => setView(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {view === 'home' && (
        <section className="grid">
          <article className="card">
            <h2>Innovation Loop</h2>
            <p>
              React-2 keeps React rendering while introducing a compact authoring layer for fast
              UI experiments.
            </p>
            <button type="button" onClick={() => setBoosts((value) => value + 1)}>
              Add boost ({boosts})
            </button>
          </article>

          <article className="card">
            <h2>Feature Progress</h2>
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    {todo.label}
                  </label>
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}

      {view === 'studio' && (
        <section className="grid studio-grid">
          <article className="card">
            <h2>React-2 Markup</h2>
            <p className="hint">Syntax: tag.class#id::text with 2-space indentation for nesting.</p>
            <textarea
              value={markup}
              onChange={(event) => setMarkup(event.target.value)}
              rows={12}
              spellCheck={false}
            />
          </article>
          <article className="card preview">
            <h2>Live Preview</h2>
            <div className="dsl-preview">{preview}</div>
          </article>
        </section>
      )}

      {view === 'stats' && (
        <section className="grid">
          <article className="card metric">
            <h2>Completion</h2>
            <strong>
              {completed}/{todos.length}
            </strong>
          </article>
          <article className="card metric">
            <h2>Boost Power</h2>
            <strong>{boosts}</strong>
          </article>
        </section>
      )}
    </div>
  )
}

export default App
