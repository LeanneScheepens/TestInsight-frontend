import Card from "../../common/components/Card";
import { useFetchData } from "../hooks/useFetchData";
import { getStatusTrendCount } from "../services/TestResultService";
import type { TestStatusTrend } from "../types/TestStatusTrend";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
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

export default function TestStatusTrendChart() {

    const { data: testStatusTrends, loading, error } =
        useFetchData<TestStatusTrend>(getStatusTrendCount);

        console.log("Backend data:", testStatusTrends);

    if (loading) {
        return <Card>Loading test results...</Card>;
    }

    if (error) {
        return <Card>{error}</Card>;
    }

    if (testStatusTrends.length === 0) {
        return <Card>No test results available.</Card>;
    }

    // Determine all available test statuses.
    const statuses = [
        ...new Set(testStatusTrends.map(result => result.status))
    ];

    // Group test results by date.
    const groupedResults: Record<
        string,
        Record<string, string | number>
    > = {};

    testStatusTrends.forEach(({ status, count, executedAt }) => {

        if (!groupedResults[executedAt]) {
            groupedResults[executedAt] = {
                date: executedAt,
                total: 0
            };

            statuses.forEach(status => {
                groupedResults[executedAt][status] = 0;
            });
        }

        const day = groupedResults[executedAt];

        day[status] = Number(day[status]) + count;
        day.total = Number(day.total) + count;
    });

    // Sort the test results by date.
    const chartData = Object.values(groupedResults)
        .sort((a, b) =>
            String(a.date).localeCompare(String(b.date))
        );

    // Get the first execution timestamp of each day.
    const uniqueDates = chartData
    .filter((result, index) =>
        index === 0 ||
        String(result.date).split("T")[0] !==
        String(chartData[index - 1].date).split("T")[0]
    )
    .map(result => result.date);



    
    return (
        <Card>

            {/* Header */}
            <div className="flex justify-between items-start gap-4 mb-6">

                <div>
                    <h2>Status trend over time</h2>

                    <p className="mt-2">
                        Daily test results
                    </p>
                </div>


            </div>

            {/* Custom legend */}
            <div className="flex flex-wrap items-center gap-6 mb-6">

                <div className="flex items-center gap-2">

                    <span className="w-6 border-t-2
                                     border-dashed border-muted" />

                    <span className="text-secondary">
                        Total tests
                    </span>

                </div>

                {statuses.map(status => (
                    <div
                        key={status}
                        className="flex items-center gap-2"
                    >
                        <span
                            className="w-6 h-0.5"
                            style={{
                                backgroundColor: STATUS_COLORS[status]
                                    ?? "var(--color-muted)"
                            }}
                        />

                        <span className="text-secondary capitalize">
                            {status.toLowerCase()} tests
                        </span>
                    </div>
                ))}

            </div>

            {/* Line chart */}
            <div className="w-full h-64">

                <ResponsiveContainer width="100%" height="100%">

                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 5,
                            bottom: 10,
                            left: 5
                        }}
                    >

                        <CartesianGrid
                            vertical={false}
                            stroke="var(--color-border)"
                        />

                        <XAxis
                            dataKey="date"
                            ticks={uniqueDates}
                            axisLine={false}
                            tickLine={false}
                            tickMargin={15}
                            tick={{
                                fill: "var(--color-secondary)",
                                fontSize: 12
                            }}
                            tickFormatter={(date: string) =>
                                new Date(date).toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        timeZone: "UTC"
                                    }
                                )
                            }
                        />

                        <YAxis hide domain={[0, "auto"]} />

                        <Tooltip
                        labelFormatter={(date) =>
                            new Date(String(date)).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",

                            })
                        } />

                        <Line
                            type="monotone"
                            dataKey="total"
                            name="Total tests"
                            stroke="var(--color-secondary)"
                            strokeWidth={3}
                            strokeDasharray="4 4"
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }}
                        />

                        {statuses.map(status => (
                            <Line
                                key={status}
                                type="monotone"
                                dataKey={(data) => {
                        const index = chartData.indexOf(data);

                        const current = Number(data[status] ?? 0);
                        const previous = Number(chartData[index - 1]?.[status] ?? 0);
                        const next = Number(chartData[index + 1]?.[status] ?? 0);

                        return current > 0 || previous > 0 || next > 0
                            ? current
                            : null;
                    }}
                                name={
                                    status.charAt(0) +
                                    status.slice(1).toLowerCase() +
                                    " tests"
                                }
                                stroke={STATUS_COLORS[status]
                                    ?? "var(--color-muted)"}
                                strokeWidth={3}
                                dot={false}
                            />
                        ))}

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </Card>
    );
}