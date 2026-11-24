import { useEffect, useState } from "react";
import type { TestStatusCount } from "../types/TestStatusCount";
import { getLatestTestStatusCounts } from "../services/TestResultService";

export function useTestStatusCounts() {

    const [testStatusCounts, setTestStatusCounts] =
        useState<TestStatusCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    getLatestTestStatusCounts()
        .then(setTestStatusCounts)
        .catch(() => setError("Failed to load test results"))
        .finally(() => setLoading(false));
}, []);

    return {
        testStatusCounts,
        loading,
        error
    };
}