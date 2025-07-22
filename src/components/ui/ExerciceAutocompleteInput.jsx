import React, { useState, useEffect, useRef } from "react";

export default function ExerciceAutocompleteInput({ value, onChange, placeholder = "Choisir un exercice...", label }) {
  const [input, setInput] = useState(value ? value.nom : "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [debounced, setDebounced] = useState(input);
  const [isFocused, setIsFocused] = useState(false);
  const id = useRef(`exo-autocomplete-${Math.random().toString(36).slice(2, 10)}`).current;

  // Debounce input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), 200);
    return () => clearTimeout(t);
  }, [input]);

  // Fetch exercices
  useEffect(() => {
    if (!open || !debounced) { setResults([]); return; }
    setLoading(true);
    const params = new URLSearchParams();
    params.append("search", debounced);
    params.append("limit", "20");
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/exercices?${params.toString()}`)
      .then(r => r.json())
      .then(d => setResults(d.exercices || []))
      .finally(() => setLoading(false));
  }, [debounced, open]);

  // Reset input if value change
  useEffect(() => {
    if (value && value.nom !== input) setInput(value.nom);
    if (!value && input) setInput("");
  }, [value]);

  // Keyboard navigation
  const handleKeyDown = e => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      setHighlighted(h => Math.min(h + 1, results.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlighted(h => Math.max(h - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (results[highlighted]) {
        select(results[highlighted]);
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const select = exo => {
    setInput(exo.nom);
    setOpen(false);
    setResults([]);
    setHighlighted(0);
    onChange(exo);
  };

  // Flottant si focus ou valeur non vide
  const isFloating = isFocused || !!input;

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        id={id}
        type="text"
        className={`block px-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 peer pt-5 pb-2.5 w-full ${open ? 'rounded-b-none' : ''}`}
        placeholder={placeholder}
        value={input}
        onChange={e => { setInput(e.target.value); setOpen(true); }}
        onFocus={() => { setOpen(true); setIsFocused(true); }}
        onBlur={e => { setTimeout(() => setOpen(false), 150); setIsFocused(false); }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
        aria-autocomplete="list"
        aria-controls={open ? `${id}-listbox` : undefined}
        aria-expanded={open}
        aria-activedescendant={open && results[highlighted] ? `${id}-option-${results[highlighted].id}` : undefined}
      />
      {label && (
        <label
          htmlFor={id}
          className={`absolute text-sm text-gray-400 duration-300 transform z-10 origin-[0] bg-gray-900 px-2 left-1
            ${isFloating
              ? 'top-4 -translate-y-3 scale-75 text-orange-400'
              : 'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 top-1/2 -translate-y-1/2 scale-100'}
            max-w-full break-words whitespace-normal leading-snug text-xs`}
          style={{
            maxWidth: '100%',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            lineHeight: '1.2',
            paddingLeft: 6,
            paddingRight: 6
          }}
        >
          {label}
        </label>
      )}
      {open && (results.length > 0 || loading) && (
        <ul
          id={`${id}-listbox`}
          ref={listRef}
          className="absolute z-50 mt-0 w-full bg-gray-900 border border-orange-700 rounded-b-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {loading && (
            <li className="px-4 py-2 text-orange-200 text-sm">Chargement...</li>
          )}
          {results.map((exo, idx) => (
            <li
              id={`${id}-option-${exo.id}`}
              key={exo.id}
              className={`px-4 py-2 cursor-pointer text-orange-100 hover:bg-orange-800 ${highlighted === idx ? 'bg-orange-800' : ''}`}
              onMouseDown={() => select(exo)}
              onMouseEnter={() => setHighlighted(idx)}
              role="option"
              aria-selected={highlighted === idx}
            >
              <div className="font-semibold">{exo.nom}</div>
              <div className="text-xs text-orange-300">{exo.categorie_nom || ''}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 