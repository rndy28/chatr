import debounce from "lodash.debounce";
import { useState, useMemo, useEffect } from "react";

export const useDebouncedQuery = (): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void
] => {
  const [query, setQuery] = useState("");
  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const debouncedQuery = useMemo(() => debounce(onQueryChange, 300), []);

  useEffect(() => {
    return () => {
      debouncedQuery.cancel();
    };
  }, []);

  return [query, debouncedQuery];
};
