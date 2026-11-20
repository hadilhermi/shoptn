import { useState, useEffect } from "react";

export default function useFetch(fetchFn, param) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchFn(param)
      .then((data) => {
        if (!cancelled) setResult({ param, data, error: null });
      })
      .catch((err) => {
        if (!cancelled) setResult({ param, data: null, error: err.message });
      });

    // Cleanup: ken el component yetna7a wala param etbaddel, nتجاهلou el jawab el 9dim
    return () => {
      cancelled = true;
    };
  }, [fetchFn, param]);

  const loading = result === null || result.param !== param;

  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
  };
}