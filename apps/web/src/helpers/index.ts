import { createContext, useContext } from "react";

function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  function useCtx() {
    const c = useContext(ctx);
    if (c === undefined) throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

function localStorageSet<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function localStorageGet<T>(key: string): T {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export { localStorageSet, localStorageGet, createCtx };
