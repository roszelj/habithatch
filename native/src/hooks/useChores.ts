import { useState, useCallback } from 'react';
import { type CategoryChores, type TimeActionType, type ChoreStatus, createDefaultChores } from '../models/types';

let nextId = 1;

export function useChores(initial?: CategoryChores) {
  const [chores, setChores] = useState<CategoryChores>(initial ?? createDefaultChores());

  const addChore = useCallback((category: TimeActionType, name: string) => {
    const trimmed = name.trim().slice(0, 40);
    if (!trimmed) return;
    setChores(prev => ({
      ...prev,
      [category]: [...prev[category], { id: String(nextId++), name: trimmed, status: 'unchecked' as ChoreStatus }],
    }));
  }, []);

  const removeChore = useCallback((category: TimeActionType, id: string) => {
    setChores(prev => ({
      ...prev,
      [category]: prev[category].filter(c => c.id !== id),
    }));
  }, []);

  // Child checks off → pending (if parent mode) or approved (if no parent mode)
  const checkOffChore = useCallback((category: TimeActionType, id: string, parentActive: boolean) => {
    const targetStatus: ChoreStatus = parentActive ? 'pending' : 'approved';
    setChores(prev => ({
      ...prev,
      [category]: prev[category].map(c =>
        c.id === id && c.status === 'unchecked' ? { ...c, status: targetStatus } : c
      ),
    }));
  }, []);

  // Parent approves a pending chore
  const approveChore = useCallback((category: TimeActionType, id: string) => {
    setChores(prev => ({
      ...prev,
      [category]: prev[category].map(c =>
        c.id === id && c.status === 'pending' ? { ...c, status: 'approved' as ChoreStatus } : c
      ),
    }));
  }, []);

  // Parent rejects a pending chore
  const rejectChore = useCallback((category: TimeActionType, id: string) => {
    setChores(prev => ({
      ...prev,
      [category]: prev[category].map(c =>
        c.id === id && c.status === 'pending' ? { ...c, status: 'unchecked' as ChoreStatus } : c
      ),
    }));
  }, []);

  const resetCategory = useCallback((category: TimeActionType) => {
    setChores(prev => ({
      ...prev,
      [category]: prev[category].map(c => ({ ...c, status: 'unchecked' as ChoreStatus })),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setChores(prev => ({
      morning: prev.morning.map(c => ({ ...c, status: 'unchecked' as ChoreStatus })),
      afternoon: prev.afternoon.map(c => ({ ...c, status: 'unchecked' as ChoreStatus })),
      evening: prev.evening.map(c => ({ ...c, status: 'unchecked' as ChoreStatus })),
    }));
  }, []);

  return { chores, addChore, removeChore, checkOffChore, approveChore, rejectChore, resetCategory, resetAll, setChores };
}
