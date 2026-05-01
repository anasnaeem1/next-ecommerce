"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LoadingBarContextValue = {
  /** Begin an async operation (increment). Pair every `start` with `done`. */
  start: () => void;
  /** End an async operation (decrement). */
  done: () => void;
  /** Runs `fn` with the loading line active until the promise settles. */
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
};

const LoadingBarContext = createContext<LoadingBarContextValue | null>(null);

export function LoadingBarProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const start = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const done = useCallback(() => {
    setCount((c) => Math.max(0, c - 1));
  }, []);

  const withLoading = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      start();
      try {
        return await fn();
      } finally {
        done();
      }
    },
    [start, done]
  );

  const value = useMemo(
    () => ({ start, done, withLoading }),
    [start, done, withLoading]
  );

  const active = count > 0;

  return (
    <LoadingBarContext.Provider value={value}>
      {active ? (
        <div
          className="fixed top-[55px] left-0 right-0 z-[100000] h-[3px] overflow-hidden bg-black/10 pointer-events-none"
          aria-hidden
        >
          <div className="manual-loading-bar h-full w-[35%] rounded-r bg-urban shadow-[0_0_10px_#F35C7A]" />
        </div>
      ) : null}
      {children}
    </LoadingBarContext.Provider>
  );
}

export function useLoadingBar(): LoadingBarContextValue {
  const ctx = useContext(LoadingBarContext);
  if (!ctx) {
    throw new Error("useLoadingBar must be used within LoadingBarProvider");
  }
  return ctx;
}
