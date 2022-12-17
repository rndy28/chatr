import debounce from "lodash.debounce";
import React, { useState, useMemo, useEffect } from "react";

const useDebouncedQuery = (): [string, (e: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [query, setQuery] = useState("");
  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const debouncedQuery = useMemo(() => debounce(onQueryChange, 300), []);

  useEffect(
    () => () => {
      debouncedQuery.cancel();
    },
    []
  );

  return [query, debouncedQuery];
};

export default useDebouncedQuery;
