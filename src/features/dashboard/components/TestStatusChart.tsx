import Card from "../../common/components/Card";
import { useTestStatusCounts } from "../hooks/useTestStatusCounts";

import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
    PASSED: "var(--color-passed)",
    FAILED: "var(--color-failed)",
    SKIPPED: "var(--color-skipped)",
    PENDING: "var(--color-pending)",
    UNDEFINED: "var(--color-undefined)",
    AMBIGUOUS: "var(--color-ambiguous)",
    UNKNOWN: "var(--color-unknown)"
};

export default function TestStatusChart() {

    const { testStatusCounts, loading, error } =
        useTestStatusCounts();

    if (loading) {
        return <Card>Loading test results...</Card>;
    }

    if (error) {
        return <Card>{error}</Card>;
    }

    if (testStatusCounts.length === 0) {
        return <Card>No test results available.</Card>;
    }

    const totalTests = testStatusCounts.reduce(
        (total, testStatusCount) => total + testStatusCount.count,
        0
    );

    const chartData = testStatusCounts.map((testStatusCount) => ({
        ...testStatusCount,
        fill: STATUS_COLORS[testStatusCount.status]
            ?? "var(--color-muted)",
        percentage: totalTests > 0
            ? (testStatusCount.count / totalTests) * 100
            : 0
    }));

    return (
        <Card>

            {/* Header */}
            <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                    <h2>Test status overview</h2>

                    <p className="mt-2">
                        Latest execution per test case
                    </p>
                </div>

                <span className="text-muted whitespace-nowrap">
                    {totalTests.toLocaleString("en-US")} total
                </span>
            </div>

            {/* Chart and legend */}
            <div className="flex flex-wrap items-center justify-between gap-6">

                {/* Donut chart */}
                <div className="relative w-56 h-56 mx-auto shrink-0">

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="count"
                                nameKey="status"
                                innerRadius="75%"
                                outerRadius="95%"
                                startAngle={90}
                                endAngle={-270}
                                stroke="none"
                            />

                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Total inside donut */}
                    <div className="absolute inset-0 flex flex-col
                                    items-center justify-center
                                    pointer-events-none">

                        <span className="text-total font-semibold">
                            {totalTests.toLocaleString("en-US")}
                        </span>

                        <span className="text-secondary">
                            total tests
                        </span>
                    </div>

                </div>

                {/* Custom legend */}
                <div className="flex-1 min-w-40">

                    {chartData.map((testStatusCount) => (
                        <div
                            key={testStatusCount.status}
                            className="flex items-center gap-3 py-4
                                       border-b border-border"
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{
                                    backgroundColor: testStatusCount.fill
                                }}
                            />

                            <div className="flex flex-col flex-1">
                                <span className="text-lg font-semibold">
                                    {testStatusCount.count.toLocaleString("en-US")}
                                </span>

                                <span className="text-secondary capitalize">
                                    {testStatusCount.status.toLowerCase()}
                                </span>
                            </div>

                            <span className="text-secondary">
                                {testStatusCount.percentage.toFixed(1)}%
                            </span>
                        </div>
                    ))}

                </div>

            </div>

        </Card>
    );
}