import { API_BASE_URL } from "../../common/config/apiConfig";
import type { TestStatusCount } from "../types/TestStatusCount";
import type { TestStatusTrend } from "../types/TestStatusTrend";

export async function getLatestTestStatusCounts(): Promise<TestStatusCount[]> {

    const response = await fetch( `${API_BASE_URL}/testresults/latest`);

    if (!response.ok) {
        throw new Error("Failed to fetch test results");
    }
    return response.json();
}

export async function getStatusTrendCount(): Promise<TestStatusTrend[]> {

    const response = await fetch( `${API_BASE_URL}/testresults/statusTrend` )

    if(!response.ok){
        throw new Error("Failed to fetch test results")
    }
    return response.json();
}