import { useEffect, useState } from "react";

export function useFetchData<T>(
    fetchFunction: () => Promise<T[]>
) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetchFunction()
            .then(setData)
            .catch(() => setError("Failed to load data"))
            .finally(() => setLoading(false));
    }, [fetchFunction]);

    return {
        data,
        loading,
        error
    };
}