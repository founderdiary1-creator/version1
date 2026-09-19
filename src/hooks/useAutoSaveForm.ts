'use client';

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

// Need to add lodash.debounce or write a simple debounce manually
export function useAutoSaveForm<T>(
  form: UseFormReturn<any>,
  storageKey: string,
  debounceMs: number = 1000
) {
  const [isRestored, setIsRestored] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // Check for existing draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(storageKey);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        if (Object.keys(parsedDraft).length > 0) {
          setHasDraft(true);
        }
      } catch (e) {
        console.error('Failed to parse draft from localStorage', e);
      }
    }
  }, [storageKey]);

  // Handle restoring the draft
  const restoreDraft = () => {
    const draft = localStorage.getItem(storageKey);
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      form.reset(parsedDraft);
    }
    setIsRestored(true);
    setHasDraft(false);
  };

  const clearDraft = () => {
    localStorage.removeItem(storageKey);
    setHasDraft(false);
  };

  const ignoreDraft = () => {
    setHasDraft(false);
    setIsRestored(true);
  };

  // Watch for changes and save to localStorage
  useEffect(() => {
    if (hasDraft && !isRestored) return; // Don't overwrite draft before user decides to restore/ignore

    const subscription = form.watch((value) => {
      // Simple debounce using setTimeout
      const handler = setTimeout(() => {
        localStorage.setItem(storageKey, JSON.stringify(value));
      }, debounceMs);
      return () => clearTimeout(handler);
    });

    return () => subscription.unsubscribe();
  }, [form, form.watch, storageKey, debounceMs, isRestored, hasDraft]);

  return { hasDraft, restoreDraft, ignoreDraft, clearDraft };
}
