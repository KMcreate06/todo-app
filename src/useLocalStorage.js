import { useEffect, useState } from 'react'

// État React synchronisé avec localStorage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) return JSON.parse(stored)
    } catch {
      // stockage indisponible ou JSON invalide : on repart de la valeur initiale
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // stockage plein ou bloqué : l'app continue de fonctionner en mémoire
    }
  }, [key, value])

  return [value, setValue]
}
