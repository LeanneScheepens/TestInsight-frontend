import TestStatusChart from "./components/TestStatusChart";

export default function Dashboard() {


    return (
        <main className="p-8">

            <h1 className="mb-6">
                TestInsight Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TestStatusChart />
            </div>

        </main>
    );

}